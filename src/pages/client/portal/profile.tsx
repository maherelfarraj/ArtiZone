/**
 * /client/portal/profile — My Profile
 */
import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Save, Edit2, Check, X } from 'lucide-react';
import { DEMO_CUSTOMER } from '@/lib/client-portal-data';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const LINE  = 'rgba(196,168,130,0.18)';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' as const } }),
};

export default function ClientProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...DEMO_CUSTOMER });
  const [consent, setConsent] = useState({
    whatsapp: DEMO_CUSTOMER.whatsappConsent,
    email: DEMO_CUSTOMER.emailConsent,
    photo: DEMO_CUSTOMER.photoConsent,
  });

  function handleSave() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCancel() {
    setForm({ ...DEMO_CUSTOMER });
    setEditing(false);
  }

  function field(label: string, key: keyof typeof form, type: 'text' | 'date' | 'textarea' = 'text') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, color: SAGE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            disabled={!editing}
            rows={3}
            style={inputStyle(editing)}
          />
        ) : (
          <input
            type={type}
            value={form[key] as string}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            disabled={!editing}
            style={inputStyle(editing)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile — ArtiZone Client Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={eyebrow}>My Profile</p>
          <h1 style={pageTitle}>Beauty Profile & Preferences</h1>
          <p style={subtitle}>Keep your personal details, treatment preferences, and consent settings updated.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {editing ? (
            <>
              <button onClick={handleSave} style={btnStyle('primary')}>
                <Save size={14} style={{ marginRight: 6 }} />Save Changes
              </button>
              <button onClick={handleCancel} style={btnStyle('ghost')}>
                <X size={14} style={{ marginRight: 6 }} />Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={btnStyle('secondary')}>
              <Edit2 size={14} style={{ marginRight: 6 }} />Edit Profile
            </button>
          )}
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 14, background: '#e0f2e8', border: '1px solid #a8d5be', color: '#2f7d5c', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          <Check size={15} />Profile saved successfully.
        </motion.div>
      )}

      {/* Avatar + name */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${GOLD}, #e9caa8)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 26,
        }}>
          {form.firstName.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 20, margin: '0 0 4px', fontWeight: 600 }}>
            {form.firstName} {form.lastName}
          </h2>
          <p style={{ color: SAGE, fontSize: 13, margin: 0 }}>{form.email}</p>
        </div>
      </motion.div>

      {/* Personal details */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{ ...cardStyle, marginBottom: 18 }}>
        <h3 style={sectionHeading}>Personal Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {field('First Name', 'firstName')}
          {field('Last Name', 'lastName')}
          {field('Mobile', 'mobile')}
          {field('Email', 'email')}
          {field('Date of Birth', 'dob', 'date')}
          {field('Area', 'area')}
        </div>
      </motion.div>

      {/* Beauty preferences */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ ...cardStyle, marginBottom: 18 }}>
        <h3 style={sectionHeading}>Beauty Preferences</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: SAGE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preferred Therapist</label>
            <select
              value={form.preferredTherapist}
              onChange={e => setForm(f => ({ ...f, preferredTherapist: e.target.value }))}
              disabled={!editing}
              style={inputStyle(editing)}
            >
              {['Lina', 'Rania', 'Maya', 'No preference'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: SAGE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skin Type</label>
            <select
              value={form.skinType}
              onChange={e => setForm(f => ({ ...f, skinType: e.target.value }))}
              disabled={!editing}
              style={inputStyle(editing)}
            >
              {['Combination', 'Dry', 'Oily', 'Sensitive', 'Normal'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {field('Favourite Services', 'favoriteServices')}
          {field('Body Goals', 'bodyGoals')}
          {field('Allergies / Notes', 'allergies', 'textarea')}
          {field('Skin Concerns', 'skinConcerns', 'textarea')}
        </div>
      </motion.div>

      {/* Consent settings */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" style={cardStyle}>
        <h3 style={sectionHeading}>Consent Settings</h3>
        {[
          { key: 'whatsapp' as const, label: 'WhatsApp booking and offers', desc: 'Receive appointment confirmations and relevant campaigns.' },
          { key: 'email' as const,    label: 'Email updates',               desc: 'Receive invoices and account updates.' },
          { key: 'photo' as const,    label: 'Before / after photos',       desc: 'Private use only unless approved separately.' },
        ].map((item, i) => (
          <div key={item.key} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
            padding: '16px 0', borderBottom: i < 2 ? `1px solid ${LINE}` : 'none',
          }}>
            <div>
              <p style={{ fontWeight: 700, color: NAVY, margin: '0 0 3px', fontSize: 14 }}>{item.label}</p>
              <p style={{ color: SAGE, fontSize: 12, margin: 0 }}>{item.desc}</p>
            </div>
            <button
              onClick={() => editing && setConsent(c => ({ ...c, [item.key]: !c[item.key] }))}
              style={{
                padding: '7px 14px', borderRadius: 999, fontWeight: 700, fontSize: 12,
                border: 'none', cursor: editing ? 'pointer' : 'default',
                background: consent[item.key] ? '#e0f2e8' : '#fff0dc',
                color: consent[item.key] ? '#2f7d5c' : '#b06b1b',
                flexShrink: 0,
              }}
            >
              {item.key === 'photo'
                ? (consent[item.key] ? 'Approved' : 'Private Only')
                : (consent[item.key] ? 'Enabled' : 'Disabled')
              }
            </button>
          </div>
        ))}
      </motion.div>
    </>
  );
}

function inputStyle(editing: boolean): React.CSSProperties {
  return {
    border: `1px solid ${editing ? 'rgba(196,168,130,0.5)' : 'rgba(196,168,130,0.2)'}`,
    borderRadius: 12, padding: '11px 14px', fontSize: 14,
    background: editing ? '#fff' : '#faf7f3',
    color: '#0E2A3A', outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.15s',
  };
}

const cardStyle: React.CSSProperties = { background: '#fff', border: `1px solid rgba(196,168,130,0.18)`, borderRadius: 22, padding: 22, boxShadow: '0 8px 32px rgba(14,42,58,0.06)' };
const sectionHeading: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 17, margin: '0 0 18px', fontWeight: 600 };
const eyebrow: React.CSSProperties = { fontSize: 11, color: '#C4A882', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' };
const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', color: '#0E2A3A', fontSize: 'clamp(1.5rem,3vw,2rem)', margin: '0 0 6px', fontWeight: 600 };
const subtitle: React.CSSProperties = { color: '#6B7260', margin: 0, fontSize: 14 };

function btnStyle(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' };
  if (variant === 'primary')   return { ...base, background: '#C4A882', color: '#fff', boxShadow: '0 6px 18px rgba(196,168,130,0.28)' };
  if (variant === 'secondary') return { ...base, background: '#fff', color: '#7b5435', border: '1px solid rgba(196,168,130,0.35)' };
  return { ...base, background: 'transparent', color: '#7b5435', border: '1px solid rgba(196,168,130,0.3)' };
}
