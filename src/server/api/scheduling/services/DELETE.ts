/**
 * DELETE /api/scheduling/services/:id
 * Soft-delete (deactivate) a service — sets active = false.
 * Hard delete only if ?hard=true is passed.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id.' });

  try {
    if (req.query.hard === 'true') {
      await db.delete(services).where(eq(services.id, id));
    } else {
      await db.update(services).set({ active: false }).where(eq(services.id, id));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service', message: String(err) });
  }
}
