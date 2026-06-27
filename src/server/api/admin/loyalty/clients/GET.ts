/**
 * GET /api/admin/loyalty/clients
 * List all loyalty clients with optional search.
 * Query: ?q=search&status=active|inactive&tier=silver|gold|platinum
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { loyaltyClients } from '../../../../db/schema.js';
import { desc, like, or, eq, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { q, status, tier } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (q?.trim()) {
      const term = `%${q.trim()}%`;
      conditions.push(
        or(
          like(loyaltyClients.name, term),
          like(loyaltyClients.phone, term),
          like(loyaltyClients.email, term),
        )
      );
    }
    if (status) conditions.push(eq(loyaltyClients.status, status as 'active' | 'inactive'));
    if (tier)   conditions.push(eq(loyaltyClients.tier, tier));

    const rows = await db
      .select()
      .from(loyaltyClients)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(loyaltyClients.createdAt));

    return res.json({ clients: rows });
  } catch (err) {
    console.error('loyalty.clients.get.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
