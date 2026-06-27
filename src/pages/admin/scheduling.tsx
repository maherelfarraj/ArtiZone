/**
 * /admin/scheduling — Full scheduling dashboard
 * Tabs: Requests queue | Calendar (day view) | Team & Rooms | Packages | Waitlist | Customers | Menu
 */
import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  List, CalendarDays, Users, RefreshCw, Loader2, CheckCircle,
  XCircle, Clock, MessageCircle, Phone, AlertCircle,
  UserX, ThumbsDown, Search, Filter, Package, UserCheck, BookOpen,
  Tag, Copy, Check,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import AppointmentDetailModal from '@/components/admin/AppointmentDetailModal';
import SchedulingCalendar from '@/components/admin/SchedulingCalendar';
import TeamRoomsSettings from '@/components/admin/TeamRoomsSettings';
import PackagesManager from '@/components/admin/PackagesManager';
import WaitlistManager from '@/components/admin/WaitlistManager';
import CustomerLookup from '@/components/admin/CustomerLookup';
import ServicesMenu from '@/components/admin/ServicesMenu';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

type Tab = 'requests' | 'calendar' | 'team' | 'packages' | 'waitlist' | 'customers' | 'menu' | 'codes';

interface DiscountSignup {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  signedUpAt: string;
  ip?: string;
}

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
  bookingRequestId?: number | null;
  notes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
}

const STATUS_META: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  requested:  { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Requested', icon: <Clock size={11} /> },
  pending:    { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Pending',   icon: <Clock size={11} /> },
  confirmed:  { bg: 'rgba(60,180,100,0.14)',  color: '#1e7a44', label: 'Confirmed', icon: <CheckCircle size={11} /> },
  completed:  { bg: 'rgba(14,42,58,0.12)',    color: NAVY,      label: 'Completed', icon: <CheckCircle size={11} /> },
  declined:   { bg: 'rgba(200,100,20,0.12)',  color: '#8a4010', label: 'Declined',  icon: <ThumbsDown size={11} /> },
  no_show:    { bg: 'rgba(120,80,200,0.12)',  color: '#5a2d9a', label: 'No-show',   icon: <UserX size={11} /> },
  cancelled:  { bg: 'rgba(220,60,60,0.12)',   color: '#b02828', label: 'Cancelled', icon: <XCircle size={11} /> },
};

const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
  web_form:  { label: 'Web form',  color: '#0c447c', bg: '#e6f1fb' },
  whatsapp:  { label: 'WhatsApp',  color: '#1a6e2e', bg: '#eaf3de' },
  phone:     { label: 'Phone',     color: '#7a5a10', bg: '#faeeda' },
  instagram: { label: 'Instagram', color: '#8b1a5a', bg: '#fce8f3' },
  walk_in:   { label: 'Walk-in',   color: '#3d3d3a', bg: '#f1efe8' },
};

export default function SchedulingPage() {
  const [tab, setTab] = useState<Tab>('requests');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Discount codes state
  const [codes, setCodes] = useState<DiscountSignup[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [codeSearch, setCodeSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scheduling/appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Load discount codes when tab is active
  useEffect(() => {
    if (tab !== 'codes') return;
    setCodesLoading(true);
    fetch('/api/admin/discount-codes')
      .then(r => r.json())
      .then(d => setCodes(Array.isArray(d.signups) ? d.signups : []))
      .catch(() => setCodes([]))
      .finally(() => setCodesLoading(false));
  }, [tab]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }

  const pending = appointments.filter(a => a.status === 'requested' || a.status === 'pending');
  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter(a => a.date === today);
  const confirmed = appointments.filter(a => a.status === 'confirmed');

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.customerName.toLowerCase().includes(q) ||
        a.customerPhone.includes(q) ||
        (a.serviceName ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'requests',  label: 'Requests',     icon: <List size={14} /> },
    { key: 'calendar',  label: 'Calendar',     icon: <CalendarDays size={14} /> },
    { key: 'team',      label: 'Team & Rooms', icon: <Users size={14} /> },
    { key: 'packages',  label: 'Packages',     icon: <Package size={14} /> },
    { key: 'waitlist',  label: 'Waitlist',     icon: <Clock size={14} /> },
    { key: 'customers', label: 'Customers',    icon: <UserCheck size={14} /> },
    { key: 'menu',      label: 'Menu',         icon: <BookOpen size={14} /> },
    { key: 'codes',     label: 'Discount Codes', icon: <Tag size={14} /> },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Scheduling — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Scheduling
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
              Manage appointments, assign staff & rooms, view the day calendar
            </p>
          </div>
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded transition-all hover:opacity-80"
            style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Refresh
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Today', value: todayAppts.length, color: NAVY },
            { label: 'Pending', value: pending.length, color: '#7a7618' },
            { label: 'Confirmed', value: confirmed.length, color: '#1e7a44' },
            { label: 'Total', value: appointments.length, color: NAVY },
          ].map(m => (
            <div key={m.label} className="p-4 rounded"
              style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)' }}>
              <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded" style={{ background: PARCH, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all"
              style={{
                background: tab === t.key ? NAVY : 'transparent',
                color: tab === t.key ? '#fff' : NAVY,
              }}>
              {t.icon} {t.label}
              {t.key === 'requests' && pending.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: '#c4a882', color: NAVY }}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Requests tab ──────────────────────────────────────────────── */}
        {tab === 'requests' && (
          <div>
            {/* Pending queue */}
            {pending.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: NAVY }}>
                  <AlertCircle size={14} style={{ color: '#7a7618' }} />
                  Pending Requests ({pending.length})
                </h2>
                <div className="space-y-2">
                  {pending.map(a => (
                    <motion.div key={a.id} layout
                      className="flex items-center gap-3 p-4 rounded cursor-pointer transition-all hover:shadow-md"
                      style={{ background: '#fff', border: `1.5px solid rgba(180,175,83,0.35)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)' }}
                      onClick={() => setSelected(a)}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: `${GOLD}22`, color: NAVY }}>
                        {a.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold" style={{ color: NAVY }}>{a.customerName}</span>
                          {a.source && SOURCE_META[a.source] && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{ background: SOURCE_META[a.source].bg, color: SOURCE_META[a.source].color }}>
                              {SOURCE_META[a.source].label}
                            </span>
                          )}
                          {a.bookingRequestId && (
                            <a href={`/admin/bookings`}
                              onClick={e => e.stopPropagation()}
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold underline"
                              style={{ background: 'rgba(14,42,58,0.07)', color: NAVY }}>
                              Booking #{a.bookingRequestId}
                            </a>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 50%)' }}>
                          {a.serviceName ?? 'No service'} · {a.date} · {a.startTime} · {a.customerPhone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(a); }}
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
                          style={{ background: NAVY, color: '#fff' }}>
                          <CheckCircle size={11} className="inline mr-1" />Confirm
                        </button>
                        <a href={`https://wa.me/${a.customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(a.customerName)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-2 rounded transition-all hover:opacity-80"
                          style={{ background: '#25D366', color: '#fff' }}>
                          <MessageCircle size={13} />
                        </a>
                        <a href={`tel:${a.customerPhone}`}
                          onClick={e => e.stopPropagation()}
                          className="p-2 rounded transition-all hover:opacity-80"
                          style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                          <Phone size={13} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Full list with filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone, service..."
                  className="w-full text-sm outline-none pl-9 pr-3 py-2.5"
                  style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}
                />
              </div>
              <div className="relative">
                <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm outline-none pl-8 pr-4 py-2.5 appearance-none"
                  style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}>
                  <option value="all">All statuses</option>
                  {Object.entries(STATUS_META).filter(([k]) => k !== 'pending').map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 && !loading && (
                <p className="text-sm text-center py-8" style={{ color: 'hsl(20 15% 55%)' }}>No appointments found.</p>
              )}
              {filtered.map(a => {
                const meta = STATUS_META[a.status] ?? STATUS_META.requested;
                return (
                  <div key={a.id}
                    className="flex items-center gap-3 p-3 rounded cursor-pointer transition-all hover:shadow-sm"
                    style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.18)` }}
                    onClick={() => setSelected(a)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: `${GOLD}18`, color: NAVY }}>
                      {a.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: NAVY }}>{a.customerName}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: meta.bg, color: meta.color }}>
                          {meta.icon} {meta.label}
                        </span>
                        {a.staffName && (
                          <span className="text-[10px]" style={{ color: 'hsl(20 15% 55%)' }}>· {a.staffName}</span>
                        )}
                        {a.roomName && (
                          <span className="text-[10px]" style={{ color: 'hsl(20 15% 55%)' }}>· {a.roomName}</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                        {a.serviceName ?? '—'} · {a.date} · {a.startTime}
                      </p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: 'hsl(20 15% 60%)' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Calendar tab ──────────────────────────────────────────────── */}
        {tab === 'calendar' && (
          <div style={{ minHeight: 600 }}>
            <SchedulingCalendar />
          </div>
        )}

        {/* ── Team & Rooms tab ──────────────────────────────────────────── */}
        {tab === 'team' && (
          <TeamRoomsSettings />
        )}

        {/* ── Packages tab ──────────────────────────────────────────────── */}
        {tab === 'packages' && (
          <PackagesManager />
        )}

        {/* ── Waitlist tab ──────────────────────────────────────────────── */}
        {tab === 'waitlist' && (
          <WaitlistManager />
        )}

        {/* ── Customers tab ─────────────────────────────────────────────── */}
        {tab === 'customers' && (
          <CustomerLookup />
        )}

        {/* ── Menu tab ──────────────────────────────────────────────────── */}
        {tab === 'menu' && (
          <ServicesMenu />
        )}

        {/* ── Discount Codes tab ────────────────────────────────────────── */}
        {tab === 'codes' && (
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-bold" style={{ color: NAVY }}>Discount Codes Issued</h2>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                  10% off codes sent to clients who signed up via the website
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(196,168,130,0.15)', color: NAVY, border: '1px solid rgba(196,168,130,0.3)' }}>
                <Tag size={12} style={{ color: GOLD }} />
                {codes.length} code{codes.length !== 1 ? 's' : ''} total
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
              <input
                type="text"
                value={codeSearch}
                onChange={e => setCodeSearch(e.target.value)}
                placeholder="Search name, email, code…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded border outline-none"
                style={{ borderColor: 'rgba(196,168,130,0.3)', color: NAVY, background: '#fff' }}
              />
            </div>

            {codesLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin" style={{ color: GOLD }} />
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'hsl(20 15% 55%)' }}>
                <Tag size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No discount codes issued yet.</p>
              </div>
            ) : (
              <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(196,168,130,0.2)' }}>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: PARCH, color: 'hsl(20 15% 45%)' }}>
                  <span>Client</span>
                  <span>Contact</span>
                  <span>Code</span>
                  <span>Issued</span>
                </div>
                {codes
                  .filter(c => {
                    if (!codeSearch) return true;
                    const q = codeSearch.toLowerCase();
                    return c.name.toLowerCase().includes(q) ||
                      c.email.toLowerCase().includes(q) ||
                      c.phone.includes(q) ||
                      c.code.toLowerCase().includes(q);
                  })
                  .map((c, i) => (
                    <div key={c.id}
                      className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center text-xs"
                      style={{
                        background: i % 2 === 0 ? '#fff' : 'rgba(247,243,238,0.5)',
                        borderTop: i > 0 ? '1px solid rgba(196,168,130,0.1)' : 'none',
                      }}>
                      {/* Name */}
                      <div>
                        <p className="font-semibold" style={{ color: NAVY }}>{c.name}</p>
                      </div>
                      {/* Contact */}
                      <div>
                        <p style={{ color: 'hsl(20 15% 40%)' }}>{c.email}</p>
                        <p className="mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{c.phone}</p>
                      </div>
                      {/* Code */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded font-mono font-bold text-[11px]"
                          style={{ background: 'rgba(196,168,130,0.15)', color: NAVY, border: '1px solid rgba(196,168,130,0.3)', letterSpacing: '0.05em' }}>
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyCode(c.code)}
                          className="p-1.5 rounded transition-all hover:opacity-70"
                          style={{ background: 'rgba(196,168,130,0.1)', color: NAVY }}
                          title="Copy code">
                          {copiedCode === c.code ? <Check size={12} style={{ color: '#1e7a44' }} /> : <Copy size={12} />}
                        </button>
                      </div>
                      {/* Date */}
                      <div className="text-right" style={{ color: 'hsl(20 15% 55%)', whiteSpace: 'nowrap' }}>
                        {new Date(c.signedUpAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
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
    </AdminLayout>
  );
}
