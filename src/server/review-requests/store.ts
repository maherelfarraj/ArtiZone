import { promises as fs } from 'node:fs';
import path from 'node:path';

const STORE_PATH = '/private/review-requests.json';

export type ReviewRequestStatus =
  | 'pending'      // email not yet sent
  | 'sent'         // initial email sent, awaiting review
  | 'followed_up'  // follow-up email sent
  | 'completed'    // client left a review
  | 'cancelled';   // manually cancelled

export interface ReviewRequest {
  id: string;
  /** Client details */
  clientName: string;
  clientEmail: string;
  /** Treatment info */
  service: string;
  staffName?: string;
  /** When the appointment/service took place */
  serviceDate: string;
  /** Automation state */
  status: ReviewRequestStatus;
  createdAt: string;
  /** ISO timestamp when initial review-request email was sent */
  sentAt?: string;
  /** ISO timestamp when follow-up email was sent */
  followUpSentAt?: string;
  /** ISO timestamp when client submitted a review */
  reviewedAt?: string;
  /** Number of email click events recorded for this request */
  clicks: number;
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function readRequests(): Promise<ReviewRequest[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as ReviewRequest[];
  } catch {
    return [];
  }
}

export async function writeRequests(requests: ReviewRequest[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(requests, null, 2), 'utf-8');
}

export async function createRequest(
  data: Omit<ReviewRequest, 'id' | 'status' | 'createdAt' | 'clicks'>,
): Promise<ReviewRequest> {
  const requests = await readRequests();
  const req: ReviewRequest = {
    ...data,
    id: uid(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    clicks: 0,
  };
  requests.push(req);
  await writeRequests(requests);
  return req;
}

export async function updateRequest(
  id: string,
  patch: Partial<ReviewRequest>,
): Promise<ReviewRequest | null> {
  const requests = await readRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  requests[idx] = { ...requests[idx], ...patch };
  await writeRequests(requests);
  return requests[idx];
}

export async function incrementClicks(id: string): Promise<void> {
  const requests = await readRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return;
  requests[idx].clicks = (requests[idx].clicks ?? 0) + 1;
  await writeRequests(requests);
}

/** Returns requests eligible for follow-up: sent >3 days ago, not yet followed up */
export async function getFollowUpCandidates(): Promise<ReviewRequest[]> {
  const requests = await readRequests();
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  return requests.filter(
    (r) =>
      r.status === 'sent' &&
      r.sentAt &&
      new Date(r.sentAt).getTime() < threeDaysAgo,
  );
}

export interface ReviewRequestStats {
  total: number;
  pending: number;
  sent: number;
  followedUp: number;
  completed: number;
  cancelled: number;
  conversionRate: number; // completed / (sent + followedUp + completed) %
}

export async function getStats(): Promise<ReviewRequestStats> {
  const requests = await readRequests();
  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const sent = requests.filter((r) => r.status === 'sent').length;
  const followedUp = requests.filter((r) => r.status === 'followed_up').length;
  const completed = requests.filter((r) => r.status === 'completed').length;
  const cancelled = requests.filter((r) => r.status === 'cancelled').length;
  const denominator = sent + followedUp + completed;
  const conversionRate = denominator > 0 ? Math.round((completed / denominator) * 100) : 0;
  return { total, pending, sent, followedUp, completed, cancelled, conversionRate };
}
