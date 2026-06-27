/**
 * GET /api/admin/token
 * Returns the admin secret for use by admin UI pages.
 * Only callable from the same origin (server-side rendered admin pages).
 */
import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';

export default function handler(req: Request, res: Response) {
  // Only allow same-origin requests (no external callers)
  const origin = req.headers.origin;
  const host   = req.headers.host;
  if (origin && host && !origin.includes(host.split(':')[0])) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return res.json({ token: getSecret('SEQUENCE_SECRET') ?? '' });
}
