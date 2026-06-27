import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { staff, staffSkills } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

const VALID_SKILLS = ['skin', 'body', 'laser', 'nails', 'other'];

export default async function handler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const { name, role, skills, active } = req.body as { name?: string; role?: string; skills?: string[]; active?: boolean };

    if (skills) {
      const bad = skills.filter(s => !VALID_SKILLS.includes(s));
      if (bad.length) return res.status(400).json({ error: `unknown skills: ${bad.join(', ')}` });
      // Replace skills
      await db.delete(staffSkills).where(eq(staffSkills.staffId, id));
      for (const skill of skills) {
        await db.insert(staffSkills).values({ staffId: id, skill });
      }
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (role !== undefined) updates.role = role;
    if (active !== undefined) updates.active = active;
    if (Object.keys(updates).length > 0) {
      await db.update(staff).set(updates).where(eq(staff.id, id));
    }

    const [updated] = await db.select().from(staff).where(eq(staff.id, id));
    const skillRows = await db.select().from(staffSkills).where(eq(staffSkills.staffId, id));
    res.json({ ...updated, skills: skillRows.map(s => s.skill) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update staff', message: String(err) });
  }
}
