/**
 * GET /api/client/loyalty
 * Returns the loyalty profile for the currently logged-in client,
 * matched by email against loyalty_clients.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions, loyaltyClients, loyaltyTransactions } from '../../../db/schema.js';
import { eq, and, gt, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.client_session;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

    const now = new Date();
    const sessions = await db.select()
      .from(clientSessions)
      .where(and(eq(clientSessions.id, sessionId), gt(clientSessions.expiresAt, now)))
      .limit(1);
    if (sessions.length === 0) return res.status(401).json({ error: 'Session expired.' });

    const users = await db.select().from(clientUsers).where(eq(clientUsers.id, sessions[0].userId)).limit(1);
    if (users.length === 0) return res.status(401).json({ error: 'User not found.' });

    const email = users[0].email;

    // Look up loyalty record by email
    const loyalty = await db.select().from(loyaltyClients).where(eq(loyaltyClients.email, email)).limit(1);
    if (loyalty.length === 0) {
      return res.json({ enrolled: false });
    }

    const lc = loyalty[0];

    // Recent transactions (last 5)
    const txns = await db.select()
      .from(loyaltyTransactions)
      .where(eq(loyaltyTransactions.clientId, lc.id))
      .orderBy(desc(loyaltyTransactions.createdAt))
      .limit(5);

    return res.json({
      enrolled: true,
      tier: lc.tier,
      pointsBalance: lc.pointsBalance,
      pointsEarnedTotal: lc.pointsEarnedTotal,
      pointsRedeemedTotal: lc.pointsRedeemedTotal,
      visits: lc.visits,
      status: lc.status,
      recentTransactions: txns.map(t => ({
        id: t.id,
        type: t.type,
        points: t.points,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    console.error('client.loyalty', err);
    return res.status(500).json({ error: 'Failed to load loyalty data.' });
  }
}
