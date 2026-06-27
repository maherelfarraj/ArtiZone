/**
 * /client/portal/bookings — My Bookings
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { RefreshCw, X, CalendarPlus } from 'lucide-react';
import { DEMO_BOOKINGS, BOOK_AGAIN_SERVICES, RECOMMENDED_ADDONS, Booking } from '@/lib/client-portal-data';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const LINE  = 'rgba(196,168,130,0.18)';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' as const } }),
};

export default function ClientBookingsPage() {
  const [tab, setTab] = useState<'upcoming' | 'history' | 'cancelled'>('upcoming');

  const upcoming  = DEMO_BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const history   = DEMO_BOOKINGS.filter(b => b.status === 'completed');
  const cancelled = DEMO_BOOKINGS.filter(b => b.status === 'cancelled');

  return (
    <>
      <Helmet>
        <title>My Bookings — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={eyebrow}>My Bookings</p>
          <h1 style={pageTitle}>Appointments & Visit History</h1>
          <p style={subtitle}>Manage upcoming appointments and book completed services again.</p>
        </div>
        <Link to="/booking" style={btnStyle('primary')}>Book New Appointment</Link>
      </div>

      {/* Upcoming appointment card */}
      {upcoming.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ ...cardStyle, marginBottom: 22, borderTop: `3px solid ${GOLD}` }}>
          <h3 style={sectionHeading}>Upcoming Appointment</h3>
          {upcoming.map(b => (
            <div key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 16 }}>{b.service}</p>
                  <p style={{ color: SAGE, fontSize: 13, margin: '4px 0 0', lineHeight: 1.6 }}>
                    {formatDate(b.date)} · {b.time} · Therapist: {b.therapist} · Earn {b.pointsEarned} pts
                  </p>
                </div>
                <span style={{ ...badgeStyle, background: '#e0f2e8', color: '#2f7d5c' }}>Confirmed</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <button style={btnStyle('secondary')}>
                  <RefreshCw size={13} style={{ marginRight: 6 }} />Reschedule
                </button>
                <button style={btnStyle('ghost')}>
                  <X size={13} style={{ marginRight: 6 }} />Cancel
                </button>
                <button style={btnStyle('ghost')}>
                  <CalendarPlus size={13} style={{ marginRight: 6 }} />Add to Calendar
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Book again + add-ons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 22 }}>
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <h3 style={sectionHeading}>Book Again</h3>
          {BOOK_AGAIN_SERVICES.map((s, i) => (
            <div key={s.service} style={rowStyle(i < BOOK_AGAIN_SERVICES.length - 1)}>
              <div>
                <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 14 }}>{s.service}</p>
                <p style={{ color: SAGE, fontSize: 12, margin: '2px 0 0' }}>Last visit {s.lastVisit}</p>
              </div>
              <Link to="/booking" style={btnStyle('ghost')}>Book</Link>
            </div>
          ))}
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
          <h3 style={sectionHeading}>Recommended Add-Ons</h3>
          {RECOMMENDED_ADDONS.map((a, i) => (
            <div key={a.name} style={rowStyle(i < RECOMMENDED_ADDONS.length - 1)}>
              <div>
                <p style={{ fontWeight: 700, color: NAVY, margin: 0, fontSize: 14 }}>{a.name}</p>
                <p style={{ color: SAGE, fontSize: 12, margin: '2px 0 0' }}>{a.price} · {a.duration} · {a.note}</p>
              </div>
              <Link to="/booking" style={btnStyle('ghost')}>Add</Link>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Visit history tabs */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {(['upcoming', 'history', 'cancelled'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '9px 16px', borderRadius: 999,
              border: `1px solid ${tab === t ? GOLD : LINE}`,
              background: tab === t ? 'rgba(196,168,130,0.14)' : '#fff',
              color: tab === t ? NAVY : SAGE,
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              textTransform: 'capitalize',
            }}>
              {t === 'upcoming' ? 'Upcoming' : t === 'history' ? 'Visit History' : 'Cancelled'}
            </button>
          ))}
        </div>

        {tab === 'upcoming' && (
          upcoming.length === 0
            ? <p style={{ color: SAGE, fontSize: 14 }}>No upcoming appointments. <Link to="/booking" style={{ color: GOLD }}>Book now →</Link></p>
            : <BookingTable bookings={upcoming} showBookAgain={false} />
        )}
        {tab === 'history' && <BookingTable bookings={history} showBookAgain />}
        {tab === 'cancelled' && (
          cancelled.length === 0
            ? <p style={{ color: SAGE, fontSize: 14 }}>No cancelled appointments.</p>
            : <BookingTable bookings={cancelled} showBookAgain />
        )}
      </motion.div>
    </>
  );
}

function BookingTable({ bookings, showBookAgain }: { bookings: Booking[]; showBookAgain: boolean }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            {['Date', 'Service', 'Therapist', 'Paid', 'Points', ''].map(h => (
              <th key={h} style={{ textAlign: 'left', color: SAGE, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 4px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              {[
                formatDateShort(b.date),
                b.service,
                b.therapist,
                b.paid > 0 ? `${b.paid} JOD` : '—',
                b.pointsEarned > 0 ? `+${b.pointsEarned}` : '—',
              ].map((cell, ci) => (
                <td key={ci} style={{
                  background: '#fff', padding: '14px 12px', fontSize: 13, color: ci === 0 ? SAGE : NAVY,
                  borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`,
                  borderLeft: ci === 0 ? `1px solid ${LINE}` : 'none',
                  borderRight: ci === 4 ? `1px solid ${LINE}` : 'none',
                  borderRadius: ci === 0 ? '12px 0 0 12px' : ci === 4 ? '0 12px 12px 0' : 0,
                }}>
                  {cell}
                </td>
              ))}
              <td style={{
                background: '#fff', padding: '14px 12px',
                borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`,
                borderRight: `1px solid ${LINE}`, borderRadius: '0 12px 12px 0',
              }}>
                {showBookAgain && <Link to="/booking" style={btnStyle('ghost')}>Book Again</Link>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}
function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const cardStyle: React.CSSProperties = { background: '#fff', border: `1px solid rgba(196,168,130,0.18)`, borderRadius: 22, padding: 22, boxShadow: '0 8px 32px rgba(14,42,58,0.06)' };
const sectionHeading: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 17, margin: '0 0 14px', fontWeight: 600 };
const eyebrow: React.CSSProperties = { fontSize: 11, color: '#C4A882', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' };
const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 'clamp(1.5rem,3vw,2rem)', margin: '0 0 6px', fontWeight: 600 };
const subtitle: React.CSSProperties = { color: '#6B7260', margin: 0, fontSize: 14 };
const badgeStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '5px 10px', background: 'rgba(196,168,130,0.14)', color: '#7b5435', fontWeight: 700, fontSize: 11 };

function rowStyle(hasBorder: boolean): React.CSSProperties {
  return { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: hasBorder ? `1px solid rgba(196,168,130,0.18)` : 'none' };
}

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' };
  if (variant === 'primary')   return { ...base, background: '#C4A882', color: '#fff', boxShadow: '0 6px 18px rgba(196,168,130,0.28)' };
  if (variant === 'secondary') return { ...base, background: '#fff', color: '#7b5435', border: '1px solid rgba(196,168,130,0.35)' };
  return { ...base, background: 'transparent', color: '#7b5435', border: '1px solid rgba(196,168,130,0.3)' };
}
