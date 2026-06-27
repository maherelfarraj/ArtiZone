/**
 * CustomerLookup — admin panel to search customers, view appointment history,
 * and see / redeem package balances.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Search, User, CalendarDays, Package, Loader2,
  ChevronRight, CheckCircle, Clock, XCircle, Gift,
  Phone, Mail, MapPin, Plus,
} from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  area?: string | null;
  dob?: string | null;
  notes?: string | null;
  createdAt: string;
}

interface Appt {
  id: number;
  date: string;
  startTime: string;
  serviceName?: string | null;
  status: string;
  source?: string;
}

interface CustomerPkg {
  id: number;
  packageName: string;
  totalSessions: number;
  sessionsRemaining: number;
  pricePaidJod: number;
  purchasedAt: string;
  expiresAt?: string | null;
  status: string;
  category?: string | null;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  confirmed:  <CheckCircle size={11} style={{ color: '#1e7a44' }} />,
  completed:  <CheckCircle size={11} style={{ color: NAVY }} />,
  requested:  <Clock size={11} style={{ color: '#7a7618' }} />,
  cancelled:  <XCircle size={11} style={{ color: '#b02828' }} />,
  no_show:    <XCircle size={11} style={{ color: '#5a2d9a' }} />,
};

const PKG_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#eaf3de', color: '#1a6e2e' },
  completed: { bg: 'rgba(14,42,58,0.1)', color: NAVY },
  expired:   { bg: '#faeeda', color: '#7a5a10' },
  cancelled: { bg: '#fce8f3', color: '#b02828' },
};

const fmt = (fils: number) => `${(fils / 100).toFixed(2)} JOD`;

export default function CustomerLookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [detail, setDetail] = useState<{ appointments: Appt[]; packages: CustomerPkg[] } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [redeemingPkg, setRedeemingPkg] = useState<number | null>(null);
  const [redeemMsg, setRedeemMsg] = useState('');

  // New customer form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', phone: '', email: '', area: '', dob: '' });
  const [savingNew, setSavingNew] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/scheduling/customers?q=${encodeURIComponent(q)}&limit=20`);
      const data = await res.json();
      setResults(data.customers ?? []);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void doSearch(query); }, 350);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const loadDetail = useCallback(async (c: Customer) => {
    setSelected(c);
    setDetail(null);
    setRedeemMsg('');
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/scheduling/customers/${c.id}`);
      const data = await res.json();
      setDetail({ appointments: data.appointments ?? [], packages: data.packages ?? [] });
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const redeemSession = async (pkgId: number) => {
    if (!selected) return;
    setRedeemingPkg(pkgId);
    setRedeemMsg('');
    try {
      const res = await fetch(`/api/scheduling/customers/${selected.id}/packages/${pkgId}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redeemedBy: 'Admin' }),
      });
      const data = await res.json();
      if (data.ok) {
        setRedeemMsg(`✓ Session redeemed. ${data.sessionsRemaining} remaining.`);
        await loadDetail(selected);
      } else {
        setRedeemMsg(`Error: ${data.error}`);
      }
    } finally {
      setRedeemingPkg(null);
    }
  };

  const createCustomer = async () => {
    if (!newForm.name || !newForm.phone) return;
    setSavingNew(true);
    try {
      const res = await fetch('/api/scheduling/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      const data = await res.json();
      if (data.ok) {
        setShowNewForm(false);
        setQuery(newForm.name);
        setNewForm({ name: '', phone: '', email: '', area: '', dob: '' });
        await doSearch(newForm.name);
      }
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Left: search panel ─────────────────────────────────────────── */}
      <div className="lg:w-80 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: NAVY }}>
            <User size={16} style={{ color: GOLD }} /> Customers
          </h2>
          <button onClick={() => setShowNewForm(v => !v)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
            style={{ background: NAVY, color: '#fff' }}>
            <Plus size={11} /> New
          </button>
        </div>

        {/* New customer form */}
        {showNewForm && (
          <div className="mb-4 p-4 rounded space-y-3" style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)` }}>
            <p className="text-xs font-bold" style={{ color: NAVY }}>New Customer</p>
            {(['name', 'phone', 'email', 'area', 'dob'] as const).map(f => (
              <input key={f} value={newForm[f]} onChange={e => setNewForm(v => ({ ...v, [f]: e.target.value }))}
                placeholder={f === 'dob' ? 'DOB (YYYY-MM-DD)' : f.charAt(0).toUpperCase() + f.slice(1)}
                className="w-full text-xs outline-none px-3 py-2"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
            ))}
            <div className="flex gap-2">
              <button onClick={() => setShowNewForm(false)}
                className="flex-1 py-1.5 text-xs font-bold"
                style={{ background: '#fff', color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                Cancel
              </button>
              <button onClick={createCustomer} disabled={savingNew || !newForm.name || !newForm.phone}
                className="flex-1 py-1.5 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                style={{ background: NAVY, color: '#fff' }}>
                {savingNew ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                Save
              </button>
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="relative mb-3">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name or phone..."
            className="w-full text-sm outline-none pl-8 pr-3 py-2.5"
            style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
          {searching && <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: GOLD }} />}
        </div>

        {/* Results */}
        <div className="space-y-1.5">
          {results.length === 0 && query && !searching && (
            <p className="text-xs text-center py-4" style={{ color: 'hsl(20 15% 55%)' }}>No customers found.</p>
          )}
          {results.map(c => (
            <button key={c.id} onClick={() => loadDetail(c)}
              className="w-full text-left p-3 rounded flex items-center gap-3 transition-all hover:shadow-sm"
              style={{
                background: selected?.id === c.id ? NAVY : '#fff',
                border: `1px solid ${selected?.id === c.id ? NAVY : 'rgba(196,168,130,0.2)'}`,
                color: selected?.id === c.id ? '#fff' : NAVY,
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: selected?.id === c.id ? 'rgba(255,255,255,0.15)' : `${GOLD}22`, color: selected?.id === c.id ? '#fff' : NAVY }}>
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{c.name}</p>
                <p className="text-xs opacity-70">{c.phone}</p>
              </div>
              <ChevronRight size={13} className="shrink-0 opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: detail panel ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User size={40} className="mb-4 opacity-20" style={{ color: NAVY }} />
            <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>Search for a customer to view their profile.</p>
          </div>
        ) : (
          <div>
            {/* Customer header */}
            <div className="p-5 rounded mb-5" style={{ background: NAVY }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: `${GOLD}33`, color: GOLD }}>
                  {selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white">{selected.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="flex items-center gap-1"><Phone size={10} /> {selected.phone}</span>
                    {selected.email && <span className="flex items-center gap-1"><Mail size={10} /> {selected.email}</span>}
                    {selected.area && <span className="flex items-center gap-1"><MapPin size={10} /> {selected.area}</span>}
                    {selected.dob && <span>DOB: {selected.dob}</span>}
                  </div>
                  {selected.notes && (
                    <p className="text-xs mt-1.5 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>"{selected.notes}"</p>
                  )}
                </div>
              </div>
            </div>

            {loadingDetail ? (
              <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin" style={{ color: GOLD }} /></div>
            ) : detail && (
              <div className="space-y-6">
                {/* Packages */}
                <div>
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: NAVY }}>
                    <Package size={14} style={{ color: GOLD }} /> Packages ({detail.packages.length})
                  </h4>
                  {redeemMsg && (
                    <p className="text-xs font-semibold mb-3 px-3 py-2 rounded"
                      style={{ background: redeemMsg.startsWith('✓') ? '#eaf3de' : '#fce8f3', color: redeemMsg.startsWith('✓') ? '#1a6e2e' : '#b02828' }}>
                      {redeemMsg}
                    </p>
                  )}
                  {detail.packages.length === 0 ? (
                    <p className="text-xs py-3" style={{ color: 'hsl(20 15% 55%)' }}>No packages purchased yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.packages.map(p => {
                        const sc = PKG_STATUS_COLORS[p.status] ?? PKG_STATUS_COLORS.active;
                        const pct = Math.round(((p.totalSessions - p.sessionsRemaining) / p.totalSessions) * 100);
                        return (
                          <div key={p.id} className="p-4 rounded"
                            style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)` }}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-sm font-bold" style={{ color: NAVY }}>{p.packageName}</span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                    style={{ background: sc.bg, color: sc.color }}>{p.status}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: 'hsl(20 15% 55%)' }}>
                                  <span><strong style={{ color: NAVY }}>{p.sessionsRemaining}</strong>/{p.totalSessions} sessions left</span>
                                  <span>{fmt(p.pricePaidJod)}</span>
                                  {p.expiresAt && <span>Expires {new Date(p.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                </div>
                                {/* Progress bar */}
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(196,168,130,0.2)' }}>
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${pct}%`, background: p.status === 'active' ? NAVY : GOLD }} />
                                </div>
                              </div>
                              {p.status === 'active' && p.sessionsRemaining > 0 && (
                                <button onClick={() => redeemSession(p.id)} disabled={redeemingPkg === p.id}
                                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
                                  style={{ background: NAVY, color: '#fff' }}>
                                  {redeemingPkg === p.id ? <Loader2 size={11} className="animate-spin" /> : <Gift size={11} />}
                                  Redeem
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Appointment history */}
                <div>
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: NAVY }}>
                    <CalendarDays size={14} style={{ color: GOLD }} /> Appointment History ({detail.appointments.length})
                  </h4>
                  {detail.appointments.length === 0 ? (
                    <p className="text-xs py-3" style={{ color: 'hsl(20 15% 55%)' }}>No appointments on record.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {detail.appointments.map(a => (
                        <div key={a.id} className="flex items-center gap-3 p-3 rounded"
                          style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.15)` }}>
                          <div className="shrink-0">{STATUS_ICON[a.status] ?? <Clock size={11} />}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{ color: NAVY }}>
                              {a.serviceName ?? 'Service'}
                            </p>
                            <p className="text-[11px]" style={{ color: 'hsl(20 15% 55%)' }}>
                              {a.date} · {a.startTime}
                            </p>
                          </div>
                          <span className="text-[10px] capitalize shrink-0" style={{ color: 'hsl(20 15% 60%)' }}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
