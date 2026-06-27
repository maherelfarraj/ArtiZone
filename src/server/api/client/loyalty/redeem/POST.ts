/**
 * POST /api/client/loyalty/redeem
 * Client-initiated reward redemption request.
 * Body: { rewardId: string, rewardTitle: string, pointsCost: number }
 *
 * Flow:
 *  1. Validate session → resolve loyalty client by email
 *  2. Check sufficient balance
 *  3. Deduct points + insert transaction (type = 'redeem')
 *  4. Return updated balance + redemption code
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { clientUsers, clientSessions, loyaltyClients, loyaltyTransactions } from '../../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

// Canonical reward catalogue — must match frontend REWARDS_CATALOGUE
const REWARD_CATALOGUE: Record<string, { title: string; pts: number }> = {
  'express-facial':          { title: 'Express Facial (30 min)',        pts: 500  },
  'hydra-boost-mask':        { title: 'Hydra-Boost Mask Add-On',        pts: 750  },
  'brow-shaping':            { title: 'Brow Shaping Session',           pts: 300  },
  'nail-polish-change':      { title: 'Nail Polish Change',             pts: 200  },
  'full-body-scrub':         { title: 'Full Body Scrub',                pts: 1200 },
  'signature-treatment':     { title: 'Full Signature Treatment',       pts: 1500 },
};

function generateCode(rewardId: string, clientId: number): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rid = rewardId.slice(0, 4).toUpperCase();
  return `AZ-${rid}-${clientId}-${ts}`;
}

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
    // ── Auth ──────────────────────────────────────────────────────────────────
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

    // ── Validate body ─────────────────────────────────────────────────────────
    const { rewardId } = req.body as { rewardId?: string };
    if (!rewardId) return res.status(400).json({ error: 'rewardId is required.' });

    const reward = REWARD_CATALOGUE[rewardId];
    if (!reward) return res.status(400).json({ error: 'Unknown reward.' });

    // ── Resolve loyalty client ────────────────────────────────────────────────
    const email = users[0].email;
    const loyalty = await db.select().from(loyaltyClients).where(eq(loyaltyClients.email, email)).limit(1);
    if (loyalty.length === 0) return res.status(404).json({ error: 'Not enrolled in loyalty programme.' });

    const lc = loyalty[0];

    // ── Check balance ─────────────────────────────────────────────────────────
    if (lc.pointsBalance < reward.pts) {
      return res.status(400).json({
        error: 'Insufficient points.',
        required: reward.pts,
        balance: lc.pointsBalance,
        shortfall: reward.pts - lc.pointsBalance,
      });
    }

    // ── Deduct + record ───────────────────────────────────────────────────────
    const newBalance  = lc.pointsBalance - reward.pts;
    const newRedeemed = lc.pointsRedeemedTotal + reward.pts;
    const newTier     = calcTier(lc.pointsEarnedTotal);
    const code        = generateCode(rewardId, lc.id);

    await db.insert(loyaltyTransactions).values({
      clientId:    lc.id,
      type:        'redeem',
      points:      -reward.pts,
      description: `Redeemed: ${reward.title} (${code})`,
      adminBy:     'client-portal',
    });

    await db.update(loyaltyClients).set({
      pointsBalance:       newBalance,
      pointsRedeemedTotal: newRedeemed,
      tier:                newTier,
    }).where(eq(loyaltyClients.id, lc.id));

    return res.json({
      success:      true,
      code,
      reward:       reward.title,
      pointsSpent:  reward.pts,
      newBalance,
      message:      `Show code ${code} at the clinic to claim your reward.`,
    });
  } catch (err) {
    console.error('client.loyalty.redeem', err);
    return res.status(500).json({ error: 'Redemption failed. Please try again.' });
  }
}
