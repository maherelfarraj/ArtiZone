import type { Request, Response } from 'express';
import { computeStats } from '../../../analytics/store.js';
import { readSubscribers } from '../POST.js';

export default async function handler(req: Request, res: Response) {
  // Simple secret check
  const secret = req.headers['x-sequence-secret'] as string | undefined;
  if (secret !== process.env.SEQUENCE_SECRET && process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscribers = await readSubscribers();
    const stats = await computeStats(subscribers.length);
    return res.json(stats);
  } catch (err) {
    console.error('analytics.stats.error', err);
    return res.status(500).json({ error: 'Failed to compute stats.' });
  }
}
