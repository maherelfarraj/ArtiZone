import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Users, Mail, Star, TrendingUp, Clock, CheckCircle,
  ArrowRight, RefreshCw, Send, MousePointerClick, Loader2,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { useAdminToken } from '@/lib/useAdminToken';
import type { AnalyticsStats } from '../../server/analytics/store';
import type { Review } from '../../server/reviews/store';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const },
  }),
};

interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgRating: number;
}

function MetricCard({
  icon: Icon, label, value, sub, color, href, i,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
  i: number;
}) {
  const inner = (
    <motion.div
      custom={i}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl p-5 flex flex-col gap-3 h-full transition-shadow hover:shadow-md"
      style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(20 15% 55%)' }}>{label}</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{sub}</p>}
      {href && (
        <div className="flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: GOLD }}>
          View details <ArrowRight size={12} />
        </div>
      )}
    </motion.div>
  );
  return href ? <Link to={href} className="block">{inner}</Link> : inner;
}

export default function AdminOverviewPage() {
  const { token, ready } = useAdminToken();
  const [newsletter, setNewsletter] = useState<AnalyticsStats | null>(null);
  const [reviewStats, setReviewStats] = useState<AdminStats | null>(null);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [testEmailState, setTestEmailState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const sendTestEmail = useCallback(async () => {
    setTestEmailState('sending');
    try {
      const res = await fetch('/api/admin/test-email', { method: 'POST' });
      setTestEmailState(res.ok ? 'ok' : 'error');
    } catch {
      setTestEmailState('error');
    }
    setTimeout(() => setTestEmailState('idle'), 5000);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [nlRes, rvRes] = await Promise.all([
        fetch('/api/newsletter/analytics', { headers: { 'x-sequence-secret': token } }),
        fetch('/api/reviews/admin', { headers: { 'x-admin-secret': token } }),
      ]);
      if (nlRes.ok) setNewsletter(await nlRes.json() as AnalyticsStats);
      if (rvRes.ok) {
        const d = await rvRes.json() as { reviews: Review[]; stats: AdminStats };
        setReviewStats(d.stats);
        setPendingReviews(d.reviews.filter((r) => r.status === 'pending').slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (ready) void fetchAll(); }, [ready, token]);

  const totalEmailClicks = newsletter
    ? Object.values(newsletter.clicksByLabel).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <>
      <Helmet>
        <title>Admin Overview — ArtiZone</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin" />
      </Helmet>
      <AdminLayout badges={{ reviews: reviewStats?.pending }}>
        <div className="p-5 sm:p-8 max-w-screen-xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Overview
              </h1>
              <p className="text-sm mt-1" style={{ color: 'hsl(20 15% 55%)' }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => void fetchAll()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(184,150,90,0.12)', color: GOLD }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw size={28} className="animate-spin" style={{ color: GOLD }} />
            </div>
          ) : (
            <>
              {/* ── Key metrics ──────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                  icon={Users} label="Subscribers" color={GOLD}
                  value={newsletter?.totalSubscribers ?? 0}
                  sub="Total newsletter subscribers"
                  href="/admin/newsletter" i={0}
                />
                <MetricCard
                  icon={TrendingUp} label="Conversion" color="#22c55e"
                  value={`${newsletter?.conversionRate ?? 0}%`}
                  sub={`${newsletter?.signupSuccesses ?? 0} new signups`}
                  href="/admin/newsletter" i={1}
                />
                <MetricCard
                  icon={Star} label="Avg Rating" color="#f59e0b"
                  value={reviewStats ? `${reviewStats.avgRating} ★` : '—'}
                  sub={`${reviewStats?.approved ?? 0} published reviews`}
                  href="/admin/reviews" i={2}
                />
                <MetricCard
                  icon={Clock} label="Pending Reviews" color="#d97706"
                  value={reviewStats?.pending ?? 0}
                  sub="Awaiting moderation"
                  href="/admin/reviews" i={3}
                />
              </div>

              {/* ── Secondary metrics ─────────────────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Mail,             label: 'Emails Sent',    value: (newsletter?.emails.welcome.sent ?? 0) + (newsletter?.emails.day3.sent ?? 0) + (newsletter?.emails.day7.sent ?? 0), color: TAUPE },
                  { icon: MousePointerClick, label: 'Email Clicks',   value: totalEmailClicks, color: '#6366f1' },
                  { icon: CheckCircle,       label: 'Reviews Live',   value: reviewStats?.approved ?? 0, color: '#22c55e' },
                  { icon: Send,              label: 'Form Submits',   value: newsletter?.formSubmits ?? 0, color: '#0ea5e9' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                  <motion.div
                    key={label}
                    custom={i + 4}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{value}</p>
                      <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Two-column: email funnel + pending reviews ─────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email sequence summary */}
                <motion.div
                  custom={8}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>Email Sequence</h2>
                    <Link to="/admin/newsletter" className="text-xs font-semibold flex items-center gap-1" style={{ color: GOLD }}>
                      Full stats <ArrowRight size={11} />
                    </Link>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(61,46,38,0.06)' }}>
                    {newsletter && [
                      { label: 'Welcome (Immediate)', data: newsletter.emails.welcome },
                      { label: 'Beauty Tips (Day 3)',  data: newsletter.emails.day3 },
                      { label: 'Special Offer (Day 7)', data: newsletter.emails.day7 },
                    ].map(({ label, data }) => (
                      <div key={label} className="flex items-center justify-between px-6 py-3.5">
                        <div>
                          <p className="text-sm font-medium" style={{ color: TAUPE }}>{label}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{data.sent} sent · {data.clicks} clicks</p>
                        </div>
                        <span
                          className="text-sm font-bold px-3 py-1 rounded-full"
                          style={{ background: data.ctr > 0 ? 'rgba(201,169,110,0.12)' : 'rgba(61,46,38,0.06)', color: data.ctr > 0 ? GOLD : 'hsl(20 15% 55%)' }}
                        >
                          {data.ctr}% CTR
                        </span>
                      </div>
                    ))}
                    {!newsletter && (
                      <p className="px-6 py-8 text-sm text-center" style={{ color: 'hsl(20 15% 60%)' }}>No data yet.</p>
                    )}
                  </div>
                </motion.div>

                {/* Pending reviews queue */}
                <motion.div
                  custom={9}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>
                      Pending Reviews
                      {(reviewStats?.pending ?? 0) > 0 && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#d97706', color: '#fff' }}>
                          {reviewStats?.pending}
                        </span>
                      )}
                    </h2>
                    <Link to="/admin/reviews" className="text-xs font-semibold flex items-center gap-1" style={{ color: GOLD }}>
                      Moderate <ArrowRight size={11} />
                    </Link>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(61,46,38,0.06)' }}>
                    {pendingReviews.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-10">
                        <CheckCircle size={24} style={{ color: '#22c55e', opacity: 0.5 }} />
                        <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>All caught up — no pending reviews.</p>
                      </div>
                    ) : (
                      pendingReviews.map((review) => (
                        <div key={review.id} className="px-6 py-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold" style={{ color: TAUPE }}>{review.name}</span>
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map((s) => (
                                    <Star key={s} size={11} fill={s <= review.rating ? GOLD : 'none'} stroke={s <= review.rating ? GOLD : 'rgba(61,46,38,0.2)'} strokeWidth={1.5} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs truncate" style={{ color: 'hsl(20 15% 50%)' }}>{review.body}</p>
                            </div>
                            {review.service && (
                              <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(201,169,110,0.1)', color: GOLD }}>
                                {review.service}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Email test card */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
                <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(196,168,130,0.20)' }}>
                  <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ background: '#fff' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(196,168,130,0.12)' }}>
                        <Mail size={16} style={{ color: GOLD }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: TAUPE }}>Email Notifications</p>
                        <p className="text-xs" style={{ color: 'rgba(14,42,58,0.50)' }}>
                          {testEmailState === 'ok'    ? '✅ Test email sent to info@artizonespa.com'
                          : testEmailState === 'error' ? '❌ Failed — check server logs'
                          : 'Verify booking emails reach info@artizonespa.com'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={sendTestEmail}
                      disabled={testEmailState === 'sending'}
                      className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ background: 'rgba(196,168,130,0.12)', color: GOLD, border: '1px solid rgba(196,168,130,0.25)' }}
                    >
                      {testEmailState === 'sending'
                        ? <><Loader2 size={12} className="animate-spin" /> Sending…</>
                        : <><Send size={12} /> Send Test</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
