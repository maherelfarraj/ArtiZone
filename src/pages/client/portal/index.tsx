/**
 * /client/portal — Dashboard overview
 */
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  Star, Crown, Award,
  Sparkles, AlertCircle,
} from 'lucide-react';
import {
  DEMO_CUSTOMER, DEMO_LOYALTY, DEMO_BOOKINGS, DEMO_PACKAGES,
  BOOK_AGAIN_SERVICES, TIERS, TierKey,
} from '@/lib/client-portal-data';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const PARCH = '#F7F3EE';
const LINE  = 'rgba(196,168,130,0.18)';

const TIER_ICONS: Record<TierKey, React.ElementType> = {
  glow: Star, silver: Sparkles, gold: Award, platinum: Crown,
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' as const } }),
};

export default function ClientPortalDashboard() {
  const customer = DEMO_CUSTOMER;
  const loyalty  = DEMO_LOYALTY;
  const tier     = TIERS[loyalty.tier];
  const TierIcon = TIER_ICONS[loyalty.tier];
  const upcoming = DEMO_BOOKINGS.find(b => b.status === 'confirmed');
  const activePackage = DEMO_PACKAGES.find(p => p.status === 'active' || p.status === 'expiring');
  const tierProgress = tier.nextSpend
    ? Math.min(100, (loyalty.totalSpend / tier.nextSpend) * 100)
    : 100;

  return (
    <>
      <Helmet>
        <title>Dashboard — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            Customer Dashboard
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.6rem,3vw,2.2rem)', margin: '0 0 6px', fontWeight: 600 }}>
            Welcome back, {customer.firstName}
          </h1>
          <p style={{ color: SAGE, margin: 0, fontSize: 14 }}>
            Your beauty rewards, bookings, packages, and repeat visits in one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/booking" style={btnStyle('primary')}>Book Appointment</Link>
          <Link to="/client/portal/rewards" style={btnStyle('secondary')}>View Rewards</Link>
        </div>
      </div>

      {/* ── Expiry notice ──────────────────────────────────────────────── */}
      {loyalty.expiringPoints > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 18px', borderRadius: 16,
            background: '#fff8ef', border: '1px solid #ecd4b3',
            color: '#6c4b26', fontSize: 13, marginBottom: 22,
          }}>
          <AlertCircle size={16} style={{ flexShrink: 0, color: '#b06b1b' }} />
          You have <strong style={{ margin: '0 3px' }}>{loyalty.expiringPoints} points</strong> expiring soon
          {activePackage && <> and <strong style={{ margin: '0 3px' }}>{activePackage.totalSessions - activePackage.usedSessions} sessions</strong> remaining in your active package.</>}
        </motion.div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 22 }}>
        {/* Loyalty tier */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...cardStyle, borderTop: `3px solid ${tier.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ ...badgeStyle, background: tier.bg, color: tier.color }}>Loyalty Status</span>
            <TierIcon size={18} style={{ color: tier.color }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: NAVY, fontFamily: 'var(--font-heading)', margin: '4px 0 2px' }}>
            {tier.label} Member
          </div>
          <p style={{ color: SAGE, fontSize: 13, margin: '0 0 12px' }}>
            You earn {tier.multiplier} points on treatments.
          </p>
          {tier.nextTier && (
            <>
              <div style={{ height: 8, background: '#f1e8df', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${tierProgress}%`, background: `linear-gradient(90deg, ${tier.color}, #ddb081)`, borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>
              <p style={{ fontSize: 11, color: SAGE, margin: 0 }}>
                {tier.nextSpend! - loyalty.totalSpend} JOD to {TIERS[tier.nextTier!].label}
              </p>
            </>
          )}
        </motion.div>

        {/* Points wallet */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...cardStyle, borderTop: '3px solid #2f7d5c' }}>
          <span style={{ ...badgeStyle, background: '#e0f2e8', color: '#2f7d5c', marginBottom: 10, display: 'inline-block' }}>Points Wallet</span>
          <div style={{ fontSize: 36, fontWeight: 900, color: NAVY, fontFamily: 'var(--font-heading)', margin: '4px 0 4px' }}>
            {loyalty.points.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 600, color: SAGE }}>pts</span>
          </div>
          <p style={{ color: SAGE, fontSize: 13, margin: '0 0 14px' }}>
            Next reward: 500 pts = 25 JOD discount
          </p>
          <Link to="/client/portal/rewards" style={btnStyle('secondary')}>Redeem Points</Link>
        </motion.div>

        {/* Upcoming appointment */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...cardStyle, borderTop: `3px solid ${GOLD}` }}>
          <span style={{ ...badgeStyle, background: '#fff0dc', color: '#b06b1b', marginBottom: 10, display: 'inline-block' }}>Upcoming</span>
          {upcoming ? (
            <>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 16, margin: '4px 0 6px', fontWeight: 600 }}>
                {upcoming.service}
              </h3>
              <p style={{ color: SAGE, fontSize: 13, margin: '0 0 14px', lineHeight: 1.6 }}>
                {formatDate(upcoming.date)} · {upcoming.time}<br />
                Therapist: {upcoming.therapist} · Earn {upcoming.pointsEarned} pts
              </p>
              <Link to="/client/portal/bookings" style={btnStyle('secondary')}>Manage Booking</Link>
            </>
          ) : (
            <>
              <p style={{ color: SAGE, fontSize: 13, margin: '4px 0 14px' }}>No upcoming appointments.</p>
              <Link to="/booking" style={btnStyle('secondary')}>Book Now</Link>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Active package + Book again ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 22 }}>
        {/* Active package */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <h3 style={sectionHeading}>My Active Package</h3>
          {activePackage ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 15 }}>{activePackage.name}</p>
                  <p style={{ color: SAGE, fontSize: 12, margin: '2px 0 0' }}>
                    {activePackage.usedSessions} of {activePackage.totalSessions} used · {activePackage.totalSessions - activePackage.usedSessions} remaining
                  </p>
                </div>
                <span style={{ ...badgeStyle, background: activePackage.status === 'expiring' ? '#fff0dc' : '#e0f2e8', color: activePackage.status === 'expiring' ? '#b06b1b' : '#2f7d5c' }}>
                  {activePackage.status === 'expiring' ? 'Expiring Soon' : 'Active'}
                </span>
              </div>
              <div style={{ height: 8, background: '#f1e8df', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${(activePackage.usedSessions / activePackage.totalSessions) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, #ddb081)`, borderRadius: 99 }} />
              </div>
              <p style={{ color: SAGE, fontSize: 12, margin: '0 0 14px' }}>Expires: {activePackage.expiry}</p>
              <Link to="/client/portal/packages" style={btnStyle('secondary')}>Book Next Session</Link>
            </>
          ) : (
            <p style={{ color: SAGE, fontSize: 13 }}>No active packages. <Link to="/packages" style={{ color: GOLD }}>Browse packages →</Link></p>
          )}
        </motion.div>

        {/* Book again */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <h3 style={sectionHeading}>Book Again</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {BOOK_AGAIN_SERVICES.map((s, i) => (
              <div key={s.service} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0', borderBottom: i < BOOK_AGAIN_SERVICES.length - 1 ? `1px solid ${LINE}` : 'none',
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 14 }}>{s.service}</p>
                  <p style={{ color: SAGE, fontSize: 12, margin: '2px 0 0' }}>Last visit {s.lastVisit}</p>
                </div>
                <Link to="/booking" style={btnStyle('ghost')}>Book</Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Recommended for you ────────────────────────────────────────── */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <h3 style={sectionHeading}>Recommended For You</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { name: 'LED Light Therapy',       desc: 'Perfect after facials for glow and recovery.',    price: '35 JOD', duration: '30 min', pts: 35,  badge: 'Add-On' },
            { name: '24K Gold Luxury Facial',  desc: 'Premium glow facial for special occasions.',      price: '75 JOD', duration: '75 min', pts: 75,  badge: 'Premium' },
            { name: 'Laser Touch-Up Session',  desc: 'Maintenance session for small areas.',            price: '30 JOD', duration: '20 min', pts: 30,  badge: 'Touch-Up' },
          ].map(item => (
            <div key={item.name} style={{
              padding: '16px', borderRadius: 16,
              background: PARCH, border: `1px solid ${LINE}`,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 14 }}>{item.name}</p>
                <span style={{ ...badgeStyle, fontSize: 10 }}>{item.badge}</span>
              </div>
              <p style={{ color: SAGE, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, margin: 0 }}>{item.price} · {item.duration} · Earn {item.pts} pts</p>
              <Link to="/booking" style={{ ...btnStyle('ghost'), marginTop: 4, textAlign: 'center' }}>Book</Link>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: `1px solid ${LINE}`,
  borderRadius: 22,
  padding: 22,
  boxShadow: '0 8px 32px rgba(14,42,58,0.06)',
};

const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  color: '#0E2A3A',
  fontSize: 17,
  margin: '0 0 14px',
  fontWeight: 600,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  borderRadius: 999, padding: '5px 10px',
  background: 'rgba(196,168,130,0.14)', color: '#7b5435',
  fontWeight: 700, fontSize: 11,
};

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, padding: '10px 14px',
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
    textDecoration: 'none', border: 'none', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  };
  if (variant === 'primary')   return { ...base, background: '#C4A882', color: '#fff', boxShadow: '0 6px 18px rgba(196,168,130,0.28)' };
  if (variant === 'secondary') return { ...base, background: '#fff', color: '#7b5435', border: '1px solid rgba(196,168,130,0.35)' };
  return { ...base, background: 'transparent', color: '#7b5435', border: '1px solid rgba(196,168,130,0.3)' };
}
