/**
 * PATCH /api/scheduling/appointments/:id
 * Update status, assign staff/room/time, add admin notes.
 *
 * Side-effects on status → 'completed':
 *  1. Auto-earn Glow Points for the client (matched by phone → loyalty_clients)
 *  2. Auto-create a review request in the JSON store (if not already sent)
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import {
  appointments, appointmentEvents, services,
  loyaltyClients, loyaltyTransactions,
} from '../../../../db/schema.js';
import { eq, like, or } from 'drizzle-orm';
import { createRequest, readRequests } from '../../../../review-requests/store.js';

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Determine tier multiplier from lifetime earned points */
function tierMultiplier(lifetimeEarned: number): number {
  if (lifetimeEarned >= 10000) return 2;    // platinum
  if (lifetimeEarned >= 5000)  return 1.5;  // gold
  if (lifetimeEarned >= 2000)  return 1.25; // silver
  return 1;                                  // glow
}

/** Determine tier name from lifetime earned points */
function tierName(lifetimeEarned: number): string {
  if (lifetimeEarned >= 10000) return 'platinum';
  if (lifetimeEarned >= 5000)  return 'gold';
  if (lifetimeEarned >= 2000)  return 'silver';
  return 'glow';
}

export default async function handler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    const {
      status, staffId, resourceId, serviceId, date, startTime, adminNotes,
    } = req.body as {
      status?: string; staffId?: number | null; resourceId?: number | null;
      serviceId?: number | null; date?: string; startTime?: string; adminNotes?: string;
    };

    const updates: Record<string, unknown> = {};
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (staffId !== undefined)    updates.staffId    = staffId;
    if (resourceId !== undefined) updates.resourceId = resourceId;
    if (serviceId !== undefined)  updates.serviceId  = serviceId;
    if (date !== undefined)       updates.date       = date;

    // Recompute endTime if startTime or serviceId changes
    const newStartTime = startTime ?? existing.startTime;
    const newServiceId = serviceId ?? existing.serviceId;
    if (startTime !== undefined || serviceId !== undefined) {
      updates.startTime = newStartTime;
      if (newServiceId) {
        const [svc] = await db.select().from(services).where(eq(services.id, newServiceId));
        if (svc) updates.endTime = addMinutes(newStartTime, svc.durationMin + svc.bufferMin);
      }
    }

    // Status transitions
    if (status && status !== existing.status) {
      updates.status = status;
      if (status === 'confirmed')   updates.confirmedAt = new Date();
      if (status === 'no_show')     updates.noShowAt    = new Date();

      await db.insert(appointmentEvents).values({
        appointmentId: id,
        fromStatus:    existing.status,
        toStatus:      status,
        actor:         'admin',
      });

      // ── Side-effects when marking COMPLETED ──────────────────────────────
      if (status === 'completed') {
        const svcName = existing.serviceName ?? 'Treatment';
        const apptDate = date ?? existing.date;

        // ── 1. Auto-earn Glow Points ────────────────────────────────────────
        try {
          // Resolve service price (fils → JOD)
          let priceJod = 0;
          const resolvedServiceId = serviceId ?? existing.serviceId;
          if (resolvedServiceId) {
            const [svc] = await db.select().from(services).where(eq(services.id, resolvedServiceId));
            if (svc) priceJod = Math.round(svc.price / 100); // fils → JOD
          }
          // Base points: 1 pt per JOD (minimum 10 pts per visit)
          const basePoints = Math.max(10, priceJod);

          // Find loyalty client by phone or name
          const cleanPhone = existing.customerPhone.replace(/\s/g, '');
          const loyaltyRows = await db.select().from(loyaltyClients)
            .where(
              or(
                cleanPhone ? like(loyaltyClients.phone, `%${cleanPhone}%`) : undefined,
                like(loyaltyClients.name, `%${existing.customerName}%`),
              )
            )
            .limit(1);

          if (loyaltyRows.length > 0) {
            const lc = loyaltyRows[0];
            const multiplier = tierMultiplier(lc.pointsEarnedTotal ?? 0);
            const earnedPts  = Math.round(basePoints * multiplier);
            const newBalance = (lc.pointsBalance ?? 0) + earnedPts;
            const newEarned  = (lc.pointsEarnedTotal ?? 0) + earnedPts;
            const newTier    = tierName(newEarned);

            await db.update(loyaltyClients)
              .set({
                pointsBalance:     newBalance,
                pointsEarnedTotal: newEarned,
                visits:            (lc.visits ?? 0) + 1,
                tier:              newTier,
              })
              .where(eq(loyaltyClients.id, lc.id));

            await db.insert(loyaltyTransactions).values({
              clientId:    lc.id,
              type:        'earn',
              points:      earnedPts,
              description: `${svcName} — appt #${id} (${multiplier}× ${tierName(lc.pointsEarnedTotal ?? 0)} tier)`,
              adminBy:     'system',
            });

            console.log(`loyalty.auto_earn appt=${id} client=${lc.id} pts=${earnedPts} tier=${newTier}`);
          }
        } catch (loyaltyErr) {
          console.error('appointment.completed.loyalty.error', loyaltyErr);
          // Non-fatal — don't fail the status update
        }

        // ── 2. Auto-create review request ──────────────────────────────────
        try {
          // Only create if no review request already exists for this appointment
          const allRequests = await readRequests();
          const alreadyExists = allRequests.some(r =>
            r.clientName === existing.customerName &&
            r.serviceDate === apptDate &&
            r.service === svcName
          );

          if (!alreadyExists) {
            await createRequest({
              clientName:  existing.customerName,
              clientEmail: '',   // no email on appointment; admin can send manually via review-requests panel
              service:     svcName,
              serviceDate: apptDate,
            });
            console.log(`review_request.auto_created appt=${id} client=${existing.customerName}`);
          }
        } catch (rrErr) {
          console.error('appointment.completed.review_request.error', rrErr);
          // Non-fatal
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await db.update(appointments).set(updates).where(eq(appointments.id, id));
    }

    const [updated] = await db.select().from(appointments).where(eq(appointments.id, id));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment', message: String(err) });
  }
}
