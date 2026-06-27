/**
 * PATCH /api/scheduling/waitlist/:id
 * Updates waitlist entry status (offered, booked, expired, cancelled).
 * When status → 'offered', sets offeredAt timestamp.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { waitlist } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const { status, notes } = req.body as {
      status?: 'waiting' | 'offered' | 'booked' | 'expired' | 'cancelled';
      notes?: string;
    };

    const updates: Record<string, unknown> = {};
    if (status !== undefined) {
      updates.status = status;
      if (status === 'offered') updates.offeredAt = new Date();
    }
    if (notes !== undefined) updates.notes = notes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await db.update(waitlist).set(updates).where(eq(waitlist.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error('scheduling.waitlist.patch.error', err);
    res.status(500).json({ error: 'Failed to update waitlist entry' });
  }
}
