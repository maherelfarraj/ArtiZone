/**
 * GET /api/admin/auth/me
 * Returns the currently logged-in admin user (or 401 if not authenticated).
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { adminUsers, adminSessions } from '../../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const sessionId = req.cookies?.admin_session as string | undefined;
  if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.id, sessionId),
          gt(adminSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) {
      res.clearCookie('admin_session', { path: '/' });
      return res.status(401).json({ error: 'Session expired.' });
    }

    const [user] = await db
      .select({
        id:          adminUsers.id,
        name:        adminUsers.name,
        email:       adminUsers.email,
        role:        adminUsers.role,
        isActive:    adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, session.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account inactive.' });
    }

    return res.json({ user });
  } catch (err: unknown) {
    // If the table doesn't exist yet (migration not run), signal setup required
    const msg = String(err);
    if (msg.includes("doesn't exist") || msg.includes('no such table') || msg.includes('ER_NO_SUCH_TABLE')) {
      return res.status(503).json({ error: 'setup_required' });
    }
    console.error('admin.auth.me.error', err);
    return res.status(500).json({ error: 'Auth check failed.' });
  }
}
