/**
 * POST /api/scheduling/appointments
 * Create a new appointment (walk-in or admin-created)
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { appointments, appointmentEvents, services } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default async function handler(req: Request, res: Response) {
  try {
    const {
      customerName, customerPhone, serviceId, serviceName,
      staffId, resourceId, date, startTime, status = 'requested',
      source = 'web_form', notes, adminNotes,
    } = req.body as {
      customerName: string; customerPhone: string;
      serviceId?: number; serviceName?: string;
      staffId?: number; resourceId?: number;
      date: string; startTime: string;
      status?: string; source?: string;
      notes?: string; adminNotes?: string;
    };

    if (!customerName || !customerPhone || !date || !startTime) {
      return res.status(400).json({ error: 'customerName, customerPhone, date, startTime required' });
    }

    // Compute endTime from service duration
    let endTime: string | null = null;
    if (serviceId) {
      const [svc] = await db.select().from(services).where(eq(services.id, serviceId));
      if (svc) endTime = addMinutes(startTime, svc.durationMin + svc.bufferMin);
    }

    const confirmedAt = status === 'confirmed' ? new Date() : null;

    const result = await db.insert(appointments).values({
      customerName, customerPhone,
      serviceId: serviceId ?? null,
      serviceName: serviceName ?? null,
      staffId: staffId ?? null,
      resourceId: resourceId ?? null,
      date, startTime, endTime,
      status: status as 'requested' | 'confirmed' | 'completed' | 'declined' | 'no_show' | 'cancelled',
      source, notes: notes ?? null, adminNotes: adminNotes ?? null,
      confirmedAt,
    });

    const id = Number(result[0].insertId);

    // Audit event
    await db.insert(appointmentEvents).values({
      appointmentId: id,
      fromStatus: null,
      toStatus: status,
      actor: 'admin',
    });

    const [created] = await db.select().from(appointments).where(eq(appointments.id, id));
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment', message: String(err) });
  }
}
