/**
 * POST /api/client/register
 * Creates a new client account, auto-verifies, and logs them in immediately.
 * No OTP step required.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/server/email';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export default async function handler(req: Request, res: Response) {
  try {
    const { fullName, phone, email, area, address, dob, password } = req.body as {
      fullName?: string; phone?: string; email?: string; area?: string;
      address?: string; dob?: string; password?: string;
    };

    if (!fullName?.trim() || !phone?.trim() || !email?.trim() || !area?.trim()) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const emailLower = email.trim().toLowerCase();

    // Check duplicate email
    const existing = await db.select({ id: clientUsers.id, verifiedAt: clientUsers.verifiedAt })
      .from(clientUsers)
      .where(eq(clientUsers.email, emailLower))
      .limit(1);

    if (existing.length > 0 && existing[0].verifiedAt) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();
    let userId: number;

    if (existing.length > 0) {
      // Unverified account — update and verify now
      await db.update(clientUsers)
        .set({
          fullName: fullName.trim(),
          phone: phone.trim(),
          area: area.trim(),
          address: address?.trim() || null,
          dob: dob?.trim() || null,
          passwordHash,
          verifiedAt: now,
        })
        .where(eq(clientUsers.email, emailLower));
      userId = existing[0].id;
    } else {
      // New user — insert and mark verified immediately
      const [result] = await db.insert(clientUsers).values({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: emailLower,
        area: area.trim(),
        address: address?.trim() || null,
        dob: dob?.trim() || null,
        passwordHash,
        verifiedAt: now,
      });
      userId = (result as unknown as { insertId: number }).insertId;
    }

    // Auto-login: create session cookie
    const sessionId = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.insert(clientSessions).values({ id: sessionId, userId, expiresAt });

    res.cookie('client_session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: emailLower,
      subject: 'Welcome to ArtiZone!',
      html: welcomeEmailHtml(fullName.trim()),
      text: `Hi ${fullName.trim()},\n\nWelcome to ArtiZone! Your account has been created successfully.\n\nYou can log in at artizonespa.com/client/login\n\nArtiZone Beauty Clinic`,
    }).catch(() => {/* non-critical */});

    return res.json({ success: true, user: { id: userId, fullName: fullName.trim(), email: emailLower } });
  } catch (err) {
    console.error('client.register', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}

function welcomeEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,42,58,0.10);">
    <div style="background:linear-gradient(135deg,#0E2A3A 0%,#1a3d52 100%);padding:32px 32px 24px;text-align:center;">
      <img src="https://artizonespa.com/airo-assets/images/layouts/header/artizone" alt="ArtiZone" style="height:48px;width:auto;object-fit:contain;" />
    </div>
    <div style="padding:32px;">
      <h2 style="color:#0E2A3A;font-size:22px;margin:0 0 8px;">Welcome, ${name}!</h2>
      <p style="color:#6B7260;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Your ArtiZone account has been created. You can now book appointments, track your loyalty points, and access exclusive offers.
      </p>
      <a href="https://artizonespa.com/client/dashboard"
        style="display:inline-block;background:#C4A882;color:#0E2A3A;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:1px;">
        Go to My Account
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #F0EBE3;text-align:center;">
      <p style="color:#C4A882;font-size:12px;margin:0;">ArtiZone Beauty Clinic · Amman, Jordan</p>
    </div>
  </div>
</body>
</html>`;
}
