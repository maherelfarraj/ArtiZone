/**
 * GET /api/support/tickets
 * Admin: returns all tickets with latest message preview.
 * Protected by x-admin-secret header.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { supportTickets, ticketMessages } from '../../../db/schema.js';
import { desc, eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const tickets = await db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));

    // Attach last message to each ticket
    const enriched = await Promise.all(
      tickets.map(async (t) => {
        const [last] = await db
          .select()
          .from(ticketMessages)
          .where(eq(ticketMessages.ticketId, t.id))
          .orderBy(desc(ticketMessages.createdAt))
          .limit(1);
        const [msgCount] = await db
          .select({ count: ticketMessages.id })
          .from(ticketMessages)
          .where(eq(ticketMessages.ticketId, t.id));
        return { ...t, lastMessage: last ?? null, messageCount: msgCount?.count ?? 0 };
      }),
    );

    return res.json({ tickets: enriched });
  } catch (err) {
    console.error('support.tickets.list.error', err);
    return res.status(500).json({ error: 'Failed to load tickets.' });
  }
}
