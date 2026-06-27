import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { staff, staffSkills } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

const VALID_SKILLS = ['skin', 'body', 'laser', 'nails', 'other'];

export default async function handler(req: Request, res: Response) {
  try {
    const { name, role, skills = [] } = req.body as { name: string; role?: string; skills?: string[] };
    if (!name?.trim()) return res.status(400).json({ error: 'name required' });
    const bad = skills.filter(s => !VALID_SKILLS.includes(s));
    if (bad.length) return res.status(400).json({ error: `unknown skills: ${bad.join(', ')}` });

    const result = await db.insert(staff).values({ name: name.trim(), role: role || null });
    const staffId = Number(result[0].insertId);

    for (const skill of skills) {
      await db.insert(staffSkills).values({ staffId, skill });
    }

    const [created] = await db.select().from(staff).where(eq(staff.id, staffId));
    res.status(201).json({ ...created, skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create staff', message: String(err) });
  }
}
