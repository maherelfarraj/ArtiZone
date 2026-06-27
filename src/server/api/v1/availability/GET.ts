/**
 * GET /api/v1/availability
 * Widget-compatible availability endpoint.
 *
 * Query params:
 *   service_id        (number, required)
 *   date              (YYYY-MM-DD, required)
 *   preferred_gender  ("female" | "male" | "", optional — stored but not yet
 *                      enforced at slot level; passed through to booking)
 *
 * Returns:
 *   { slots: [ { start, end, therapist_id, resource_id } ] }
 *   where start/end are ISO-like "YYYY-MM-DDTHH:MM" strings.
 *
 * Only available slots are returned (unavailable ones are omitted).
 * Falls back to all TIME_SLOTS available if service not found in catalogue.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import {
  services, staff, staffSkills, staffAvailability, staffTimeOff, appointments,
} from '../../../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';

const TIME_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
  '19:00','19:30','20:00',
];

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function overlaps(aS: string, aE: string, bS: string, bE: string): boolean {
  return aS < bE && aE > bS;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { service_id, date, preferred_gender } = req.query as Record<string, string>;

    if (!service_id || !date) {
      return res.status(400).json({ error: 'service_id and date are required' });
    }

    const [svc] = await db.select().from(services)
      .where(eq(services.id, parseInt(service_id)));

    // Service not found — return all slots as available (fallback mode)
    if (!svc) {
      const slots = TIME_SLOTS.map(h24 => ({
        start:        `${date}T${h24}`,
        end:          `${date}T${addMinutes(h24, 60)}`,
        therapist_id: null,
        resource_id:  null,
      }));
      return res.json({ slots, fallback: true });
    }

    const duration = svc.durationMin + svc.bufferMin;
    const weekday  = new Date(date + 'T00:00:00').getDay();

    const allStaff   = await db.select().from(staff).where(eq(staff.active, true));
    const allSkills  = await db.select().from(staffSkills);
    const allAvail   = await db.select().from(staffAvailability);
    const allTimeOff = await db.select().from(staffTimeOff);

    // Filter by gender preference if provided
    let qualifiedStaff = allStaff.filter(s => {
      const skills = allSkills.filter(sk => sk.staffId === s.id).map(sk => sk.skill);
      return skills.includes(svc.category);
    });

    if (preferred_gender === 'female' || preferred_gender === 'male') {
      const filtered = qualifiedStaff.filter(s =>
        (s as Record<string, unknown>).gender === preferred_gender
      );
      // Only apply gender filter if it yields results; otherwise keep all qualified
      if (filtered.length > 0) qualifiedStaff = filtered;
    }

    const existingAppts = await db.select()
      .from(appointments)
      .where(and(
        eq(appointments.date, date),
        inArray(appointments.status, ['confirmed', 'requested']),
      ));

    const slots: { start: string; end: string; therapist_id: number | null; resource_id: null }[] = [];

    for (const h24 of TIME_SLOTS) {
      const slotEnd = addMinutes(h24, duration);

      // Find the first free qualified therapist for this slot
      const freeTherapist = qualifiedStaff.find(s => {
        const avail = allAvail.find(a => a.staffId === s.id && a.weekday === weekday);
        if (!avail) return false;
        if (avail.startTime > h24 || avail.endTime < slotEnd) return false;

        const onTimeOff = allTimeOff.some(t =>
          t.staffId === s.id &&
          t.startAt.toISOString().slice(0, 10) <= date &&
          t.endAt.toISOString().slice(0, 10) >= date
        );
        if (onTimeOff) return false;

        const clash = existingAppts.some(a => {
          if (a.staffId !== s.id || !a.endTime) return false;
          return overlaps(h24, slotEnd, a.startTime, a.endTime);
        });
        return !clash;
      });

      if (freeTherapist) {
        slots.push({
          start:        `${date}T${h24}`,
          end:          `${date}T${slotEnd}`,
          therapist_id: freeTherapist.id,
          resource_id:  null,
        });
      }
    }

    return res.json({ slots });
  } catch (err) {
    console.error('v1.availability.error', err);
    return res.status(500).json({ error: 'Failed to check availability', message: String(err) });
  }
}
