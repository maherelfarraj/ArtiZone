/**
 * POST /api/support/tickets
 * Create a new support ticket (from the chat widget or contact form).
 * Returns the ticket id + sessionToken so the client can poll for replies.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { supportTickets, ticketMessages } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/server/email';
import crypto from 'node:crypto';

const ADMIN_EMAIL = 'info@artizonespa.com';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message, source } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
      source?: string;
    };

    if (!name || name.trim().length < 2)
      return res.status(400).json({ error: 'Please enter your name.' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (!subject || subject.trim().length < 3)
      return res.status(400).json({ error: 'Please enter a subject.' });
    if (!message || message.trim().length < 5)
      return res.status(400).json({ error: 'Please enter a message.' });

    const sessionToken = crypto.randomBytes(32).toString('hex');

    const result = await db.insert(supportTickets).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      status: 'open',
      priority: 'normal',
      source: (source as 'chat_widget' | 'contact_form' | 'admin') || 'chat_widget',
      sessionToken,
    });

    const ticketId = Number(result[0].insertId);

    // Save the opening message
    await db.insert(ticketMessages).values({
      ticketId,
      sender: 'client',
      body: message.trim(),
    });

    // Notify admin (fire-and-forget)
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `💬 New support ticket #${ticketId}: ${subject.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#0E2A3A;margin:0 0 16px;">New Support Ticket #${ticketId}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:#888;width:100px;">From</td><td style="padding:6px 0;font-weight:600;color:#0E2A3A;">${name.trim()} &lt;${email.trim()}&gt;</td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;color:#0E2A3A;">${phone.trim()}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#888;">Subject</td><td style="padding:6px 0;color:#0E2A3A;">${subject.trim()}</td></tr>
          </table>
          <div style="margin:16px 0;padding:16px;background:#FDFAF6;border-radius:8px;font-size:14px;color:#0E2A3A;line-height:1.6;">${message.trim().replace(/\n/g, '<br/>')}</div>
          <a href="https://artizonespa.com/admin/support" style="display:inline-block;background:#C4A882;color:#fff;text-decoration:none;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:600;">
            Reply in Admin Dashboard →
          </a>
        </div>
      `,
      text: `New support ticket #${ticketId}\nFrom: ${name.trim()} <${email.trim()}>\nSubject: ${subject.trim()}\n\n${message.trim()}\n\nReply at: https://artizonespa.com/admin/support`,
    }).catch((err) => console.error('support.ticket.email.error', err));

    // Fetch the created ticket to return
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketId)).limit(1);

    return res.status(201).json({ success: true, ticketId, sessionToken, ticket });
  } catch (err) {
    console.error('support.ticket.create.error', err);
    return res.status(500).json({ error: 'Failed to create ticket. Please try again.' });
  }
}
