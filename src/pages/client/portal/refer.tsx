/**
 * /client/portal/refer — Refer a Friend
 */
import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { DEMO_CUSTOMER, DEMO_REFERRALS } from '@/lib/client-portal-data';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const PARCH = '#F7F3EE';
const LINE  = 'rgba(196,168,130,0.18)';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' as const } }),
};

export default function ClientReferPage() {
  const [copied, setCopied] = useState(false);
  const code = DEMO_CUSTOMER.referralCode;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Referral code: ' + code);
    }
  }

  const waText = encodeURIComponent(
    `Use my Artizone Spa code ${code} for 10% off your first visit! Book at artizonespa.com`
  );

  return (
    <>
      <Helmet>
        <title>Refer a Friend — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Topbar */}
      <div style={{ marginBottom: 28 }}>
        <p style={eyebrow}>Refer a Friend</p>
        <h1 style={pageTitle}>Share Artizone & Earn Points</h1>
        <p style={subtitle}>Your friend receives 10% off their first visit. You receive 100 points after their first paid session.</p>
      </div>

      {/* Referral code + how it works */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 22 }}>

        {/* Referral code card */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...cardStyle, borderTop: `3px solid ${GOLD}` }}>
          <h3 style={sectionHeading}>Your Referral Code</h3>
          <div style={{
            fontSize: 38, fontWeight: 900, color: NAVY,
            fontFamily: 'var(--font-heading)', letterSpacing: '0.08em',
            margin: '12px 0 8px',
            padding: '18px', borderRadius: 16,
            background: 'rgba(196,168,130,0.08)',
            border: `2px dashed rgba(196,168,130,0.4)`,
            textAlign: 'center',
          }}>
            {code}
          </div>
          <p style={{ color: SAGE, fontSize: 13, margin: '0 0 18px' }}>
            Share this code with friends when they register or book.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={copyCode} style={btnStyle('primary')}>
              {copied ? <Check size={14} style={{ marginRight: 6 }} /> : <Copy size={14} style={{ marginRight: 6 }} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <a
              href={`https://wa.me/?text=${waText}`}
              target="_blank" rel="noopener noreferrer"
              style={btnStyle('secondary')}
            >
              <MessageCircle size={14} style={{ marginRight: 6 }} />
              Share on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <h3 style={sectionHeading}>How It Works</h3>
          {[
            { step: '1', title: 'Share your code', desc: 'Send your referral code to a friend via WhatsApp, message, or in person.' },
            { step: '2', title: 'Friend books',    desc: 'They receive 10% off their first paid visit when they use your code.' },
            { step: '3', title: 'You earn',        desc: 'You receive 100 loyalty points after their first session is completed.' },
          ].map((item, i) => (
            <div key={item.step} style={{
              display: 'flex', gap: 14, padding: '14px 0',
              borderBottom: i < 2 ? `1px solid ${LINE}` : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${GOLD}, #ddb081)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 14,
              }}>
                {item.step}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: NAVY, margin: '0 0 3px', fontSize: 14 }}>{item.title}</p>
                <p style={{ color: SAGE, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Referral history */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={sectionHeading}>Referral History</h3>
          <span style={{ ...badgeStyle, background: 'rgba(196,168,130,0.12)', color: SAGE }}>
            {DEMO_REFERRALS.length} referrals
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                {['Friend', 'Status', 'Points'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: SAGE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_REFERRALS.map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle(true, false)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${GOLD}, #e9caa8)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0,
                      }}>
                        {r.name.charAt(0)}
                      </div>
                      <span style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle(false, false)}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '5px 10px',
                      fontWeight: 700, fontSize: 11,
                      background: r.status === 'completed' ? '#e0f2e8' : '#fff0dc',
                      color: r.status === 'completed' ? '#2f7d5c' : '#b06b1b',
                    }}>
                      {r.status === 'completed' ? 'Completed first visit' : r.status === 'booked' ? 'Booked appointment' : 'Registered'}
                    </span>
                  </td>
                  <td style={tdStyle(false, true)}>
                    {r.points !== null
                      ? <span style={{ fontWeight: 800, color: '#2f7d5c', fontSize: 14 }}>+{r.points} earned</span>
                      : <span style={{ color: SAGE, fontSize: 13 }}>Pending</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{
          marginTop: 18, padding: '14px 18px', borderRadius: 14,
          background: PARCH, border: `1px solid ${LINE}`,
          display: 'flex', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: NAVY, fontFamily: 'var(--font-heading)' }}>
              {DEMO_REFERRALS.filter(r => r.status === 'completed').length}
            </div>
            <p style={{ color: SAGE, fontSize: 12, margin: 0 }}>Completed</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: GOLD, fontFamily: 'var(--font-heading)' }}>
              {DEMO_REFERRALS.reduce((sum, r) => sum + (r.points ?? 0), 0)}
            </div>
            <p style={{ color: SAGE, fontSize: 12, margin: 0 }}>Points Earned</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#b06b1b', fontFamily: 'var(--font-heading)' }}>
              {DEMO_REFERRALS.filter(r => r.status !== 'completed').length}
            </div>
            <p style={{ color: SAGE, fontSize: 12, margin: 0 }}>Pending</p>
          </div>
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
