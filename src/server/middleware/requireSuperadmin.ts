/**
 * Express middleware — rejects requests from non-superadmin sessions with 403.
 * Attach to any route that only superadmins should call.
 */
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { adminUsers, adminSessions } from '../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export async function requireSuperadmin(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.admin_session as string | undefined;
  if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date())))
      .limit(1);

    if (!session) return res.status(401).json({ error: 'Session expired.' });

    const [user] = await db
      .select({ role: adminUsers.role, isActive: adminUsers.isActive })
      .from(adminUsers)
      .where(eq(adminUsers.id, session.userId))
      .limit(1);

    if (!user || !user.isActive) return res.status(401).json({ error: 'Account inactive.' });
    if (user.role !== 'superadmin') return res.status(403).json({ error: 'Superadmin access required.' });

    next();
  } catch {
    return res.status(500).json({ error: 'Auth check failed.' });
  }
}
