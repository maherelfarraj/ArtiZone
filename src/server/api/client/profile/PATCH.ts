/**
 * PATCH /api/client/profile
 * Update the logged-in client's profile (fullName, phone, area, address, dob).
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions } from '../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.client_session;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated.' });

    const now = new Date();
    const sessions = await db.select()
      .from(clientSessions)
      .where(and(eq(clientSessions.id, sessionId), gt(clientSessions.expiresAt, now)))
      .limit(1);
    if (sessions.length === 0) return res.status(401).json({ error: 'Session expired.' });

    const { fullName, phone, area, address, dob } = req.body as {
      fullName?: string; phone?: string; area?: string; address?: string; dob?: string;
    };

    const updates: Record<string, unknown> = {};
    if (fullName?.trim()) updates.fullName = fullName.trim();
    if (phone?.trim())    updates.phone    = phone.trim();
    if (area?.trim())     updates.area     = area.trim();
    if (address !== undefined) updates.address = address?.trim() ?? null;
    if (dob !== undefined)     updates.dob     = dob?.trim() ?? null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    await db.update(clientUsers)
      .set(updates)
      .where(eq(clientUsers.id, sessions[0].userId));

    const [updated] = await db.select().from(clientUsers).where(eq(clientUsers.id, sessions[0].userId)).limit(1);

    return res.json({
      user: {
        id:       updated.id,
        fullName: updated.fullName,
        email:    updated.email,
        phone:    updated.phone,
        area:     updated.area,
        address:  updated.address,
        dob:      updated.dob,
      },
    });
  } catch (err) {
    console.error('client.profile.patch', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
}
