/**
 * POST /api/admin/auth/reset-password
 * Validates the reset token and sets a new password.
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../../../db/client.js';
import { adminUsers } from '../../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.resetToken, token.trim()),
          gt(adminUsers.resetTokenExpiry, new Date()),
        ),
      )
      .limit(1);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }

    const hash = await bcrypt.hash(password, 12);
    await db.update(adminUsers)
      .set({ passwordHash: hash, resetToken: null, resetTokenExpiry: null })
      .where(eq(adminUsers.id, user.id));

    return res.json({ ok: true });
  } catch (err) {
    console.error('admin.auth.reset-password.error', err);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
}
