/**
 * POST /api/client/resend-otp
 * Re-sends a fresh OTP to an existing (unverified or verified) client email.
 * Does NOT overwrite name/phone/area.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientOtp } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/server/email';
import { randomInt } from 'node:crypto';

export default async function handler(req: Request, res: Response) {
  try {
    const { email } = req.body as { email?: string };
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });

    const emailLower = email.trim().toLowerCase();

    const users = await db.select({ id: clientUsers.id, fullName: clientUsers.fullName })
      .from(clientUsers)
      .where(eq(clientUsers.email, emailLower))
      .limit(1);

    if (users.length === 0) return res.status(404).json({ error: 'No account found with this email.' });

    const { fullName } = users[0];
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.insert(clientOtp).values({ email: emailLower, code, expiresAt });

    await sendEmail({
      to: emailLower,
      subject: 'Your New ArtiZone Verification Code',
      html: otpHtml(fullName, code),
      text: `Hi ${fullName},\n\nYour new ArtiZone verification code is: ${code}\n\nExpires in 15 minutes.\n\nArtiZone Beauty Clinic`,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('client.resend-otp', err);
    return res.status(500).json({ error: 'Failed to resend code.' });
  }
}

function otpHtml(name: string, code: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,42,58,0.10);">
    <div style="background:linear-gradient(135deg,#0E2A3A 0%,#1a3d52 100%);padding:32px;text-align:center;">
      <img src="https://artizonespa.com/airo-assets/images/layouts/header/artizone" alt="ArtiZone" style="height:48px;width:auto;" />
    </div>
    <div style="padding:32px;">
      <h2 style="color:#0E2A3A;font-size:20px;margin:0 0 8px;">New Verification Code</h2>
      <p style="color:#6B7260;font-size:14px;margin:0 0 24px;">Hi ${name}, here is your new code:</p>
      <div style="background:#F7F3EE;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="color:#0E2A3A;font-size:40px;font-weight:800;letter-spacing:10px;margin:0;">${code}</p>
        <p style="color:#C4A882;font-size:12px;margin:8px 0 0;">Expires in 15 minutes</p>
      </div>
    </div>
    <div style="background:#F7F3EE;padding:16px 32px;text-align:center;">
      <p style="color:#C4A882;font-size:12px;margin:0;">ArtiZone Beauty Clinic · Amman, Jordan</p>
    </div>
  </div>
</body></html>`;
}
