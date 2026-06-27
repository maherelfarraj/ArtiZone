import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { appointments, appointmentEvents, staff, resources, services } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const [appt] = await db.select().from(appointments).where(eq(appointments.id, id));
    if (!appt) return res.status(404).json({ error: 'Not found' });

    const events = await db.select().from(appointmentEvents).where(eq(appointmentEvents.appointmentId, id));
    const [staffMember] = appt.staffId ? await db.select().from(staff).where(eq(staff.id, appt.staffId)) : [null];
    const [room] = appt.resourceId ? await db.select().from(resources).where(eq(resources.id, appt.resourceId)) : [null];
    const [svc] = appt.serviceId ? await db.select().from(services).where(eq(services.id, appt.serviceId)) : [null];

    res.json({ ...appt, staffMember, room, serviceDetails: svc, events });
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
