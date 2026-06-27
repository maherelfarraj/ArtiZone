import { useState, useEffect, useCallback } from 'react';
import { useAdminToken } from '@/lib/useAdminToken';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Star, CheckCircle, XCircle, Clock, RefreshCw,
  ThumbsUp, ThumbsDown, RotateCcw, Filter,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Review, ReviewStatus } from '../../server/reviews/store';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

const STATUS_COLORS: Record<ReviewStatus, { bg: string; text: string; icon: React.ElementType }> = {
  pending:  { bg: 'rgba(245,158,11,0.12)',  text: '#d97706', icon: Clock },
  approved: { bg: 'rgba(34,197,94,0.12)',   text: '#16a34a', icon: CheckCircle },
  rejected: { bg: 'rgba(239,68,68,0.12)',   text: '#dc2626', icon: XCircle },
};

interface AdminStats {
  total: number; pending: number; approved: number; rejected: number; avgRating: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13} fill={s <= rating ? GOLD : 'none'} stroke={s <= rating ? GOLD : 'rgba(61,46,38,0.2)'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { token, ready } = useAdminToken();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/reviews/admin', { headers: { 'x-admin-secret': token } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { reviews: Review[]; stats: AdminStats };
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load reviews.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (ready) void fetchReviews(); }, [fetchReviews, ready]);

  const moderate = async (id: string, status: ReviewStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': token },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const old = reviews.find((r) => r.id === id)?.status ?? 'pending';
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status, moderatedAt: new Date().toISOString() } : r));
      setStats((prev) => prev ? { ...prev, [old]: prev[old] - 1, [status]: prev[status] + 1 } : prev);
    } catch {
      setError('Failed to update review. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Helmet>
        <title>Review Moderation — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/reviews" />
      </Helmet>
      <AdminLayout badges={{ reviews: stats?.pending }}>
        <div className="p-5 sm:p-8 max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>Review Moderation</h1>
              {stats && <p className="text-sm mt-1" style={{ color: 'hsl(20 15% 55%)' }}>{stats.total} total · {stats.pending} pending</p>}
            </div>
            <button onClick={() => void fetchReviews()} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(184,150,90,0.12)', color: GOLD }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{error}</div>}

          {/* Stats pills */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {[
                { label: 'Total',      value: stats.total,      color: TAUPE },
                { label: 'Pending',    value: stats.pending,    color: '#d97706' },
                { label: 'Approved',   value: stats.approved,   color: '#16a34a' },
                { label: 'Rejected',   value: stats.rejected,   color: '#dc2626' },
                { label: 'Avg Rating', value: `${stats.avgRating} ★`, color: GOLD },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all"
                style={{ background: filter === f ? GOLD : 'rgba(61,46,38,0.08)', color: filter === f ? '#fff' : TAUPE }}
              >
                <Filter size={12} className="inline mr-1.5 opacity-60" />
                {f}
                {f !== 'all' && stats && <span className="ml-1.5 opacity-70">({stats[f]})</span>}
              </button>
            ))}
          </div>

          {/* Reviews list */}
          {loading ? (
            <div className="flex items-center justify-center py-24"><RefreshCw size={28} className="animate-spin" style={{ color: GOLD }} /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(61,46,38,0.04)', border: '1.5px dashed rgba(61,46,38,0.12)' }}>
              <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>No {filter === 'all' ? '' : filter} reviews found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((review, i) => {
                const sc = STATUS_COLORS[review.status];
                const StatusIcon = sc.icon;
                return (
                  <motion.div key={review.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl p-5 sm:p-6"
                    style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <Stars rating={review.rating} />
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                            <StatusIcon size={11} />{review.status}
                          </span>
                          {review.service && (
                            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>{review.service}</span>
                          )}
                        </div>
                        {review.title && <p className="font-semibold text-sm mb-1" style={{ color: TAUPE }}>{review.title}</p>}
                        <p className="text-sm leading-relaxed mb-3" style={{ color: 'hsl(20 15% 40%)' }}>{review.body}</p>
                        <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
                          <span className="font-semibold" style={{ color: TAUPE }}>{review.name}</span>
                          {review.email && <span>{review.email}</span>}
                          <span>{formatDate(review.submittedAt)}</span>
                          {review.moderatedAt && <span>Moderated: {formatDate(review.moderatedAt)}</span>}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        {review.status !== 'approved' && (
                          <button onClick={() => void moderate(review.id, 'approved')} disabled={updating === review.id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
                          >
                            <ThumbsUp size={13} />Approve
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button onClick={() => void moderate(review.id, 'rejected')} disabled={updating === review.id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}
                          >
                            <ThumbsDown size={13} />Reject
                          </button>
                        )}
                        {review.status !== 'pending' && (
                          <button onClick={() => void moderate(review.id, 'pending')} disabled={updating === review.id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: 'rgba(61,46,38,0.08)', color: TAUPE }}
                          >
                            <RotateCcw size={13} />Reset
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
      </AdminLayout>
    </>
  );
}
