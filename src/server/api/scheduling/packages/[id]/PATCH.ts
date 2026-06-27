/**
 * PATCH /api/scheduling/packages/:id
 * Updates a package (name, price, active flag, etc.).
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { packages } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const {
      name, description, category, totalSessions,
      priceJod, serviceId, validityDays, active,
    } = req.body as Partial<{
      name: string;
      description: string;
      category: string;
      totalSessions: number;
      priceJod: number;
      serviceId: number | null;
      validityDays: number;
      active: boolean;
    }>;

    const updates: Record<string, unknown> = {};
    if (name !== undefined)          updates.name = name;
    if (description !== undefined)   updates.description = description;
    if (category !== undefined)      updates.category = category;
    if (totalSessions !== undefined) updates.totalSessions = Number(totalSessions);
    if (priceJod !== undefined)      updates.priceJod = Number(priceJod);
    if (serviceId !== undefined)     updates.serviceId = serviceId;
    if (validityDays !== undefined)  updates.validityDays = Number(validityDays);
    if (active !== undefined)        updates.active = active;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await db.update(packages).set(updates).where(eq(packages.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error('scheduling.packages.patch.error', err);
    res.status(500).json({ error: 'Failed to update package' });
  }
}
