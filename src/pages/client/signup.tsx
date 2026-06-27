/**
 * /client/signup — Full client registration
 * Collects: full name, mobile, email, address, area, dob, password, confirm password
 * Then sends OTP to email → redirects to /client/verify
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { User, Phone, Mail, MapPin, Home, Calendar, Lock, Eye, EyeOff, ArrowRight, Loader2, ChevronDown } from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const CREAM = '#FDFAF6';

const JORDAN_AREAS = [
  'Amman – Abdoun', 'Amman – Sweifieh', 'Amman – Khalda', 'Amman – Mecca St',
  'Amman – Shmeisani', 'Amman – Jabal Amman', 'Amman – Dabouq', 'Amman – Tla Al Ali',
  'Amman – Marj Al Hamam', 'Amman – Other',
  'Zarqa', 'Irbid', 'Aqaba', 'Madaba', 'Jerash', 'Ajloun',
  'Karak', 'Tafilah', 'Maan', 'Balqa', 'Mafraq', 'Other',
];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(196,168,130,0.25)',
  color: CREAM,
  borderRadius: 10,
  padding: '12px 12px 12px 42px',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  color: 'rgba(253,250,246,0.65)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  marginBottom: 6,
  fontFamily: 'var(--font-sans)',
};

export default function ClientSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', address: '', area: '', dob: '',
    password: '', confirmPassword: '',
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.area) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          address: form.address.trim(),
          area: form.area,
          dob: form.dob,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError(json.error + ' ');
          setLoading(false);
          return;
        }
        setError(json.error ?? 'Registration failed.');
        setLoading(false);
        return;
      }
      // Account created + auto-logged in — go straight to dashboard
      navigate('/client/dashboard');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Account — ArtiZone</title>
        <meta name="description" content="Create your ArtiZone client account to manage bookings and access exclusive offers." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 60%, #0a2030 100%)` }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="w-full max-w-lg"
        >
          {/* Card */}
          <div style={{
            background: 'rgba(14,42,58,0.85)',
            border: '1px solid rgba(196,168,130,0.20)',
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.40)',
          }}>
            {/* Logo + heading */}
            <div className="text-center mb-8">
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: CREAM,
                letterSpacing: '0.06em',
                display: 'block',
                margin: '0 auto 16px',
              }}>ArtiZone</span>
              <h1 style={{ color: CREAM, fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400, margin: '0 0 6px' }}>
                Create Your Account
              </h1>
              <p style={{ color: 'rgba(253,250,246,0.50)', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                Join ArtiZone — Amman's premier beauty clinic
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,60,60,0.12)', border: '1px solid rgba(220,60,60,0.30)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                color: '#f87171', fontSize: 13, fontFamily: 'var(--font-sans)',
              }}>
                {error}
                {error.includes('already exists') && (
                  <Link to="/client/login" style={{ color: GOLD, marginLeft: 4, textDecoration: 'underline' }}>Sign in instead</Link>
                )}
              </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                  <input
                    type="text" required placeholder="Your full name"
                    value={form.fullName} onChange={set('fullName')}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                  />
                </div>
              </div>

              {/* Mobile + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                    <input
                      type="tel" required placeholder="+962 7X XXX XXXX"
                      value={form.phone} onChange={set('phone')}
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                    <input
                      type="email" required placeholder="you@email.com"
                      value={form.email} onChange={set('email')}
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    />
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label style={labelStyle}>Full Address</label>
                <div style={{ position: 'relative' }}>
                  <Home size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                  <input
                    type="text" placeholder="Street, building, apartment…"
                    value={form.address} onChange={set('address')}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                  />
                </div>
              </div>

              {/* Area + DOB row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Area *</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7, zIndex: 1 }} />
                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.6, pointerEvents: 'none' }} />
                    <select
                      required value={form.area} onChange={set('area')}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    >
                      <option value="" disabled style={{ background: NAVY }}>Select area</option>
                      {JORDAN_AREAS.map(a => (
                        <option key={a} value={a} style={{ background: NAVY }}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                    <input
                      type="date" placeholder="YYYY-MM-DD"
                      value={form.dob} onChange={set('dob')}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    />
                  </div>
                </div>
              </div>

              {/* Password + Confirm row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                    <input
                      type={showPwd ? 'text' : 'password'} required placeholder="Min. 8 characters"
                      value={form.password} onChange={set('password')}
                      style={{ ...inputStyle, paddingRight: 40 }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.7 }} />
                    <input
                      type={showConfirm ? 'text' : 'password'} required placeholder="Repeat password"
                      value={form.confirmPassword} onChange={set('confirmPassword')}
                      style={{ ...inputStyle, paddingRight: 40 }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.25)')}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: GOLD, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: loading ? 'rgba(196,168,130,0.5)' : GOLD,
                  color: NAVY, borderRadius: 12, fontSize: 13,
                  fontFamily: 'var(--font-sans)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : `0 0 24px rgba(196,168,130,0.35)`,
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
              <p style={{ color: 'rgba(253,250,246,0.45)', fontSize: 13 }}>
                Already have an account?{' '}
                <Link to="/client/login" style={{ color: GOLD, textDecoration: 'underline' }}>Sign in</Link>
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-center mt-4" style={{ color: 'rgba(253,250,246,0.30)', fontSize: 11, fontFamily: 'var(--font-sans)' }}>
            Your information is kept private and secure.
          </p>
        </motion.div>
      </div>
    </>
  );
}
