import { promises as fs } from 'node:fs';
import path from 'node:path';

const ANALYTICS_PATH = '/private/newsletter-analytics.json';

export type EventType =
  | 'form_view'         // user saw the signup form
  | 'form_submit'       // user clicked subscribe
  | 'signup_success'    // server confirmed new subscriber
  | 'signup_duplicate'  // already subscribed
  | 'email_sent'        // any email was sent
  | 'email_click';      // tracked link in email was clicked

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  ts: string;           // ISO timestamp
  email?: string;
  emailSequence?: 'welcome' | 'day3' | 'day7' | 'day14blog';
  linkLabel?: string;   // which CTA was clicked
  destination?: string; // where the click went
  source?: string;      // 'homepage' | 'footer' | etc.
  ip?: string;
  userAgent?: string;
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    const raw = await fs.readFile(ANALYTICS_PATH, 'utf-8');
    return JSON.parse(raw) as AnalyticsEvent[];
  } catch {
    return [];
  }
}

export async function appendEvent(
  partial: Omit<AnalyticsEvent, 'id' | 'ts'>,
): Promise<AnalyticsEvent> {
  const event: AnalyticsEvent = {
    id: uid(),
    ts: new Date().toISOString(),
    ...partial,
  };
  const events = await readEvents();
  events.push(event);
  await fs.mkdir(path.dirname(ANALYTICS_PATH), { recursive: true });
  await fs.writeFile(ANALYTICS_PATH, JSON.stringify(events, null, 2), 'utf-8');
  return event;
}

// ─── Aggregate stats ──────────────────────────────────────────────────────────
export interface AnalyticsStats {
  totalSubscribers: number;
  formViews: number;
  formSubmits: number;
  signupSuccesses: number;
  signupDuplicates: number;
  conversionRate: number; // signupSuccesses / formSubmits
  emails: {
    welcome: { sent: number; clicks: number; ctr: number };
    day3:    { sent: number; clicks: number; ctr: number };
    day7:    { sent: number; clicks: number; ctr: number };
  };
  clicksByLabel: Record<string, number>;
  signupsByDay: { date: string; count: number }[];
  recentEvents: AnalyticsEvent[];
}

export async function computeStats(subscriberCount: number): Promise<AnalyticsStats> {
  const events = await readEvents();

  const count = (type: EventType, seq?: string) =>
    events.filter((e) => e.type === type && (seq ? e.emailSequence === seq : true)).length;

  const formViews     = count('form_view');
  const formSubmits   = count('form_submit');
  const successes     = count('signup_success');
  const duplicates    = count('signup_duplicate');

  const emailStats = (seq: 'welcome' | 'day3' | 'day7' | 'day14blog') => {
    const sent   = count('email_sent', seq);
    const clicks = count('email_click', seq);
    return { sent, clicks, ctr: sent > 0 ? Math.round((clicks / sent) * 100) : 0 };
  };

  // Clicks grouped by label
  const clicksByLabel: Record<string, number> = {};
  for (const e of events) {
    if (e.type === 'email_click' && e.linkLabel) {
      clicksByLabel[e.linkLabel] = (clicksByLabel[e.linkLabel] ?? 0) + 1;
    }
  }

  // Signups per day (last 30 days)
  const dayMap: Record<string, number> = {};
  for (const e of events) {
    if (e.type === 'signup_success') {
      const day = e.ts.slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + 1;
    }
  }
  const signupsByDay = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({ date, count }));

  return {
    totalSubscribers: subscriberCount,
    formViews,
    formSubmits,
    signupSuccesses: successes,
    signupDuplicates: duplicates,
    conversionRate: formSubmits > 0 ? Math.round((successes / formSubmits) * 100) : 0,
    emails: {
      welcome: emailStats('welcome'),
      day3:    emailStats('day3'),
      day7:    emailStats('day7'),
    },
    clicksByLabel,
    signupsByDay,
    recentEvents: events.slice(-50).reverse(),
  };
}
