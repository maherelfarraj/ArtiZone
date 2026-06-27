/**
 * GET /api/booking/count
 * Returns count of pending booking requests for admin badge.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { bookingRequests } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookingRequests)
      .where(eq(bookingRequests.status, 'pending'));
    return res.json({ pending: Number(row?.count ?? 0) });
  } catch (err) {
    console.error('booking.count.get', err);
    return res.status(500).json({ error: 'Failed to get count.' });
  }
}
