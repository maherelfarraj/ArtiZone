/**
 * POST /api/scheduling/waitlist
 * Adds a client to the waitlist (called from booking form when slot is full).
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { waitlist } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const {
      customerName, customerPhone, customerEmail,
      serviceId, serviceName, preferredDate, preferredTime,
      staffId, notes, source,
    } = req.body as {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      serviceId?: number;
      serviceName?: string;
      preferredDate?: string;
      preferredTime?: string;
      staffId?: number;
      notes?: string;
      source?: string;
    };

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'customerName and customerPhone are required' });
    }

    const result = await db.insert(waitlist).values({
      customerName,
      customerPhone,
      customerEmail: customerEmail ?? null,
      serviceId: serviceId ? Number(serviceId) : null,
      serviceName: serviceName ?? null,
      preferredDate: preferredDate ?? null,
      preferredTime: preferredTime ?? null,
      staffId: staffId ? Number(staffId) : null,
      notes: notes ?? null,
      source: source ?? 'web_form',
      status: 'waiting',
    });

    const id = (result[0] as unknown as { insertId: number }).insertId;
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error('scheduling.waitlist.post.error', err);
    res.status(500).json({ error: 'Failed to add to waitlist' });
  }
}
