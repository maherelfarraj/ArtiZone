/**
 * DELETE /api/booking/:id
 * Admin: permanently delete a booking record
 */
import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { bookingRequests } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id.' });

  try {
    await db.delete(bookingRequests).where(eq(bookingRequests.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error('booking.delete', err);
    return res.status(500).json({ error: 'Failed to delete booking.' });
  }
}
