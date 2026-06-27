/**
 * POST /api/client/login
 * Email + password login for verified clients.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export default async function handler(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailLower = email.trim().toLowerCase();
    const users = await db.select().from(clientUsers).where(eq(clientUsers.email, emailLower)).limit(1);

    if (users.length === 0) {
      return res.status(401).json({ error: 'No account found with this email.' });
    }

    const user = users[0];

    if (!user.passwordHash) {
      return res.status(403).json({ error: 'Please complete your registration by setting a password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Create session
    const sessionId = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
    console.error('client.login', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
