/**
 * /client/login — Email + password sign in
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader2, User, ArrowRight } from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const CREAM = '#FDFAF6';

export default function ClientLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/client/portal';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.needsVerification) {
          sessionStorage.setItem('client_reg_email', email.trim().toLowerCase());
          navigate('/client/verify');
          return;
        }
        setError(json.error ?? 'Login failed.');
        setLoading(false);
        return;
      }
      navigate(from, { replace: true });
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign In — ArtiZone</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 60%, #0a2030 100%)` }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Link to="/">
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 600,
                color: GOLD,
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: 16,
              }}>ArtiZone</span>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <User size={14} style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                Client Account
              </span>
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
              Welcome Back
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(253,250,246,0.55)', fontFamily: 'var(--font-sans)' }}>
              Sign in to your client account
            </p>
          </div>

          <div className="rounded-2xl p-7" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,168,130,0.20)' }}>
            <form onSubmit={submit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(253,250,246,0.60)', fontFamily: 'var(--font-sans)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(196,168,130,0.22)', color: CREAM, fontFamily: 'var(--font-sans)' }}
                    required autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(253,250,246,0.60)', fontFamily: 'var(--font-sans)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(196,168,130,0.22)', color: CREAM, fontFamily: 'var(--font-sans)' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(253,250,246,0.40)' }}>
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-xs" style={{ background: 'rgba(196,168,130,0.10)', border: '1px solid rgba(196,168,130,0.25)', color: GOLD }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 mt-1"
                style={{ background: GOLD, color: NAVY, fontFamily: 'var(--font-sans)' }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(196,168,130,0.15)' }} />
              <span className="text-xs" style={{ color: 'rgba(253,250,246,0.35)' }}>new here?</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(196,168,130,0.15)' }} />
            </div>

            <Link to="/client/signup"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: '1.5px solid rgba(196,168,130,0.28)', color: GOLD, fontFamily: 'var(--font-sans)' }}>
              Create Account <ArrowRight size={13} />
            </Link>


          </div>
        </motion.div>
      </div>
    </>
  );
}
