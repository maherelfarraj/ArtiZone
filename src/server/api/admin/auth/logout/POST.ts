/**
 * POST /api/admin/auth/logout
 * Deletes the session from DB and clears the cookie.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { adminSessions } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const sessionId = req.cookies?.admin_session as string | undefined;
  if (sessionId) {
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId)).catch(() => {});
  }
  res.clearCookie('admin_session', { path: '/' });
  return res.json({ ok: true });
}
