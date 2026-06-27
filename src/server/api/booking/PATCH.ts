/**
 * PATCH /api/booking/:id
 * Admin: update booking status, date, time, service, or admin notes.
 * Sets confirmedAt / noShowAt timestamps automatically on status transitions.
 * Also mirrors status changes to the linked appointments row (if any).
 */
import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { bookingRequests, appointments, appointmentEvents } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'no_show', 'declined'] as const;
type BookingStatus = typeof VALID_STATUSES[number];

/** Map booking_requests status → appointments status */
const STATUS_MAP: Record<BookingStatus, string> = {
  pending:   'requested',
  confirmed: 'confirmed',
  cancelled: 'cancelled',
  no_show:   'no_show',
  declined:  'declined',
};

export default async function handler(req: Request, res: Response) {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id.' });

  const { status, date, time, service, adminNotes } = req.body as {
    status?: BookingStatus;
    date?: string;
    time?: string;
    service?: string;
    adminNotes?: string;
  };

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const updates: Record<string, unknown> = {};
  if (status)                   updates.status     = status;
  if (date)                     updates.date       = date;
  if (time)                     updates.time       = time;
  if (service)                  updates.service    = service;
  if (adminNotes !== undefined) updates.adminNotes = adminNotes;

  if (status === 'confirmed') updates.confirmedAt = new Date();
  if (status === 'no_show')   updates.noShowAt    = new Date();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }

  try {
    // 1. Update booking_requests
    await db.update(bookingRequests).set(updates).where(eq(bookingRequests.id, id));

    // 2. Mirror to linked appointment (if one exists)
    if (status) {
      try {
        const apptStatus = STATUS_MAP[status] as 'requested' | 'confirmed' | 'completed' | 'declined' | 'no_show' | 'cancelled';

        // Find the appointment linked to this booking request
        const [linked] = await db.select({ id: appointments.id, status: appointments.status })
          .from(appointments)
          .where(eq(appointments.bookingRequestId, id))
          .limit(1);

        if (linked) {
          const apptUpdates: Record<string, unknown> = { status: apptStatus };
          if (status === 'confirmed') apptUpdates.confirmedAt = new Date();
          if (status === 'no_show')   apptUpdates.noShowAt    = new Date();

          await db.update(appointments)
            .set(apptUpdates)
            .where(eq(appointments.id, linked.id));

          // Audit trail
          await db.insert(appointmentEvents).values({
            appointmentId: linked.id,
            fromStatus:    linked.status,
            toStatus:      apptStatus,
            actor:         'admin_bookings',
          }).catch(() => { /* non-fatal */ });
        }
      } catch (mirrorErr) {
        // Non-fatal — booking_requests was already updated
        console.error('booking.patch.mirror', mirrorErr);
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('booking.patch', err);
    return res.status(500).json({ error: 'Failed to update booking.' });
  }
}
