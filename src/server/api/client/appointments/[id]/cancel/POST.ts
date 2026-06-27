/**
 * POST /api/client/appointments/:id/cancel
 * Allows a logged-in client to cancel their own upcoming appointment.
 * Only cancels if the appointment belongs to the client (matched by phone/name)
 * and is in a cancellable state (requested | confirmed).
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../db/client.js';
import { clientUsers, clientSessions, appointments, appointmentEvents } from '../../../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

const CANCELLABLE = new Set(['requested', 'confirmed']);

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.client_session;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

    const now = new Date();
    const sessions = await db.select()
      .from(clientSessions)
      .where(and(eq(clientSessions.id, sessionId), gt(clientSessions.expiresAt, now)))
      .limit(1);
    if (sessions.length === 0) return res.status(401).json({ error: 'Session expired.' });

    const users = await db.select().from(clientUsers).where(eq(clientUsers.id, sessions[0].userId)).limit(1);
    if (users.length === 0) return res.status(401).json({ error: 'User not found.' });

    const user = users[0];
    const apptId = parseInt(req.params.id as string, 10);
    if (isNaN(apptId)) return res.status(400).json({ error: 'Invalid appointment ID.' });

    const [appt] = await db.select().from(appointments).where(eq(appointments.id, apptId)).limit(1);
    if (!appt) return res.status(404).json({ error: 'Appointment not found.' });

    // Verify ownership — phone or name must match
    const cleanPhone = (user.phone ?? '').replace(/\s/g, '');
    const phoneMatch = cleanPhone && appt.customerPhone.replace(/\s/g, '').includes(cleanPhone);
    const nameMatch  = user.fullName && appt.customerName.toLowerCase().includes(user.fullName.toLowerCase());
    if (!phoneMatch && !nameMatch) {
      return res.status(403).json({ error: 'You do not have permission to cancel this appointment.' });
    }

    if (!CANCELLABLE.has(appt.status)) {
      return res.status(409).json({ error: `Cannot cancel an appointment with status "${appt.status}".` });
    }

    await db.update(appointments)
      .set({ status: 'cancelled' })
      .where(eq(appointments.id, apptId));

    await db.insert(appointmentEvents).values({
      appointmentId: apptId,
      fromStatus:    appt.status,
      toStatus:      'cancelled',
      actor:         'client',
    }).catch(() => { /* non-fatal */ });

    return res.json({ success: true, message: 'Appointment cancelled.' });
  } catch (err) {
    console.error('client.appointments.cancel', err);
    return res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
}
