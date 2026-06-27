/**
 * POST /api/client/set-password
 * Sets the password for a newly verified client using the set-password token.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientOtp, clientSessions } from '../../../db/schema.js';
import { eq, and, isNull, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export default async function handler(req: Request, res: Response) {
  try {
    const { email, token, password } = req.body as {
      email?: string; token?: string; password?: string;
    };

    if (!email?.trim() || !token?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const emailLower = email.trim().toLowerCase();
    const now = new Date();

    // Validate set-password token
    const otps = await db.select()
      .from(clientOtp)
      .where(
        and(
          eq(clientOtp.email, emailLower),
          eq(clientOtp.code, `SET_PWD:${token.trim()}`),
          isNull(clientOtp.usedAt),
          gt(clientOtp.expiresAt, now),
        )
      )
      .limit(1);

    if (otps.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token. Please register again.' });
    }

    // Mark token used
    await db.update(clientOtp).set({ usedAt: now }).where(eq(clientOtp.id, otps[0].id));

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Get user
    const users = await db.select().from(clientUsers).where(eq(clientUsers.email, emailLower)).limit(1);
    if (users.length === 0) return res.status(404).json({ error: 'Account not found.' });
    const user = users[0];

    // Update password
    await db.update(clientUsers).set({ passwordHash: hash }).where(eq(clientUsers.id, user.id));

    // Create session
    const sessionId = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(clientSessions).values({ id: sessionId, userId: user.id, expiresAt });

    res.cookie('client_session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return res.json({
      success: true,
      user: { id: user.id, fullName: user.fullName, email: emailLower, area: user.area },
    });
  } catch (err) {
    console.error('client.set-password', err);
    return res.status(500).json({ error: 'Failed to set password. Please try again.' });
  }
}
