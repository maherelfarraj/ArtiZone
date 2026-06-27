/**
 * GET /api/scheduling/availability
 * ?service_id=&date=YYYY-MM-DD&start_time=HH:MM&appointment_id= (optional, skip self on reschedule)
 *
 * Returns available staff and rooms for the given service + slot.
 * Also returns a boolean `available` for a specific staff+room combo if both are provided.
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import {
  services, staff, staffSkills, staffAvailability, staffTimeOff,
  resources, resourceCapabilities, appointments,
} from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

// JS getDay() returns 0=Sun..6=Sat — same as MySQL DOW
function dateToWeekday(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

export default async function handler(req: Request, res: Response) {
  try {
    const { service_id, date, start_time, staff_id, resource_id, appointment_id } = req.query as Record<string, string>;

    if (!service_id || !date || !start_time) {
      return res.status(400).json({ error: 'service_id, date, start_time required' });
    }

    const [svc] = await db.select().from(services).where(eq(services.id, parseInt(service_id)));
    if (!svc) return res.status(404).json({ error: 'Service not found' });

    const endTime = addMinutes(start_time, svc.durationMin + svc.bufferMin);
    const weekday = dateToWeekday(date);
    const skipId = appointment_id ? parseInt(appointment_id) : null;

    // ── Gate 1+2+3: Available staff ──────────────────────────────────────────
    const allStaff = await db.select().from(staff).where(eq(staff.active, true));
    const allSkills = await db.select().from(staffSkills);
    const allAvail = await db.select().from(staffAvailability);
    const allTimeOff = await db.select().from(staffTimeOff);
    const confirmedAppts = await db.select().from(appointments).where(eq(appointments.status, 'confirmed'));

    const availableStaff = allStaff.filter(s => {
      // Gate 1: skill match
      const skills = allSkills.filter(sk => sk.staffId === s.id).map(sk => sk.skill);
      if (!skills.includes(svc.category)) return false;

      // Gate 2: working hours
      const avail = allAvail.find(a => a.staffId === s.id && a.weekday === weekday);
      if (!avail) return false;
      if (avail.startTime > start_time || avail.endTime < endTime) return false;

      // Gate 2b: not on time off
      const onTimeOff = allTimeOff.some(t =>
        t.staffId === s.id &&
        t.startAt.toISOString().slice(0, 10) <= date &&
        t.endAt.toISOString().slice(0, 10) >= date
      );
      if (onTimeOff) return false;

      // Gate 3: no confirmed overlap
      const clash = confirmedAppts.some(a => {
        if (a.staffId !== s.id) return false;
        if (skipId && a.id === skipId) return false;
        if (a.date !== date) return false;
        if (!a.endTime) return false;
        return a.startTime < endTime && a.endTime > start_time;
      });
      return !clash;
    });

    // ── Gate 4: Available rooms ───────────────────────────────────────────────
    const allRooms = await db.select().from(resources).where(eq(resources.active, true));
    const allCaps = await db.select().from(resourceCapabilities);

    const availableRooms = allRooms.filter(r => {
      // Capability check
      if (svc.requiredCapability) {
        const hasCap = allCaps.some(c => c.resourceId === r.id && c.capability === svc.requiredCapability);
        if (!hasCap) return false;
      }
      // No confirmed overlap
      const clash = confirmedAppts.some(a => {
        if (a.resourceId !== r.id) return false;
        if (skipId && a.id === skipId) return false;
        if (a.date !== date) return false;
        if (!a.endTime) return false;
        return a.startTime < endTime && a.endTime > start_time;
      });
      return !clash;
    });

    // ── Specific combo check ──────────────────────────────────────────────────
    let comboAvailable: boolean | null = null;
    if (staff_id && resource_id) {
      const staffOk = availableStaff.some(s => s.id === parseInt(staff_id));
      const roomOk = availableRooms.some(r => r.id === parseInt(resource_id));
      comboAvailable = staffOk && roomOk;
    }

    res.json({
      service: { id: svc.id, name: svc.name, durationMin: svc.durationMin, bufferMin: svc.bufferMin },
      date,
      startTime: start_time,
      endTime,
      availableStaff: availableStaff.map(s => ({
        id: s.id,
        name: s.name,
        role: s.role,
        skills: allSkills.filter(sk => sk.staffId === s.id).map(sk => sk.skill),
      })),
      availableRooms: availableRooms.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        capabilities: allCaps.filter(c => c.resourceId === r.id).map(c => c.capability),
      })),
      available: comboAvailable,
    });
  } catch (err) {
    res.status(500).json({ error: 'Availability check failed', message: String(err) });
  }
}
