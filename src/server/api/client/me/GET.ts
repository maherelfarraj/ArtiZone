/**
 * GET /api/client/me
 * Returns the current logged-in client from session cookie.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions } from '../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.client_session;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

    const now = new Date();
    const sessions = await db.select()
      .from(clientSessions)
      .where(and(eq(clientSessions.id, sessionId), gt(clientSessions.expiresAt, now)))
      .limit(1);

    if (sessions.length === 0) return res.status(401).json({ error: 'Session expired.' });

    const users = await db.select().from(clientUsers).where(eq(clientUsers.id, sessions[0].userId)).limit(1);
    if (users.length === 0) return res.status(401).json({ error: 'User not found.' });

    const user = users[0];

    return res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        area: user.area,
        address: user.address,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error('client.me', err);
    return res.status(500).json({ error: 'Failed to load profile.' });
  }
}
