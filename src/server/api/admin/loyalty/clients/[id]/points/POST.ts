/**
 * POST /api/admin/loyalty/clients/:id/points
 * Manually add or deduct points for a client.
 * Body: { type: 'earn'|'redeem'|'bonus'|'adjust', points: number, description: string, adminBy: string }
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../../db/client.js';
import { loyaltyClients, loyaltyTransactions } from '../../../../../../db/schema.js';
import { eq } from 'drizzle-orm';

// Tier thresholds — canonical: glow / silver / gold / platinum
const TIER_THRESHOLDS = [
  { tier: 'platinum', min: 10000 },
  { tier: 'gold',     min: 5000  },
  { tier: 'silver',   min: 2000  },
  { tier: 'glow',     min: 0     },
];

function calcTier(totalEarned: number): string {
  for (const t of TIER_THRESHOLDS) {
    if (totalEarned >= t.min) return t.tier;
  }
  return 'glow';
}

export default async function handler(req: Request, res: Response) {
  try {
    const clientId = parseInt(req.params.id as string, 10);
    if (isNaN(clientId)) return res.status(400).json({ error: 'Invalid id.' });

    const { type, points: rawPoints, description, adminBy } =
      req.body as { type?: string; points?: number; description?: string; adminBy?: string };

    if (!type || rawPoints === undefined) {
      return res.status(400).json({ error: 'type and points are required.' });
    }

    const pts = parseInt(String(rawPoints), 10);
    if (isNaN(pts) || pts === 0) return res.status(400).json({ error: 'points must be a non-zero integer.' });

    const [client] = await db.select().from(loyaltyClients).where(eq(loyaltyClients.id, clientId));
    if (!client) return res.status(404).json({ error: 'Client not found.' });

    // For redeem, pts should be negative; for earn/bonus, positive
    const delta = type === 'redeem' ? -Math.abs(pts) : Math.abs(pts);

    const newBalance = client.pointsBalance + delta;
    if (newBalance < 0) return res.status(400).json({ error: 'Insufficient points balance.' });

    const newEarned  = delta > 0 ? client.pointsEarnedTotal + delta : client.pointsEarnedTotal;
    const newRedeemed = delta < 0 ? client.pointsRedeemedTotal + Math.abs(delta) : client.pointsRedeemedTotal;
    const newTier = calcTier(newEarned);

    await db.insert(loyaltyTransactions).values({
      clientId,
      type,
      points: delta,
      description: description?.trim() || undefined,
      adminBy: adminBy?.trim() || 'Admin',
    });

    await db.update(loyaltyClients).set({
      pointsBalance:       newBalance,
      pointsEarnedTotal:   newEarned,
      pointsRedeemedTotal: newRedeemed,
      tier:                newTier,
    }).where(eq(loyaltyClients.id, clientId));

    const [updated] = await db.select().from(loyaltyClients).where(eq(loyaltyClients.id, clientId));
    return res.json({ client: updated, delta, newTier });
  } catch (err) {
    console.error('loyalty.points.post.error', err);
    return res.status(500).json({ error: String(err) });
  }
}
