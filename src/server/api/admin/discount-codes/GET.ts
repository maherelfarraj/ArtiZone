import type { Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import type { DiscountSignup } from '../../discount-signup/POST.js';

const STORAGE_PATH = '/private/discount-signups.json';

async function readSignups(): Promise<DiscountSignup[]> {
  try {
    const raw = await fs.readFile(STORAGE_PATH, 'utf-8');
    return JSON.parse(raw) as DiscountSignup[];
  } catch {
    return [];
  }
}

export default async function handler(_req: Request, res: Response) {
  try {
    const signups = await readSignups();
    // Sort newest first
    const sorted = [...signups].sort(
      (a, b) => new Date(b.signedUpAt).getTime() - new Date(a.signedUpAt).getTime()
    );
    return res.json({ signups: sorted, total: sorted.length });
  } catch (error) {
    console.error('admin.discount-codes.get.error', error);
    return res.status(500).json({ error: 'Failed to load discount codes.' });
  }
}
