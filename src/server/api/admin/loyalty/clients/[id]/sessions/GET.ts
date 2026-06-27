/**
 * GET /api/admin/loyalty/clients/:id/sessions
 * List sessions for a client.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../../db/client.js';
import { loyaltySessions } from '../../../../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const clientId = parseInt(req.params.id as string, 10);
    if (isNaN(clientId)) return res.status(400).json({ error: 'Invalid id.' });

    const sessions = await db
      .select()
      .from(loyaltySessions)
      .where(eq(loyaltySessions.clientId, clientId))
      .orderBy(desc(loyaltySessions.sessionDate));

    return res.json({ sessions });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
