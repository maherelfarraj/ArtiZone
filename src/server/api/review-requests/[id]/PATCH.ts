import type { Request, Response } from 'express';
import { updateRequest, type ReviewRequestStatus } from '../../../review-requests/store.js';

const VALID: ReviewRequestStatus[] = ['pending', 'sent', 'followed_up', 'completed', 'cancelled'];

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status?: string };

    if (!status || !VALID.includes(status as ReviewRequestStatus)) {
      return res.status(400).json({ error: `status must be one of: ${VALID.join(', ')}` });
    }

    const updated = await updateRequest(id, { status: status as ReviewRequestStatus });
    if (!updated) return res.status(404).json({ error: 'Review request not found.' });

    return res.json({ success: true, request: updated });
  } catch (err) {
    console.error('review-request.patch.error', err);
    return res.status(500).json({ error: 'Failed to update review request.' });
  }
}
