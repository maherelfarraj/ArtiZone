import { promises as fs } from 'node:fs';
import path from 'node:path';

const REVIEWS_PATH = '/private/reviews.json';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;          // 1–5
  title?: string;
  body: string;
  service?: string;        // which treatment/service
  status: ReviewStatus;
  submittedAt: string;
  moderatedAt?: string;
  ip?: string;
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_PATH, 'utf-8');
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
  await fs.writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
}

export async function createReview(
  data: Omit<Review, 'id' | 'status' | 'submittedAt'>,
): Promise<Review> {
  const reviews = await readReviews();
  const review: Review = {
    ...data,
    id: uid(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  reviews.push(review);
  await writeReviews(reviews);
  return review;
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<Review | null> {
  const reviews = await readReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reviews[idx].status = status;
  reviews[idx].moderatedAt = new Date().toISOString();
  await writeReviews(reviews);
  return reviews[idx];
}
