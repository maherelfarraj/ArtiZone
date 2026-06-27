/**
 * POST /api/v1/booking
 * Widget-compatible booking endpoint.
 *
 * Accepts the widget's payload shape:
 *   {
 *     name, phone, service_id, preferred_date, preferred_time,
 *     preferred_staff_gender?, notes?, source?, lang?,
 *     slot_start?, staff_id?, resource_id?,   ← live-slot fields
 *     whatsapp_optin?
 *   }
 *
 * Internally adapts to the existing POST /api/booking contract
 * (name, phone, service, date, time, notes) and dual-writes
 * booking_requests + appointments.
 *
 * Returns: { appointment_id, message }
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { services, bookingRequests, appointments, appointmentEvents } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/server/email';

const CLINIC_EMAIL = 'info@artizonespa.com';

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Normalise time to HH:MM 24h */
function normaliseTime(t: string): string {
  // Already HH:MM
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  // ISO datetime: "2025-01-01T14:30"
  const isoMatch = t.match(/T(\d{2}:\d{2})/);
  if (isoMatch) return isoMatch[1];
  // 12h format "02:30 PM"
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m) {
    let h = parseInt(m[1], 10);
    const period = m[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m[2]}`;
  }
  return t;
}

export default async function handler(req: Request, res: Response) {
  try {
    const {
      name, phone,
      service_id, preferred_date, preferred_time,
      preferred_staff_gender, notes, source, lang,
      slot_start, staff_id,
    } = req.body as {
      name: string; phone: string;
      service_id: number | string; preferred_date: string; preferred_time: string;
      preferred_staff_gender?: string; notes?: string; source?: string; lang?: string;
      slot_start?: string; staff_id?: number | null; resource_id?: null;
      whatsapp_optin?: boolean;
    };

    if (!name?.trim() || !phone?.trim() || !service_id || !preferred_date || !preferred_time) {
      return res.status(400).json({ error: 'name, phone, service_id, preferred_date and preferred_time are required' });
    }

    // Resolve service name from catalogue
    const [svc] = await db.select().from(services)
      .where(eq(services.id, Number(service_id)));

    const serviceName = svc?.name ?? `Service #${service_id}`;
    const duration    = svc ? svc.durationMin + svc.bufferMin : 60;

    const cleanTime = normaliseTime(
      slot_start ? slot_start.replace(/.*T/, '') : preferred_time
    );
    const endTime   = addMinutes(cleanTime, duration);

    const enrichedNotes = [
      preferred_staff_gender ? `Preferred gender: ${preferred_staff_gender}` : '',
      notes?.trim() ?? '',
      source ? `Source: ${source}` : '',
      lang   ? `Lang: ${lang}`   : '',
    ].filter(Boolean).join(' | ');

    // ── 1. booking_requests ───────────────────────────────────────────────────
    const brResult = await db.insert(bookingRequests).values({
      name:    name.trim(),
      phone:   phone.trim(),
      service: serviceName,
      date:    preferred_date,
      time:    cleanTime,
      notes:   enrichedNotes || null,
      status:  'pending',
    });
    const bookingRequestId = Number(brResult[0].insertId);

    // ── 2. appointments (scheduling system) ──────────────────────────────────
    const apptResult = await db.insert(appointments).values({
      customerName:     name.trim(),
      customerPhone:    phone.trim(),
      serviceId:        svc?.id ?? null,
      staffId:          staff_id ?? svc?.defaultStaffId ?? null,
      date:             preferred_date,
      startTime:        cleanTime,
      endTime,
      status:           'requested',
      source:           'web_form',
      bookingRequestId,
    });
    const appointmentId = Number(apptResult[0].insertId);

    // ── 3. Audit event ────────────────────────────────────────────────────────
    await db.insert(appointmentEvents).values({
      appointmentId,
      actor:      'client',
      toStatus:   'requested',
    }).catch(() => {/* non-fatal */});

    // ── 4. Email notification ─────────────────────────────────────────────────
    sendEmail({
      to:      CLINIC_EMAIL,
      subject: `New Booking Request — ${serviceName}`,
      html: `<p><strong>${name.trim()}</strong> (${phone.trim()}) requested <strong>${serviceName}</strong> on ${preferred_date} at ${cleanTime}.</p>${enrichedNotes ? `<p>Notes: ${enrichedNotes}</p>` : ''}`,
    }).catch(() => {/* non-fatal */});

    return res.status(201).json({
      appointment_id: appointmentId,
      booking_request_id: bookingRequestId,
      message: 'Booking request received',
    });
  } catch (err) {
    console.error('v1.booking.post.error', err);
    return res.status(500).json({ error: 'Failed to create booking', message: String(err) });
  }
}
