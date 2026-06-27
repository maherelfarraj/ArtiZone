/**
 * POST /api/admin/auth/forgot-password
 * Generates a reset token and emails it to info@artizonespa.com
 * (always sends to the clinic email for security — not to the user's email).
 */
import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { sendEmail } from '@/server/email';
import { db } from '../../../../db/client.js';
import { adminUsers } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const { email } = req.body as { email?: string };
  if (!email?.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.trim().toLowerCase()))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return res.json({ ok: true });
    }

    const token   = crypto.randomBytes(32).toString('hex');
    const expiry  = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.update(adminUsers)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(adminUsers.id, user.id));

    // Determine base URL
    const host    = req.headers.host ?? 'artizonespa.com';
    const proto   = req.headers['x-forwarded-proto'] ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    const resetUrl = `${proto}://${host}/admin/reset-password?token=${token}`;

    await sendEmail({
      to:      'info@artizonespa.com',
      subject: '🔐 ArtiZone Admin — Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#FDFAF6;border-radius:12px;border:1px solid #e8e0d4">
          <div style="background:#0E2A3A;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
            <h2 style="color:#C4A882;margin:0;font-size:18px">Password Reset Request</h2>
            <p style="color:#a0b8c8;margin:4px 0 0;font-size:13px">ArtiZone Admin Panel</p>
          </div>
          <p style="color:#0E2A3A;font-size:14px;line-height:1.6">
            A password reset was requested for: <strong>${user.name}</strong> (${user.email})
          </p>
          <p style="color:#0E2A3A;font-size:14px;line-height:1.6">
            Click the button below to reset the password. This link expires in <strong>1 hour</strong>.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${resetUrl}"
               style="background:#0E2A3A;color:#C4A882;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
              Reset Password
            </a>
          </div>
          <p style="color:#9a8a7a;font-size:12px">
            If you did not request this, ignore this email — your password will not change.
          </p>
          <p style="color:#9a8a7a;font-size:11px;margin-top:8px">
            Link: <a href="${resetUrl}" style="color:#C4A882">${resetUrl}</a>
          </p>
        </div>
      `,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('admin.auth.forgot-password.error', err);
    return res.status(500).json({ error: 'Failed to send reset email.' });
  }
}
