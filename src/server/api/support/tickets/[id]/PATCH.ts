/**
 * PATCH /api/support/tickets/:id
 * Admin: update ticket status or priority.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { supportTickets } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const ticketId = parseInt(req.params.id as string, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: 'Invalid ticket id.' });

    const { status, priority } = req.body as {
      status?: 'open' | 'in_progress' | 'resolved' | 'closed';
      priority?: 'low' | 'normal' | 'high';
    };

    const patch: Record<string, unknown> = {};
    if (status) patch.status = status;
    if (priority) patch.priority = priority;
    if (status === 'resolved' || status === 'closed') patch.resolvedAt = new Date();

    if (Object.keys(patch).length === 0)
      return res.status(400).json({ error: 'Nothing to update.' });

    await db.update(supportTickets).set(patch).where(eq(supportTickets.id, ticketId));

    const [updated] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1);

    return res.json({ success: true, ticket: updated });
  } catch (err) {
    console.error('support.ticket.patch.error', err);
    return res.status(500).json({ error: 'Failed to update ticket.' });
  }
}
