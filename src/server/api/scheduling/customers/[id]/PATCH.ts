/**
 * PATCH /api/scheduling/customers/:id
 * Updates customer profile fields.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { customers } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const { name, phone, email, area, dob, notes, loyaltyClientId } = req.body as Partial<{
      name: string; phone: string; email: string; area: string;
      dob: string; notes: string; loyaltyClientId: number | null;
    }>;

    const updates: Record<string, unknown> = {};
    if (name !== undefined)             updates.name = name;
    if (phone !== undefined)            updates.phone = phone;
    if (email !== undefined)            updates.email = email;
    if (area !== undefined)             updates.area = area;
    if (dob !== undefined)              updates.dob = dob;
    if (notes !== undefined)            updates.notes = notes;
    if (loyaltyClientId !== undefined)  updates.loyaltyClientId = loyaltyClientId;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await db.update(customers).set(updates).where(eq(customers.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error('scheduling.customers.patch.error', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}
