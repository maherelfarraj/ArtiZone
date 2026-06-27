import type { Request, Response } from 'express';
import { createReview } from '../../reviews/store.js';
import { readRequests, updateRequest } from '../../review-requests/store.js';

const SERVICES = [
  'Face & Skin Care',
  'Laser Hair Removal',
  'Body Slimming',
  'Nails & Foot Care',
  'Men\'s Grooming',
  'Hair Removal',
  'Other',
];

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, rating, title, body, service } = req.body as {
      name?: string;
      email?: string;
      rating?: unknown;
      title?: string;
      body?: string;
      service?: string;
    };

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your name (at least 2 characters).' });
    }
    if (!body || typeof body !== 'string' || body.trim().length < 10) {
      return res.status(400).json({ error: 'Review must be at least 10 characters.' });
    }
    const ratingNum = Number(rating);
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Please select a rating between 1 and 5.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (service && !SERVICES.includes(service)) {
      return res.status(400).json({ error: 'Invalid service selected.' });
    }

    const review = await createReview({
      name: name.trim(),
      email: email?.trim().toLowerCase() || undefined,
      rating: ratingNum,
      title: title?.trim() || undefined,
      body: body.trim(),
      service: service || undefined,
      ip: req.ip,
    });

    // Auto-complete any open review request for this email address (fire-and-forget)
    if (review.email) {
      const normalizedEmail = review.email.toLowerCase();
      readRequests()
        .then(async (requests) => {
          const openRequest = requests.find(
            (r) =>
              r.clientEmail.toLowerCase() === normalizedEmail &&
              (r.status === 'sent' || r.status === 'followed_up' || r.status === 'pending'),
          );
          if (openRequest) {
            await updateRequest(openRequest.id, {
              status: 'completed',
              reviewedAt: new Date().toISOString(),
            });
          }
        })
        .catch((err) => console.error('review-request.autocomplete.error', err));
    }

    return res.status(201).json({ success: true, id: review.id });
  } catch (err) {
    console.error('reviews.submit.error', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
