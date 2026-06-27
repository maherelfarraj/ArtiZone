import type { Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { sendEmail } from '@/server/email';
import { discountClientEmail, discountAdminEmail } from '../../email/discount-templates.js';

const STORAGE_PATH = '/private/discount-signups.json';

export interface DiscountSignup {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  signedUpAt: string;
  ip?: string;
}

async function readSignups(): Promise<DiscountSignup[]> {
  try {
    const raw = await fs.readFile(STORAGE_PATH, 'utf-8');
    return JSON.parse(raw) as DiscountSignup[];
  } catch {
    return [];
  }
}

async function writeSignups(signups: DiscountSignup[]): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.writeFile(STORAGE_PATH, JSON.stringify(signups, null, 2), 'utf-8');
}

function generateCode(name: string): string {
  const prefix = name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'ART';
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${rand}-10`;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, phone } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const signups = await readSignups();

    // Check duplicate
    const existing = signups.find(s => s.email === normalizedEmail);
    if (existing) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        code: existing.code,
        message: 'You are already registered! Your discount code has been resent.',
      });
    }

    const code = generateCode(name);
    const now = new Date().toISOString();

    const signup: DiscountSignup = {
      id: `ds_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      code,
      signedUpAt: now,
      ip: req.ip,
    };

    // Send discount code to client
    try {
      const clientTpl = discountClientEmail(signup.name, code);
      await sendEmail({ to: normalizedEmail, ...clientTpl });
      console.log(`discount-signup.client-email.sent to=${normalizedEmail} code=${code}`);
    } catch (err) {
      console.error('discount-signup.client-email.failed', err);
    }

    // Send notification + client info to admin
    try {
      const adminTpl = discountAdminEmail(signup);
      await sendEmail({ to: 'info@artizonespa.com', ...adminTpl });
      console.log(`discount-signup.admin-email.sent signup=${signup.id}`);
    } catch (err) {
      console.error('discount-signup.admin-email.failed', err);
    }

    signups.push(signup);
    await writeSignups(signups);

    return res.status(201).json({ success: true, code, message: 'Your discount code has been sent to your email!' });
  } catch (error) {
    console.error('discount-signup.error', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
