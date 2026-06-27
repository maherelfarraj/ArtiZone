import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { staff, staffSkills } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const staffRows = await db.select().from(staff).where(eq(staff.active, true));
    const skillRows = await db.select().from(staffSkills);

    const result = staffRows.map(s => ({
      ...s,
      skills: skillRows.filter(sk => sk.staffId === s.id).map(sk => sk.skill),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff', message: String(err) });
  }
}
