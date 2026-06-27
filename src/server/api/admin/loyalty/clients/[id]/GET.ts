/**
 * GET /api/admin/loyalty/clients/:id
 * Get a single loyalty client with their sessions and points history.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../db/client.js';
import { loyaltyClients, loyaltySessions, loyaltyTransactions } from '../../../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id.' });

    const [client] = await db.select().from(loyaltyClients).where(eq(loyaltyClients.id, id));
    if (!client) return res.status(404).json({ error: 'Client not found.' });

    const sessions = await db
      .select()
      .from(loyaltySessions)
      .where(eq(loyaltySessions.clientId, id))
      .orderBy(desc(loyaltySessions.sessionDate));

    const transactions = await db
      .select()
      .from(loyaltyTransactions)
      .where(eq(loyaltyTransactions.clientId, id))
      .orderBy(desc(loyaltyTransactions.createdAt));

    return res.json({ client, sessions, transactions });
  } catch (err) {
    console.error('loyalty.client.get.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
