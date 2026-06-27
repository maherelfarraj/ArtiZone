/**
 * POST /api/scheduling/services
 * Create a new service in the catalogue.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, category, durationMin, bufferMin, price, requiredCapability } = req.body as {
      name: string; category: string; durationMin: number;
      bufferMin?: number; price: number; requiredCapability?: string;
    };

    if (!name?.trim() || !category?.trim() || !durationMin || price == null) {
      return res.status(400).json({ error: 'name, category, durationMin, price are required.' });
    }

    const result = await db.insert(services).values({
      name: name.trim(),
      category: category.trim(),
      durationMin: Number(durationMin),
      bufferMin: Number(bufferMin ?? 10),
      price: Number(price),
      requiredCapability: requiredCapability?.trim() || null,
      active: true,
    });

    const id = Number(result[0].insertId);
    res.status(201).json({ id, name: name.trim(), category, durationMin, bufferMin: bufferMin ?? 10, price, active: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service', message: String(err) });
  }
}
