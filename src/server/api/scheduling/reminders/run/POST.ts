/**
 * POST /api/scheduling/reminders/run
 * Finds confirmed appointments scheduled for tomorrow (Amman time, UTC+3)
 * and sends a reminder email to the clinic for each one not yet reminded.
 * Uses the notifications table to prevent duplicate sends.
 * Protected by x-sequence-secret header.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { appointments, notifications } from '../../../../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';
import { sendEmail } from '@/server/email';

const CLINIC_EMAIL = 'info@artizonespa.com';
const NOTIFICATION_TYPE = 'appointment_reminder_24h';

function tomorrowAmman(): string {
  // UTC+3 offset
  const now = new Date();
  const ammanNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const tomorrow = new Date(ammanNow);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-sequence-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const tomorrow = tomorrowAmman();

    // Get all confirmed appointments for tomorrow
    const tomorrowAppts = await db.select()
      .from(appointments)
      .where(
        and(
          eq(appointments.date, tomorrow),
          inArray(appointments.status, ['confirmed', 'requested']),
        )
      );

    if (tomorrowAppts.length === 0) {
      return res.json({ sent: 0, skipped: 0, date: tomorrow });
    }

    // Check which ones already have a reminder sent
    const apptIds = tomorrowAppts.map(a => a.id);
    const alreadySent = await db.select()
      .from(notifications)
      .where(
        and(
          eq(notifications.type, NOTIFICATION_TYPE),
          inArray(notifications.referenceId, apptIds),
        )
      );
    const alreadySentIds = new Set(alreadySent.map(n => n.referenceId));

    const toRemind = tomorrowAppts.filter(a => !alreadySentIds.has(a.id));

    if (toRemind.length === 0) {
      return res.json({ sent: 0, skipped: tomorrowAppts.length, date: tomorrow });
    }

    // Build summary email to clinic
    const rows = toRemind.map(a =>
      `• ${a.startTime} — ${a.customerName} (${a.customerPhone}) — ${a.serviceName ?? 'Treatment'}`
    ).join('\n');

    const htmlRows = toRemind.map(a =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;color:#7a6a5a;font-size:13px">${a.startTime}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;color:#0E2A3A;font-weight:600;font-size:13px">${a.customerName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;font-size:13px"><a href="tel:${a.customerPhone}" style="color:#0E2A3A">${a.customerPhone}</a></td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;color:#6B7260;font-size:13px">${a.serviceName ?? 'Treatment'}</td>
      </tr>`
    ).join('');

    await sendEmail({
      to: CLINIC_EMAIL,
      subject: `⏰ Tomorrow's Appointments (${tomorrow}) — ${toRemind.length} client${toRemind.length > 1 ? 's' : ''}`,
      text: `ArtiZone — Appointment Reminders for ${tomorrow}\n\n${rows}\n\nView full schedule: https://artizonespa.com/admin/scheduling`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FDFAF6;border-radius:12px;border:1px solid #e8e0d4">
          <div style="background:#0E2A3A;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
            <h2 style="color:#C4A882;margin:0;font-size:18px;font-weight:700">⏰ Tomorrow's Appointments</h2>
            <p style="color:#a0b8c8;margin:4px 0 0;font-size:13px">${tomorrow} · ${toRemind.length} appointment${toRemind.length > 1 ? 's' : ''}</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#F7F3EE">
                <th style="padding:8px 12px;text-align:left;font-size:11px;color:#7a6a5a;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Time</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;color:#7a6a5a;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Client</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;color:#7a6a5a;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Phone</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;color:#7a6a5a;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Service</th>
              </tr>
            </thead>
            <tbody>${htmlRows}</tbody>
          </table>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e8e0d4">
            <a href="https://artizonespa.com/admin/scheduling"
               style="display:inline-block;background:#C4A882;color:#0E2A3A;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">
              View Full Schedule →
            </a>
          </div>
        </div>
      `,
    });

    // Log to notifications table to prevent re-sending
    for (const appt of toRemind) {
      await db.insert(notifications).values({
        type:        NOTIFICATION_TYPE,
        referenceId: appt.id,
        channel:     'email',
        recipient:   CLINIC_EMAIL,
        statusCode:  200,
      }).catch(() => { /* non-fatal */ });
    }

    return res.json({ sent: toRemind.length, skipped: alreadySentIds.size, date: tomorrow });
  } catch (err) {
    console.error('reminders.run.error', err);
    return res.status(500).json({ error: 'Failed to run reminders', message: String(err) });
  }
}
