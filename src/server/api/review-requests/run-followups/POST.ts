import type { Request, Response } from 'express';
import { getFollowUpCandidates, updateRequest } from '../../../review-requests/store.js';
import { reviewFollowUpEmail } from '../../../email/templates.js';
import { sendEmail } from '@/server/email';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-sequence-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const candidates = await getFollowUpCandidates();
    const results: { id: string; email: string; success: boolean; error?: string }[] = [];

    for (const request of candidates) {
      const { subject, html, text } = reviewFollowUpEmail({
        name: request.clientName,
        service: request.service,
        requestId: request.id,
      });

      try {
        await sendEmail({ to: request.clientEmail, subject, html, text });
        await updateRequest(request.id, {
          status: 'followed_up',
          followUpSentAt: new Date().toISOString(),
        });
        results.push({ id: request.id, email: request.clientEmail, success: true });
      } catch (err) {
        results.push({ id: request.id, email: request.clientEmail, success: false, error: String(err) });
        console.error('review-request.followup.error', request.id, err);
      }
    }

    return res.json({
      processed: candidates.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (err) {
    console.error('review-request.followups.error', err);
    return res.status(500).json({ error: 'Failed to run follow-ups.' });
  }
}
