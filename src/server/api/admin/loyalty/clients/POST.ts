/**
 * POST /api/admin/loyalty/clients
 * Create a new loyalty client.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { loyaltyClients } from '../../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const {
      name, phone, email, dateOfBirth, address, area, skinType, notes,
    } = req.body as Record<string, string | undefined>;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const [result] = await db.insert(loyaltyClients).values({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      dateOfBirth: dateOfBirth?.trim() || undefined,
      address: address?.trim() || undefined,
      area: area?.trim() || undefined,
      skinType: skinType?.trim() || undefined,
      notes: notes?.trim() || undefined,
      tier: 'glow',
      status: 'active',
    });

    const id = (result as unknown as { insertId: number }).insertId;
    const [client] = await db.select().from(loyaltyClients).where(
      (await import('drizzle-orm')).eq(loyaltyClients.id, id)
    );

    return res.status(201).json({ client });
  } catch (err) {
    console.error('loyalty.clients.post.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
