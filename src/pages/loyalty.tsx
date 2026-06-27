/**
 * /loyalty — ArtiZone Rewards public page
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Star, Award, Crown, ChevronDown, ChevronUp,
  Phone, Check, Sparkles, Gift, Zap, Users, Share2, MessageCircle, Copy, CheckCircle,
} from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const NAVY   = '#0E2A3A';
const GOLD   = '#C4A882';
const SAGE   = '#6B7260';
const CREAM  = '#F7F3EE';
const IVORY  = '#FDFAF6';

const SITE_URL = 'https://artizonespa.com';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const } }),
};

// ── Tier data ──────────────────────────────────────────────────────────────────
const TIERS = [
  {
    key: 'glow',
    name: 'Glow',
    icon: Star,
    requirement: 'Join free on your first visit',
    rate: '1 Point / 1 JOD',
    accentTop: '#C4A882',
    accentText: '#7a5a10',
    perks: [
      'Birthday surprise gift',
      'Early access to promotions',
      'Member-only events',
      'Digital loyalty card',
      'Double Points Tuesdays',
    ],
  },
  {
    key: 'silver',
    name: 'Silver',
    icon: Award,
    requirement: '2,000+ points in 12 months',
    rate: '1.25 Points / 1 JOD',
    accentTop: '#A8B8C8',
    accentText: '#4a6070',
    perks: [
      '10% off every service',
      'Priority booking slots',
      'Quarterly free add-on treatment',
      'Friend referral bonuses',
      'All Glow perks included',
    ],
    featured: true,
  },
  {
    key: 'gold',
    name: 'Gold',
    icon: Sparkles,
    requirement: '5,000+ points in 12 months',
    rate: '1.5 Points / 1 JOD',
    accentTop: '#E8B86D',
    accentText: '#8B5e14',
    perks: [
      '15% off every service',
      'Free monthly express treatment',
      'VIP lounge access & events',
      'Dedicated concierge line',
      'All Silver perks included',
    ],
  },
  {
    key: 'platinum',
    name: 'Platinum',
    icon: Crown,
    requirement: 'By invitation — top clients',
    rate: '2 Points / 1 JOD',
    accentTop: '#A0A0A0',
    accentText: '#444',
    perks: [
      '20% off every service',
      'Unlimited free express treatments',
      'Private VIP suite access',
      'Personal beauty concierge',
      'All Luminous perks included',
    ],
  },
];

const STEPS = [
  { num: '1', title: 'Sign Up', body: 'Enroll free at reception or online in 30 seconds. No cards, no fees.', icon: Users },
  { num: '2', title: 'Earn Points', body: 'Collect points on every treatment, product, and package you purchase.', icon: Sparkles },
  { num: '3', title: 'Redeem', body: '100 points = 5 JOD. Use them anytime at checkout — no restrictions.', icon: Gift },
  { num: '4', title: 'Upgrade Tiers', body: 'Hit spending targets to unlock automatic tier perks and higher earn rates.', icon: Zap },
];

const FAQS = [
  {
    q: 'How do I join ArtiZone Rewards?',
    a: 'Simply ask our reception team on your next visit, or sign up via our website. It\'s completely free and takes less than a minute. You\'ll start earning points immediately on your first treatment.',
  },
  {
    q: 'When do my points expire?',
    a: 'Points expire 18 months after your last visit (earning or redemption). Just book one treatment per year to keep all your points active indefinitely.',
  },
  {
    q: 'Can I use points and my tier discount together?',
    a: 'Yes! Tier discounts (Gold 10%, Platinum 15%) apply automatically to every service. You can also redeem points on top for extra savings — stack them however you like.',
  },
  {
    q: 'What happens if I don\'t maintain my tier spend?',
    a: 'Tier status is reviewed every 12 months. If you don\'t meet the spend threshold, you\'ll move to the appropriate tier — but your points balance never disappears.',
  },
  {
    q: 'How do referrals work?',
    a: 'Refer a friend and both of you win. You get 200 bonus points when they complete their first paid visit. They get 10% off their first treatment. Bonus points are added within 48 hours.',
  },
  {
    q: 'Is there a Double Points day?',
    a: 'Yes — every Tuesday is Double Points day. Book any treatment on a Tuesday and earn 2× the standard points for your tier.',
  },
];

// ── Tier Progress Tracker ──────────────────────────────────────────────────────
const TIER_MILESTONES = [
  { key: 'glow',     label: 'Glow',     pts: 0,     icon: Star,     color: '#C4A882', desc: 'Join free' },
  { key: 'silver',   label: 'Silver',   pts: 2000,  icon: Award,    color: '#A8B8C8', desc: '2,000 pts' },
  { key: 'gold',     label: 'Gold',     pts: 5000,  icon: Sparkles, color: '#E8B86D', desc: '5,000 pts' },
  { key: 'platinum', label: 'Platinum', pts: 10000, icon: Crown,    color: '#B0C4DE', desc: '10,000 pts' },
];

function TierProgressTracker() {
  const [examplePts, setExamplePts] = useState(1200);

  const currentTierIdx = TIER_MILESTONES.reduce((acc, t, i) => examplePts >= t.pts ? i : acc, 0);
  const nextTier = TIER_MILESTONES[currentTierIdx + 1];
  const currentTier = TIER_MILESTONES[currentTierIdx];
  const progressPct = nextTier
    ? Math.min(100, Math.round(((examplePts - currentTier.pts) / (nextTier.pts - currentTier.pts)) * 100))
    : 100;

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl"
      style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)` }}>

      <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-1">
          <Zap size={18} style={{ color: GOLD }} />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
            Your Tier Journey
          </h2>
        </div>
        <p className="text-xs" style={{ color: SAGE }}>Drag the slider to see how quickly you progress</p>
      </div>

      <div className="px-8 py-7">
        {/* Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: SAGE }}>Points balance</span>
            <span className="text-lg font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
              {examplePts.toLocaleString()} pts
            </span>
          </div>
          <input type="range" min={0} max={12000} step={100} value={examplePts}
            onChange={e => setExamplePts(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: GOLD, background: `linear-gradient(to right, ${GOLD} ${(examplePts / 12000) * 100}%, rgba(196,168,130,0.2) ${(examplePts / 12000) * 100}%)` }} />
        </div>

        {/* Milestone track */}
        <div className="relative mb-8">
          {/* Track line */}
          <div className="absolute top-5 left-5 right-5 h-1 rounded-full" style={{ background: 'rgba(196,168,130,0.15)' }} />
          <motion.div className="absolute top-5 left-5 h-1 rounded-full"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD}aa)` }}
            animate={{ width: `calc(${Math.min(100, (examplePts / 10000) * 100)}% - 40px)` }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }} />

          {/* Milestones */}
          <div className="relative flex justify-between">
            {TIER_MILESTONES.map((tier, i) => {
              const Icon = tier.icon;
              const reached = examplePts >= tier.pts;
              const isCurrent = i === currentTierIdx;
              return (
                <div key={tier.key} className="flex flex-col items-center gap-2" style={{ width: '25%' }}>
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all"
                    animate={{
                      background: reached ? tier.color : 'rgba(196,168,130,0.12)',
                      scale: isCurrent ? 1.15 : 1,
                      boxShadow: isCurrent ? `0 0 0 4px ${tier.color}30` : 'none',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon size={16} style={{ color: reached ? '#fff' : 'rgba(14,42,58,0.25)' }} />
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center"
                    style={{ color: reached ? tier.color : 'rgba(14,42,58,0.30)' }}>
                    {tier.label}
                  </span>
                  <span className="text-[9px] text-center" style={{ color: 'rgba(14,42,58,0.35)' }}>{tier.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status card */}
        <div className="rounded-2xl px-6 py-5 text-center"
          style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)` }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {(() => { const Icon = currentTier.icon; return <Icon size={16} style={{ color: currentTier.color }} />; })()}
            <span className="text-sm font-bold" style={{ color: currentTier.color }}>{currentTier.label} Member</span>
          </div>
          {nextTier ? (
            <>
              <p className="text-xs mb-3" style={{ color: 'rgba(253,250,246,0.55)' }}>
                {(nextTier.pts - examplePts).toLocaleString()} more points to reach <strong style={{ color: nextTier.color }}>{nextTier.label}</strong>
              </p>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' as const }} />
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'rgba(253,250,246,0.35)' }}>{progressPct}% of the way to {nextTier.label}</p>
            </>
          ) : (
            <p className="text-xs" style={{ color: GOLD }}>You've reached the highest tier — Platinum!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Referral Section ───────────────────────────────────────────────────────────
function ReferralSection() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://artizonespa.com/loyalty';
  const waMsg = encodeURIComponent(`Hey! I've been going to ArtiZone beauty clinic in Amman and they have an amazing loyalty rewards program. Join using my link and get 10% off your first treatment! ${referralLink}`);

  function copyLink() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 100%)`, border: `1px solid rgba(196,168,130,0.2)` }}>

      <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'rgba(196,168,130,0.12)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(196,168,130,0.15)', border: `2px solid rgba(196,168,130,0.3)` }}>
          <Share2 size={22} style={{ color: GOLD }} />
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: IVORY }}>
          Refer a Friend, Earn Together
        </h2>
        <p className="text-sm" style={{ color: 'rgba(253,250,246,0.60)' }}>
          Share ArtiZone with someone you love — you both win.
        </p>
      </div>

      <div className="px-8 py-7">
        {/* Reward cards */}
        <div className="grid grid-cols-2 gap-4 mb-7">
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(196,168,130,0.10)', border: '1px solid rgba(196,168,130,0.2)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>200</div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Bonus Points</div>
            <div className="text-xs" style={{ color: 'rgba(253,250,246,0.50)' }}>for you when your friend completes their first visit</div>
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(196,168,130,0.10)', border: '1px solid rgba(196,168,130,0.2)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>10%</div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Off First Visit</div>
            <div className="text-xs" style={{ color: 'rgba(253,250,246,0.50)' }}>your friend gets a discount on their first treatment</div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-3">
          <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#25D366', color: '#fff' }}>
            <MessageCircle size={16} /> Share via WhatsApp
          </a>
          <button onClick={copyLink}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: '1px solid rgba(196,168,130,0.30)' }}>
            {copied ? <><CheckCircle size={16} /> Link Copied!</> : <><Copy size={16} /> Copy Referral Link</>}
          </button>
        </div>

        <p className="text-[10px] text-center mt-4" style={{ color: 'rgba(253,250,246,0.30)' }}>
          Bonus points are added within 48 hours of your friend's first paid visit.
        </p>
      </div>
    </motion.div>
  );
}


function PointsCalculator() {
  const [spend, setSpend] = useState(150);
  const [tier, setTier]   = useState('glow');

  const multipliers: Record<string, number> = { glow: 1, silver: 1.25, gold: 1.5, platinum: 2 };
  const pts = Math.floor(spend * (multipliers[tier] ?? 1));
  const jod = (pts / 100 * 5).toFixed(1);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="rounded-3xl shadow-xl max-w-2xl mx-auto overflow-hidden"
      style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)` }}>

      {/* Header strip */}
      <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-1">
          <Sparkles size={18} style={{ color: GOLD }} />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
            See Your Points Add Up
          </h2>
        </div>
        <p className="text-xs" style={{ color: SAGE }}>Adjust your spend and tier to see your rewards</p>
      </div>

      <div className="px-8 py-7">
        {/* Inputs row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
          <span className="text-sm font-medium" style={{ color: SAGE }}>I spend</span>
          <input
            type="number" min="0" value={spend}
            onChange={e => setSpend(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-28 text-center text-xl font-bold px-3 py-2.5 rounded-xl border-2 outline-none transition-colors"
            style={{ borderColor: `${GOLD}66`, color: NAVY }}
          />
          <span className="text-sm font-medium" style={{ color: SAGE }}>JOD per visit as a</span>
          <select value={tier} onChange={e => setTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl border-2 text-sm font-semibold outline-none cursor-pointer"
            style={{ borderColor: `${GOLD}66`, color: NAVY, background: '#fff' }}>
            <option value="glow">Glow member</option>
            <option value="silver">Silver member</option>
            <option value="gold">Gold member</option>
            <option value="platinum">Platinum member</option>
          </select>
        </div>

        {/* Result card */}
        <div className="rounded-2xl px-6 py-6 text-center" style={{ background: `linear-gradient(135deg, ${CREAM}, #f0ebe3)` }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: SAGE }}>You earn</p>
          <p className="font-bold leading-none mb-2" style={{ color: NAVY, fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem,6vw,3.5rem)' }}>
            {pts.toLocaleString()}
            <span className="text-lg font-normal ml-2" style={{ color: SAGE }}>points</span>
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mt-1 mb-3"
            style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44` }}>
            <span className="text-base font-bold" style={{ color: GOLD }}>= {jod} JOD back</span>
            <span className="text-xs" style={{ color: SAGE }}>on your next visit</span>
          </div>
          <p className="text-xs" style={{ color: SAGE }}>100 points = 5 JOD redeemable value · Points never expire with annual visits</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border transition-all"
      style={{ borderColor: open ? `${GOLD}44` : 'rgba(14,42,58,0.1)', background: '#fff' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-amber-50/40"
      >
        <span className="font-semibold text-sm pr-4" style={{ color: NAVY }}>{q}</span>
        {open ? <ChevronUp size={16} style={{ color: GOLD, flexShrink: 0 }} />
               : <ChevronDown size={16} style={{ color: SAGE, flexShrink: 0 }} />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: SAGE }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function LoyaltyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ArtiZone Rewards — Loyalty Program | Earn While You Glow',
    description: 'Join ArtiZone Rewards and earn points on every treatment. Glow, Radiant, Luminous & Platinum tiers with exclusive perks in Amman, Jordan.',
    url: `${SITE_URL}/loyalty`,
    publisher: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: SITE_URL,
    },
  };

  return (
    <>
      <Helmet>
        <title>ArtiZone Rewards — Earn While You Glow | Loyalty Program Amman</title>
        <meta name="description" content="Join ArtiZone Rewards — earn points on every treatment, unlock Glow, Radiant, Luminous & Platinum tier perks. Free to join at our Amman beauty clinic." />
        <link rel="canonical" href={`${SITE_URL}/loyalty`} />
        <meta property="og:title" content="ArtiZone Rewards — Earn While You Glow" />
        <meta property="og:description" content="Earn points on every treatment. Unlock exclusive perks. Because your loyalty deserves to be celebrated." />
        <meta property="og:image" content={`${SITE_URL}/airo-assets/images/pages/home/hero`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${SITE_URL}/loyalty`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artizone_clinic" />
        <meta name="twitter:title" content="ArtiZone Rewards — Earn While You Glow" />
        <meta name="twitter:description" content="Earn points on every treatment. Unlock exclusive perks. Free to join at ArtiZone Amman." />
        <meta name="twitter:image" content={`${SITE_URL}/airo-assets/images/pages/home/hero`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/loyalty`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/loyalty`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 sm:py-32"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 60%, #0a2030 100%)` }}>
        {/* Hero background image */}
        <OptimizedImage
          src="/airo-assets/images/services/loyalty-video"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          priority
          width={1920} height={700}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: GOLD, filter: 'blur(80px)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: GOLD, filter: 'blur(80px)' }} />

        <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: '1px solid rgba(196,168,130,0.3)' }}>
              <Sparkles size={11} /> New Program
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(2.2rem,6vw,4.5rem)', fontWeight: 400 }}>
            ArtiZone Rewards<br />
            <em style={{ color: GOLD, fontStyle: 'italic' }}>Earn While You Glow</em>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(253,250,246,0.72)' }}>
            Earn points on every treatment. Unlock exclusive perks. Because your loyalty deserves to be celebrated.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+962790412758"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: GOLD, color: NAVY, boxShadow: `0 8px 24px rgba(196,168,130,0.35)` }}>
              <Phone size={15} /> Call to Enroll: 07 9041 2758
            </a>
            <Link to="/booking"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: 'rgba(196,168,130,0.12)', color: GOLD, border: '1px solid rgba(196,168,130,0.3)' }}>
              Book a Treatment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8" style={{ background: IVORY }}>
        <PointsCalculator />
      </section>

      {/* ── TIER PROGRESS TRACKER ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8" style={{ background: CREAM }}>
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: SAGE }}>Your Progress</p>
            <h2 className="text-3xl sm:text-4xl font-normal mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              See How Fast You Climb
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: SAGE }}>
              Every treatment moves you closer to the next tier. Use the slider to explore your journey.
            </p>
          </motion.div>
          <TierProgressTracker />
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: CREAM }}>
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: SAGE }}>Membership Tiers</p>
            <h2 className="text-3xl sm:text-4xl font-normal mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Four Tiers. Endless Rewards.
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: SAGE }}>
              The more you visit, the more we give back. Upgrade automatically as you spend.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div key={tier.key} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className={`rounded-3xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${tier.featured ? 'ring-2' : ''}`}
                  style={{
                    background: '#fff',
                    border: tier.featured ? `2px solid ${GOLD}` : '1px solid rgba(14,42,58,0.1)',
                  }}>
                  {tier.featured && (
                    <div className="text-center py-2 text-xs font-bold uppercase tracking-widest"
                      style={{ background: GOLD, color: NAVY }}>
                      Most Popular
                    </div>
                  )}
                  {/* Top accent bar */}
                  <div className="h-1" style={{ background: tier.accentTop }} />

                  <div className="p-7 text-center border-b" style={{ borderColor: 'rgba(14,42,58,0.07)' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
                      style={{ background: `${tier.accentTop}22` }}>
                      <Icon size={28} style={{ color: tier.accentTop }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: tier.accentText }}>
                      {tier.name}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: SAGE }}>{tier.requirement}</p>
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                      style={{ background: `${tier.accentTop}18`, color: tier.accentText }}>
                      {tier.rate}
                    </span>
                  </div>

                  <ul className="p-7 space-y-3">
                    {tier.perks.map(perk => (
                      <li key={perk} className="flex items-start gap-3 text-sm" style={{ color: SAGE }}>
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: tier.accentTop }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: IVORY }}>
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: SAGE }}>Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-normal"
              style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.num} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="text-center">
                  {/* Numbered circle */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3d52)`, boxShadow: `0 4px 16px rgba(14,42,58,0.25)` }}>
                    <span className="text-2xl font-bold" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>{step.num}</span>
                  </div>
                  {/* Icon badge */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto -mt-3 mb-4 shadow-sm"
                    style={{ background: GOLD }}>
                    <Icon size={14} style={{ color: NAVY }} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: SAGE }}>{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── QUICK RULES ──────────────────────────────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8" style={{ background: CREAM }}>
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl p-8 sm:p-10" style={{ background: NAVY }}>
            <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
              Quick Rules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                '100 points = 5 JOD redeemable value',
                'Points expire 18 months after last visit',
                'Refer a friend = 200 bonus points',
                'Friend gets 10% off their first visit',
                'Double Points every Tuesday',
                'Points can stack with tier discounts',
              ].map(rule => (
                <div key={rule} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm" style={{ color: 'rgba(253,250,246,0.80)' }}>{rule}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: IVORY }}>
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-normal" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Common Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── REFERRAL ─────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8" style={{ background: CREAM }}>
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: SAGE }}>Referrals</p>
            <h2 className="text-3xl sm:text-4xl font-normal mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Share the Glow
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: SAGE }}>
              Invite a friend to ArtiZone and earn bonus points when they visit.
            </p>
          </motion.div>
          <ReferralSection />
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 60%, #0a2030 100%)` }}>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: GOLD, filter: 'blur(60px)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: GOLD, filter: 'blur(60px)' }} />

        <div className="relative max-w-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: `${GOLD}22`, border: `2px solid ${GOLD}44` }}>
              <Gift size={28} style={{ color: GOLD }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: IVORY }}>
              Ready to Start Earning?
            </h2>
            <p className="text-sm mb-2" style={{ color: 'rgba(253,250,246,0.65)' }}>
              Your first <strong style={{ color: GOLD }}>100 bonus points</strong> are on us when you sign up today.
            </p>
            <p className="text-xs mb-8" style={{ color: 'rgba(253,250,246,0.40)' }}>
              Free to join · No cards required · Points never expire with annual visits
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+962790412758"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: GOLD, color: NAVY, boxShadow: `0 8px 24px rgba(196,168,130,0.35)` }}>
                <Phone size={16} /> Call to Enroll: 07 9041 2758
              </a>
              <Link to="/booking"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-80"
                style={{ background: 'rgba(196,168,130,0.12)', color: GOLD, border: '1px solid rgba(196,168,130,0.3)' }}>
                Book Online
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
