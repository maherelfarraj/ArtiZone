/**
 * GET /api/scheduling/appointments
 * ?date=YYYY-MM-DD  (optional — filter by date)
 * ?status=requested|confirmed|...  (optional)
 * ?from=YYYY-MM-DD&to=YYYY-MM-DD  (optional date range)
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { appointments, staff, resources, services } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { date, status, from, to } = req.query as Record<string, string>;

    let rows = await db.select().from(appointments);

    if (date) rows = rows.filter(a => a.date === date);
    if (status) rows = rows.filter(a => a.status === status);
    if (from) rows = rows.filter(a => a.date >= from);
    if (to) rows = rows.filter(a => a.date <= to);

    // Enrich with staff/room/service names
    const allStaff = await db.select().from(staff);
    const allRooms = await db.select().from(resources);
    const allServices = await db.select().from(services);

    const enriched = rows.map(a => ({
      ...a,
      staffName: allStaff.find(s => s.id === a.staffId)?.name ?? null,
      roomName: allRooms.find(r => r.id === a.resourceId)?.name ?? null,
      serviceDetails: allServices.find(s => s.id === a.serviceId) ?? null,
    }));

    // Sort by date desc, then time
    enriched.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return a.startTime.localeCompare(b.startTime);
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments', message: String(err) });
  }
}
