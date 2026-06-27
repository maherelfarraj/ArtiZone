import { useState, useEffect, useCallback } from 'react';
import { useAdminToken } from '@/lib/useAdminToken';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Send, Clock, CheckCircle, XCircle, RefreshCw,
  Plus, Mail, User, Scissors, Calendar, TrendingUp, X, Loader2,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { ReviewRequest, ReviewRequestStatus, ReviewRequestStats } from '../../server/review-requests/store';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

const STATUS_META: Record<ReviewRequestStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending:     { label: 'Pending',     bg: 'rgba(245,158,11,0.12)',  text: '#d97706', icon: Clock },
  sent:        { label: 'Sent',        bg: 'rgba(99,102,241,0.12)',  text: '#6366f1', icon: Mail },
  followed_up: { label: 'Followed Up', bg: 'rgba(14,165,233,0.12)', text: '#0ea5e9', icon: Send },
  completed:   { label: 'Reviewed',    bg: 'rgba(34,197,94,0.12)',  text: '#16a34a', icon: CheckCircle },
  cancelled:   { label: 'Cancelled',   bg: 'rgba(239,68,68,0.12)',  text: '#dc2626', icon: XCircle },
};

const SERVICES = [
  'Face & Skin Care', 'Laser Hair Removal', 'Body Slimming',
  'Nails & Foot Care', "Men's Grooming", 'Hair Removal', 'Other',
];

const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors`;
const inputStyle = { borderColor: 'rgba(61,46,38,0.15)', background: '#fff', color: TAUPE };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface NewRequestForm {
  clientName: string;
  clientEmail: string;
  service: string;
  staffName: string;
  serviceDate: string;
}

const emptyForm: NewRequestForm = {
  clientName: '', clientEmail: '', service: '', staffName: '',
  serviceDate: new Date().toISOString().split('T')[0],
};

export default function AdminReviewRequestsPage() {
  const { token, ready } = useAdminToken();
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [stats, setStats] = useState<ReviewRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReviewRequestStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewRequestForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/review-requests/admin', { headers: { 'x-admin-secret': token } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { requests: ReviewRequest[]; stats: ReviewRequestStats };
      setRequests(data.requests);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load review requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (ready) void fetchData(); }, [fetchData, ready]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError(''); setFormSuccess('');
    try {
      const res = await fetch('/api/review-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': token },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean; error?: string; emailSent?: boolean };
      if (res.ok && data.success) {
        setFormSuccess(data.emailSent
          ? `Review request sent to ${form.clientEmail}!`
          : `Request created (email queued — SMTP not configured).`);
        setForm(emptyForm);
        void fetchData();
        setTimeout(() => { setShowForm(false); setFormSuccess(''); }, 2500);
      } else {
        setFormError(data.error ?? 'Something went wrong.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: ReviewRequestStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/review-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': token },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const old = requests.find((r) => r.id === id)?.status ?? 'pending';
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      if (stats) {
        setStats((prev) => prev ? {
          ...prev,
          [old === 'followed_up' ? 'followedUp' : old]: Math.max(0, prev[old === 'followed_up' ? 'followedUp' : old as keyof ReviewRequestStats] as number - 1),
          [status === 'followed_up' ? 'followedUp' : status]: (prev[status === 'followed_up' ? 'followedUp' : status as keyof ReviewRequestStats] as number) + 1,
        } : prev);
      }
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <Helmet>
        <title>Review Requests — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/review-requests" />
      </Helmet>
      <AdminLayout>
        <div className="p-5 sm:p-8 max-w-screen-xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Review Requests
              </h1>
              <p className="text-sm mt-1" style={{ color: 'hsl(20 15% 55%)' }}>
                Send post-service review request emails to clients
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => void fetchData()} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: 'rgba(184,150,90,0.12)', color: GOLD }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: GOLD, color: '#fff' }}
              >
                <Plus size={14} />
                New Request
              </button>
            </div>
          </div>

          {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{error}</div>}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {[
                { label: 'Total',       value: stats.total,       color: TAUPE },
                { label: 'Pending',     value: stats.pending,     color: '#d97706' },
                { label: 'Sent',        value: stats.sent,        color: '#6366f1' },
                { label: 'Followed Up', value: stats.followedUp,  color: '#0ea5e9' },
                { label: 'Reviewed',    value: stats.completed,   color: '#16a34a' },
                { label: 'Conversion',  value: `${stats.conversionRate}%`, color: GOLD },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}>
                  <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'pending', 'sent', 'followed_up', 'completed', 'cancelled'] as const).map((f) => {
              const meta = f !== 'all' ? STATUS_META[f] : null;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all"
                  style={{ background: filter === f ? GOLD : 'rgba(61,46,38,0.08)', color: filter === f ? '#fff' : TAUPE }}
                >
                  {meta ? meta.label : 'All'}
                </button>
              );
            })}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-24"><RefreshCw size={28} className="animate-spin" style={{ color: GOLD }} /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(61,46,38,0.04)', border: '1.5px dashed rgba(61,46,38,0.12)' }}>
              <Mail size={28} className="mx-auto mb-3 opacity-30" style={{ color: TAUPE }} />
              <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>No review requests yet. Click "New Request" to send one.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((req, i) => {
                const meta = STATUS_META[req.status];
                const StatusIcon = meta.icon;
                return (
                  <motion.div key={req.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-2xl p-5 sm:p-6"
                    style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Top row */}
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: meta.bg, color: meta.text }}>
                            <StatusIcon size={11} />{meta.label}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>
                            {req.service}
                          </span>
                          {req.clicks > 0 && (
                            <span className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                              <TrendingUp size={10} />{req.clicks} click{req.clicks !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Client info */}
                        <div className="flex items-center gap-4 flex-wrap mb-2">
                          <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: TAUPE }}>
                            <User size={13} style={{ color: GOLD }} />{req.clientName}
                          </span>
                          <span className="text-sm" style={{ color: 'hsl(20 15% 50%)' }}>{req.clientEmail}</span>
                          {req.staffName && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
                              <Scissors size={11} />by {req.staffName}
                            </span>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: 'hsl(20 15% 60%)' }}>
                          <span className="flex items-center gap-1"><Calendar size={11} />Service: {formatDate(req.serviceDate)}</span>
                          <span>Created: {formatDate(req.createdAt)}</span>
                          {req.sentAt && <span>Sent: {formatDate(req.sentAt)}</span>}
                          {req.followUpSentAt && <span>Follow-up: {formatDate(req.followUpSentAt)}</span>}
                          {req.reviewedAt && <span className="font-semibold" style={{ color: '#16a34a' }}>Reviewed: {formatDate(req.reviewedAt)}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        {req.status !== 'completed' && (
                          <button onClick={() => void updateStatus(req.id, 'completed')} disabled={updating === req.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
                          >
                            <CheckCircle size={12} />Mark Reviewed
                          </button>
                        )}
                        {req.status !== 'cancelled' && req.status !== 'completed' && (
                          <button onClick={() => void updateStatus(req.id, 'cancelled')} disabled={updating === req.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}
                          >
                            <XCircle size={12} />Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── New Request Modal ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40" style={{ background: 'rgba(30,21,16,0.6)', backdropFilter: 'blur(4px)' }}
                onClick={() => setShowForm(false)}
              />
              <motion.div key="modal"
                initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[6vh] z-50 w-full sm:w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{ background: CREAM, boxShadow: '0 24px 64px rgba(30,21,16,0.3)' }}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                        Send Review Request
                      </h2>
                      <p className="text-sm mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                        An email will be sent to the client immediately.
                      </p>
                    </div>
                    <button onClick={() => setShowForm(false)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70 shrink-0 ml-4"
                      style={{ background: 'rgba(61,46,38,0.08)', color: TAUPE }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {formSuccess ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3 py-10 text-center"
                      >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)' }}>
                          <CheckCircle size={28} style={{ color: '#16a34a' }} />
                        </div>
                        <p className="font-semibold" style={{ color: TAUPE }}>{formSuccess}</p>
                      </motion.div>
                    ) : (
                      <motion.form key="form" onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Client Name *</label>
                            <input className={inputCls} style={inputStyle} type="text" value={form.clientName}
                              onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                              placeholder="e.g. Sara Al-Ahmad" required minLength={2}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Client Email *</label>
                            <input className={inputCls} style={inputStyle} type="email" value={form.clientEmail}
                              onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                              placeholder="client@email.com" required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Service *</label>
                            <select className={inputCls} style={{ ...inputStyle, appearance: 'none' }}
                              value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} required
                            >
                              <option value="">Select service…</option>
                              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Staff Name <span style={{ color: 'hsl(20 15% 65%)' }}>(optional)</span></label>
                            <input className={inputCls} style={inputStyle} type="text" value={form.staffName}
                              onChange={(e) => setForm((f) => ({ ...f, staffName: e.target.value }))}
                              placeholder="e.g. Nour"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Service Date</label>
                          <input className={inputCls} style={inputStyle} type="date" value={form.serviceDate}
                            onChange={(e) => setForm((f) => ({ ...f, serviceDate: e.target.value }))}
                          />
                        </div>

                        {formError && <p className="text-sm" style={{ color: '#dc2626' }}>{formError}</p>}

                        <div className="flex items-center gap-3 pt-2">
                          <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                            style={{ background: GOLD, color: '#fff' }}
                          >
                            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                            {submitting ? 'Sending…' : 'Send Review Request'}
                          </button>
                          <button type="button" onClick={() => setShowForm(false)}
                            className="px-4 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-70"
                            style={{ background: 'rgba(61,46,38,0.08)', color: TAUPE }}
                          >
                            Cancel
                          </button>
                        </div>

                        <p className="text-xs" style={{ color: 'hsl(20 15% 60%)' }}>
                          A follow-up email is sent automatically 3 days later if no review is received.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
}
