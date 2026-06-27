/**
 * PATCH /api/scheduling/services/:id
 * Update a service — name, category, duration, buffer, price, active, defaultStaffId.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id.' });

  const { name, category, durationMin, bufferMin, price, requiredCapability, active, defaultStaffId } = req.body as {
    name?: string; category?: string; durationMin?: number;
    bufferMin?: number; price?: number; requiredCapability?: string | null;
    active?: boolean; defaultStaffId?: number | null;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined)                updates.name                = name.trim();
  if (category !== undefined)            updates.category            = category.trim();
  if (durationMin !== undefined)         updates.durationMin         = Number(durationMin);
  if (bufferMin !== undefined)           updates.bufferMin           = Number(bufferMin);
  if (price !== undefined)               updates.price               = Number(price);
  if (requiredCapability !== undefined)  updates.requiredCapability  = requiredCapability || null;
  if (active !== undefined)              updates.active              = active;
  if (defaultStaffId !== undefined)      updates.defaultStaffId      = defaultStaffId ?? null;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }

  try {
    await db.update(services).set(updates).where(eq(services.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service', message: String(err) });
  }
}
