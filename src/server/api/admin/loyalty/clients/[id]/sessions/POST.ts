/**
 * POST /api/admin/loyalty/clients/:id/sessions
 * Add a session for a client. If status=completed and amountPaid>0,
 * automatically awards points (1 pt per 1 JOD, adjusted by tier multiplier).
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../../db/client.js';
import { loyaltySessions, loyaltyClients, loyaltyTransactions } from '../../../../../../db/schema.js';
import { eq } from 'drizzle-orm';

// Tier multipliers — canonical: glow / silver / gold / platinum
const TIER_MULTIPLIER: Record<string, number> = {
  glow:     1.0,
  silver:   1.25,
  gold:     1.5,
  platinum: 2.0,
};

export default async function handler(req: Request, res: Response) {
  try {
    const clientId = parseInt(req.params.id as string, 10);
    if (isNaN(clientId)) return res.status(400).json({ error: 'Invalid id.' });

    const { sessionDate, sessionType, status, staffName, notes, amountPaid, adminBy } =
      req.body as Record<string, string | undefined>;

    if (!sessionDate?.trim() || !sessionType?.trim()) {
      return res.status(400).json({ error: 'sessionDate and sessionType are required.' });
    }

    const paid = parseInt(amountPaid ?? '0', 10) || 0;

    const [result] = await db.insert(loyaltySessions).values({
      clientId,
      sessionDate: sessionDate.trim(),
      sessionType: sessionType.trim(),
      status: (status as 'completed' | 'pending' | 'cancelled') ?? 'pending',
      staffName: staffName?.trim() || undefined,
      notes: notes?.trim() || undefined,
      amountPaid: paid,
    });

    const sessionId = (result as unknown as { insertId: number }).insertId;

    // Auto-award points for completed sessions with payment
    if (status === 'completed' && paid > 0) {
      const [client] = await db.select().from(loyaltyClients).where(eq(loyaltyClients.id, clientId));
      if (client) {
        const multiplier = TIER_MULTIPLIER[client.tier] ?? 1.0;
        const pts = Math.floor(paid * multiplier);

        await db.insert(loyaltyTransactions).values({
          clientId,
          type: 'earn',
          points: pts,
          description: `Session: ${sessionType.trim()} (${paid} JOD × ${multiplier})`,
          adminBy: adminBy?.trim() || 'System',
        });

        await db.update(loyaltyClients).set({
          pointsBalance:      client.pointsBalance + pts,
          pointsEarnedTotal:  client.pointsEarnedTotal + pts,
          visits:             client.visits + 1,
        }).where(eq(loyaltyClients.id, clientId));
      }
    }

    const [session] = await db.select().from(loyaltySessions).where(
      (await import('drizzle-orm')).eq(loyaltySessions.id, sessionId)
    );

    return res.status(201).json({ session });
  } catch (err) {
    console.error('loyalty.sessions.post.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
