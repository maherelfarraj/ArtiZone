/**
 * SchedulingCalendar — day view with per-practitioner columns
 * Block height is proportional to appointment duration.
 * Empty cells are clickable to create walk-ins.
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import AppointmentDetailModal from './AppointmentDetailModal';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

// Hours shown in the calendar: 10:00 – 19:00
const HOURS = Array.from({ length: 10 }, (_, i) => i + 10);
const HOUR_HEIGHT = 64; // px per hour

interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  serviceId?: number | null;
  serviceName?: string | null;
  staffId?: number | null;
  staffName?: string | null;
  resourceId?: number | null;
  roomName?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  status: string;
  source?: string;
  notes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  serviceDetails?: { durationMin: number; bufferMin: number; name: string } | null;
}

interface StaffMember { id: number; name: string; role?: string | null; }

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  requested:  { bg: '#fef9e7', border: '#c4a882', text: '#7a7618' },
  pending:    { bg: '#fef9e7', border: '#c4a882', text: '#7a7618' },
  confirmed:  { bg: '#eafaf1', border: '#1e7a44', text: '#1e7a44' },
  completed:  { bg: '#eaf0f6', border: '#0E2A3A', text: '#0E2A3A' },
  declined:   { bg: '#fdf0e8', border: '#8a4010', text: '#8a4010' },
  no_show:    { bg: '#f3eef9', border: '#5a2d9a', text: '#5a2d9a' },
  cancelled:  { bg: '#fdeaea', border: '#b02828', text: '#b02828' },
};

export default function SchedulingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const dateStr = formatDate(selectedDate);

  const load = async () => {
    setLoading(true);
    try {
      const [appts, stf] = await Promise.all([
        fetch(`/api/scheduling/appointments?date=${dateStr}`).then(r => r.json()),
        fetch('/api/scheduling/staff').then(r => r.json()),
      ]);
      setAppointments(Array.isArray(appts) ? appts : []);
      setStaff(Array.isArray(stf) ? stf : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [dateStr]);

  const dayLabel = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Unassigned appointments (no staffId)
  const unassigned = appointments.filter(a => !a.staffId);

  return (
    <div className="flex flex-col h-full">
      {/* Date nav */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedDate(d => addDays(d, -1))}
            className="p-2 rounded hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} style={{ color: NAVY }} />
          </button>
          <span className="text-sm font-semibold" style={{ color: NAVY }}>{dayLabel}</span>
          <button onClick={() => setSelectedDate(d => addDays(d, 1))}
            className="p-2 rounded hover:bg-gray-100 transition-colors">
            <ChevronRight size={16} style={{ color: NAVY }} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1.5 text-xs font-semibold rounded transition-all hover:opacity-80"
            style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
            Today
          </button>
          <button onClick={load} className="p-2 rounded hover:bg-gray-100 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" style={{ color: GOLD }} /> : <RefreshCw size={14} style={{ color: NAVY }} />}
          </button>
        </div>
      </div>

      {/* Unassigned strip */}
      {unassigned.length > 0 && (
        <div className="mb-4 p-3 rounded" style={{ background: 'rgba(180,175,83,0.1)', border: `1px solid rgba(180,175,83,0.3)` }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7618' }}>
            Unassigned ({unassigned.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(a => (
              <button key={a.id} onClick={() => setSelected(a)}
                className="px-3 py-1.5 text-xs rounded transition-all hover:opacity-80"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.4)`, color: NAVY }}>
                {a.customerName} · {a.serviceName ?? 'No service'} · {a.startTime}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header row */}
          <div className="flex" style={{ paddingLeft: 48 }}>
            {staff.map(s => (
              <div key={s.id} className="flex-1 min-w-[140px] px-2 py-2 text-center"
                style={{ borderBottom: `2px solid ${GOLD}` }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>{s.name}</p>
                {s.role && <p className="text-[10px]" style={{ color: 'hsl(20 15% 55%)' }}>{s.role}</p>}
              </div>
            ))}
            {staff.length === 0 && (
              <div className="flex-1 px-2 py-2 text-center">
                <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>No staff configured</p>
              </div>
            )}
          </div>

          {/* Time grid */}
          <div className="relative flex">
            {/* Time labels */}
            <div className="shrink-0" style={{ width: 48 }}>
              {HOURS.map(h => (
                <div key={h} className="flex items-start justify-end pr-2"
                  style={{ height: HOUR_HEIGHT, paddingTop: 2 }}>
                  <span className="text-[10px] font-medium" style={{ color: 'hsl(20 15% 55%)' }}>
                    {String(h).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Staff columns */}
            {staff.map(s => {
              const colAppts = appointments.filter(a => a.staffId === s.id);
              return (
                <div key={s.id} className="flex-1 min-w-[140px] relative"
                  style={{ borderLeft: `1px solid rgba(196,168,130,0.2)` }}>
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: `1px solid rgba(196,168,130,0.12)` }} />
                  ))}

                  {/* Appointment blocks */}
                  {colAppts.map(a => {
                    const startMin = timeToMinutes(a.startTime);
                    const calStart = 10 * 60; // 10:00
                    const topPx = ((startMin - calStart) / 60) * HOUR_HEIGHT;

                    // Duration: from serviceDetails or endTime, fallback 30min
                    let durMin = 30;
                    if (a.endTime) {
                      durMin = timeToMinutes(a.endTime) - startMin;
                    } else if (a.serviceDetails) {
                      durMin = a.serviceDetails.durationMin + a.serviceDetails.bufferMin;
                    }
                    const heightPx = Math.max((durMin / 60) * HOUR_HEIGHT, 28);

                    const colors = STATUS_COLORS[a.status] ?? STATUS_COLORS.requested;

                    return (
                      <motion.button
                        key={a.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setSelected(a)}
                        className="absolute left-1 right-1 rounded text-left overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
                        style={{
                          top: topPx,
                          height: heightPx,
                          background: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          zIndex: 10,
                        }}
                      >
                        <div className="px-1.5 py-1">
                          <p className="text-[10px] font-bold truncate" style={{ color: colors.text }}>
                            {a.customerName}
                          </p>
                          <p className="text-[9px] truncate" style={{ color: colors.text, opacity: 0.8 }}>
                            {a.serviceName ?? a.serviceDetails?.name ?? '—'}
                          </p>
                          {heightPx > 40 && (
                            <p className="text-[9px]" style={{ color: colors.text, opacity: 0.7 }}>
                              {a.startTime}{a.endTime ? ` – ${a.endTime}` : ''}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: `1px solid rgba(196,168,130,0.2)` }}>
        {Object.entries(STATUS_COLORS).filter(([k]) => !['pending', 'cancelled'].includes(k)).map(([status, c]) => (
          <span key={status} className="flex items-center gap-1.5 text-[10px] font-medium capitalize">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c.bg, border: `1.5px solid ${c.border}` }} />
            <span style={{ color: 'hsl(20 15% 50%)' }}>{status.replace('_', '-')}</span>
          </span>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <AppointmentDetailModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdated={updated => {
            setAppointments(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
