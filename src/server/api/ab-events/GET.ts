import type { Request, Response } from 'express';
import fs from 'fs/promises';

const DATA_FILE = '/private/ab-events.json';

interface AbEvent {
  testKey: string;
  variant: 'a' | 'b';
  event: 'impression' | 'click_cta' | 'whatsapp' | 'booking';
  ts: number;
}

interface VariantStats {
  impressions: number;
  click_cta: number;
  whatsapp: number;
  booking: number;
  ctr: string;
  conversionRate: string;
}

interface TestResult {
  testKey: string;
  a: VariantStats;
  b: VariantStats;
  winner: 'a' | 'b' | 'tie' | 'insufficient data';
  totalEvents: number;
}

function calcStats(events: AbEvent[], testKey: string, variant: 'a' | 'b'): VariantStats {
  const filtered = events.filter(e => e.testKey === testKey && e.variant === variant);
  const impressions = filtered.filter(e => e.event === 'impression').length;
  const click_cta   = filtered.filter(e => e.event === 'click_cta').length;
  const whatsapp    = filtered.filter(e => e.event === 'whatsapp').length;
  const booking     = filtered.filter(e => e.event === 'booking').length;
  const conversions = click_cta + whatsapp + booking;
  return {
    impressions,
    click_cta,
    whatsapp,
    booking,
    ctr: impressions > 0 ? `${((conversions / impressions) * 100).toFixed(1)}%` : '0%',
    conversionRate: impressions > 0 ? `${((booking / impressions) * 100).toFixed(1)}%` : '0%',
  };
}

export default async function handler(_req: Request, res: Response) {
  try {
    let events: AbEvent[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      events = JSON.parse(raw);
    } catch {
      // No data yet
    }

    const testKeys = [...new Set(events.map(e => e.testKey))];
    const results: TestResult[] = testKeys.map(testKey => {
      const a = calcStats(events, testKey, 'a');
      const b = calcStats(events, testKey, 'b');
      const totalEvents = events.filter(e => e.testKey === testKey).length;

      let winner: TestResult['winner'] = 'insufficient data';
      if (a.impressions >= 30 && b.impressions >= 30) {
        const aConv = parseFloat(a.ctr);
        const bConv = parseFloat(b.ctr);
        if (Math.abs(aConv - bConv) < 0.5) winner = 'tie';
        else winner = aConv >= bConv ? 'a' : 'b';
      }

      return { testKey, a, b, winner, totalEvents };
    });

    res.json({ results, totalEvents: events.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read events', message: String(err) });
  }
}
