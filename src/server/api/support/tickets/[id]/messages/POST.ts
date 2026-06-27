/**
 * POST /api/support/tickets/:id/messages
 * Add a message to a ticket.
 * - Admin (x-admin-secret): sender = 'admin', can set adminName
 * - Client (x-session-token): sender = 'client', reopens ticket if resolved
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../db/client.js';
import { supportTickets, ticketMessages } from '../../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/server/email';

const ADMIN_EMAIL = 'info@artizonespa.com';

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

    if (!isAdmin && ticket.sessionToken !== sessionToken) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const { body, adminName } = req.body as { body?: string; adminName?: string };
    if (!body || body.trim().length < 1)
      return res.status(400).json({ error: 'Message cannot be empty.' });

    const sender = isAdmin ? 'admin' : 'client';

    const result = await db.insert(ticketMessages).values({
      ticketId,
      sender,
      body: body.trim(),
      adminName: isAdmin ? (adminName?.trim() || 'ArtiZone Team') : null,
    });

    const msgId = Number(result[0].insertId);

    // If client replies to a resolved/closed ticket, reopen it
    if (!isAdmin && (ticket.status === 'resolved' || ticket.status === 'closed')) {
      await db
        .update(supportTickets)
        .set({ status: 'open', resolvedAt: null })
        .where(eq(supportTickets.id, ticketId));
    }

    // If admin replies, update status to in_progress if still open
    if (isAdmin && ticket.status === 'open') {
      await db
        .update(supportTickets)
        .set({ status: 'in_progress' })
        .where(eq(supportTickets.id, ticketId));
    }

    // Notify the other party (fire-and-forget)
    if (isAdmin) {
      // Email the client
      sendEmail({
        to: ticket.email,
        subject: `Re: ${ticket.subject} [Ticket #${ticketId}]`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;">
            <h2 style="color:#0E2A3A;margin:0 0 4px;">ArtiZone Support</h2>
            <p style="color:#888;font-size:13px;margin:0 0 20px;">Ticket #${ticketId}: ${ticket.subject}</p>
            <p style="font-size:14px;color:#0E2A3A;margin:0 0 8px;">Hi ${ticket.name},</p>
            <p style="font-size:14px;color:#0E2A3A;margin:0 0 16px;">Our team has replied to your inquiry:</p>
            <div style="padding:16px;background:#FDFAF6;border-radius:8px;font-size:14px;color:#0E2A3A;line-height:1.6;margin-bottom:20px;">${body.trim().replace(/\n/g, '<br/>')}</div>
            <p style="font-size:13px;color:#888;">You can reply by visiting <a href="https://artizonespa.com" style="color:#C4A882;">artizonespa.com</a> and opening the chat widget.</p>
          </div>
        `,
        text: `Hi ${ticket.name},\n\nOur team has replied to your inquiry (Ticket #${ticketId}: ${ticket.subject}):\n\n${body.trim()}\n\nYou can reply by visiting artizonespa.com and opening the chat widget.`,
      }).catch((err) => console.error('support.reply.email.client.error', err));
    } else {
      // Notify admin of client reply
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `💬 Client reply on Ticket #${ticketId}: ${ticket.subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;">
            <h2 style="color:#0E2A3A;margin:0 0 16px;">Client Reply — Ticket #${ticketId}</h2>
            <p style="font-size:14px;color:#888;margin:0 0 4px;">From: <strong style="color:#0E2A3A;">${ticket.name}</strong> &lt;${ticket.email}&gt;</p>
            <p style="font-size:14px;color:#888;margin:0 0 16px;">Subject: ${ticket.subject}</p>
            <div style="padding:16px;background:#FDFAF6;border-radius:8px;font-size:14px;color:#0E2A3A;line-height:1.6;margin-bottom:20px;">${body.trim().replace(/\n/g, '<br/>')}</div>
            <a href="https://artizonespa.com/admin/support" style="display:inline-block;background:#C4A882;color:#fff;text-decoration:none;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:600;">Reply in Dashboard →</a>
          </div>
        `,
        text: `Client reply on Ticket #${ticketId}\nFrom: ${ticket.name} <${ticket.email}>\n\n${body.trim()}\n\nReply at: https://artizonespa.com/admin/support`,
      }).catch((err) => console.error('support.reply.email.admin.error', err));
    }

    const [msg] = await db
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.id, msgId))
      .limit(1);

    return res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error('support.message.create.error', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}
