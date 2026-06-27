/**
 * POST /api/client/seed-demo
 * One-time: creates the demo client account if it doesn't exist.
 * Safe to call multiple times (idempotent).
 *
 * PROTECTED — requires header:  Authorization: Bearer <SEQUENCE_SECRET>
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSecret } from '#airo/secrets';

const DEMO_EMAIL    = 'demo@artizonespa.com';
const DEMO_PASSWORD = 'Demo1234';

export default async function handler(req: Request, res: Response) {
  // Guard: only allow requests that carry the server-side secret
  const authHeader = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const secret = getSecret('SEQUENCE_SECRET');

  if (!secret || token !== secret) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const existing = await db.select({ id: clientUsers.id })
      .from(clientUsers)
      .where(eq(clientUsers.email, DEMO_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      return res.json({ ok: true, message: 'Demo account already exists.', email: DEMO_EMAIL });
    }

    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
    await db.insert(clientUsers).values({
      fullName:     'Sara Al Ahmad',
      phone:        '+962791234567',
      email:        DEMO_EMAIL,
      area:         'Abdoun, Amman',
      passwordHash: hash,
      verifiedAt:   new Date(),
    });

    return res.json({ ok: true, message: 'Demo account created.', email: DEMO_EMAIL });
  } catch (err) {
    console.error('seed-demo error', err);
    return res.status(500).json({ error: String(err) });
  }
}
