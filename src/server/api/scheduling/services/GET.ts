/**
 * GET /api/scheduling/services
 * Returns all active services enriched with default staff name.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services, staff } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const rows     = await db.select().from(services).where(eq(services.active, true));
    const allStaff = await db.select().from(staff);

    const enriched = rows.map(s => ({
      ...s,
      defaultStaffName: allStaff.find(st => st.id === s.defaultStaffId)?.name ?? null,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services', message: String(err) });
  }
}
