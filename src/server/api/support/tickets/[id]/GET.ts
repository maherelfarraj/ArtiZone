/**
 * GET /api/support/tickets/:id
 * Returns a single ticket + all its messages.
 * Accessible by admin (x-admin-secret) OR the ticket owner (x-session-token).
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { supportTickets, ticketMessages } from '../../../../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const adminSecret = req.headers['x-admin-secret'] as string | undefined;
  const sessionToken = req.headers['x-session-token'] as string | undefined;

  const isAdmin = process.env.SEQUENCE_SECRET
    ? adminSecret === process.env.SEQUENCE_SECRET
    : !!adminSecret;

  try {
    const ticketId = parseInt(req.params.id as string, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: 'Invalid ticket id.' });

    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1);

    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

    // Auth: must be admin OR own the ticket via session token
    if (!isAdmin && ticket.sessionToken !== sessionToken) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const messages = await db
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(asc(ticketMessages.createdAt));

    // Strip sessionToken from non-admin responses
    const safeTicket = isAdmin ? ticket : { ...ticket, sessionToken: undefined };

    return res.json({ ticket: safeTicket, messages });
  } catch (err) {
    console.error('support.ticket.get.error', err);
    return res.status(500).json({ error: 'Failed to load ticket.' });
  }
}
