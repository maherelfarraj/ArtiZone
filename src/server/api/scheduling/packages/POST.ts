/**
 * POST /api/scheduling/packages
 * Creates a new package in the catalogue.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { packages } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const {
      name, description, category, totalSessions,
      priceJod, serviceId, validityDays,
    } = req.body as {
      name: string;
      description?: string;
      category?: string;
      totalSessions: number;
      priceJod: number;
      serviceId?: number;
      validityDays?: number;
    };

    if (!name || !totalSessions || priceJod === undefined) {
      return res.status(400).json({ error: 'name, totalSessions and priceJod are required' });
    }

    const result = await db.insert(packages).values({
      name,
      description: description ?? null,
      category: category ?? 'other',
      totalSessions: Number(totalSessions),
      priceJod: Number(priceJod),
      serviceId: serviceId ? Number(serviceId) : null,
      validityDays: validityDays ? Number(validityDays) : 0,
      active: true,
    });

    const id = (result[0] as unknown as { insertId: number }).insertId;
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error('scheduling.packages.post.error', err);
    res.status(500).json({ error: 'Failed to create package' });
  }
}
