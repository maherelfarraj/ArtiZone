/**
 * POST /api/admin/test-email
 * Sends a test email to info@artizonespa.com to verify the email gateway is working.
 */
import type { Request, Response } from 'express';
import { sendEmail } from '@/server/email';

export default async function handler(_req: Request, res: Response) {
  try {
    const { messageId } = await sendEmail({
      to: 'info@artizonespa.com',
      subject: '✅ ArtiZone Email Test — Gateway Working',
      text: 'This is a test email from your ArtiZone admin panel. If you received this, booking notification emails are working correctly.',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#FDFAF6;border-radius:12px;border:1px solid #e8e0d4">
          <div style="background:#0E2A3A;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
            <h2 style="color:#C4A882;margin:0;font-size:18px">✅ Email Test Successful</h2>
            <p style="color:#a0b8c8;margin:4px 0 0;font-size:13px">artizonespa.com</p>
          </div>
          <p style="color:#0E2A3A;font-size:14px;line-height:1.6">
            This is a test email from your ArtiZone admin panel.<br><br>
            If you received this, <strong>booking notification emails are working correctly</strong> and you will receive an email at this address every time a client submits the booking form.
          </p>
          <p style="color:#7a6a5a;font-size:12px;margin-top:20px">Sent from: ArtiZone Admin Panel</p>
        </div>
      `,
    });

    console.log('test-email.sent', messageId);
    return res.json({ success: true, messageId });
  } catch (err) {
    console.error('test-email.failed', err);
    return res.status(500).json({ success: false, error: 'Failed to send test email.' });
  }
}
