import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Users, Mail, MousePointerClick, TrendingUp,
  RefreshCw, Eye, Send, CheckCircle, AlertCircle, Clock,
} from 'lucide-react';
import type { AnalyticsStats } from '../server/analytics/store';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const },
  }),
};

function StatCard({
  icon: Icon, label, value, sub, color = TAUPE, i = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  i?: number;
}) {
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
      style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)', boxShadow: '0 2px 12px rgba(61,46,38,0.05)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(20 15% 55%)' }}>{label}</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{sub}</p>}
    </motion.div>
  );
}

function EmailRow({
  label, seq, data, i,
}: {
  label: string;
  seq: string;
  data: { sent: number; clicks: number; ctr: number };
  i: number;
}) {
  return (
    <motion.tr
      custom={i}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="border-b last:border-0"
      style={{ borderColor: 'rgba(61,46,38,0.07)' }}
    >
      <td className="py-3.5 pr-4">
        <span className="text-sm font-medium" style={{ color: TAUPE }}>{label}</span>
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>{seq}</span>
      </td>
      <td className="py-3.5 px-4 text-sm text-center" style={{ color: 'hsl(20 15% 40%)' }}>{data.sent}</td>
      <td className="py-3.5 px-4 text-sm text-center" style={{ color: 'hsl(20 15% 40%)' }}>{data.clicks}</td>
      <td className="py-3.5 pl-4 text-sm text-center font-semibold" style={{ color: data.ctr > 0 ? GOLD : 'hsl(20 15% 55%)' }}>
        {data.ctr}%
      </td>
    </motion.tr>
  );
}

export default function NewsletterAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter/analytics', {
        headers: { 'x-sequence-secret': '' }, // No secret needed in dev
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as AnalyticsStats;
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load analytics. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchStats(); }, [fetchStats]);

  const eventIcon = (type: string) => {
    switch (type) {
      case 'signup_success': return <CheckCircle size={13} style={{ color: '#22c55e' }} />;
      case 'signup_duplicate': return <AlertCircle size={13} style={{ color: '#f59e0b' }} />;
      case 'email_sent': return <Send size={13} style={{ color: GOLD }} />;
      case 'email_click': return <MousePointerClick size={13} style={{ color: '#6366f1' }} />;
      case 'form_view': return <Eye size={13} style={{ color: 'hsl(20 15% 55%)' }} />;
      case 'form_submit': return <Mail size={13} style={{ color: TAUPE }} />;
      default: return <Clock size={13} style={{ color: 'hsl(20 15% 55%)' }} />;
    }
  };

  const formatTs = (ts: string) =>
    new Date(ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Helmet>
        <title>Newsletter Analytics — ArtiZone</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ background: CREAM, minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div style={{ background: TAUPE }} className="py-8 sm:py-10">
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(201,169,110,0.7)' }}>Admin</p>
              <h1 className="font-bold text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Newsletter Analytics
              </h1>
            </div>
            <button
              onClick={() => void fetchStats()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(201,169,110,0.2)', color: GOLD }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
          {lastRefresh && (
            <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 mt-2">
              <p className="text-xs" style={{ color: 'rgba(249,245,240,0.35)' }}>
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
          {error && (
            <div className="mb-8 p-4 rounded-xl text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {loading && !stats && (
            <div className="flex items-center justify-center py-24">
              <RefreshCw size={28} className="animate-spin" style={{ color: GOLD }} />
            </div>
          )}

          {stats && (
            <>
              {/* ── Overview stats ─────────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
                <StatCard icon={Users}           label="Total Subscribers" value={stats.totalSubscribers}                                       color={GOLD}      i={0} />
                <StatCard icon={Eye}             label="Form Views"        value={stats.formViews}                                              color={TAUPE}     i={1} />
                <StatCard icon={TrendingUp}      label="Conversion Rate"   value={`${stats.conversionRate}%`} sub={`${stats.signupSuccesses} new signups`} color="#22c55e" i={2} />
                <StatCard icon={MousePointerClick} label="Total Clicks"    value={Object.values(stats.clicksByLabel).reduce((a, b) => a + b, 0)} color="#6366f1"  i={3} />
              </div>

              {/* ── Funnel ─────────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10">
                {[
                  { label: 'Form Views', value: stats.formViews, icon: Eye, color: 'hsl(20 15% 55%)' },
                  { label: 'Form Submits', value: stats.formSubmits, icon: Send, color: TAUPE },
                  { label: 'Successful Signups', value: stats.signupSuccesses, icon: CheckCircle, color: '#22c55e' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl p-5 flex items-center gap-4"
                    style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{item.label}</p>
                    </div>
                    {i < 2 && (
                      <div className="ml-auto text-lg font-light" style={{ color: 'hsl(20 15% 70%)' }}>→</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ── Email sequence performance ──────────────────────────────── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="rounded-2xl mb-10 overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)', boxShadow: '0 2px 12px rgba(61,46,38,0.05)' }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                  <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>
                    Email Sequence Performance
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full px-6">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(61,46,38,0.07)' }}>
                        {['Email', 'Sent', 'Clicks', 'CTR'].map((h) => (
                          <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider first:pl-6 last:pr-6" style={{ color: 'hsl(20 15% 55%)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="px-6">
                      <EmailRow label="Welcome"      seq="Immediate" data={stats.emails.welcome} i={0} />
                      <EmailRow label="Beauty Tips"  seq="Day 3"     data={stats.emails.day3}    i={1} />
                      <EmailRow label="Special Offer" seq="Day 7"    data={stats.emails.day7}    i={2} />
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* ── Clicks by CTA + Signups by day ─────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Clicks by label */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>
                      Clicks by CTA
                    </h2>
                  </div>
                  <div className="p-6">
                    {Object.keys(stats.clicksByLabel).length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'hsl(20 15% 60%)' }}>No clicks recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(stats.clicksByLabel)
                          .sort(([, a], [, b]) => b - a)
                          .map(([label, count]) => {
                            const max = Math.max(...Object.values(stats.clicksByLabel));
                            const pct = Math.round((count / max) * 100);
                            return (
                              <div key={label}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span style={{ color: TAUPE }}>{label}</span>
                                  <span className="font-semibold" style={{ color: GOLD }}>{count}</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(61,46,38,0.08)' }}>
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: GOLD }} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Signups by day */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={6}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>
                      Signups by Day
                    </h2>
                  </div>
                  <div className="p-6">
                    {stats.signupsByDay.length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'hsl(20 15% 60%)' }}>No signups recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.signupsByDay.slice(-10).map(({ date, count }) => {
                          const max = Math.max(...stats.signupsByDay.map((d) => d.count));
                          const pct = Math.round((count / max) * 100);
                          return (
                            <div key={date}>
                              <div className="flex justify-between text-xs mb-1">
                                <span style={{ color: TAUPE }}>{date}</span>
                                <span className="font-semibold" style={{ color: GOLD }}>{count}</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(61,46,38,0.08)' }}>
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: GOLD }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* ── Recent events feed ─────────────────────────────────────── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={7}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                  <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>
                    Recent Events <span className="font-normal text-xs ml-1" style={{ color: 'hsl(20 15% 55%)' }}>(last 50)</span>
                  </h2>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(61,46,38,0.06)' }}>
                  {stats.recentEvents.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: 'hsl(20 15% 60%)' }}>No events yet.</p>
                  ) : (
                    stats.recentEvents.map((ev) => (
                      <div key={ev.id} className="px-6 py-3 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">{eventIcon(ev.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold" style={{ color: TAUPE }}>{ev.type}</span>
                            {ev.emailSequence && (
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>{ev.emailSequence}</span>
                            )}
                            {ev.source && (
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(61,46,38,0.06)', color: 'hsl(20 15% 50%)' }}>{ev.source}</span>
                            )}
                          </div>
                          {ev.email && <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(20 15% 55%)' }}>{ev.email}</p>}
                          {ev.linkLabel && <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>→ {ev.linkLabel}</p>}
                        </div>
                        <span className="text-xs shrink-0" style={{ color: 'hsl(20 15% 65%)' }}>{formatTs(ev.ts)}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
