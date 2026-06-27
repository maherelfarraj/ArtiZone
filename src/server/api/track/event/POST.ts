import type { Request, Response } from 'express';
import { appendEvent, type EventType } from '../../../analytics/store.js';

const ALLOWED_TYPES: EventType[] = ['form_view', 'form_submit'];

export default async function handler(req: Request, res: Response) {
  try {
    const { type, source, email } = req.body as {
      type?: string;
      source?: string;
      email?: string;
    };

    if (!type || !ALLOWED_TYPES.includes(type as EventType)) {
      return res.status(400).json({ error: 'Invalid event type.' });
    }

    await appendEvent({
      type: type as EventType,
      source,
      email: email?.toLowerCase().trim(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('analytics.event.failed', err);
    return res.status(500).json({ error: 'Tracking failed.' });
  }
}
