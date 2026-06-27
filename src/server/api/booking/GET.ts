/**
 * GET /api/booking
 * Admin: list all booking requests, newest first.
 * Supports ?status=pending|confirmed|cancelled, ?search=, ?service=, ?from=YYYY-MM-DD, ?to=YYYY-MM-DD
 */
import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { bookingRequests } from '../../db/schema.js';
import { desc, eq, like, or, and, gte, lte } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const search  = (req.query.search  as string | undefined)?.trim();
  const status  = req.query.status   as string | undefined;
  const service = (req.query.service as string | undefined)?.trim();
  const from    = (req.query.from    as string | undefined)?.trim();
  const to      = (req.query.to      as string | undefined)?.trim();

  try {
    const conditions = [];

    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      conditions.push(eq(bookingRequests.status, status as 'pending' | 'confirmed' | 'cancelled'));
    }
    if (service) {
      conditions.push(like(bookingRequests.service, `%${service}%`));
    }
    if (from) {
      conditions.push(gte(bookingRequests.date, from));
    }
    if (to) {
      conditions.push(lte(bookingRequests.date, to));
    }
    if (search) {
      conditions.push(
        or(
          like(bookingRequests.name,    `%${search}%`),
          like(bookingRequests.phone,   `%${search}%`),
          like(bookingRequests.service, `%${search}%`),
        )
      );
    }

    const base = db.select().from(bookingRequests).orderBy(desc(bookingRequests.createdAt));
    const rows = conditions.length > 0
      ? await base.where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : await base;

    return res.json({ bookings: rows, total: rows.length });
  } catch (err) {
    console.error('booking.get', err);
    return res.status(500).json({ error: 'Failed to load bookings.' });
  }
}
