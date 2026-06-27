/**
 * GET /api/scheduling/customers
 * Search / list customers. Supports ?q= for name/phone search.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { customers } from '../../../db/schema.js';
import { like, or, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    const limit = Math.min(Number(req.query.limit ?? 50), 200);

    let rows;
    if (q) {
      const pattern = `%${q}%`;
      rows = await db
        .select()
        .from(customers)
        .where(or(like(customers.name, pattern), like(customers.phone, pattern)))
        .orderBy(desc(customers.createdAt))
        .limit(limit);
    } else {
      rows = await db
        .select()
        .from(customers)
        .orderBy(desc(customers.createdAt))
        .limit(limit);
    }

    res.json({ customers: rows });
  } catch (err) {
    console.error('scheduling.customers.get.error', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}
