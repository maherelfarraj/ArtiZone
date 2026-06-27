import type { Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { sendEmail } from '@/server/email';
import { welcomeEmail } from '../../email/templates.js';
import { appendEvent } from '../../analytics/store.js';

const STORAGE_PATH = '/private/newsletter-subscribers.json';

export interface Subscriber {
  email: string;
  name?: string;
  subscribedAt: string;
  ip?: string;
  /** Where the subscriber signed up — e.g. 'blog', 'homepage', 'footer', 'landing' */
  source?: string;
  /** Tracks which sequence emails have been sent */
  sequence: {
    welcomeSentAt?: string;
    day3SentAt?: string;
    day7SentAt?: string;
    /** Blog-reader nurture email — only sent to subscribers with source='blog' */
    day14BlogSentAt?: string;
  };
}

export async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(STORAGE_PATH, 'utf-8');
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

export async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.writeFile(STORAGE_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
}

export default async function handler(req: Request, res: Response) {
  try {
    const { email, name, source } = req.body as { email?: string; name?: string; source?: string };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const subscribers = await readSubscribers();

    const alreadyExists = subscribers.some((s) => s.email === normalizedEmail);
    if (alreadyExists) {
      await appendEvent({ type: 'signup_duplicate', email: normalizedEmail, ip: req.ip }).catch(() => {});
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    const now = new Date().toISOString();
    const newSubscriber: Subscriber = {
      email: normalizedEmail,
      name: name?.trim() || undefined,
      subscribedAt: now,
      ip: req.ip,
      source: typeof source === 'string' && source.trim() ? source.trim() : undefined,
      sequence: {},
    };

    // Send welcome email immediately
    try {
      const tpl = welcomeEmail(newSubscriber.name);
      await sendEmail({ to: normalizedEmail, ...tpl });
      newSubscriber.sequence.welcomeSentAt = new Date().toISOString();
      await appendEvent({ type: 'email_sent', email: normalizedEmail, emailSequence: 'welcome' }).catch(() => {});
      console.log(`newsletter.welcome.sent to=${normalizedEmail}`);
    } catch (emailErr) {
      // Don't fail the subscription if email sending fails
      console.error('newsletter.welcome.failed', emailErr);
    }

    subscribers.push(newSubscriber);
    await writeSubscribers(subscribers);

    await appendEvent({ type: 'signup_success', email: normalizedEmail, ip: req.ip }).catch(() => {});
    return res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('newsletter.subscribe.error', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
