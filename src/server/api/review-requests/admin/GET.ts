import type { Request, Response } from 'express';
import { readRequests, getStats } from '../../../review-requests/store.js';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [requests, stats] = await Promise.all([readRequests(), getStats()]);
    const sorted = [...requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return res.json({ requests: sorted, stats });
  } catch (err) {
    console.error('review-requests.admin.error', err);
    return res.status(500).json({ error: 'Failed to load review requests.' });
  }
}
