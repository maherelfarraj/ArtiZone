/**
 * /client/portal/rewards — My Rewards
 */
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Star, Crown, Award, Sparkles, PartyPopper } from 'lucide-react';
import {
  DEMO_LOYALTY, REWARDS_TABLE, POINTS_HISTORY, TIERS, TierKey,
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
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' as const } }),
};

export default function ClientRewardsPage() {
  const loyalty = DEMO_LOYALTY;
  const tier    = TIERS[loyalty.tier];
  const TierIcon = TIER_ICONS[loyalty.tier];
  const tierProgress = tier.nextSpend ? Math.min(100, (loyalty.totalSpend / tier.nextSpend) * 100) : 100;

  return (
    <>
      <Helmet>
        <title>My Rewards — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={eyebrow}>My Rewards</p>
          <h1 style={pageTitle}>Track Points, Tiers & Rewards</h1>
          <p style={subtitle}>Redeem Artizone Rewards points and monitor progress to your next tier.</p>
        </div>
        <Link to="/booking" style={btnStyle('primary')}>Book to Earn More</Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Available Points',  value: loyalty.points.toLocaleString(),        color: GOLD },
          { label: 'Lifetime Points',   value: loyalty.lifetimePoints.toLocaleString(), color: '#2f7d5c' },
          { label: 'Redeemed Points',   value: loyalty.redeemedPoints.toLocaleString(), color: '#7b5435' },
          { label: 'Expiring Soon',     value: loyalty.expiringPoints.toLocaleString(), color: '#b06b1b' },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            style={{ ...cardStyle, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: SAGE, fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
            <div style={{ fontSize: 34, fontWeight: 900, color: stat.color, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tier progress + birthday */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 22 }}>
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...cardStyle, borderTop: `3px solid ${tier.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <TierIcon size={20} style={{ color: tier.color }} />
            <h3 style={sectionHeading}>Tier Progress</h3>
          </div>
          <span style={{ ...badgeStyle, background: tier.bg, color: tier.color, marginBottom: 12, display: 'inline-block' }}>
            {tier.label} Member · {tier.multiplier} points
          </span>
          <div style={{ height: 10, background: '#f1e8df', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', width: `${tierProgress}%`, background: `linear-gradient(90deg, ${tier.color}, #ddb081)`, borderRadius: 99, transition: 'width 0.8s ease' }} />
          </div>
          {tier.nextTier ? (
            <p style={{ color: SAGE, fontSize: 13, margin: 0 }}>
              Spend <strong style={{ color: NAVY }}>{tier.nextSpend! - loyalty.totalSpend} JOD</strong> more to reach{' '}
              <strong style={{ color: TIERS[tier.nextTier!].color }}>{TIERS[tier.nextTier!].label}</strong> and unlock{' '}
              {TIERS[tier.nextTier!].multiplier} points, VIP priority, and premium benefits.
            </p>
          ) : (
            <p style={{ color: SAGE, fontSize: 13, margin: 0 }}>You've reached the highest tier — enjoy 2× points on every visit!</p>
          )}

          {/* All tiers */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {(Object.entries(TIERS) as [TierKey, typeof TIERS[TierKey]][]).map(([key, t]) => (
              <span key={key} style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: loyalty.tier === key ? t.bg : '#f5f0ea',
                color: loyalty.tier === key ? t.color : SAGE,
                border: `1px solid ${loyalty.tier === key ? t.color : 'transparent'}`,
              }}>
                {t.label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <PartyPopper size={18} style={{ color: GOLD }} />
            <h3 style={sectionHeading}>Birthday Reward</h3>
          </div>
          <p style={{ color: SAGE, fontSize: 13, lineHeight: 1.65, margin: '0 0 14px' }}>
            Your birthday reward will appear during your birthday month. Platinum members receive a complimentary selected treatment or luxury upgrade.
          </p>
          <div style={{ padding: '14px', borderRadius: 14, background: PARCH, border: `1px solid ${LINE}` }}>
            <p style={{ margin: 0, fontSize: 12, color: SAGE }}>
              <strong style={{ color: NAVY }}>Glow & Silver:</strong> 50 bonus points<br />
              <strong style={{ color: NAVY }}>Gold:</strong> Free add-on treatment<br />
              <strong style={{ color: NAVY }}>Platinum:</strong> Complimentary signature treatment
            </p>
          </div>
        </motion.div>
      </div>

      {/* Rewards table */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" style={{ ...cardStyle, marginBottom: 22 }}>
        <h3 style={sectionHeading}>Rewards Available</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                {['Points', 'Reward', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: SAGE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REWARDS_TABLE.map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle(true, false)}><strong style={{ color: GOLD }}>{r.pts}</strong></td>
                  <td style={tdStyle(false, false)}><span style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{r.label}</span></td>
                  <td style={tdStyle(false, false)}>
                    {r.status === 'available'
                      ? <span style={{ ...badgeStyle, background: '#e0f2e8', color: '#2f7d5c' }}>Available</span>
                      : <span style={{ ...badgeStyle, background: '#fff0dc', color: '#b06b1b' }}>{r.ptsNeeded} pts needed</span>
                    }
                  </td>
                  <td style={tdStyle(false, true)}>
                    {r.status === 'available'
                      ? <button style={btnStyle('ghost')}>Use Reward</button>
                      : <Link to="/booking" style={btnStyle('ghost')}>Earn More</Link>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Points history */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <h3 style={sectionHeading}>Points History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                {['Date', 'Activity', 'Points', 'Type'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: SAGE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POINTS_HISTORY.map((t, i) => (
                <tr key={i}>
                  <td style={tdStyle(true, false)}><span style={{ color: SAGE, fontSize: 13 }}>{t.date}</span></td>
                  <td style={tdStyle(false, false)}><span style={{ color: NAVY, fontSize: 13 }}>{t.activity}</span></td>
                  <td style={tdStyle(false, false)}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: t.points > 0 ? '#2f7d5c' : '#a34040' }}>
                      {t.points > 0 ? '+' : ''}{t.points}
                    </span>
                  </td>
                  <td style={tdStyle(false, true)}>
                    <span style={{
                      ...badgeStyle,
                      background: t.type === 'earned' ? '#e0f2e8' : t.type === 'redeemed' ? '#ffe7e7' : t.type === 'bonus' ? 'rgba(196,168,130,0.14)' : '#fff0dc',
                      color: t.type === 'earned' ? '#2f7d5c' : t.type === 'redeemed' ? '#a34040' : t.type === 'bonus' ? '#7b5435' : '#b06b1b',
                    }}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

function tdStyle(isFirst: boolean, isLast: boolean): React.CSSProperties {
  return {
    background: '#fff', padding: '13px 12px', fontSize: 13,
    borderTop: `1px solid rgba(196,168,130,0.18)`, borderBottom: `1px solid rgba(196,168,130,0.18)`,
    borderLeft: isFirst ? `1px solid rgba(196,168,130,0.18)` : 'none',
    borderRight: isLast ? `1px solid rgba(196,168,130,0.18)` : 'none',
    borderRadius: isFirst ? '12px 0 0 12px' : isLast ? '0 12px 12px 0' : 0,
  };
}

const cardStyle: React.CSSProperties = { background: '#fff', border: `1px solid rgba(196,168,130,0.18)`, borderRadius: 22, padding: 22, boxShadow: '0 8px 32px rgba(14,42,58,0.06)' };
const sectionHeading: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 17, margin: '0 0 0', fontWeight: 600 };
const eyebrow: React.CSSProperties = { fontSize: 11, color: '#C4A882', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' };
const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 'clamp(1.5rem,3vw,2rem)', margin: '0 0 6px', fontWeight: 600 };
const subtitle: React.CSSProperties = { color: '#6B7260', margin: 0, fontSize: 14 };
const badgeStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '5px 10px', background: 'rgba(196,168,130,0.14)', color: '#7b5435', fontWeight: 700, fontSize: 11 };

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' };
  if (variant === 'primary')   return { ...base, background: '#C4A882', color: '#fff', boxShadow: '0 6px 18px rgba(196,168,130,0.28)' };
  if (variant === 'secondary') return { ...base, background: '#fff', color: '#7b5435', border: '1px solid rgba(196,168,130,0.35)' };
  return { ...base, background: 'transparent', color: '#7b5435', border: '1px solid rgba(196,168,130,0.3)' };
}
