/**
 * POST /api/scheduling/customers
 * Creates a new customer record.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { customers } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, phone, email, area, dob, notes, loyaltyClientId } = req.body as {
      name: string;
      phone: string;
      email?: string;
      area?: string;
      dob?: string;
      notes?: string;
      loyaltyClientId?: number;
    };

    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone are required' });
    }

    const result = await db.insert(customers).values({
      name,
      phone,
      email: email ?? null,
      area: area ?? null,
      dob: dob ?? null,
      notes: notes ?? null,
      loyaltyClientId: loyaltyClientId ? Number(loyaltyClientId) : null,
    });

    const id = (result[0] as unknown as { insertId: number }).insertId;
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error('scheduling.customers.post.error', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}
