/**
 * PATCH /api/admin/loyalty/clients/:id
 * Update a loyalty client's profile.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../db/client.js';
import { loyaltyClients } from '../../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id.' });

    const {
      name, phone, email, dateOfBirth, address, area, skinType, notes, status, tier,
    } = req.body as Record<string, string | undefined>;

    const updates: Record<string, unknown> = {};
    if (name !== undefined)        updates.name = name.trim();
    if (phone !== undefined)       updates.phone = phone.trim();
    if (email !== undefined)       updates.email = email.trim() || null;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth.trim() || null;
    if (address !== undefined)     updates.address = address.trim() || null;
    if (area !== undefined)        updates.area = area.trim() || null;
    if (skinType !== undefined)    updates.skinType = skinType.trim() || null;
    if (notes !== undefined)       updates.notes = notes.trim() || null;
    if (status !== undefined)      updates.status = status as 'active' | 'inactive';
    if (tier !== undefined)        updates.tier = tier;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    await db.update(loyaltyClients).set(updates).where(eq(loyaltyClients.id, id));
    const [client] = await db.select().from(loyaltyClients).where(eq(loyaltyClients.id, id));

    return res.json({ client });
  } catch (err) {
    console.error('loyalty.client.patch.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
