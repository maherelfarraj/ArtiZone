/**
 * POST /api/client/logout
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientSessions } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.client_session;
    if (sessionId) {
      await db.delete(clientSessions).where(eq(clientSessions.id, sessionId));
    }
    res.clearCookie('client_session', { path: '/' });
    return res.json({ success: true });
  } catch (err) {
    console.error('client.logout', err);
    return res.status(500).json({ error: 'Logout failed.' });
  }
}
