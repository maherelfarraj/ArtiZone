/**
 * POST /api/admin/users
 * Creates a new admin user. Only superadmins can create users.
 * Sends a welcome email with a temporary password.
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { sendEmail } from '@/server/email';
import { db } from '../../../db/client.js';
import { adminUsers, adminSessions } from '../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

async function getSessionUser(req: Request) {
  const sessionId = req.cookies?.admin_session as string | undefined;
  if (!sessionId) return null;
  const [session] = await db.select().from(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  if (!session) return null;
  const [user] = await db.select().from(adminUsers)
    .where(eq(adminUsers.id, session.userId)).limit(1);
  return user?.isActive ? user : null;
}

export default async function handler(req: Request, res: Response) {
  try {
    const me = await getSessionUser(req);
    if (!me) return res.status(401).json({ error: 'Not authenticated.' });
    if (me.role !== 'superadmin') return res.status(403).json({ error: 'Only superadmins can add users.' });

    const { name, email, role = 'staff' } = req.body as {
      name?: string; email?: string; role?: 'superadmin' | 'staff';
    };

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Check duplicate
    const [existing] = await db.select().from(adminUsers)
      .where(eq(adminUsers.email, email.trim().toLowerCase())).limit(1);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    // Generate temp password
    const tempPassword = crypto.randomBytes(6).toString('hex'); // 12 chars
    const hash = await bcrypt.hash(tempPassword, 12);

    const [result] = await db.insert(adminUsers).values({
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      passwordHash: hash,
      role:         role === 'superadmin' ? 'superadmin' : 'staff',
    });

    // Send welcome email to the new user's email AND to info@artizonespa.com
    const host   = req.headers.host ?? 'artizonespa.com';
    const proto  = req.headers['x-forwarded-proto'] ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    const loginUrl = `${proto}://${host}/admin/login`;

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#FDFAF6;border-radius:12px;border:1px solid #e8e0d4">
        <div style="background:#0E2A3A;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
          <h2 style="color:#C4A882;margin:0;font-size:18px">Welcome to ArtiZone Admin</h2>
          <p style="color:#a0b8c8;margin:4px 0 0;font-size:13px">Your account has been created</p>
        </div>
        <p style="color:#0E2A3A;font-size:14px;line-height:1.6">Hi <strong>${name.trim()}</strong>,</p>
        <p style="color:#0E2A3A;font-size:14px;line-height:1.6">
          Your admin account has been created. Use the credentials below to log in:
        </p>
        <div style="background:#f0ebe3;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0 0 6px;font-size:13px;color:#7a6a5a">Login URL</p>
          <p style="margin:0 0 12px;font-size:14px;font-weight:bold;color:#0E2A3A">${loginUrl}</p>
          <p style="margin:0 0 6px;font-size:13px;color:#7a6a5a">Email</p>
          <p style="margin:0 0 12px;font-size:14px;font-weight:bold;color:#0E2A3A">${email.trim()}</p>
          <p style="margin:0 0 6px;font-size:13px;color:#7a6a5a">Temporary Password</p>
          <p style="margin:0;font-size:16px;font-weight:bold;color:#0E2A3A;letter-spacing:2px">${tempPassword}</p>
        </div>
        <p style="color:#9a8a7a;font-size:12px">Please change your password after first login.</p>
      </div>
    `;

    await sendEmail({
      to:      [email.trim(), 'info@artizonespa.com'],
      subject: '🔑 Your ArtiZone Admin Account',
      html,
    });

    return res.status(201).json({ ok: true, userId: (result as { insertId: number }).insertId });
  } catch (err) {
    console.error('admin.users.create.error', err);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
}
