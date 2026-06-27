/**
 * GlowPointsWidget — Glow Points loyalty program widget.
 *
 * Two modes:
 *  1. `mode="demo"` (default) — static display showing tier journey.
 *  2. `mode="live"`           — phone/email lookup; fetches real balance
 *                               from /api/loyalty/balance.
 *
 * Used on homepage, /special-offers, /loyalty-rewards, /offers-deals.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Search, Phone, Loader2, AlertCircle, Zap, Crown, Gem, Sparkles } from 'lucide-react';

const GOLD  = '#C4A882';
const OLIVE = '#6B7260';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

/* ── Tier config ─────────────────────────────────────────────────────────── */
const TIERS = [
  { key: 'glow',     label: 'Glow',     pts: 0,      icon: Sparkles, color: OLIVE,     mult: '1×'    },
  { key: 'silver',   label: 'Silver',   pts: 2000,   icon: Star,     color: GOLD,      mult: '1.25×' },
  { key: 'gold',     label: 'Gold',     pts: 5000,   icon: Zap,      color: '#b8a9e0', mult: '1.5×'  },
  { key: 'platinum', label: 'Platinum', pts: 10000,  icon: Crown,    color: '#e8c97a', mult: '2×'    },
];

function getTier(pts: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (pts >= TIERS[i].pts) return TIERS[i];
  }
  return TIERS[0];
}

function getNextTier(pts: number) {
  for (const t of TIERS) {
    if (pts < t.pts) return t;
  }
  return null;
}

/* ── Live lookup ─────────────────────────────────────────────────────────── */
interface BalanceData {
  name: string;
  pointsBalance: number;
  tier: string;
  pointsEarnedTotal: number;
}

interface Props {
  /** Points to show in demo mode. Default: 1200 */
  demoPoints?: number;
  /** Dark background variant */
  dark?: boolean;
  /** Compact single-row layout for banners */
  compact?: boolean;
  /** live = real API lookup; demo = static display */
  mode?: 'live' | 'demo';
  /** @deprecated kept for backward compat — ignored */
  completed?: number;
}

/* ── Tier journey bar ────────────────────────────────────────────────────── */
function TierJourney({ pts, dark }: { pts: number; dark: boolean }) {
  const subCol  = dark ? 'rgba(253,250,246,0.50)' : 'rgba(14,42,58,0.55)';
  const trackBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(196,168,130,0.12)';
  const current = getTier(pts);
  const next    = getNextTier(pts);
  const pct     = next
    ? Math.min(100, ((pts - current.pts) / (next.pts - current.pts)) * 100)
    : 100;
  const toNext  = next ? next.pts - pts : 0;

  return (
    <>
      {/* Tier steps */}
      <div className="flex items-end gap-0 mb-4">
        {TIERS.map((tier, i) => {
          const reached  = pts >= tier.pts;
          const isCurrent = tier.key === current.key;
          const Icon = tier.icon;
          return (
            <div key={tier.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: reached ? `${tier.color}22` : trackBg,
                    border: `2px solid ${reached ? tier.color : 'rgba(196,168,130,0.18)'}`,
                    boxShadow: isCurrent ? `0 0 0 3px ${tier.color}30` : 'none',
                  }}
                >
                  <Icon size={15} style={{ color: reached ? tier.color : subCol }} />
                </motion.div>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-center whitespace-nowrap"
                  style={{ color: reached ? tier.color : subCol }}>
                  {tier.label}
                </span>
                <span className="text-[8px] text-center" style={{ color: subCol }}>
                  {tier.pts === 0 ? 'Start' : `${(tier.pts / 1000).toFixed(0)}k`}
                </span>
              </div>
              {i < TIERS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-6 rounded-full overflow-hidden" style={{ background: trackBg }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${OLIVE}, ${GOLD})` }}
                    initial={{ width: 0 }}
                    animate={{ width: pts >= TIERS[i + 1].pts ? '100%' : isCurrent ? `${pct}%` : '0%' }}
                    transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: trackBg }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${OLIVE}, ${GOLD})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' as const }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs" style={{ color: subCol }}>
          {next
            ? `${toNext.toLocaleString()} pts to ${next.label}`
            : 'Maximum tier reached — enjoy 2× points!'}
        </p>
        <span className="text-xs font-bold" style={{ color: GOLD }}>
          {pts.toLocaleString()} pts
        </span>
      </div>
    </>
  );
}

/* ── Live lookup form ────────────────────────────────────────────────────── */
function LiveLookup({ dark }: { dark: boolean }) {
  const [input, setInput]   = useState('');
  const [loading, setLoad]  = useState(false);
  const [data, setData]     = useState<BalanceData | null>(null);
  const [error, setError]   = useState('');

  const headCol    = dark ? 'rgba(253,250,246,0.92)' : TAUPE;
  const subCol     = dark ? 'rgba(253,250,246,0.50)' : 'rgba(14,42,58,0.55)';
  const inputBg    = dark ? 'rgba(255,255,255,0.06)' : '#fff';
  const inputBorder = dark ? 'rgba(196,168,130,0.25)' : 'rgba(196,168,130,0.35)';

  async function lookup() {
    const val = input.trim();
    if (!val) return;
    setLoad(true); setError(''); setData(null);
    const isEmail = val.includes('@');
    try {
      const res = await fetch('/api/loyalty/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: val } : { phone: val }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? 'Account not found.');
      else setData(json as BalanceData);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoad(false); }
  }

  return (
    <AnimatePresence mode="wait">
      {!data ? (
        <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <p className="text-xs mb-3" style={{ color: subCol }}>
            Enter your phone or email to check your Glow Points balance.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookup()}
                placeholder="Phone or email"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: headCol }}
              />
            </div>
            <button onClick={lookup} disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: OLIVE, color: CREAM }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Check
            </button>
          </div>
          {error && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 mt-3 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(196,168,130,0.10)', border: '1px solid rgba(196,168,130,0.20)' }}>
              <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
              <span style={{ color: subCol }}>{error}</span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {data.name && (
            <p className="text-sm font-semibold mb-4" style={{ color: GOLD }}>
              Welcome back, {data.name}!
            </p>
          )}
          <TierJourney pts={data.pointsBalance} dark={dark} />
          <div className="flex gap-2 mt-1">
            <Link to="/booking"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: OLIVE, color: CREAM }}>
              Book & Earn Points <ArrowRight size={14} />
            </Link>
            <button onClick={() => { setData(null); setInput(''); }}
              className="px-4 py-3 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: 'transparent', border: `1.5px solid rgba(196,168,130,0.30)`, color: subCol }}>
              Back
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function LoyaltyTracker({
  demoPoints = 1200,
  dark = false,
  compact = false,
  mode = 'demo',
}: Props) {
  const bg      = dark ? 'rgba(255,255,255,0.05)' : '#fff';
  const border  = dark ? 'rgba(196,168,130,0.20)' : 'rgba(196,168,130,0.22)';
  const headCol = dark ? 'rgba(253,250,246,0.92)' : TAUPE;
  const subCol  = dark ? 'rgba(253,250,246,0.50)' : 'rgba(14,42,58,0.55)';
  const trackBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(196,168,130,0.12)';
  const tier    = getTier(demoPoints);
  const next    = getNextTier(demoPoints);
  const pct     = next
    ? Math.min(100, ((demoPoints - tier.pts) / (next.pts - tier.pts)) * 100)
    : 100;

  /* ── Compact banner ─────────────────────────────────────────────────── */
  if (compact) {
    return (
      <div className="flex items-center gap-4 px-5 py-3 rounded-2xl"
        style={{ background: bg, border: `1.5px solid ${border}` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GOLD}22` }}>
          <Star size={16} style={{ color: GOLD }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: headCol }}>
            Glow Points — Earn 1 pt per 1 JOD spent
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${OLIVE}, ${GOLD})` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' as const }}
              />
            </div>
            <span className="text-[10px] font-semibold shrink-0" style={{ color: GOLD }}>
              {tier.label}
            </span>
          </div>
        </div>
        <Link to="/loyalty-rewards"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
          style={{ background: OLIVE, color: CREAM }}>
          View Rewards
        </Link>
      </div>
    );
  }

  /* ── Full card ──────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl p-6 sm:p-7"
      style={{ background: bg, border: `1.5px solid ${border}`, boxShadow: dark ? 'none' : '0 4px 24px rgba(14,42,58,0.07)' }}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GOLD}22` }}>
          <Star size={18} style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: OLIVE }}>
            Glow Points
          </p>
          <h3 className="font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: headCol, fontSize: '1.15rem' }}>
            Earn Points,{' '}
            <span style={{ color: GOLD }}>Unlock Rewards</span>
          </h3>
        </div>
      </div>

      {/* Earning rate pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-5 text-xs font-semibold"
        style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}30`, color: GOLD }}>
        <Zap size={12} />
        1 Glow Point per 1 JOD spent &nbsp;·&nbsp; Bonus points for referrals, reviews & off-peak visits
      </div>

      {/* Content — live lookup or static demo */}
      {mode === 'live' ? (
        <LiveLookup dark={dark} />
      ) : (
        <>
          <TierJourney pts={demoPoints} dark={dark} />
          {/* Tier multiplier hint */}
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: subCol }}>
            <Gem size={11} style={{ color: GOLD }} />
            <span>
              Current tier: <strong style={{ color: GOLD }}>{tier.label}</strong> ({tier.mult} points) &nbsp;·&nbsp;
              {next ? <>Next: <strong style={{ color: next.color }}>{next.label}</strong> at {next.pts.toLocaleString()} pts</> : 'Max tier reached!'}
            </span>
          </div>
          <Link to="/loyalty-rewards"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: OLIVE, color: CREAM }}>
            Explore All Rewards
            <ArrowRight size={14} />
          </Link>
        </>
      )}
    </div>
  );
}
