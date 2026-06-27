/**
 * GET /api/scheduling/waitlist
 * Returns waitlist entries. Supports ?status=waiting|offered|booked|expired|cancelled
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { waitlist, services, staff } from '../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const statusFilter = req.query.status as string | undefined;

    const rows = await db
      .select({
        id:            waitlist.id,
        customerName:  waitlist.customerName,
        customerPhone: waitlist.customerPhone,
        customerEmail: waitlist.customerEmail,
        serviceId:     waitlist.serviceId,
        serviceName:   services.name,
        preferredDate: waitlist.preferredDate,
        preferredTime: waitlist.preferredTime,
        staffId:       waitlist.staffId,
        staffName:     staff.name,
        status:        waitlist.status,
        offeredAt:     waitlist.offeredAt,
        notes:         waitlist.notes,
        source:        waitlist.source,
        createdAt:     waitlist.createdAt,
      })
      .from(waitlist)
      .leftJoin(services, eq(waitlist.serviceId, services.id))
      .leftJoin(staff, eq(waitlist.staffId, staff.id))
      .where(statusFilter ? eq(waitlist.status, statusFilter as 'waiting' | 'offered' | 'booked' | 'expired' | 'cancelled') : undefined)
      .orderBy(desc(waitlist.createdAt));

    res.json({ waitlist: rows });
  } catch (err) {
    console.error('scheduling.waitlist.get.error', err);
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
}
