/**
 * /client/dashboard — Client portal with Glow Points + Rewards Redemption
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Tag, MessageCircle, LogOut, ChevronRight, ArrowRight, User,
  Sparkles, Gift, TrendingUp, Star, Award, Crown, Zap, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, Lock, Unlock, PartyPopper, Copy, Check,
  RefreshCw, ChevronDown, Edit2, Save, X, Phone,
} from 'lucide-react';
import { useClientAuth } from '@/hooks/useClientAuth';

// ── Palette ───────────────────────────────────────────────────────────────────
const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const OLIVE = '#6B7260';
const CREAM = '#FDFAF6';
const PARCH = '#F7F3EE';

// ── Tier config — canonical: glow / silver / gold / platinum ─────────────────
const TIERS = {
  glow:     { label: 'Glow',     multiplier: '1×',    next: 'Silver',   nextPts: 2000,  color: '#C4A882', bg: 'rgba(196,168,130,0.12)', icon: Star },
  silver:   { label: 'Silver',   multiplier: '1.25×', next: 'Gold',     nextPts: 5000,  color: '#A8B8C8', bg: 'rgba(168,184,200,0.12)', icon: Sparkles },
  gold:     { label: 'Gold',     multiplier: '1.5×',  next: 'Platinum', nextPts: 10000, color: '#E8B86D', bg: 'rgba(232,184,109,0.12)', icon: Award },
  platinum: { label: 'Platinum', multiplier: '2×',    next: null,       nextPts: null,  color: '#B0C4DE', bg: 'rgba(176,196,222,0.12)', icon: Crown },
} as const;
type TierKey = keyof typeof TIERS;

// ── Rewards catalogue (must match backend REWARD_CATALOGUE) ───────────────────
interface Reward {
  id: string;
  title: string;
  subtitle: string;
  pts: number;
  category: 'skin' | 'body' | 'nails' | 'brows';
  icon: React.ElementType;
  highlight?: boolean;
}

const REWARDS_CATALOGUE: Reward[] = [
  { id: 'nail-polish-change',  title: 'Nail Polish Change',          subtitle: 'Any colour from our collection',       pts: 200,  category: 'nails', icon: Sparkles },
  { id: 'brow-shaping',        title: 'Brow Shaping Session',        subtitle: 'Precision threading or waxing',        pts: 300,  category: 'brows', icon: Star },
  { id: 'express-facial',      title: 'Express Facial (30 min)',     subtitle: 'A quick glow refresh add-on',          pts: 500,  category: 'skin',  icon: Gift,    highlight: true },
  { id: 'hydra-boost-mask',    title: 'Hydra-Boost Mask Add-On',     subtitle: 'Pair with any facial treatment',       pts: 750,  category: 'skin',  icon: Zap },
  { id: 'full-body-scrub',     title: 'Full Body Scrub',             subtitle: 'Exfoliating ritual, 45 minutes',       pts: 1200, category: 'body',  icon: Award },
  { id: 'signature-treatment', title: 'Full Signature Treatment',    subtitle: 'Our premium 60-min facial',            pts: 1500, category: 'skin',  icon: Crown,   highlight: true },
];

const CATEGORY_COLORS: Record<string, string> = {
  skin:  '#C4A882',
  body:  '#A8C5A0',
  nails: '#E8B86D',
  brows: '#B0C4DE',
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoyaltyData {
  enrolled: boolean;
  tier?: TierKey;
  pointsBalance?: number;
  pointsEarnedTotal?: number;
  pointsRedeemedTotal?: number;
  visits?: number;
  recentTransactions?: Transaction[];
}

interface Transaction {
  id: number;
  type: string;
  points: number;
  description?: string;
  createdAt: string;
}

interface Booking {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'requested' | 'completed' | 'declined' | 'no_show';
  createdAt: string;
}

interface RedemptionResult {
  code: string;
  reward: string;
  pointsSpent: number;
  newBalance: number;
  message: string;
}

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; label: string; bg: string; color: string }> = {
    confirmed:  { icon: <CheckCircle size={11} />, label: 'Confirmed',  bg: 'rgba(26,110,46,0.10)',   color: '#1a6e2e' },
    pending:    { icon: <AlertCircle size={11} />, label: 'Pending',    bg: 'rgba(196,168,130,0.15)', color: '#8B6914' },
    requested:  { icon: <AlertCircle size={11} />, label: 'Requested',  bg: 'rgba(196,168,130,0.15)', color: '#8B6914' },
    completed:  { icon: <CheckCircle size={11} />, label: 'Completed',  bg: 'rgba(14,42,58,0.10)',    color: '#0E2A3A' },
    cancelled:  { icon: <XCircle size={11} />,     label: 'Cancelled',  bg: 'rgba(220,60,60,0.10)',   color: '#c0392b' },
    declined:   { icon: <XCircle size={11} />,     label: 'Declined',   bg: 'rgba(220,60,60,0.10)',   color: '#c0392b' },
    no_show:    { icon: <AlertCircle size={11} />, label: 'No-show',    bg: 'rgba(120,80,200,0.10)',  color: '#5a2d9a' },
  };
  const cfg = map[status] ?? map.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Redeem Modal ──────────────────────────────────────────────────────────────
function RedeemModal({
  reward,
  pts,
  onClose,
  onConfirm,
  loading,
  result,
}: {
  reward: Reward;
  pts: number;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  result: RedemptionResult | null;
}) {
  const [codeCopied, setCodeCopied] = useState(false);
  const Icon = reward.icon;
  const catColor = CATEGORY_COLORS[reward.category];

  function copyCode() {
    if (!result) return;
    navigator.clipboard.writeText(result.code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 24px 64px rgba(14,42,58,0.25)' }}>

        {/* Accent top */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}88)` }} />

        <AnimatePresence mode="wait">
          {/* ── Confirm state ── */}
          {!result ? (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
                  Confirm Redemption
                </h2>
                <button onClick={onClose} disabled={loading}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                  style={{ background: 'rgba(14,42,58,0.06)' }}>
                  <XCircle size={16} style={{ color: OLIVE }} />
                </button>
              </div>

              {/* Reward preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl mb-5"
                style={{ background: `${catColor}12`, border: `1.5px solid ${catColor}30` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${catColor}20` }}>
                  <Icon size={22} style={{ color: catColor }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: NAVY }}>{reward.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: OLIVE }}>{reward.subtitle}</p>
                </div>
              </div>

              {/* Points summary */}
              <div className="rounded-2xl overflow-hidden mb-5"
                style={{ border: '1px solid rgba(14,42,58,0.08)' }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(14,42,58,0.06)' }}>
                  <span className="text-xs font-semibold" style={{ color: OLIVE }}>Cost</span>
                  <span className="text-sm font-bold" style={{ color: '#c0392b' }}>−{reward.pts.toLocaleString()} pts</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(14,42,58,0.06)' }}>
                  <span className="text-xs font-semibold" style={{ color: OLIVE }}>Current balance</span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{pts.toLocaleString()} pts</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-semibold" style={{ color: OLIVE }}>After redemption</span>
                  <span className="text-sm font-bold" style={{ color: GOLD }}>{(pts - reward.pts).toLocaleString()} pts</span>
                </div>
              </div>

              <p className="text-xs text-center mb-5" style={{ color: 'rgba(14,42,58,0.45)' }}>
                You'll receive a unique code to show at the clinic. Valid for 30 days.
              </p>

              <div className="flex gap-3">
                <button onClick={onClose} disabled={loading}
                  className="flex-1 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: 'rgba(14,42,58,0.06)', color: OLIVE }}>
                  Cancel
                </button>
                <button onClick={onConfirm} disabled={loading}
                  className="flex-1 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: NAVY, color: GOLD }}>
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Unlock size={14} />}
                  {loading ? 'Processing…' : 'Redeem Now'}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Success state ── */
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}
              className="p-7 text-center">

              {/* Confetti burst */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${GOLD}18`, border: `2px solid ${GOLD}40` }}>
                <PartyPopper size={28} style={{ color: GOLD }} />
              </motion.div>

              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
                Reward Unlocked!
              </h2>
              <p className="text-sm mb-5" style={{ color: OLIVE }}>{result.reward}</p>

              {/* Code block */}
              <div className="rounded-2xl p-5 mb-4"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(196,168,130,0.60)' }}>
                  Your Redemption Code
                </p>
                <p className="text-2xl font-bold tracking-widest mb-3"
                  style={{ color: GOLD, fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>
                  {result.code}
                </p>
                <button onClick={copyCode}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-80"
                  style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: '1px solid rgba(196,168,130,0.25)' }}>
                  {codeCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Code</>}
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                style={{ background: 'rgba(14,42,58,0.04)', border: '1px solid rgba(14,42,58,0.07)' }}>
                <span className="text-xs" style={{ color: OLIVE }}>New balance</span>
                <span className="text-sm font-bold" style={{ color: GOLD }}>{result.newBalance.toLocaleString()} pts</span>
              </div>

              <p className="text-xs mb-5" style={{ color: 'rgba(14,42,58,0.45)' }}>
                Show this code at the clinic reception. Valid for 30 days from today.
              </p>

              <div className="flex gap-3">
                <a href={`https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20a%20session%20to%20use%20my%20reward%20code%20${result.code}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: '#25D366', color: '#fff' }}>
                  <MessageCircle size={14} /> Book via WhatsApp
                </a>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: 'rgba(14,42,58,0.06)', color: OLIVE }}>
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Rewards Catalogue ─────────────────────────────────────────────────────────
function RewardsCatalogue({
  pts,
  onRedeem,
}: {
  pts: number;
  onRedeem: (reward: Reward) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'skin' | 'body' | 'nails' | 'brows'>('all');

  const filtered = REWARDS_CATALOGUE.filter(r => filter === 'all' || r.category === filter);

  return (
    <div>
      {/* Category filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['all', 'skin', 'body', 'nails', 'brows'] as const).map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: filter === cat ? NAVY : 'rgba(14,42,58,0.06)',
              color: filter === cat ? CREAM : OLIVE,
            }}>
            {cat === 'all' ? 'All Rewards' : cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((reward, i) => {
          const Icon = reward.icon;
          const canRedeem = pts >= reward.pts;
          const catColor = CATEGORY_COLORS[reward.category];
          const shortfall = reward.pts - pts;

          return (
            <motion.div key={reward.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden transition-all"
              style={{
                background: '#fff',
                border: canRedeem
                  ? (reward.highlight ? `2px solid ${catColor}60` : `1.5px solid ${catColor}35`)
                  : '1.5px solid rgba(14,42,58,0.07)',
                boxShadow: canRedeem ? `0 2px 16px ${catColor}18` : '0 1px 4px rgba(14,42,58,0.05)',
              }}>

              {/* Highlight badge */}
              {reward.highlight && canRedeem && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: catColor, color: '#fff' }}>
                  Popular
                </div>
              )}

              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: canRedeem ? catColor : 'rgba(14,42,58,0.08)' }} />

              <div className="flex items-center gap-4 pl-5 pr-4 py-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: canRedeem ? `${catColor}18` : 'rgba(14,42,58,0.05)' }}>
                  {canRedeem
                    ? <Icon size={20} style={{ color: catColor }} />
                    : <Lock size={16} style={{ color: 'rgba(14,42,58,0.25)' }} />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: canRedeem ? catColor : 'rgba(14,42,58,0.30)' }}>
                      {reward.pts.toLocaleString()} pts
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase"
                      style={{ background: `${CATEGORY_COLORS[reward.category]}18`, color: CATEGORY_COLORS[reward.category] }}>
                      {reward.category}
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-tight" style={{ color: canRedeem ? NAVY : 'rgba(14,42,58,0.50)' }}>
                    {reward.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: canRedeem ? OLIVE : 'rgba(14,42,58,0.30)' }}>
                    {reward.subtitle}
                  </p>
                  {!canRedeem && (
                    <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: 'rgba(14,42,58,0.35)' }}>
                      <TrendingUp size={9} /> {shortfall.toLocaleString()} more pts needed
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  {canRedeem ? (
                    <button onClick={() => onRedeem(reward)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                      style={{ background: NAVY, color: GOLD, boxShadow: `0 2px 8px rgba(14,42,58,0.20)` }}>
                      <Unlock size={11} /> Redeem
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(14,42,58,0.04)' }}>
                        <Lock size={14} style={{ color: 'rgba(14,42,58,0.20)' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar for locked rewards */}
              {!canRedeem && (
                <div className="px-5 pb-3">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(14,42,58,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${catColor}60, ${catColor}30)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, Math.round((pts / reward.pts) * 100))}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' as const, delay: i * 0.05 }} />
                  </div>
                  <p className="text-[9px] mt-1 text-right" style={{ color: 'rgba(14,42,58,0.30)' }}>
                    {Math.min(100, Math.round((pts / reward.pts) * 100))}% there
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Points History ────────────────────────────────────────────────────────────
function PointsHistory({ transactions }: { transactions?: Transaction[] }) {
  const [filter, setFilter] = useState<'all' | 'earn' | 'redeem'>('all');

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 rounded-2xl"
        style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
        <Zap size={24} className="mb-2" style={{ color: 'rgba(14,42,58,0.2)' }} />
        <p className="text-sm" style={{ color: OLIVE }}>No transactions yet</p>
      </div>
    );
  }

  const filtered = transactions.filter(t => {
    if (filter === 'earn') return t.points > 0;
    if (filter === 'redeem') return t.points < 0;
    return true;
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Filter size={12} style={{ color: OLIVE }} />
        {(['all', 'earn', 'redeem'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: filter === f ? NAVY : 'rgba(14,42,58,0.06)',
              color: filter === f ? CREAM : OLIVE,
            }}>
            {f === 'all' ? 'All' : f === 'earn' ? 'Earned' : 'Redeemed'}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)', boxShadow: '0 1px 4px rgba(14,42,58,0.05)' }}>
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-xs" style={{ color: OLIVE }}>No transactions match this filter</div>
        ) : (
          filtered.map((t, i, arr) => {
            const isEarn = t.points > 0;
            const isRedeem = t.type === 'redeem';
            return (
              <div key={t.id} className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(14,42,58,0.05)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: isRedeem ? 'rgba(176,196,222,0.15)' : isEarn ? 'rgba(196,168,130,0.12)' : 'rgba(107,114,96,0.10)' }}>
                    {isRedeem
                      ? <Gift size={13} style={{ color: '#B0C4DE' }} />
                      : isEarn
                        ? <Zap size={13} style={{ color: GOLD }} />
                        : <ChevronDown size={13} style={{ color: OLIVE }} />
                    }
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: NAVY }}>
                      {t.description || (isEarn ? 'Points earned' : 'Points redeemed')}
                    </p>
                    <p className="text-[10px]" style={{ color: 'rgba(14,42,58,0.40)' }}>
                      {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold"
                  style={{ color: isEarn ? GOLD : '#c0392b' }}>
                  {isEarn ? '+' : ''}{t.points.toLocaleString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Upcoming Appointments ─────────────────────────────────────────────────────
function UpcomingAppointments({ bookings }: { bookings: Booking[] }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = bookings
    .filter(b => b.date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 rounded-2xl"
        style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
        <Calendar size={28} className="mb-3" style={{ color: 'rgba(14,42,58,0.2)' }} />
        <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>No upcoming appointments</p>
        <p className="text-xs mb-4" style={{ color: OLIVE }}>Ready for your next treatment?</p>
        <Link to="/booking"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}>
          Book Now <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)', boxShadow: '0 1px 4px rgba(14,42,58,0.05)' }}>
      {upcoming.map((b, i, arr) => (
        <div key={b.id} className="flex items-start gap-3 px-4 py-4"
          style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(14,42,58,0.05)' : 'none' }}>
          <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
            style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}33` }}>
            <span className="text-[10px] font-bold uppercase" style={{ color: GOLD }}>
              {new Date(b.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
            </span>
            <span className="text-lg font-bold leading-none" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
              {new Date(b.date + 'T00:00:00').getDate()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: NAVY }}>{b.service}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-xs" style={{ color: OLIVE }}>
                <Clock size={10} /> {b.time}
              </span>
              <StatusBadge status={b.status} />
            </div>
          </div>
          <a href={`https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20confirm%20my%20appointment%20for%20${encodeURIComponent(b.service)}%20on%20${b.date}%20at%20${b.time}`}
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:opacity-80"
            style={{ background: '#25D36618', color: '#1a9e4e' }}>
            <MessageCircle size={11} /> Chat
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useClientAuth();

  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'appointments' | 'points'>('overview');

  // Redeem modal state
  const [redeemTarget, setRedeemTarget] = useState<Reward | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<RedemptionResult | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Cancel state
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', area: '', address: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/client/login', { state: { from: '/client/dashboard' } });
  }, [user, loading, navigate]);

  const fetchLoyalty = useCallback(() => {
    fetch('/api/client/loyalty', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setLoyalty(data))
      .catch(() => setLoyalty(null));
  }, []);

  const fetchBookings = useCallback(() => {
    fetch('/api/client/bookings', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setBookings(data?.bookings ?? []))
      .catch(() => setBookings([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchLoyalty();
    fetchBookings();
  }, [user, fetchLoyalty, fetchBookings]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: GOLD, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleCancel(apptId: number) {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(apptId);
    setCancelError(null);
    try {
      const res = await fetch(`/api/client/appointments/${apptId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error ?? 'Could not cancel. Please call us.');
      } else {
        // Optimistically update local state
        setBookings(prev => prev.map(b => b.id === apptId ? { ...b, status: 'cancelled' as const } : b));
      }
    } catch {
      setCancelError('Network error. Please try again.');
    } finally {
      setCancellingId(null);
    }
  }

  function openProfileEdit() {
    if (!user) return;
    setProfileForm({
      fullName: user.fullName ?? '',
      phone:    user.phone ?? '',
      area:     user.area ?? '',
      address:  (user as unknown as Record<string, unknown>).address as string ?? '',
    });
    setProfileError(null);
    setProfileSuccess(false);
    setEditingProfile(true);
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileError(null);
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error ?? 'Failed to save. Please try again.');
      } else {
        setProfileSuccess(true);
        setTimeout(() => {
          setEditingProfile(false);
          setProfileSuccess(false);
          // Refresh user data
          window.location.reload();
        }, 1200);
      }
    } catch {
      setProfileError('Network error. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  }

  function openRedeemModal(reward: Reward) {
    setRedeemTarget(reward);
    setRedeemResult(null);
    setRedeemError(null);
  }

  function closeRedeemModal() {
    if (redeemLoading) return;
    setRedeemTarget(null);
    setRedeemResult(null);
    setRedeemError(null);
    // Refresh loyalty data after a successful redemption
    fetchLoyalty();
  }

  async function confirmRedeem() {
    if (!redeemTarget) return;
    setRedeemLoading(true);
    setRedeemError(null);
    try {
      const res = await fetch('/api/client/loyalty/redeem', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: redeemTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(data.error ?? 'Redemption failed. Please try again.');
      } else {
        setRedeemResult(data as RedemptionResult);
        // Optimistically update local balance
        setLoyalty(prev => prev ? {
          ...prev,
          pointsBalance: data.newBalance,
          pointsRedeemedTotal: (prev.pointsRedeemedTotal ?? 0) + redeemTarget.pts,
        } : prev);
      }
    } catch {
      setRedeemError('Network error. Please try again.');
    } finally {
      setRedeemLoading(false);
    }
  }

  const tier = (loyalty?.tier ?? 'glow') as TierKey;
  const tierCfg = TIERS[tier] ?? TIERS.glow;
  const pts = loyalty?.pointsBalance ?? 0;
  const nextPts = tierCfg.nextPts;
  const TierIcon = tierCfg.icon;
  const prevTierPts: Record<TierKey, number> = { glow: 0, silver: 2000, gold: 5000, platinum: 10000 };
  const prev = prevTierPts[tier];
  const progressPct = nextPts ? Math.min(100, Math.round(((pts - prev) / (nextPts - prev)) * 100)) : 100;
  const ptsToNext = nextPts ? Math.max(0, nextPts - pts) : 0;

  const today = new Date().toISOString().split('T')[0];
  const upcomingCount = bookings.filter(b => b.date >= today && b.status !== 'cancelled').length;
  const unlockedCount = REWARDS_CATALOGUE.filter(r => pts >= r.pts).length;

  const TABS = [
    { key: 'overview' as const,      label: 'Overview' },
    { key: 'rewards' as const,       label: `Rewards${unlockedCount > 0 ? ` (${unlockedCount})` : ''}` },
    { key: 'appointments' as const,  label: `Visits${upcomingCount > 0 ? ` (${upcomingCount})` : ''}` },
    { key: 'points' as const,        label: 'Points' },
  ];

  return (
    <>
      <Helmet>
        <title>My Account — ArtiZone</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{ background: PARCH, minHeight: '100vh', paddingBottom: 64 }}>

        {/* ── Header ── */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 100%)` }}>
          <div className="max-w-2xl mx-auto px-5 py-5 flex items-center justify-between">
            <Link to="/">
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: '#C4A882', letterSpacing: '0.06em' }}>ArtiZone</span>
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ color: 'rgba(253,250,246,0.55)', border: '1px solid rgba(196,168,130,0.20)' }}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>

          {/* Welcome + tier badge */}
          <div className="max-w-2xl mx-auto px-5 pb-5">
            <motion.div variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(196,168,130,0.15)', border: '1.5px solid rgba(196,168,130,0.30)' }}>
                <User size={22} style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold truncate" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                    {user.fullName}
                  </h1>
                  {loyalty?.enrolled && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                      style={{ background: tierCfg.bg, border: `1px solid ${tierCfg.color}40` }}>
                      <TierIcon size={11} style={{ color: tierCfg.color }} />
                      <span className="text-[10px] font-bold" style={{ color: tierCfg.color }}>{tierCfg.label}</span>
                    </div>
                  )}
                </div>
                {loyalty?.enrolled && (
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(253,250,246,0.50)' }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>{pts.toLocaleString()}</span> Glow Points
                    {nextPts && <span> · {ptsToNext.toLocaleString()} to {tierCfg.next}</span>}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all relative whitespace-nowrap shrink-0"
                  style={{ color: activeTab === tab.key ? GOLD : 'rgba(253,250,246,0.45)' }}>
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: GOLD }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-2xl mx-auto px-5 pt-5">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>

                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-3 -mt-4 mb-6">
                  {[
                    { label: 'Book Session', icon: Calendar,      to: '/booking',        bg: GOLD,      fg: NAVY },
                    { label: 'View Offers',  icon: Tag,           to: '/special-offers', bg: OLIVE,     fg: CREAM },
                    { label: 'WhatsApp Us',  icon: MessageCircle, href: 'https://wa.me/962790412758?text=Hi%20ArtiZone!', bg: '#25D366', fg: '#fff' },
                  ].map(({ label, icon: Icon, to, href, bg, fg }) => {
                    const cls = "flex flex-col items-center gap-2 py-4 rounded-2xl text-center transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm";
                    const style = { background: bg, color: fg };
                    const inner = (<><Icon size={20} /><span className="text-xs font-bold">{label}</span></>);
                    return href
                      ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>
                      : <Link key={label} to={to!} className={cls} style={style}>{inner}</Link>;
                  })}
                </div>

                {/* Points card */}
                {loyalty?.enrolled && (
                  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
                    <div className="rounded-2xl p-5"
                      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 100%)`, boxShadow: '0 4px 20px rgba(14,42,58,0.18)' }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(196,168,130,0.65)' }}>Glow Points Balance</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold" style={{ color: CREAM, fontFamily: 'var(--font-heading)' }}>{pts.toLocaleString()}</span>
                            <span className="text-sm font-semibold" style={{ color: GOLD }}>pts</span>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab('rewards')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                          style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                          <Gift size={12} /> Redeem
                        </button>
                      </div>
                      {nextPts && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(196,168,130,0.55)' }}>
                              Progress to {tierCfg.next}
                            </span>
                            <span className="text-[10px]" style={{ color: 'rgba(253,250,246,0.40)' }}>
                              {pts.toLocaleString()} / {nextPts.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${tierCfg.color}, ${tierCfg.color}cc)` }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progressPct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut' as const, delay: 0.2 }} />
                          </div>
                          <p className="text-[10px] mt-1.5" style={{ color: 'rgba(253,250,246,0.35)' }}>
                            {ptsToNext.toLocaleString()} pts to {tierCfg.next}
                          </p>
                        </div>
                      )}
                      {!nextPts && (
                        <div className="flex items-center gap-2">
                          <Crown size={13} style={{ color: GOLD }} />
                          <span className="text-xs font-semibold" style={{ color: GOLD }}>Platinum — highest tier achieved!</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Unlocked rewards teaser */}
                {loyalty?.enrolled && unlockedCount > 0 && (
                  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
                    <button onClick={() => setActiveTab('rewards')}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${GOLD}18, ${GOLD}08)`, border: `1.5px solid ${GOLD}35` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${GOLD}20` }}>
                        <Unlock size={18} style={{ color: GOLD }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold" style={{ color: NAVY }}>
                          {unlockedCount} reward{unlockedCount > 1 ? 's' : ''} ready to redeem
                        </p>
                        <p className="text-xs" style={{ color: OLIVE }}>Tap to browse and claim your rewards</p>
                      </div>
                      <ChevronRight size={16} style={{ color: GOLD }} />
                    </button>
                  </motion.div>
                )}

                {/* Upcoming */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>Upcoming</h2>
                    {upcomingCount > 0 && (
                      <button onClick={() => setActiveTab('appointments')}
                        className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                        style={{ color: GOLD }}>
                        See all <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                  <UpcomingAppointments bookings={bookings} />
                </motion.div>

                {/* Account details */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>Account Details</h2>
                    <button onClick={openProfileEdit}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                      style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                      <Edit2 size={11} /> Edit
                    </button>
                  </div>
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.08)', boxShadow: '0 1px 4px rgba(14,42,58,0.05)' }}>
                    {[
                      { label: 'Full Name', value: user.fullName },
                      { label: 'Email',     value: user.email },
                      { label: 'Phone',     value: user.phone },
                      { label: 'Area',      value: user.area },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} className="flex items-center justify-between px-5 py-3.5"
                        style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(14,42,58,0.06)' : 'none' }}>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(14,42,58,0.45)' }}>{label}</span>
                        <span className="text-sm font-medium" style={{ color: NAVY }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* WhatsApp */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%20need%20help%20with%20my%20account"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:opacity-90"
                    style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.08)', boxShadow: '0 1px 4px rgba(14,42,58,0.05)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#25D36618' }}>
                      <MessageCircle size={18} style={{ color: '#25D366' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: NAVY }}>Contact Us on WhatsApp</p>
                      <p className="text-xs" style={{ color: OLIVE }}>Questions about your bookings or treatments?</p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'rgba(14,42,58,0.30)' }} />
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* ── REWARDS TAB ── */}
            {activeTab === 'rewards' && (
              <motion.div key="rewards" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>

                {loyalty?.enrolled ? (
                  <>
                    {/* Balance banner */}
                    <div className="flex items-center justify-between px-5 py-4 rounded-2xl mb-5 -mt-1"
                      style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)` }}>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(196,168,130,0.60)' }}>Available to spend</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold" style={{ color: CREAM, fontFamily: 'var(--font-heading)' }}>{pts.toLocaleString()}</span>
                          <span className="text-sm font-semibold" style={{ color: GOLD }}>pts</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: tierCfg.bg, border: `1px solid ${tierCfg.color}40` }}>
                        <TierIcon size={12} style={{ color: tierCfg.color }} />
                        <span className="text-xs font-bold" style={{ color: tierCfg.color }}>{tierCfg.label}</span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold mb-3" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                      Rewards Catalogue
                    </h2>
                    <RewardsCatalogue pts={pts} onRedeem={openRedeemModal} />

                    {/* Error */}
                    {redeemError && (
                      <div className="mt-4 px-4 py-3 rounded-xl flex items-center gap-2"
                        style={{ background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.20)' }}>
                        <AlertCircle size={14} style={{ color: '#c0392b' }} />
                        <p className="text-xs font-semibold" style={{ color: '#c0392b' }}>{redeemError}</p>
                      </div>
                    )}

                    <div className="mt-5 p-4 rounded-2xl text-center" style={{ background: PARCH, border: '1px solid rgba(196,168,130,0.15)' }}>
                      <p className="text-xs" style={{ color: OLIVE }}>100 pts = 5 JOD · Show your code at reception · Valid 30 days</p>
                      <Link to="/loyalty" className="inline-flex items-center gap-1 text-xs font-semibold mt-1 hover:opacity-70 transition-opacity"
                        style={{ color: GOLD }}>
                        Full rewards programme <ChevronRight size={11} />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 rounded-2xl -mt-1"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)` }}>
                    <Sparkles size={32} className="mb-3" style={{ color: GOLD }} />
                    <p className="text-sm font-bold mb-1" style={{ color: CREAM }}>Not enrolled in Glow Points</p>
                    <p className="text-xs mb-4" style={{ color: 'rgba(253,250,246,0.50)' }}>Join free and start earning on your next visit</p>
                    <Link to="/loyalty"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: GOLD, color: NAVY }}>
                      Learn About Rewards <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── APPOINTMENTS TAB ── */}
            {activeTab === 'appointments' && (
              <motion.div key="appointments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-4 -mt-1">
                  <h2 className="text-base font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>Your Appointments</h2>
                  <Link to="/booking"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
                    style={{ background: GOLD, color: NAVY }}>
                    + Book New
                  </Link>
                </div>

                {cancelError && (
                  <div className="mb-3 px-4 py-3 rounded-xl flex items-center gap-2"
                    style={{ background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.20)' }}>
                    <AlertCircle size={14} style={{ color: '#c0392b' }} />
                    <p className="text-xs font-semibold" style={{ color: '#c0392b' }}>{cancelError}</p>
                    <button onClick={() => setCancelError(null)} className="ml-auto"><X size={12} style={{ color: '#c0392b' }} /></button>
                  </div>
                )}

                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-2xl"
                    style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
                    <Calendar size={32} className="mb-3" style={{ color: 'rgba(14,42,58,0.2)' }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>No bookings yet</p>
                    <p className="text-xs mb-4" style={{ color: OLIVE }}>Book your first treatment today</p>
                    <Link to="/booking"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: GOLD, color: NAVY }}>
                      Book Now <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (() => {
                  const upcoming = bookings.filter(b => b.date >= today && !['cancelled', 'declined', 'no_show', 'completed'].includes(b.status));
                  const past = bookings.filter(b => b.date < today || ['cancelled', 'declined', 'no_show', 'completed'].includes(b.status));
                  return (
                    <div className="space-y-4">
                      {upcoming.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: OLIVE }}>Upcoming</p>
                          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
                            {upcoming.map((b, i, arr) => (
                              <div key={b.id} className="px-4 py-4"
                                style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(14,42,58,0.05)' : 'none' }}>
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                                    style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}33` }}>
                                    <span className="text-[10px] font-bold uppercase" style={{ color: GOLD }}>
                                      {new Date(b.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold leading-none" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                                      {new Date(b.date + 'T00:00:00').getDate()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-bold" style={{ color: NAVY }}>{b.service}</p>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                      <span className="flex items-center gap-1 text-xs" style={{ color: OLIVE }}>
                                        <Clock size={10} /> {b.time}
                                      </span>
                                      <StatusBadge status={b.status} />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3 flex-wrap">
                                  <a href={`https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20confirm%20my%20appointment%20for%20${encodeURIComponent(b.service)}%20on%20${b.date}%20at%20${b.time}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                                    style={{ background: '#25D36618', color: '#1a9e4e' }}>
                                    <MessageCircle size={11} /> Confirm via WhatsApp
                                  </a>
                                  <a href="tel:+962790412758"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                                    style={{ background: 'rgba(14,42,58,0.06)', color: NAVY }}>
                                    <Phone size={11} /> Call Clinic
                                  </a>
                                  {['requested', 'confirmed', 'pending'].includes(b.status) && (
                                    <button
                                      onClick={() => handleCancel(b.id)}
                                      disabled={cancellingId === b.id}
                                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                                      style={{ background: 'rgba(220,60,60,0.08)', color: '#c0392b' }}>
                                      {cancellingId === b.id
                                        ? <RefreshCw size={11} className="animate-spin" />
                                        : <XCircle size={11} />}
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {past.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: OLIVE }}>Past</p>
                          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
                            {past.slice(0, 8).map((b, i, arr) => (
                              <div key={b.id} className="flex items-center gap-3 px-4 py-3.5"
                                style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(14,42,58,0.05)' : 'none', opacity: 0.7 }}>
                                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0"
                                  style={{ background: 'rgba(14,42,58,0.05)' }}>
                                  <span className="text-[9px] font-bold uppercase" style={{ color: OLIVE }}>
                                    {new Date(b.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                                  </span>
                                  <span className="text-sm font-bold leading-none" style={{ color: NAVY }}>
                                    {new Date(b.date + 'T00:00:00').getDate()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate" style={{ color: NAVY }}>{b.service}</p>
                                  <span className="text-[10px]" style={{ color: OLIVE }}>{b.time}</span>
                                </div>
                                <StatusBadge status={b.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* ── POINTS TAB ── */}
            {activeTab === 'points' && (
              <motion.div key="points" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>

                {loyalty?.enrolled ? (
                  <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-3 mb-5 -mt-1">
                      {[
                        { label: 'Balance',  value: pts.toLocaleString(),                                  color: GOLD },
                        { label: 'Earned',   value: (loyalty.pointsEarnedTotal ?? 0).toLocaleString(),     color: '#1a9e4e' },
                        { label: 'Redeemed', value: (loyalty.pointsRedeemedTotal ?? 0).toLocaleString(),   color: OLIVE },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl p-4 text-center"
                          style={{ background: '#fff', border: '1px solid rgba(14,42,58,0.07)' }}>
                          <p className="text-xl font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: OLIVE }}>{label}</p>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-base font-bold mb-3" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>Transaction History</h2>
                    <PointsHistory transactions={loyalty.recentTransactions} />

                    <div className="mt-4 p-4 rounded-2xl text-center" style={{ background: PARCH, border: '1px solid rgba(196,168,130,0.15)' }}>
                      <p className="text-xs" style={{ color: OLIVE }}>
                        100 points = 5 JOD · Points expire 18 months after last visit
                      </p>
                      <Link to="/loyalty" className="inline-flex items-center gap-1 text-xs font-semibold mt-1 hover:opacity-70 transition-opacity"
                        style={{ color: GOLD }}>
                        Learn more about rewards <ChevronRight size={11} />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 rounded-2xl -mt-1"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)` }}>
                    <Sparkles size={32} className="mb-3" style={{ color: GOLD }} />
                    <p className="text-sm font-bold mb-1" style={{ color: CREAM }}>Not enrolled in Glow Points</p>
                    <p className="text-xs mb-4" style={{ color: 'rgba(253,250,246,0.50)' }}>Join free and start earning on your next visit</p>
                    <Link to="/loyalty"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: GOLD, color: NAVY }}>
                      Learn About Rewards <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Redeem Modal ── */}
      <AnimatePresence>
        {redeemTarget && (
          <RedeemModal
            reward={redeemTarget}
            pts={pts}
            onClose={closeRedeemModal}
            onConfirm={confirmRedeem}
            loading={redeemLoading}
            result={redeemResult}
          />
        )}
      </AnimatePresence>

      {/* ── Profile Edit Modal ── */}
      <AnimatePresence>
        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget && !profileSaving) setEditingProfile(false); }}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 24px 64px rgba(14,42,58,0.25)' }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD}88)` }} />
              <div className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>Edit Profile</h2>
                  <button onClick={() => setEditingProfile(false)} disabled={profileSaving}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                    style={{ background: 'rgba(14,42,58,0.06)' }}>
                    <X size={16} style={{ color: OLIVE }} />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Your full name' },
                    { label: 'Phone',     key: 'phone',    type: 'tel',  placeholder: '+962 7X XXX XXXX' },
                    { label: 'Area',      key: 'area',     type: 'text', placeholder: 'e.g. Abdoun, Sweifieh' },
                    { label: 'Address',   key: 'address',  type: 'text', placeholder: 'Street address (optional)' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: OLIVE }}>{label}</label>
                      <input
                        type={type}
                        value={profileForm[key as keyof typeof profileForm]}
                        onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        disabled={profileSaving}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all disabled:opacity-60"
                        style={{
                          background: 'rgba(14,42,58,0.04)',
                          border: '1.5px solid rgba(14,42,58,0.10)',
                          color: NAVY,
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = GOLD}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(14,42,58,0.10)'}
                      />
                    </div>
                  ))}
                </div>

                {profileError && (
                  <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
                    style={{ background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.20)' }}>
                    <AlertCircle size={13} style={{ color: '#c0392b' }} />
                    <p className="text-xs" style={{ color: '#c0392b' }}>{profileError}</p>
                  </div>
                )}

                {profileSuccess && (
                  <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
                    style={{ background: 'rgba(26,110,46,0.08)', border: '1px solid rgba(26,110,46,0.20)' }}>
                    <CheckCircle size={13} style={{ color: '#1a6e2e' }} />
                    <p className="text-xs font-semibold" style={{ color: '#1a6e2e' }}>Profile updated!</p>
                  </div>
                )}

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setEditingProfile(false)} disabled={profileSaving}
                    className="flex-1 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: 'rgba(14,42,58,0.06)', color: OLIVE }}>
                    Cancel
                  </button>
                  <button onClick={saveProfile} disabled={profileSaving}
                    className="flex-1 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: NAVY, color: GOLD }}>
                    {profileSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    {profileSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
