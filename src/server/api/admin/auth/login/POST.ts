/**
 * POST /api/admin/auth/login
 * Validates email + password, creates a session, sets HttpOnly cookie.
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db } from '../../../../db/client.js';
import { adminUsers, adminSessions } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export default async function handler(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  const emailClean    = email?.trim().toLowerCase() ?? '';
  const passwordClean = password?.trim() ?? '';

  if (!emailClean || !passwordClean) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, emailClean))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(passwordClean, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create session
    const sessionId = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await db.insert(adminSessions).values({
      id:        sessionId,
      userId:    user.id,
      expiresAt,
    });

    // Update last login
    await db.update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, user.id));

    // Set HttpOnly session cookie
    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   SESSION_TTL_MS,
      path:     '/',
    });

    return res.json({
      ok:   true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    const msg = String(err);
    if (msg.includes("doesn't exist") || msg.includes('no such table') || msg.includes('ER_NO_SUCH_TABLE')) {
      return res.status(503).json({ error: 'setup_required' });
    }
    console.error('admin.auth.login.error', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
