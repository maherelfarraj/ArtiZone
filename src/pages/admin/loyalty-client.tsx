/**
 * /admin/loyalty/:id — Full client profile: info, sessions, points history
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  ArrowLeft, Edit2, Save, X, Plus, Loader2,
  Crown, Award, Star, Phone, Mail, MapPin, Calendar,
  CheckCircle, Clock, XCircle, Coins, TrendingUp, TrendingDown,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const CREAM = '#F7F3EE';

// ── Types ──────────────────────────────────────────────────────────────────────
interface LoyaltyClient {
  id: number; name: string; phone: string; email?: string;
  tier: string; status: string; pointsBalance: number;
  pointsEarnedTotal: number; pointsRedeemedTotal: number;
  visits: number; area?: string; address?: string;
  dateOfBirth?: string; skinType?: string; notes?: string;
  createdAt: string;
}
interface Session {
  id: number; sessionDate: string; sessionType: string;
  status: string; staffName?: string; notes?: string; amountPaid: number;
}
interface Transaction {
  id: number; type: string; points: number;
  description?: string; adminBy?: string; createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const TIER_CFG: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  glow:     { bg: '#FFF8F0', text: '#C4A882', icon: Star,  label: 'Glow' },
  silver:   { bg: '#F0F4F8', text: '#607D8B', icon: Award, label: 'Silver' },
  gold:     { bg: '#FFF3CD', text: '#B8860B', icon: Award, label: 'Gold' },
  platinum: { bg: '#F0F0F0', text: '#555',    icon: Crown, label: 'Platinum' },
};

const SESSION_STATUS: Record<string, { icon: React.ElementType; color: string }> = {
  completed: { icon: CheckCircle, color: '#16a34a' },
  pending:   { icon: Clock,       color: '#d97706' },
  cancelled: { icon: XCircle,     color: '#dc2626' },
};

const SERVICES = [
  'Laser Hair Removal', 'HydraFacial', 'Venus Legacy Body Slimming',
  'Microneedling', 'Chemical Peel', 'Eyebrow Threading', 'Nail Care',
  'Men\'s Grooming', 'Skin Booster', 'Other',
];

export default function LoyaltyClientPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient]           = useState<LoyaltyClient | null>(null);
  const [sessions, setSessions]       = useState<Session[]>([]);
  const [transactions, setTxns]       = useState<Transaction[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editing, setEditing]         = useState(false);
  const [editForm, setEditForm]       = useState<Partial<LoyaltyClient>>({});
  const [savingEdit, setSavingEdit]   = useState(false);

  // Add session modal
  const [showSession, setShowSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionDate: '', sessionType: '', status: 'completed',
    staffName: '', notes: '', amountPaid: '',
  });
  const [savingSession, setSavingSession] = useState(false);

  // Add points modal
  const [showPoints, setShowPoints]   = useState(false);
  const [pointsForm, setPointsForm]   = useState({ type: 'earn', points: '', description: '' });
  const [savingPoints, setSavingPoints] = useState(false);

  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/loyalty/clients/${id}`);
      const d = await r.json();
      if (!r.ok) { setError(d.error ?? 'Not found'); setLoading(false); return; }
      setClient(d.client);
      setSessions(d.sessions ?? []);
      setTxns(d.transactions ?? []);
    } catch { setError('Network error.'); }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startEdit = () => {
    if (!client) return;
    setEditForm({ ...client });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!client) return;
    setSavingEdit(true);
    const r = await fetch(`/api/admin/loyalty/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const d = await r.json();
    if (r.ok) { setClient(d.client); setEditing(false); }
    setSavingEdit(false);
  };

  const addSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSession(true);
    const r = await fetch(`/api/admin/loyalty/clients/${id}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...sessionForm, amountPaid: parseInt(sessionForm.amountPaid) || 0 }),
    });
    if (r.ok) {
      setShowSession(false);
      setSessionForm({ sessionDate: '', sessionType: '', status: 'completed', staffName: '', notes: '', amountPaid: '' });
      fetchData();
    }
    setSavingSession(false);
  };

  const addPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPoints(true);
    const r = await fetch(`/api/admin/loyalty/clients/${id}/points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pointsForm, points: parseInt(pointsForm.points) }),
    });
    if (r.ok) {
      setShowPoints(false);
      setPointsForm({ type: 'earn', points: '', description: '' });
      fetchData();
    }
    setSavingPoints(false);
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin" style={{ color: GOLD }} />
      </div>
    </AdminLayout>
  );

  if (error || !client) return (
    <AdminLayout>
      <div className="p-8 text-center" style={{ color: SAGE }}>
        <p>{error || 'Client not found.'}</p>
        <Link to="/admin/loyalty" className="text-sm underline mt-2 inline-block" style={{ color: NAVY }}>
          ← Back to Loyalty
        </Link>
      </div>
    </AdminLayout>
  );

  const tierCfg = TIER_CFG[client.tier] ?? TIER_CFG.glow;
  const TierIcon = tierCfg.icon;
  const jodValue = (client.pointsBalance / 100 * 5).toFixed(1);

  return (
    <AdminLayout>
      <Helmet>
        <title>{client.name} — Loyalty Profile | ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/loyalty"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: SAGE }}>
            <ArrowLeft size={14} /> Loyalty Clients
          </Link>
        </div>

        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden shadow-sm mb-6"
          style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.1)' }}>

          {/* Top bar */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ background: NAVY }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: 'rgba(196,168,130,0.2)', color: GOLD, fontFamily: 'var(--font-heading)' }}>
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>
                  {client.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                    style={{ background: tierCfg.bg, color: tierCfg.text }}>
                    <TierIcon size={10} /> {tierCfg.label}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={startEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: '1px solid rgba(196,168,130,0.3)' }}>
              <Edit2 size={13} /> Edit Profile
            </button>
          </div>

          {/* Points summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0"
            style={{ borderTop: '1px solid rgba(14,42,58,0.08)' }}>
            {[
              { label: 'Points Balance', value: client.pointsBalance.toLocaleString(), sub: `= ${jodValue} JOD`, color: NAVY },
              { label: 'Total Earned',   value: client.pointsEarnedTotal.toLocaleString(), sub: 'lifetime', color: '#16a34a' },
              { label: 'Total Redeemed', value: client.pointsRedeemedTotal.toLocaleString(), sub: 'lifetime', color: '#d97706' },
              { label: 'Sessions',       value: client.visits.toString(), sub: 'completed', color: NAVY },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="px-5 py-4 text-center">
                <p className="text-xs font-medium mb-1" style={{ color: SAGE }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: SAGE }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t"
            style={{ borderColor: 'rgba(14,42,58,0.08)' }}>
            {[
              { icon: Phone,    label: 'Phone',    value: client.phone },
              { icon: Mail,     label: 'Email',    value: client.email || '—' },
              { icon: MapPin,   label: 'Area',     value: client.area || '—' },
              { icon: Calendar, label: 'DOB',      value: client.dateOfBirth || '—' },
              { icon: MapPin,   label: 'Address',  value: client.address || '—' },
              { icon: Calendar, label: 'Member since', value: new Date(client.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon size={13} className="mt-0.5 shrink-0" style={{ color: SAGE }} />
                <div>
                  <span className="text-xs font-medium" style={{ color: SAGE }}>{label}: </span>
                  <span className="text-sm" style={{ color: NAVY }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sessions + Points side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Sessions */}
          <div className="rounded-2xl overflow-hidden shadow-sm"
            style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.08)' }}>
              <h2 className="font-bold text-base" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                Sessions
              </h2>
              <button onClick={() => setShowSession(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: NAVY, color: '#fff' }}>
                <Plus size={12} /> Add Session
              </button>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {sessions.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: SAGE }}>No sessions yet.</p>
              ) : sessions.map(s => {
                const sc = SESSION_STATUS[s.status] ?? SESSION_STATUS.pending;
                const SIcon = sc.icon;
                return (
                  <div key={s.id} className="px-5 py-3.5 flex items-start gap-3">
                    <SIcon size={15} className="mt-0.5 shrink-0" style={{ color: sc.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: NAVY }}>{s.sessionType}</p>
                      <p className="text-xs mt-0.5" style={{ color: SAGE }}>
                        {s.sessionDate}
                        {s.staffName && ` · ${s.staffName}`}
                        {s.amountPaid > 0 && ` · ${s.amountPaid} JOD`}
                      </p>
                      {s.notes && <p className="text-xs mt-1 italic" style={{ color: SAGE }}>{s.notes}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize shrink-0"
                      style={{ background: `${sc.color}15`, color: sc.color }}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points history */}
          <div className="rounded-2xl overflow-hidden shadow-sm"
            style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.08)' }}>
              <h2 className="font-bold text-base" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                Points History
              </h2>
              <button onClick={() => setShowPoints(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: NAVY, color: '#fff' }}>
                <Coins size={12} /> Adjust Points
              </button>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: SAGE }}>No transactions yet.</p>
              ) : transactions.map(t => {
                const isPositive = t.points > 0;
                return (
                  <div key={t.id} className="px-5 py-3.5 flex items-start gap-3">
                    {isPositive
                      ? <TrendingUp size={15} className="mt-0.5 shrink-0 text-green-600" />
                      : <TrendingDown size={15} className="mt-0.5 shrink-0 text-red-500" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: NAVY }}>
                        {t.description || t.type}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: SAGE }}>
                        {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {t.adminBy && ` · by ${t.adminBy}`}
                      </p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{t.points.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.6)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.1)', background: NAVY }}>
              <h2 className="font-bold text-base" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>
                Edit Client Profile
              </h2>
              <button onClick={() => setEditing(false)} className="opacity-60 hover:opacity-100">
                <X size={18} style={{ color: GOLD }} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {([
                ['name', 'Full Name', 'text'],
                ['phone', 'Phone', 'tel'],
                ['email', 'Email', 'email'],
                ['dateOfBirth', 'Date of Birth', 'date'],
                ['area', 'Area', 'text'],
                ['address', 'Address', 'text'],
                ['skinType', 'Skin Type', 'text'],
              ] as [keyof LoyaltyClient, string, string][]).map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>{label}</label>
                  <input type={type} value={(editForm[key] as string) ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Status</label>
                  <select value={editForm.status ?? 'active'}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                    style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Tier</label>
                  <select value={editForm.tier ?? 'glow'}
                    onChange={e => setEditForm(f => ({ ...f, tier: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                    style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                    <option value="glow">Glow</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Notes</label>
                <textarea value={(editForm.notes as string) ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2 resize-none"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50"
                style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>Cancel</button>
              <button onClick={saveEdit} disabled={savingEdit}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: NAVY, color: '#fff' }}>
                {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {savingEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.6)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.1)', background: NAVY }}>
              <h2 className="font-bold text-base" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>
                Add Session
              </h2>
              <button onClick={() => setShowSession(false)} className="opacity-60 hover:opacity-100">
                <X size={18} style={{ color: GOLD }} />
              </button>
            </div>
            <form onSubmit={addSession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Date *</label>
                <input type="date" required value={sessionForm.sessionDate}
                  onChange={e => setSessionForm(f => ({ ...f, sessionDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Service / Session Type *</label>
                <select required value={sessionForm.sessionType}
                  onChange={e => setSessionForm(f => ({ ...f, sessionType: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                  <option value="">Select service…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Status</label>
                  <select value={sessionForm.status}
                    onChange={e => setSessionForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                    style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Amount Paid (JOD)</label>
                  <input type="number" min="0" value={sessionForm.amountPaid}
                    onChange={e => setSessionForm(f => ({ ...f, amountPaid: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Staff Name</label>
                <input type="text" value={sessionForm.staffName}
                  onChange={e => setSessionForm(f => ({ ...f, staffName: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Notes</label>
                <textarea value={sessionForm.notes}
                  onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none"
                  style={{ borderColor: 'rgba(14,42,58,0.2)' }}
                />
              </div>
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: CREAM, color: SAGE }}>
                Points are auto-awarded for completed sessions with payment (based on tier multiplier).
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSession(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>Cancel</button>
                <button type="submit" disabled={savingSession}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: NAVY, color: '#fff' }}>
                  {savingSession ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {savingSession ? 'Saving…' : 'Add Session'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {showPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.6)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.1)', background: NAVY }}>
              <h2 className="font-bold text-base" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>
                Adjust Points
              </h2>
              <button onClick={() => setShowPoints(false)} className="opacity-60 hover:opacity-100">
                <X size={18} style={{ color: GOLD }} />
              </button>
            </div>
            <form onSubmit={addPoints} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Type</label>
                <select value={pointsForm.type}
                  onChange={e => setPointsForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                  <option value="earn">Earn (add points)</option>
                  <option value="redeem">Redeem (deduct points)</option>
                  <option value="bonus">Bonus</option>
                  <option value="adjust">Manual Adjust</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Points *</label>
                <input type="number" required min="1" value={pointsForm.points}
                  onChange={e => setPointsForm(f => ({ ...f, points: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Reason / Description</label>
                <input type="text" value={pointsForm.description}
                  onChange={e => setPointsForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Birthday bonus, referral reward…"
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPoints(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>Cancel</button>
                <button type="submit" disabled={savingPoints}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: NAVY, color: '#fff' }}>
                  {savingPoints ? <Loader2 size={14} className="animate-spin" /> : <Coins size={14} />}
                  {savingPoints ? 'Saving…' : 'Apply'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
