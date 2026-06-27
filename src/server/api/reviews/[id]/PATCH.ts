import type { Request, Response } from 'express';
import { updateReviewStatus, type ReviewStatus } from '../../../reviews/store.js';

const VALID_STATUSES: ReviewStatus[] = ['approved', 'rejected', 'pending'];

export default async function handler(req: Request, res: Response) {
  // Protect with SEQUENCE_SECRET (reuse existing admin secret)
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status?: string };

    if (!status || !VALID_STATUSES.includes(status as ReviewStatus)) {
      return res.status(400).json({ error: 'status must be approved, rejected, or pending.' });
    }

    const updated = await updateReviewStatus(id, status as ReviewStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    return res.json({ success: true, review: updated });
  } catch (err) {
    console.error('reviews.moderate.error', err);
    return res.status(500).json({ error: 'Failed to update review.' });
  }
}
