/**
 * DELETE /api/admin/users/:id
 * Deactivates (soft-deletes) an admin user. Superadmin only.
 */
import type { Request, Response } from 'express';
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
    if (me.role !== 'superadmin') return res.status(403).json({ error: 'Superadmin only.' });

    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid user ID.' });
    if (targetId === me.id) return res.status(400).json({ error: 'Cannot deactivate your own account.' });

    await db.update(adminUsers)
      .set({ isActive: false })
      .where(eq(adminUsers.id, targetId));

    // Invalidate all sessions for this user
    await db.delete(adminSessions).where(eq(adminSessions.userId, targetId));

    return res.json({ ok: true });
  } catch (err) {
    console.error('admin.users.delete.error', err);
    return res.status(500).json({ error: 'Failed to deactivate user.' });
  }
}
