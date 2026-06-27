/**
 * POST /api/admin/auth/change-password
 * Allows a logged-in admin to change their own password.
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../../../db/client.js';
import { adminUsers, adminSessions } from '../../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

async function getSessionUser(req: Request) {
  const sessionId = req.cookies?.admin_session as string | undefined;
  if (!sessionId) return null;
  const [session] = await db.select().from(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  if (!session) return null;
  const [user] = await db.select().from(adminUsers)
    .where(eq(adminUsers.id, session.userId)).limit(1);
  return user?.isActive ? user : null;
}

export default async function handler(req: Request, res: Response) {
  try {
    const me = await getSessionUser(req);
    if (!me) return res.status(401).json({ error: 'Not authenticated.' });

    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string; newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    const valid = await bcrypt.compare(currentPassword, me.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.update(adminUsers)
      .set({ passwordHash: hash })
      .where(eq(adminUsers.id, me.id));

    return res.json({ ok: true });
  } catch (err) {
    console.error('admin.auth.change-password.error', err);
    return res.status(500).json({ error: 'Failed to change password.' });
  }
}
