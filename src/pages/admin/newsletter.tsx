import { useState, useEffect, useCallback } from 'react';
import { useAdminToken } from '@/lib/useAdminToken';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Users, Mail, MousePointerClick, TrendingUp,
  RefreshCw, Eye, Send, CheckCircle, AlertCircle, Clock,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { AnalyticsStats } from '../../server/analytics/store';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const },
  }),
};

function StatCard({ icon: Icon, label, value, sub, color, i }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string; i: number;
}) {
  return (
    <motion.div custom={i} variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl p-5 flex flex-col gap-3"
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
    </motion.div>
  );
}

const eventIcon = (type: string) => {
  switch (type) {
    case 'signup_success':   return <CheckCircle size={13} style={{ color: '#22c55e' }} />;
    case 'signup_duplicate': return <AlertCircle size={13} style={{ color: '#f59e0b' }} />;
    case 'email_sent':       return <Send size={13} style={{ color: GOLD }} />;
    case 'email_click':      return <MousePointerClick size={13} style={{ color: '#6366f1' }} />;
    case 'form_view':        return <Eye size={13} style={{ color: 'hsl(20 15% 55%)' }} />;
    case 'form_submit':      return <Mail size={13} style={{ color: TAUPE }} />;
    default:                 return <Clock size={13} style={{ color: 'hsl(20 15% 55%)' }} />;
  }
};

export default function AdminNewsletterPage() {
  const { token, ready } = useAdminToken();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/newsletter/analytics', { headers: { 'x-sequence-secret': token } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStats(await res.json() as AnalyticsStats);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load analytics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (ready) void fetchStats(); }, [fetchStats, ready]);

  const totalClicks = stats ? Object.values(stats.clicksByLabel).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <Helmet>
        <title>Newsletter Analytics — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminLayout>
        <div className="p-5 sm:p-8 max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>Newsletter Analytics</h1>
              {lastRefresh && <p className="text-xs mt-1" style={{ color: 'hsl(20 15% 55%)' }}>Updated {lastRefresh.toLocaleTimeString()}</p>}
            </div>
            <button onClick={() => void fetchStats()} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(184,150,90,0.12)', color: GOLD }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{error}</div>}

          {loading && !stats && (
            <div className="flex items-center justify-center py-24"><RefreshCw size={28} className="animate-spin" style={{ color: GOLD }} /></div>
          )}

          {stats && (
            <>
              {/* Overview cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Users}            label="Subscribers"    value={stats.totalSubscribers}    color={GOLD}      i={0} />
                <StatCard icon={Eye}              label="Form Views"     value={stats.formViews}           color={TAUPE}     i={1} />
                <StatCard icon={TrendingUp}       label="Conversion"     value={`${stats.conversionRate}%`} sub={`${stats.signupSuccesses} signups`} color="#22c55e" i={2} />
                <StatCard icon={MousePointerClick} label="Total Clicks"  value={totalClicks}               color="#6366f1"   i={3} />
              </div>

              {/* Funnel */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Form Views',        value: stats.formViews,        icon: Eye,          color: 'hsl(20 15% 55%)' },
                  { label: 'Form Submits',       value: stats.formSubmits,      icon: Send,         color: TAUPE },
                  { label: 'Successful Signups', value: stats.signupSuccesses,  icon: CheckCircle,  color: '#22c55e' },
                ].map(({ label, value, icon: Icon, color }, i) => (
                  <motion.div key={label} custom={i + 4} variants={fadeUp} initial="hidden" animate="visible"
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{value}</p>
                      <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Email sequence table */}
              <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl mb-6 overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                  <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>Email Sequence Performance</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(61,46,38,0.07)' }}>
                        {['Email', 'Sent', 'Clicks', 'CTR'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(20 15% 55%)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Welcome',       seq: 'Immediate', data: stats.emails.welcome },
                        { label: 'Beauty Tips',   seq: 'Day 3',     data: stats.emails.day3 },
                        { label: 'Special Offer', seq: 'Day 7',     data: stats.emails.day7 },
                      ].map(({ label, seq, data }) => (
                        <tr key={label} className="border-b last:border-0" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                          <td className="px-6 py-3.5">
                            <span className="text-sm font-medium" style={{ color: TAUPE }}>{label}</span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>{seq}</span>
                          </td>
                          <td className="px-6 py-3.5 text-sm text-center" style={{ color: 'hsl(20 15% 40%)' }}>{data.sent}</td>
                          <td className="px-6 py-3.5 text-sm text-center" style={{ color: 'hsl(20 15% 40%)' }}>{data.clicks}</td>
                          <td className="px-6 py-3.5 text-sm text-center font-semibold" style={{ color: data.ctr > 0 ? GOLD : 'hsl(20 15% 55%)' }}>{data.ctr}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Clicks + signups by day */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Clicks by CTA */}
                <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>Clicks by CTA</h2>
                  </div>
                  <div className="p-6">
                    {Object.keys(stats.clicksByLabel).length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'hsl(20 15% 60%)' }}>No clicks recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(stats.clicksByLabel).sort(([, a], [, b]) => b - a).map(([label, count]) => {
                          const max = Math.max(...Object.values(stats.clicksByLabel));
                          return (
                            <div key={label}>
                              <div className="flex justify-between text-xs mb-1">
                                <span style={{ color: TAUPE }}>{label}</span>
                                <span className="font-semibold" style={{ color: GOLD }}>{count}</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(61,46,38,0.08)' }}>
                                <div className="h-full rounded-full" style={{ width: `${Math.round((count / max) * 100)}%`, background: GOLD }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Signups by day */}
                <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible"
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid rgba(61,46,38,0.08)' }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>Signups by Day</h2>
                  </div>
                  <div className="p-6">
                    {stats.signupsByDay.length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'hsl(20 15% 60%)' }}>No signups recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.signupsByDay.slice(-10).map(({ date, count }) => {
                          const max = Math.max(...stats.signupsByDay.map((d) => d.count));
                          return (
                            <div key={date}>
                              <div className="flex justify-between text-xs mb-1">
                                <span style={{ color: TAUPE }}>{date}</span>
                                <span className="font-semibold" style={{ color: GOLD }}>{count}</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(61,46,38,0.08)' }}>
                                <div className="h-full rounded-full" style={{ width: `${Math.round((count / max) * 100)}%`, background: GOLD }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Recent events */}
              <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible"
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
                  ) : stats.recentEvents.map((ev) => (
                    <div key={ev.id} className="px-6 py-3 flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{eventIcon(ev.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: TAUPE }}>{ev.type}</span>
                          {ev.emailSequence && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}>{ev.emailSequence}</span>}
                          {ev.source && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(61,46,38,0.06)', color: 'hsl(20 15% 50%)' }}>{ev.source}</span>}
                        </div>
                        {ev.email && <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(20 15% 55%)' }}>{ev.email}</p>}
                        {ev.linkLabel && <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>→ {ev.linkLabel}</p>}
                      </div>
                      <span className="text-xs shrink-0" style={{ color: 'hsl(20 15% 65%)' }}>
                        {new Date(ev.ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
