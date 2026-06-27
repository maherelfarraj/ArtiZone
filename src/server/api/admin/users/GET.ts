/**
 * GET /api/admin/users
 * Returns all admin users. Requires active session.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { adminUsers, adminSessions } from '../../../db/schema.js';
import { eq, and, gt, desc } from 'drizzle-orm';

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

    const users = await db
      .select({
        id:          adminUsers.id,
        name:        adminUsers.name,
        email:       adminUsers.email,
        role:        adminUsers.role,
        isActive:    adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt:   adminUsers.createdAt,
      })
      .from(adminUsers)
      .orderBy(desc(adminUsers.createdAt));

    return res.json({ users });
  } catch (err) {
    console.error('admin.users.list.error', err);
    return res.status(500).json({ error: 'Failed to load users.' });
  }
}
