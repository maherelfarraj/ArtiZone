import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { staff } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    await db.update(staff).set({ active: false }).where(eq(staff.id, parseInt(req.params.id as string)));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
