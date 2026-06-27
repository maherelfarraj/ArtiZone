import type { Request, Response } from 'express';
import { readReviews } from '../../../reviews/store.js';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const all = await readReviews();
    const sorted = [...all].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      approved: all.filter((r) => r.status === 'approved').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
      avgRating:
        all.length > 0
          ? Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10
          : 0,
    };

    return res.json({ reviews: sorted, stats });
  } catch (err) {
    console.error('reviews.admin.error', err);
    return res.status(500).json({ error: 'Failed to load reviews.' });
  }
}
