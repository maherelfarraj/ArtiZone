import type { Request, Response } from 'express';
import { appendEvent } from '../../../analytics/store.js';
import { incrementClicks } from '../../../review-requests/store.js';

export default async function handler(req: Request, res: Response) {
  const { url, seq, label, reqId } = req.query as {
    url?: string;
    seq?: string;
    label?: string;
    reqId?: string;
  };

  // Always redirect — even if tracking fails
  const destination = url ? decodeURIComponent(url) : 'https://artizonespa.com';

  // Fire-and-forget analytics — don't block the redirect
  appendEvent({
    type: 'email_click',
    emailSequence: (seq as 'welcome' | 'day3' | 'day7' | 'day14blog') || undefined,
    linkLabel: label ? decodeURIComponent(label) : undefined,
    destination,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }).catch((err) => console.error('analytics.click.failed', err));

  // Track click on the review request record if reqId is present
  if (reqId) {
    incrementClicks(decodeURIComponent(reqId)).catch((err) =>
      console.error('review-request.click.failed', err),
    );
  }

  return res.redirect(302, destination);
}
