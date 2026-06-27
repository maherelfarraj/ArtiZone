/**
 * GET /api/v1/services
 * Widget-compatible services endpoint.
 * Returns active services shaped for the ArtiZone booking widget:
 *   { services: [ { id, name, duration_min, buffer_min, price, category, description } ] }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const rows = await db.select().from(services).where(eq(services.active, true));

    const shaped = rows.map(s => ({
      id:           s.id,
      name:         s.name,
      duration_min: s.durationMin,
      buffer_min:   s.bufferMin,
      price:        Number(s.price ?? 0),
      category:     s.category,
    }));

    res.json({ services: shaped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services', message: String(err) });
  }
}
