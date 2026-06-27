import type { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = '/private/ab-events.json';

interface AbEvent {
  testKey: string;
  variant: 'a' | 'b';
  event: 'impression' | 'click_cta' | 'whatsapp' | 'booking';
  ts: number;
  ip?: string;
}

async function readEvents(): Promise<AbEvent[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEvents(events: AbEvent[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
}

export default async function handler(req: Request, res: Response) {
  try {
    const { testKey, variant, event, ts } = req.body as AbEvent;

    if (!testKey || !variant || !event) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['a', 'b'].includes(variant)) {
      return res.status(400).json({ error: 'Invalid variant' });
    }
    if (!['impression', 'click_cta', 'whatsapp', 'booking'].includes(event)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    const events = await readEvents();
    events.push({
      testKey: String(testKey).slice(0, 64),
      variant,
      event,
      ts: typeof ts === 'number' ? ts : Date.now(),
      ip: req.ip,
    });
    await writeEvents(events);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record event', message: String(err) });
  }
}
