/**
 * POST /api/admin/users/:id/reset-password
 * Superadmin only — sets a new password for any user (including themselves).
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../../../../db/client.js';
import { adminUsers, adminSessions } from '../../../../../db/schema.js';
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
    if (me.role !== 'superadmin') return res.status(403).json({ error: 'Only superadmins can reset passwords.' });

    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid user ID.' });

    const { newPassword } = req.body as { newPassword?: string };
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Verify target user exists
    const [target] = await db.select().from(adminUsers).where(eq(adminUsers.id, targetId)).limit(1);
    if (!target) return res.status(404).json({ error: 'User not found.' });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.update(adminUsers).set({ passwordHash: hash }).where(eq(adminUsers.id, targetId));

    return res.json({ ok: true, message: `Password updated for ${target.name}.` });
  } catch (err) {
    console.error('admin.users.reset-password.error', err);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
}
