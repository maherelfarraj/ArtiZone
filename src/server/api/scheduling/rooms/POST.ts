import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { resources, resourceCapabilities } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

const VALID_CAPS = ['laser'];

export default async function handler(req: Request, res: Response) {
  try {
    const { name, type = 'room', capabilities = [] } = req.body as { name: string; type?: string; capabilities?: string[] };
    if (!name?.trim()) return res.status(400).json({ error: 'name required' });
    if (!['room', 'machine'].includes(type)) return res.status(400).json({ error: 'invalid type' });
    const bad = capabilities.filter(c => !VALID_CAPS.includes(c));
    if (bad.length) return res.status(400).json({ error: `unknown capabilities: ${bad.join(', ')}` });

    const result = await db.insert(resources).values({ name: name.trim(), type });
    const resourceId = Number(result[0].insertId);

    for (const cap of capabilities) {
      await db.insert(resourceCapabilities).values({ resourceId, capability: cap });
    }

    const [created] = await db.select().from(resources).where(eq(resources.id, resourceId));
    res.status(201).json({ ...created, capabilities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room', message: String(err) });
  }
}
