/**
 * /client/portal/packages — My Packages
 */
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DEMO_PACKAGES, ClientPackage } from '@/lib/client-portal-data';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';

const STATUS_CONFIG = {
  active:    { label: 'Active',         bg: '#e0f2e8', color: '#2f7d5c', icon: CheckCircle },
  expiring:  { label: 'Expiring Soon',  bg: '#fff0dc', color: '#b06b1b', icon: AlertCircle },
  completed: { label: 'Completed',      bg: '#f1e8df', color: '#7b5435', icon: CheckCircle },
  expired:   { label: 'Expired',        bg: '#ffe7e7', color: '#a34040', icon: Clock },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' as const } }),
};

export default function ClientPackagesPage() {
  const active   = DEMO_PACKAGES.filter(p => p.status === 'active' || p.status === 'expiring');
  void DEMO_PACKAGES.filter(p => p.status === 'completed' || p.status === 'expired');

  return (
    <>
      <Helmet>
        <title>My Packages — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={eyebrow}>My Packages</p>
          <h1 style={pageTitle}>Track Sessions & Package Balances</h1>
          <p style={subtitle}>See remaining sessions, expiry dates, and included services.</p>
        </div>
        <Link to="/booking" style={btnStyle('primary')}>Book Package Session</Link>
      </div>

      {/* Active packages */}
      {active.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 16, margin: '0 0 14px', fontWeight: 600 }}>Active Packages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
            {active.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </>
      )}

      {/* Package history */}
      <motion.div custom={active.length} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <h3 style={sectionHeading}>Package History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                {['Package', 'Purchased', 'Status', 'Sessions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: SAGE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_PACKAGES.map((pkg, i) => {
                const s = STATUS_CONFIG[pkg.status];
                return (
                  <tr key={pkg.id}>
                    <td style={tdStyle(true, false)}><span style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{pkg.name}</span></td>
                    <td style={tdStyle(false, false)}><span style={{ color: SAGE, fontSize: 13 }}>{pkg.purchasedDate}</span></td>
                    <td style={tdStyle(false, false)}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '5px 10px', background: s.bg, color: s.color, fontWeight: 700, fontSize: 11 }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={tdStyle(false, true)}>
                      <span style={{ color: SAGE, fontSize: 13 }}>{pkg.usedSessions} / {pkg.totalSessions} used</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Browse packages CTA */}
      <motion.div custom={active.length + 1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...cardStyle, marginTop: 16, background: 'linear-gradient(135deg, rgba(196,168,130,0.08), rgba(196,168,130,0.04))', textAlign: 'center', padding: '28px 22px' }}>
        <Package size={28} style={{ color: GOLD, marginBottom: 10 }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 18, margin: '0 0 8px', fontWeight: 600 }}>
          Explore More Packages
        </h3>
        <p style={{ color: SAGE, fontSize: 13, margin: '0 0 16px' }}>
          Save up to 30% with our bundled treatment packages — laser, facials, nails, and more.
        </p>
        <Link to="/packages" style={btnStyle('primary')}>Browse All Packages</Link>
      </motion.div>
    </>
  );
}

function PackageCard({ pkg, index }: { pkg: ClientPackage; index: number }) {
  const s = STATUS_CONFIG[pkg.status];
  const StatusIcon = s.icon;
  const progress = (pkg.usedSessions / pkg.totalSessions) * 100;

  return (
    <motion.div custom={index} variants={{ hidden: { opacity: 0, y: 14 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' as const } }) }}
      initial="hidden" animate="visible"
      style={{ ...cardStyle, borderTop: `3px solid ${s.color}` }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 17, margin: 0, fontWeight: 600 }}>{pkg.name}</h3>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '5px 10px', background: s.bg, color: s.color, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
          <StatusIcon size={11} />{s.label}
        </span>
      </div>

      <p style={{ color: SAGE, fontSize: 13, margin: '0 0 12px' }}>
        {pkg.totalSessions} sessions purchased · {pkg.usedSessions} used · <strong style={{ color: '#0E2A3A' }}>{pkg.totalSessions - pkg.usedSessions} remaining</strong>
      </p>

      {/* Progress bar */}
      <div style={{ height: 10, background: '#f1e8df', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${GOLD}, #ddb081)`, borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
      <p style={{ color: SAGE, fontSize: 12, margin: '0 0 14px' }}>
        <strong style={{ color: '#0E2A3A' }}>Expires:</strong> {pkg.expiry}
      </p>

      {/* Included services */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: SAGE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Included Services</p>
        {pkg.includedServices.map(svc => (
          <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid rgba(196,168,130,0.12)` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
            <span style={{ color: '#0E2A3A', fontSize: 13 }}>{svc}</span>
          </div>
        ))}
      </div>

      {(pkg.status === 'active' || pkg.status === 'expiring') && (
        <Link to="/booking" style={btnStyle('secondary')}>Book Next Session</Link>
      )}
    </motion.div>
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
const sectionHeading: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 17, margin: '0 0 14px', fontWeight: 600 };
const eyebrow: React.CSSProperties = { fontSize: 11, color: '#C4A882', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' };
const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 'clamp(1.5rem,3vw,2rem)', margin: '0 0 6px', fontWeight: 600 };
const subtitle: React.CSSProperties = { color: '#6B7260', margin: 0, fontSize: 14 };

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' };
  if (variant === 'primary')   return { ...base, background: '#C4A882', color: '#fff', boxShadow: '0 6px 18px rgba(196,168,130,0.28)' };
  if (variant === 'secondary') return { ...base, background: '#fff', color: '#7b5435', border: '1px solid rgba(196,168,130,0.35)' };
  return { ...base, background: 'transparent', color: '#7b5435', border: '1px solid rgba(196,168,130,0.3)' };
}
