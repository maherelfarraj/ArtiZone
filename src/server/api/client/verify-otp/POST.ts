/**
 * POST /api/client/verify-otp
 * Verifies the OTP code. Returns a token so the client can set their password.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientOtp } from '../../../db/schema.js';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

export default async function handler(req: Request, res: Response) {
  try {
    const { email, code } = req.body as { email?: string; code?: string };
    if (!email?.trim() || !code?.trim()) {
      return res.status(400).json({ error: 'Email and code are required.' });
    }

    const emailLower = email.trim().toLowerCase();
    const now = new Date();

    // Find valid unused OTP
    const otps = await db.select()
      .from(clientOtp)
      .where(
        and(
          eq(clientOtp.email, emailLower),
          eq(clientOtp.code, code.trim()),
          isNull(clientOtp.usedAt),
          gt(clientOtp.expiresAt, now),
        )
      )
      .orderBy(clientOtp.createdAt)
      .limit(1);

    if (otps.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code. Please try again.' });
    }

    // Mark OTP used
    await db.update(clientOtp).set({ usedAt: now }).where(eq(clientOtp.id, otps[0].id));

    // Mark user verified
    await db.update(clientUsers)
      .set({ verifiedAt: now })
      .where(eq(clientUsers.email, emailLower));

    // Return a short-lived set-password token (stored in OTP table as a special entry)
    const token = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await db.insert(clientOtp).values({
      email: emailLower,
      code: `SET_PWD:${token}`,
      expiresAt: tokenExpiry,
    });

    return res.json({ success: true, setPasswordToken: token });
  } catch (err) {
    console.error('client.verify-otp', err);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}
