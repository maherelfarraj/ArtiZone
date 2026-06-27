import type { Request, Response } from 'express';
import { readSubscribers, writeSubscribers } from '../POST.js';
import { sendEmail } from '@/server/email';
import { beautyTipsEmail, specialOfferEmail, blogReaderNurtureEmail } from '../../../email/templates.js';
import { appendEvent } from '../../../analytics/store.js';

const DAY_MS   = 24 * 60 * 60 * 1000;
const DAY3_DELAY  = 3  * DAY_MS;
const DAY7_DELAY  = 7  * DAY_MS;
const DAY14_DELAY = 14 * DAY_MS;

export default async function handler(req: Request, res: Response) {
  // Simple secret check to prevent public triggering
  const secret = req.headers['x-sequence-secret'] as string | undefined;
  if (secret !== process.env.SEQUENCE_SECRET && process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscribers = await readSubscribers();
    const now = Date.now();

    let day3Sent = 0;
    let day7Sent = 0;
    let day14BlogSent = 0;
    let errors = 0;

    for (const subscriber of subscribers) {
      const subscribedAt = new Date(subscriber.subscribedAt).getTime();
      const elapsed = now - subscribedAt;

      // ── Day 3: Beauty Tips ──────────────────────────────────────────────────
      if (elapsed >= DAY3_DELAY && !subscriber.sequence.day3SentAt) {
        try {
          const tpl = beautyTipsEmail(subscriber.name);
          await sendEmail({ to: subscriber.email, ...tpl });
          subscriber.sequence.day3SentAt = new Date().toISOString();
          await appendEvent({ type: 'email_sent', email: subscriber.email, emailSequence: 'day3' }).catch(() => {});
          day3Sent++;
          console.log(`newsletter.day3.sent to=${subscriber.email}`);
        } catch (err) {
          errors++;
          console.error(`newsletter.day3.failed to=${subscriber.email}`, err);
        }
      }

      // ── Day 7: Special Offer ────────────────────────────────────────────────
      if (elapsed >= DAY7_DELAY && !subscriber.sequence.day7SentAt) {
        try {
          const tpl = specialOfferEmail(subscriber.name);
          await sendEmail({ to: subscriber.email, ...tpl });
          subscriber.sequence.day7SentAt = new Date().toISOString();
          await appendEvent({ type: 'email_sent', email: subscriber.email, emailSequence: 'day7' }).catch(() => {});
          day7Sent++;
          console.log(`newsletter.day7.sent to=${subscriber.email}`);
        } catch (err) {
          errors++;
          console.error(`newsletter.day7.failed to=${subscriber.email}`, err);
        }
      }

      // ── Day 14: Blog Reader Nurture (blog-source subscribers only) ──────────
      if (
        subscriber.source === 'blog' &&
        elapsed >= DAY14_DELAY &&
        !subscriber.sequence.day14BlogSentAt
      ) {
        try {
          const tpl = blogReaderNurtureEmail(subscriber.name);
          await sendEmail({ to: subscriber.email, ...tpl });
          subscriber.sequence.day14BlogSentAt = new Date().toISOString();
          await appendEvent({ type: 'email_sent', email: subscriber.email, emailSequence: 'day14blog' }).catch(() => {});
          day14BlogSent++;
          console.log(`newsletter.day14blog.sent to=${subscriber.email}`);
        } catch (err) {
          errors++;
          console.error(`newsletter.day14blog.failed to=${subscriber.email}`, err);
        }
      }
    }

    await writeSubscribers(subscribers);

    return res.json({
      success: true,
      processed: subscribers.length,
      day3Sent,
      day7Sent,
      day14BlogSent,
      errors,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('newsletter.run-sequence.error', error);
    return res.status(500).json({ error: 'Sequence runner failed.' });
  }
}
