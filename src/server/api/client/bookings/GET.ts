/**
 * GET /api/client/bookings
 * Returns appointments for the currently logged-in client (matched by phone or name).
 * Reads from the `appointments` table so status reflects admin updates in real time.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { clientUsers, clientSessions, appointments } from '../../../db/schema.js';
import { eq, and, gt, desc, like, or } from 'drizzle-orm';

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

    const users = await db.select().from(clientUsers).where(eq(clientUsers.id, sessions[0].userId)).limit(1);
    if (users.length === 0) return res.status(401).json({ error: 'User not found.' });

    const user = users[0];
    const cleanPhone = (user.phone ?? '').replace(/\s/g, '');

    // Match by phone (primary) or name against appointments table
    const rows = await db.select()
      .from(appointments)
      .where(
        or(
          cleanPhone ? like(appointments.customerPhone, `%${cleanPhone}%`) : undefined,
          like(appointments.customerName, `%${user.fullName ?? ''}%`),
        )
      )
      .orderBy(desc(appointments.date), desc(appointments.startTime))
      .limit(30);

    // Normalise to the shape the dashboard expects
    const bookings = rows.map(a => ({
      id:        a.id,
      name:      a.customerName,
      phone:     a.customerPhone,
      service:   a.serviceName ?? 'Treatment',
      date:      a.date,
      time:      a.startTime,
      notes:     a.notes ?? undefined,
      status:    a.status,           // live status from appointments table
      createdAt: a.createdAt,
    }));

    return res.json({ bookings });
  } catch (err) {
    console.error('client.bookings.get', err);
    return res.status(500).json({ error: 'Failed to load bookings.' });
  }
}
