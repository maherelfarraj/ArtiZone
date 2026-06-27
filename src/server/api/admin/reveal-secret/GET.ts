/**
 * GET /api/admin/reveal-secret — REMOVED
 * This endpoint has been permanently disabled for security.
 */
import type { Request, Response } from 'express';

export default function handler(_req: Request, res: Response) {
  return res.status(410).json({ error: 'This endpoint has been removed.' });
}
