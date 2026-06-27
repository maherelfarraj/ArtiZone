/**
 * GET /api/scheduling/slots
 * ?service_name=Hydrafacial&date=YYYY-MM-DD
 *   OR
 * ?service_id=3&date=YYYY-MM-DD
 *
 * Returns every clinic time slot for the day with:
 *   { time: "10:00 AM", time24: "10:00", available: boolean, reason?: string }
 *
 * A slot is UNAVAILABLE when ALL qualified staff are already booked for that window
 * (confirmed OR requested appointments overlap).
 *
 * This is intentionally lenient: a slot stays available as long as at least one
 * qualified therapist is free — the admin assigns the specific therapist later.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import {
  services, staff, staffSkills, staffAvailability, staffTimeOff, appointments,
} from '../../../db/schema.js';
import { eq, and, inArray, like } from 'drizzle-orm';

const TIME_SLOTS = [
  { display: '10:00 AM', h24: '10:00' },
  { display: '10:30 AM', h24: '10:30' },
  { display: '11:00 AM', h24: '11:00' },
  { display: '11:30 AM', h24: '11:30' },
  { display: '12:00 PM', h24: '12:00' },
  { display: '12:30 PM', h24: '12:30' },
  { display: '01:00 PM', h24: '13:00' },
  { display: '01:30 PM', h24: '13:30' },
  { display: '02:00 PM', h24: '14:00' },
  { display: '02:30 PM', h24: '14:30' },
  { display: '03:00 PM', h24: '15:00' },
  { display: '03:30 PM', h24: '15:30' },
  { display: '04:00 PM', h24: '16:00' },
  { display: '04:30 PM', h24: '16:30' },
  { display: '05:00 PM', h24: '17:00' },
  { display: '05:30 PM', h24: '17:30' },
  { display: '06:00 PM', h24: '18:00' },
  { display: '06:30 PM', h24: '18:30' },
  { display: '07:00 PM', h24: '19:00' },
  { display: '07:30 PM', h24: '19:30' },
  { display: '08:00 PM', h24: '20:00' },
];

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function dateToWeekday(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay(); // 0=Sun..6=Sat
}

/** True if [aStart, aEnd) overlaps [bStart, bEnd) */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { service_name, service_id, date } = req.query as Record<string, string>;

    if (!date || (!service_name && !service_id)) {
      return res.status(400).json({ error: 'date and service_name (or service_id) required' });
    }

    // ── Resolve service ───────────────────────────────────────────────────────
    let svc: typeof services.$inferSelect | undefined;
    if (service_id) {
      [svc] = await db.select().from(services).where(eq(services.id, parseInt(service_id)));
    } else {
      // Fuzzy match on first word of service name
      const firstWord = service_name.split(' ')[0];
      [svc] = await db.select().from(services)
        .where(like(services.name, `%${firstWord}%`))
        .limit(1);
    }

    // If service not found in catalogue, return all slots as available
    // (we can't do conflict checking without duration)
    if (!svc) {
      return res.json({
        date,
        serviceName: service_name ?? null,
        slots: TIME_SLOTS.map(s => ({ time: s.display, time24: s.h24, available: true })),
        note: 'service_not_in_catalogue',
      });
    }

    const duration = svc.durationMin + svc.bufferMin;
    const weekday  = dateToWeekday(date);

    // ── Load qualified staff ──────────────────────────────────────────────────
    const allStaff    = await db.select().from(staff).where(eq(staff.active, true));
    const allSkills   = await db.select().from(staffSkills);
    const allAvail    = await db.select().from(staffAvailability);
    const allTimeOff  = await db.select().from(staffTimeOff);

    // Staff who have the required skill
    const qualifiedStaff = allStaff.filter(s => {
      const skills = allSkills.filter(sk => sk.staffId === s.id).map(sk => sk.skill);
      return skills.includes(svc!.category);
    });

    if (qualifiedStaff.length === 0) {
      // No one trained for this service — all slots unavailable
      return res.json({
        date,
        serviceName: svc.name,
        slots: TIME_SLOTS.map(s => ({ time: s.display, time24: s.h24, available: false, reason: 'no_qualified_staff' })),
      });
    }

    // ── Load existing appointments for this date ──────────────────────────────
    const existingAppts = await db.select()
      .from(appointments)
      .where(
        and(
          eq(appointments.date, date),
          inArray(appointments.status, ['confirmed', 'requested']),
        )
      );

    // ── Check each slot ───────────────────────────────────────────────────────
    const slots = TIME_SLOTS.map(({ display, h24 }) => {
      const slotEnd = addMinutes(h24, duration);

      // Is at least one qualified therapist free for this window?
      const anyFree = qualifiedStaff.some(s => {
        // Gate 1: working hours on this weekday
        const avail = allAvail.find(a => a.staffId === s.id && a.weekday === weekday);
        if (!avail) return false;
        if (avail.startTime > h24 || avail.endTime < slotEnd) return false;

        // Gate 2: not on time off
        const onTimeOff = allTimeOff.some(t =>
          t.staffId === s.id &&
          t.startAt.toISOString().slice(0, 10) <= date &&
          t.endAt.toISOString().slice(0, 10) >= date
        );
        if (onTimeOff) return false;

        // Gate 3: no confirmed/requested overlap
        const clash = existingAppts.some(a => {
          if (a.staffId !== s.id) return false;
          if (!a.endTime) return false;
          return overlaps(h24, slotEnd, a.startTime, a.endTime);
        });
        return !clash;
      });

      return {
        time:      display,
        time24:    h24,
        available: anyFree,
        reason:    anyFree ? undefined : 'fully_booked',
      };
    });

    return res.json({
      date,
      serviceId:   svc.id,
      serviceName: svc.name,
      durationMin: svc.durationMin,
      bufferMin:   svc.bufferMin,
      slots,
    });
  } catch (err) {
    console.error('slots.get.error', err);
    return res.status(500).json({ error: 'Failed to check availability', message: String(err) });
  }
}
