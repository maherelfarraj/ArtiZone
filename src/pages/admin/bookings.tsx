/**
 * /admin/bookings — Booking Management Dashboard
 * Tabs: Requests (pending queue + list) | Calendar | Demand Report
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Phone, RefreshCw, Loader2, CheckCircle,
  XCircle, Clock, MessageCircle, ChevronDown, ChevronUp,
  Download, Trash2, Edit3, Save, X, CalendarDays, List,
  Users, AlertCircle, Plus, BarChart2,
  ThumbsDown, UserX,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import NewBookingModal from '@/components/admin/NewBookingModal';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';
const SAGE  = '#6B7260';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface Booking {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string | null;
  adminNotes?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'declined';
  source?: string;
  confirmedAt?: string | null;
  createdAt: string;
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'declined';
type MainTab = 'requests' | 'calendar' | 'demand';

const STATUS_META: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  pending:   { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Pending',   icon: <Clock size={11} /> },
  confirmed: { bg: 'rgba(60,180,100,0.14)',  color: '#1e7a44', label: 'Confirmed', icon: <CheckCircle size={11} /> },
  cancelled: { bg: 'rgba(220,60,60,0.12)',   color: '#b02828', label: 'Cancelled', icon: <XCircle size={11} /> },
  no_show:   { bg: 'rgba(120,80,200,0.12)',  color: '#5a2d9a', label: 'No-show',   icon: <UserX size={11} /> },
  declined:  { bg: 'rgba(200,100,20,0.12)',  color: '#8a4010', label: 'Declined',  icon: <ThumbsDown size={11} /> },
};

const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
  web_form:  { label: 'Web form',  color: '#0c447c', bg: '#e6f1fb' },
  whatsapp:  { label: 'WhatsApp',  color: '#1a6e2e', bg: '#eaf3de' },
  phone:     { label: 'Phone',     color: '#7a5a10', bg: '#faeeda' },
  instagram: { label: 'Instagram', color: '#8b1a5a', bg: '#fce8f3' },
  walk_in:   { label: 'Walk-in',   color: '#3d3d3a', bg: '#f1efe8' },
};

const SERVICES = [
  'All Services',
  'Face & Skin Care',
  'Laser Hair Removal',
  'Body Slimming',
  'Nails & Foot Care',
  'Hair Removal',
  "Men's Grooming",
];

/* ── Demand report constants ─────────────────────────────────────────────── */
const DAYS  = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
// MySQL DAYOFWEEK: 1=Sun..7=Sat → convert to 0-based Postgres DOW (0=Sun..6=Sat)
// then map to our row order (Sat=0, Sun=1, Mon=2 …)
const DOW_TO_ROW: Record<number, number> = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
const HEAT_SCALE = ['#E1F5EE', '#9FE1CB', '#5DCAA5', '#1D9E75', '#0F6E56', '#085041'];

function heatFill(n: number, max: number) {
  if (n === 0) return '#f1efe8';
  const r = n / max;
  if (r <= 0.17) return HEAT_SCALE[0];
  if (r <= 0.34) return HEAT_SCALE[1];
  if (r <= 0.50) return HEAT_SCALE[2];
  if (r <= 0.67) return HEAT_SCALE[3];
  if (r <= 0.84) return HEAT_SCALE[4];
  return HEAT_SCALE[5];
}
function heatText(n: number, max: number) {
  if (n === 0) return '#b4b2a9';
  return n / max > 0.5 ? '#E1F5EE' : '#04342C';
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}
function fmtDateTime(d: string) {
  try { return new Date(d).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return d; }
}
function whatsappConfirm(b: Booking) {
  const msg = encodeURIComponent(
    `Hi ${b.name}! 🌸\n\nYour appointment at ArtiZone has been *confirmed*:\n\n` +
    `💆 Service: ${b.service}\n📆 Date: ${b.date}\n🕐 Time: ${b.time}\n\n` +
    `We look forward to seeing you! Please arrive 5 minutes early.\n\n— ArtiZone Team`
  );
  return `https://wa.me/${b.phone.replace(/\D/g, '')}?text=${msg}`;
}
function exportCSV(bookings: Booking[]) {
  const header = ['ID', 'Name', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Source', 'Notes', 'Admin Notes', 'Submitted'];
  const rows = bookings.map(b => [
    b.id, b.name, b.phone, b.service, b.date, b.time, b.status, b.source ?? '',
    b.notes ?? '', b.adminNotes ?? '', fmtDateTime(b.createdAt),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `artizone-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ── Status badge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: m.bg, color: m.color }}>
      {m.icon} {m.label}
    </span>
  );
}

/* ── Source badge ────────────────────────────────────────────────────────── */
function SourceBadge({ source }: { source?: string }) {
  const s = source ?? 'web_form';
  const m = SOURCE_META[s] ?? SOURCE_META.web_form;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMAND REPORT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
function DemandReport() {
  const [groupBy, setGroupBy] = useState<'day_hour' | 'service' | 'channel'>('day_hour');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buckets, setBuckets] = useState<{ bucket_key: unknown; requests: number }[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    setLoading(true); setError('');
    const to   = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - rangeDays * 86400000).toISOString().slice(0, 10);
    const params = new URLSearchParams({ from, to, group_by: groupBy, status: statusFilter });
    try {
      const r = await fetch(`/api/reports/demand?${params}`, { signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      if (!signal.aborted) setBuckets(d.buckets ?? []);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError('Could not load report.');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [groupBy, statusFilter, rangeDays]);

  useEffect(() => { load(); }, [load]);

  /* ── Heatmap ── */
  const renderHeatmap = () => {
    const grid = DAYS.map(() => HOURS.map(() => 0));
    for (const b of buckets) {
      const [dow, hour] = b.bucket_key as [number, number];
      const row = DOW_TO_ROW[dow];
      const col = HOURS.indexOf(hour);
      if (row != null && col >= 0) grid[row][col] = b.requests;
    }
    let total = 0, max = 0, peak: { d: number; h: number } | null = null;
    for (let d = 0; d < 7; d++) for (let h = 0; h < 10; h++) {
      const v = grid[d][h]; total += v;
      if (v > max) { max = v; peak = { d, h }; }
    }
    if (total === 0) return <p className="text-sm text-center py-8" style={{ color: SAGE }}>No bookings in this range. Try widening the date range.</p>;

    return (
      <div>
        <p className="text-xs mb-3" style={{ color: SAGE }}>
          {total.toLocaleString()} {statusFilter === 'all' ? 'requests' : statusFilter} in view
          {peak ? ` · busiest: ${DAYS[peak.d]} ${HOURS[peak.h]}:00` : ''}
        </p>
        {/* Grid */}
        <div className="overflow-x-auto">
          <div style={{ display: 'grid', gridTemplateColumns: '44px repeat(10, 1fr)', gap: 3, minWidth: 480, fontSize: 12 }}>
            <div />
            {HOURS.map(h => (
              <div key={h} className="text-center pb-1" style={{ color: SAGE }}>{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</div>
            ))}
            {DAYS.map((day, d) => (
              <>
                <div key={`l-${d}`} className="flex items-center text-xs" style={{ color: SAGE }}>{day}</div>
                {HOURS.map((_, h) => {
                  const v = grid[d][h];
                  return (
                    <div key={`c-${d}-${h}`}
                      title={`${day} ${HOURS[h]}:00 · ${v} requests`}
                      className="flex items-center justify-center rounded-lg"
                      style={{ height: 28, background: heatFill(v, max || 1), color: heatText(v, max || 1) }}>
                      {v > 0 ? v : ''}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: SAGE }}>
          <span>Low</span>
          {HEAT_SCALE.map(c => <span key={c} style={{ width: 18, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />)}
          <span>High</span>
        </div>
      </div>
    );
  };

  /* ── Service / channel ranking ── */
  const renderRanking = () => {
    if (buckets.length === 0) return <p className="text-sm text-center py-8" style={{ color: SAGE }}>No data in this range.</p>;
    const max = Math.max(...buckets.map(b => b.requests), 1);
    return (
      <div className="space-y-3">
        {buckets.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs w-36 truncate font-medium" style={{ color: NAVY }}>{String(b.bucket_key)}</span>
            <div className="flex-1 rounded-lg overflow-hidden" style={{ background: '#f1efe8', height: 22 }}>
              <div style={{ width: `${(b.requests / max) * 100}%`, height: '100%', background: '#0F6E56', borderRadius: 8 }} />
            </div>
            <span className="text-xs w-10 text-right" style={{ color: SAGE }}>{b.requests}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Group by tabs */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(196,168,130,0.3)' }}>
          {(['day_hour', 'service', 'channel'] as const).map(g => (
            <button key={g} onClick={() => setGroupBy(g)}
              className="px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: groupBy === g ? NAVY : '#fff',
                color: groupBy === g ? GOLD : SAGE,
                borderRight: g !== 'channel' ? '1px solid rgba(196,168,130,0.3)' : undefined,
              }}>
              {g === 'day_hour' ? 'Heatmap' : g === 'service' ? 'By Service' : 'By Channel'}
            </button>
          ))}
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border outline-none"
          style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY, background: '#fff' }}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No-show</option>
          <option value="declined">Declined</option>
        </select>

        <select value={rangeDays} onChange={e => setRangeDays(Number(e.target.value))}
          className="text-xs px-3 py-2 rounded-xl border outline-none"
          style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY, background: '#fff' }}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>

        <button onClick={load} className="ml-auto flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all hover:opacity-80"
          style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Body */}
      <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(196,168,130,0.2)', background: '#fff' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2" style={{ color: SAGE }}>
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm mb-3" style={{ color: '#b02828' }}>{error}</p>
            <button onClick={load} className="text-xs px-4 py-2 rounded-xl border" style={{ borderColor: 'rgba(196,168,130,0.3)' }}>Try again</button>
          </div>
        ) : groupBy === 'day_hour' ? renderHeatmap() : renderRanking()}
      </div>

      {/* Insight callout */}
      <div className="rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ background: 'rgba(196,168,130,0.1)', color: SAGE, borderLeft: `3px solid ${GOLD}` }}>
        <strong style={{ color: NAVY }}>Tip:</strong> Count all statuses to see true demand. Filter to <em>declined</em> or <em>cancelled</em> to find lost demand — usually worst in busy evening slots, which is the case for adding capacity or off-peak promotions.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PENDING QUEUE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
interface PendingQueueProps {
  bookings: Booking[];
  onAction: (id: number, status: 'confirmed' | 'declined') => Promise<void>;
  loading: boolean;
}
function PendingQueue({ bookings, onAction, loading }: PendingQueueProps) {
  const pending = bookings.filter(b => b.status === 'pending');
  if (pending.length === 0) return (
    <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'rgba(196,168,130,0.2)', background: '#fff' }}>
      <CheckCircle size={28} className="mx-auto mb-2" style={{ color: '#1e7a44' }} />
      <p className="text-sm font-semibold" style={{ color: NAVY }}>All caught up!</p>
      <p className="text-xs mt-1" style={{ color: SAGE }}>No pending requests right now.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {pending.map(b => (
        <motion.div key={b.id} layout
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4" style={{ borderColor: 'rgba(196,168,130,0.25)', background: '#fff' }}>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
              {b.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm" style={{ color: NAVY }}>{b.name}</span>
                <SourceBadge source={b.source} />
              </div>
              <p className="text-xs" style={{ color: SAGE }}>{b.service} · {b.date} at {b.time}</p>
              <p className="text-xs mt-0.5" style={{ color: SAGE }}>
                <Phone size={10} className="inline mr-1" />{b.phone}
                {b.notes && <span className="ml-2 italic">"{b.notes}"</span>}
              </p>
            </div>
            <span className="text-[10px] shrink-0" style={{ color: SAGE }}>{fmtDateTime(b.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
            <button onClick={() => onAction(b.id, 'confirmed')} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#1e7a44', color: '#fff' }}>
              <CheckCircle size={12} /> Confirm
            </button>
            <a href={whatsappConfirm(b)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
              style={{ background: '#25D366', color: '#fff' }}>
              <MessageCircle size={12} /> WhatsApp
            </a>
            <a href={`tel:${b.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
              style={{ background: 'rgba(196,168,130,0.15)', color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
              <Phone size={12} /> Call
            </a>
            <button onClick={() => onAction(b.id, 'declined')} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50 ml-auto"
              style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}>
              <ThumbsDown size={12} /> Decline
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CALENDAR VIEW
═══════════════════════════════════════════════════════════════════════════ */
function CalendarView({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const daysInMonth = () => {
    const [y, m] = selectedDate.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  };
  const firstDayOfMonth = () => {
    const [y, m] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, 1).getDay();
  };
  const [year, month] = selectedDate.split('-').map(Number);

  const bookingsByDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const key = b.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
  };

  const monthName = new Date(year, month - 1, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  const days = Array.from({ length: daysInMonth() }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth() }, (_, i) => i);

  const [dayDetail, setDayDetail] = useState<string | null>(null);
  const detailBookings = dayDetail ? (bookingsByDate[dayDetail] ?? []) : [];

  return (
    <div className="p-6 space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-black/5 transition-all"><ChevronDown size={16} style={{ transform: 'rotate(90deg)', color: NAVY }} /></button>
        <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>{monthName}</h3>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-black/5 transition-all"><ChevronDown size={16} style={{ transform: 'rotate(-90deg)', color: NAVY }} /></button>
      </div>

      {/* Grid */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(196,168,130,0.2)' }}>
        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'rgba(196,168,130,0.15)', background: PARCH }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: SAGE }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {blanks.map(i => <div key={`b-${i}`} className="h-16 border-b border-r" style={{ borderColor: 'rgba(196,168,130,0.1)' }} />)}
          {days.map(day => {
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBookings = bookingsByDate[dateKey] ?? [];
            const hasPending = dayBookings.some(b => b.status === 'pending');
            const isToday = dateKey === new Date().toISOString().slice(0, 10);
            return (
              <button key={day} onClick={() => setDayDetail(dayDetail === dateKey ? null : dateKey)}
                className="h-16 border-b border-r p-1.5 text-left transition-all hover:bg-amber-50/50 relative"
                style={{ borderColor: 'rgba(196,168,130,0.1)', background: dayDetail === dateKey ? 'rgba(196,168,130,0.08)' : undefined }}>
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'text-white' : ''}`}
                  style={{ background: isToday ? NAVY : undefined, color: isToday ? '#fff' : NAVY }}>
                  {day}
                </span>
                {dayBookings.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    <span className="text-[9px] px-1 py-0.5 rounded font-semibold"
                      style={{ background: hasPending ? 'rgba(180,175,83,0.2)' : 'rgba(60,180,100,0.15)', color: hasPending ? '#7a7618' : '#1e7a44' }}>
                      {dayBookings.length}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail panel */}
      <AnimatePresence>
        {dayDetail && (
          <motion.div key={dayDetail} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border p-4 space-y-3" style={{ borderColor: 'rgba(196,168,130,0.25)', background: '#fff' }}>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm" style={{ color: NAVY }}>{fmtDate(dayDetail)}</h4>
              <button onClick={() => setDayDetail(null)}><X size={14} style={{ color: SAGE }} /></button>
            </div>
            {detailBookings.length === 0 ? (
              <p className="text-xs" style={{ color: SAGE }}>No bookings on this day.</p>
            ) : (
              detailBookings.sort((a, b) => a.time.localeCompare(b.time)).map(b => (
                <div key={b.id} className="flex items-center gap-3 py-2 border-t" style={{ borderColor: 'rgba(196,168,130,0.1)' }}>
                  <span className="text-xs font-bold w-14 shrink-0" style={{ color: SAGE }}>{b.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: NAVY }}>{b.name}</p>
                    <p className="text-[11px]" style={{ color: SAGE }}>{b.service}</p>
                  </div>
                  <StatusBadge status={b.status} />
                  <a href={`tel:${b.phone}`} className="shrink-0"><Phone size={13} style={{ color: GOLD }} /></a>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOKING ROW (list view)
═══════════════════════════════════════════════════════════════════════════ */
interface BookingRowProps {
  booking: Booking;
  onUpdate: (id: number, updates: Partial<Booking>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}
function BookingRow({ booking: b, onUpdate, onDelete }: BookingRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ date: b.date, time: b.time, service: b.service, adminNotes: b.adminNotes ?? '' });

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(b.id, form);
    setSaving(false); setEditing(false);
  };
  const handleStatus = async (status: Booking['status']) => {
    setSaving(true);
    await onUpdate(b.id, { status });
    setSaving(false);
  };

  return (
    <motion.div layout className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(196,168,130,0.2)', background: '#fff' }}>
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-amber-50/30 transition-all"
        onClick={() => setExpanded(v => !v)}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
          {b.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm" style={{ color: NAVY }}>{b.name}</span>
            <SourceBadge source={b.source} />
          </div>
          <p className="text-xs truncate" style={{ color: SAGE }}>{b.service} · {b.date} {b.time}</p>
        </div>
        <StatusBadge status={b.status} />
        {expanded ? <ChevronUp size={14} style={{ color: SAGE }} /> : <ChevronDown size={14} style={{ color: SAGE }} />}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div key="detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
            <div className="px-4 py-4 space-y-4">
              {editing ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Date', key: 'date', type: 'date' },
                    { label: 'Time', key: 'time', type: 'time' },
                    { label: 'Service', key: 'service', type: 'text' },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold block mb-1" style={{ color: SAGE }}>{label}</label>
                      <input type={type} value={(form as Record<string, string>)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full text-xs px-3 py-2 rounded-xl border outline-none"
                        style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="text-xs font-semibold block mb-1" style={{ color: SAGE }}>Admin Notes</label>
                    <textarea value={form.adminNotes} onChange={e => setForm(f => ({ ...f, adminNotes: e.target.value }))}
                      rows={2} className="w-full text-xs px-3 py-2 rounded-xl border outline-none resize-none"
                      style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {[
                    ['Phone', b.phone],
                    ['Service', b.service],
                    ['Date', b.date],
                    ['Time', b.time],
                    ['Submitted', fmtDateTime(b.createdAt)],
                    ['Source', b.source ?? 'web_form'],
                  ].map(([k, v]) => (
                    <div key={k}><span style={{ color: SAGE }}>{k}: </span><span style={{ color: NAVY }}>{v}</span></div>
                  ))}
                  {b.notes && <div className="col-span-2"><span style={{ color: SAGE }}>Notes: </span><span style={{ color: NAVY }}>{b.notes}</span></div>}
                  {b.adminNotes && <div className="col-span-2"><span style={{ color: SAGE }}>Admin notes: </span><span style={{ color: NAVY }}>{b.adminNotes}</span></div>}
                </div>
              )}

              {/* Action bar */}
              <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'rgba(196,168,130,0.1)' }}>
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: NAVY, color: GOLD }}>
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.3)', color: SAGE }}>
                      <X size={12} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {b.status === 'pending' && (
                      <button onClick={() => handleStatus('confirmed')} disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                        style={{ background: '#1e7a44', color: '#fff' }}>
                        <CheckCircle size={12} /> Confirm
                      </button>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleStatus('no_show')} disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                        style={{ background: 'rgba(120,80,200,0.1)', color: '#5a2d9a', border: '1px solid rgba(120,80,200,0.2)' }}>
                        <UserX size={12} /> No-show
                      </button>
                    )}
                    <a href={whatsappConfirm(b)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: '#25D366', color: '#fff' }}>
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                    <a href={`tel:${b.phone}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }}>
                      <Phone size={12} /> Call
                    </a>
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.3)', color: SAGE }}>
                      <Edit3 size={12} /> Edit
                    </button>
                    {b.status !== 'cancelled' && (
                      <button onClick={() => handleStatus('cancelled')} disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                        style={{ borderColor: 'rgba(220,60,60,0.2)', color: '#b02828' }}>
                        <XCircle size={12} /> Cancel
                      </button>
                    )}
                    <button onClick={() => onDelete(b.id)} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80 ml-auto"
                      style={{ borderColor: 'rgba(220,60,60,0.15)', color: '#b02828' }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminBookingsPage() {
  const [bookings, setBookings]         = useState<Booking[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]               = useState('');
  const [mainTab, setMainTab]           = useState<MainTab>('requests');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [search, setSearch]             = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  /* ── Fetch ── */
  const fetchBookings = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/booking');
      if (!r.ok) throw new Error('Failed to load');
      const d = await r.json();
      setBookings(d.bookings ?? d ?? []);
    } catch { setError('Could not load bookings.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  /* ── Stats ── */
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings  = bookings.filter(b => b.date === today);
  const pendingCount   = bookings.filter(b => b.status === 'pending').length;
  const confirmedToday = todayBookings.filter(b => b.status === 'confirmed').length;
  const noShowCount    = bookings.filter(b => b.status === 'no_show').length;

  /* ── Actions ── */
  const handleUpdate = async (id: number, updates: Partial<Booking>) => {
    setActionLoading(true);
    try {
      await fetch(`/api/booking/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    } finally { setActionLoading(false); }
  };

  const handleQuickAction = async (id: number, status: 'confirmed' | 'declined') => {
    await handleUpdate(id, { status });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this booking?')) return;
    setActionLoading(true);
    try {
      await fetch(`/api/booking/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== id));
    } finally { setActionLoading(false); }
  };

  /* ── Filtered list ── */
  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (serviceFilter !== 'All Services' && !b.service.toLowerCase().includes(serviceFilter.toLowerCase().split(' ')[0])) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.phone.includes(q) && !b.service.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const TABS: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'requests', label: 'Requests', icon: <List size={14} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={14} /> },
    { id: 'demand',   label: 'Demand Report', icon: <BarChart2 size={14} /> },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Bookings — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-5 sm:p-6 space-y-5 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>Bookings</h1>
            <p className="text-xs mt-0.5" style={{ color: SAGE }}>{bookings.length} total · {pendingCount} pending</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchBookings} disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => exportCSV(filtered)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY }}>
              <Download size={12} /> Export
            </button>
            <button onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold transition-all hover:opacity-90"
              style={{ background: NAVY, color: GOLD }}>
              <Plus size={12} /> New Booking
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Today', value: todayBookings.length, color: NAVY },
            { label: 'Pending', value: pendingCount, color: pendingCount > 0 ? '#7a7618' : NAVY, bg: pendingCount > 0 ? 'rgba(180,175,83,0.08)' : undefined },
            { label: 'Confirmed Today', value: confirmedToday, color: '#1e7a44', bg: 'rgba(60,180,100,0.06)' },
            { label: 'No-shows', value: noShowCount, color: '#5a2d9a', bg: 'rgba(120,80,200,0.06)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'rgba(196,168,130,0.2)', background: bg ?? '#fff' }}>
              <p className="text-xs" style={{ color: SAGE }}>{label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: PARCH }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: mainTab === t.id ? '#fff' : 'transparent',
                color: mainTab === t.id ? NAVY : SAGE,
                boxShadow: mainTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : undefined,
              }}>
              {t.icon} {t.label}
              {t.id === 'requests' && pendingCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#d97706', color: '#fff' }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {mainTab === 'demand' ? (
          <DemandReport />
        ) : mainTab === 'calendar' ? (
          <CalendarView bookings={bookings} />
        ) : (
          <div className="space-y-4">
            {/* Pending queue */}
            {pendingCount > 0 && (
              <div>
                <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: NAVY }}>
                  <AlertCircle size={14} style={{ color: '#d97706' }} />
                  Needs attention
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#d97706', color: '#fff' }}>{pendingCount}</span>
                </h2>
                <PendingQueue bookings={bookings} onAction={handleQuickAction} loading={actionLoading} />
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl border"
                style={{ borderColor: 'rgba(196,168,130,0.3)', background: '#fff' }}>
                <Search size={13} style={{ color: SAGE }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, service…"
                  className="flex-1 text-xs outline-none bg-transparent" style={{ color: NAVY }} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                className="text-xs px-3 py-2 rounded-xl border outline-none"
                style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY, background: '#fff' }}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-show</option>
                <option value="declined">Declined</option>
              </select>
              <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border outline-none"
                style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY, background: '#fff' }}>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2" style={{ color: SAGE }}>
                <Loader2 size={20} className="animate-spin" /> Loading bookings…
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle size={24} className="mx-auto mb-2" style={{ color: '#b02828' }} />
                <p className="text-sm" style={{ color: '#b02828' }}>{error}</p>
                <button onClick={fetchBookings} className="mt-3 text-xs px-4 py-2 rounded-xl border" style={{ borderColor: 'rgba(196,168,130,0.3)' }}>Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12" style={{ color: SAGE }}>
                <Users size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No bookings match your filters.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs" style={{ color: SAGE }}>{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
                {filtered.map(b => (
                  <BookingRow key={b.id} booking={b} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewBookingModal
          onClose={() => setShowNewModal(false)}
          onCreated={() => { setShowNewModal(false); fetchBookings(); }}
        />
      )}
    </AdminLayout>
  );
}
