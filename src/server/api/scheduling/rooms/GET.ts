import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { resources, resourceCapabilities } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const roomRows = await db.select().from(resources).where(eq(resources.active, true));
    const capRows = await db.select().from(resourceCapabilities);

    const result = roomRows.map(r => ({
      ...r,
      capabilities: capRows.filter(c => c.resourceId === r.id).map(c => c.capability),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms', message: String(err) });
  }
}
