/**
 * POST /api/booking
 * 1. Saves a row to booking_requests (legacy queue / /admin/bookings)
 * 2. ALSO inserts a row into appointments (scheduling system / /admin/scheduling)
 *    so both admin panels stay in sync from the moment a client submits the form.
 * 3. Sends email notification to the clinic.
 * 4. Returns a pre-filled WhatsApp URL for the client to confirm.
 */
import type { Request, Response } from 'express';
import { sendEmail } from '@/server/email';
import { db } from '../../db/client.js';
import { bookingRequests, appointments, appointmentEvents, services, staffSkills, staffAvailability, staff } from '../../db/schema.js';
import { eq, like, and, inArray } from 'drizzle-orm';

/** True if [aStart, aEnd) overlaps [bStart, bEnd) */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

const CLINIC_EMAIL = 'info@artizonespa.com';

/** Convert "10:30 AM" → "10:30", "02:00 PM" → "14:00" */
function to24h(t: string): string {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return t; // already HH:MM or unknown format
  let h = parseInt(m[1], 10);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default async function handler(req: Request, res: Response) {
  const { name, phone, service, date, time, notes, status } = req.body as {
    name: string; phone: string; service: string;
    date: string; time: string; notes?: string;
    status?: 'pending' | 'confirmed';
  };

  if (!name?.trim() || !phone?.trim() || !service?.trim() || !date?.trim() || !time?.trim()) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  const cleanName    = name.trim();
  const cleanPhone   = phone.trim();
  const cleanService = service.trim();
  const cleanDate    = date.trim();
  const cleanTime    = time.trim();
  const cleanNotes   = notes?.trim() || '';

  try {
    // ── 1. Save to booking_requests ──────────────────────────────────────────
    const brResult = await db.insert(bookingRequests).values({
      name:    cleanName,
      phone:   cleanPhone,
      service: cleanService,
      date:    cleanDate,
      time:    cleanTime,
      notes:   cleanNotes || null,
      status:  status === 'confirmed' ? 'confirmed' : 'pending',
    });
    const bookingRequestId = Number(brResult[0].insertId);

    // ── 2. Mirror into appointments (scheduling system) ───────────────────────
    // Try to find a matching service in the catalogue by name (fuzzy)
    let matchedServiceId:   number | null = null;
    let matchedDuration = 60; // default fallback
    let matchedBuffer   = 0;
    let defaultStaffId: number | null = null;
    try {
      const [svc] = await db.select().from(services)
        .where(like(services.name, `%${cleanService.split(' ')[0]}%`))
        .limit(1);
      if (svc) {
        matchedServiceId = svc.id;
        matchedDuration  = svc.durationMin;
        matchedBuffer    = svc.bufferMin;
        defaultStaffId   = svc.defaultStaffId ?? null;
      }
    } catch { /* non-fatal — proceed without serviceId */ }

    const startTime24 = to24h(cleanTime);
    const endTime24   = addMinutes(startTime24, matchedDuration + matchedBuffer);

    // ── 2a. Double-booking guard ──────────────────────────────────────────────
    // Check if ALL qualified staff are already booked for this window.
    // If so, reject with a 409 so the wizard can show a clear message.
    try {
      if (matchedServiceId) {
        const [svc] = await db.select().from(services).where(eq(services.id, matchedServiceId));
        if (svc) {
          const allStaff   = await db.select().from(staff).where(eq(staff.active, true));
          const allSkills  = await db.select().from(staffSkills);
          const allAvail   = await db.select().from(staffAvailability);
          const weekday    = new Date(cleanDate + 'T00:00:00').getDay();

          const qualifiedStaff = allStaff.filter(s => {
            const skills = allSkills.filter(sk => sk.staffId === s.id).map(sk => sk.skill);
            return skills.includes(svc.category);
          });

          if (qualifiedStaff.length > 0) {
            const existingAppts = await db.select()
              .from(appointments)
              .where(
                and(
                  eq(appointments.date, cleanDate),
                  inArray(appointments.status, ['confirmed', 'requested']),
                )
              );

            const anyFree = qualifiedStaff.some(s => {
              const avail = allAvail.find(a => a.staffId === s.id && a.weekday === weekday);
              if (!avail) return false;
              if (avail.startTime > startTime24 || avail.endTime < endTime24) return false;
              const clash = existingAppts.some(a => {
                if (a.staffId !== s.id) return false;
                if (!a.endTime) return false;
                return overlaps(startTime24, endTime24, a.startTime, a.endTime);
              });
              return !clash;
            });

            if (!anyFree) {
              return res.status(409).json({
                error: 'slot_unavailable',
                message: `Sorry, ${cleanTime} on ${cleanDate} is fully booked. Please choose a different time.`,
              });
            }
          }
        }
      }
    } catch (guardErr) {
      // Non-fatal — if guard fails, let the booking through (admin will resolve)
      console.error('booking.double_booking_guard.error', guardErr);
    }

    const apptResult = await db.insert(appointments).values({
      customerName:     cleanName,
      customerPhone:    cleanPhone,
      serviceId:        matchedServiceId,
      serviceName:      cleanService,
      staffId:          defaultStaffId,   // ← auto-assign default therapist
      date:             cleanDate,
      startTime:        startTime24,
      endTime:          endTime24,
      status:           'requested',
      source:           'web_form',
      bookingRequestId: bookingRequestId,
      notes:            cleanNotes || null,
    });
    const appointmentId = Number(apptResult[0].insertId);

    // Audit event for the new appointment
    await db.insert(appointmentEvents).values({
      appointmentId,
      fromStatus: null,
      toStatus:   'requested',
      actor:      'web_form',
    }).catch(() => { /* non-fatal */ });

    // ── 3. Email clinic ───────────────────────────────────────────────────────
    sendEmail({
      to:      CLINIC_EMAIL,
      subject: `📅 New Booking Request — ${cleanName} (${cleanService})`,
      text: [
        'New booking request received on artizonespa.com',
        '',
        `Name:    ${cleanName}`,
        `Phone:   ${cleanPhone}`,
        `Service: ${cleanService}`,
        `Date:    ${cleanDate}`,
        `Time:    ${cleanTime}`,
        cleanNotes ? `Notes:   ${cleanNotes}` : '',
        '',
        'View in Scheduling: https://artizonespa.com/admin/scheduling',
        'View in Bookings:   https://artizonespa.com/admin/bookings',
      ].filter(l => l !== undefined).join('\n'),
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#FDFAF6;border-radius:12px;border:1px solid #e8e0d4">
          <div style="background:#0E2A3A;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
            <h2 style="color:#C4A882;margin:0;font-size:18px;font-weight:700">📅 New Booking Request</h2>
            <p style="color:#a0b8c8;margin:4px 0 0;font-size:13px">artizonespa.com</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#7a6a5a;width:90px">Name</td><td style="padding:8px 0;color:#0E2A3A;font-weight:600">${cleanName}</td></tr>
            <tr><td style="padding:8px 0;color:#7a6a5a">Phone</td><td style="padding:8px 0;color:#0E2A3A;font-weight:600"><a href="tel:${cleanPhone}" style="color:#0E2A3A">${cleanPhone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#7a6a5a">Service</td><td style="padding:8px 0;color:#0E2A3A;font-weight:600">${cleanService}</td></tr>
            <tr><td style="padding:8px 0;color:#7a6a5a">Date</td><td style="padding:8px 0;color:#0E2A3A;font-weight:600">${cleanDate}</td></tr>
            <tr><td style="padding:8px 0;color:#7a6a5a">Time</td><td style="padding:8px 0;color:#0E2A3A;font-weight:600">${cleanTime}</td></tr>
            ${cleanNotes ? `<tr><td style="padding:8px 0;color:#7a6a5a;vertical-align:top">Notes</td><td style="padding:8px 0;color:#0E2A3A">${cleanNotes}</td></tr>` : ''}
          </table>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e8e0d4;display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://artizonespa.com/admin/scheduling"
               style="display:inline-block;background:#C4A882;color:#0E2A3A;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">
              View in Scheduling →
            </a>
            <a href="https://artizonespa.com/admin/bookings"
               style="display:inline-block;background:#F7F3EE;color:#0E2A3A;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;border:1px solid #e8e0d4">
              View in Bookings →
            </a>
          </div>
        </div>
      `,
    }).catch(err => console.error('booking.email.failed', err));

    // ── 4. WhatsApp URL ───────────────────────────────────────────────────────
    const msg = encodeURIComponent(
      `📅 *New Booking Request*\n\n` +
      `👤 Name: ${cleanName}\n` +
      `📞 Phone: ${cleanPhone}\n` +
      `💆 Service: ${cleanService}\n` +
      `📆 Date: ${cleanDate}\n` +
      `🕐 Time: ${cleanTime}\n` +
      (cleanNotes ? `📝 Notes: ${cleanNotes}\n` : '') +
      `\nPlease confirm this appointment.`
    );

    return res.json({
      success: true,
      whatsappUrl:      `https://wa.me/962790412758?text=${msg}`,
      bookingRequestId,
      appointmentId,
      message: 'Booking request saved.',
    });
  } catch (err) {
    console.error('booking.post', err);
    return res.status(500).json({ error: 'Failed to save booking. Please call us directly.' });
  }
}
