/**
 * /admin/login — Admin authentication page
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

const NAVY = '#0E2A3A';
const GOLD = '#C4A882';

export default function AdminLoginPage() {
  const navigate   = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Redirect if already logged in — or to setup if DB not ready
  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(async r => {
        if (r.ok) { navigate('/admin', { replace: true }); return; }
        const d = await r.json().catch(() => ({}));
        if (d.error === 'setup_required') navigate('/admin/setup', { replace: true });
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'setup_required') { navigate('/admin/setup', { replace: true }); return; }
        setError(data.error ?? 'Login failed. Please check your credentials.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 transition-all bg-white";
  const inputStyle = {
    borderColor: 'rgba(196,168,130,0.4)',
    color: NAVY,
    '--tw-ring-color': `${GOLD}55`,
  } as React.CSSProperties;

  return (
    <>
      <Helmet>
        <title>Admin Login — ArtiZone</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/login" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a4a 60%, #0a1e2a 100%)` }}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: GOLD, filter: 'blur(80px)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: GOLD, filter: 'blur(80px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-sm"
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>

            <div className="px-8 py-7 text-center" style={{ background: NAVY }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.3)' }}>
                <Lock size={20} style={{ color: GOLD }} />
              </div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
                Admin Login
              </h1>
              <p className="text-xs mt-1" style={{ color: 'rgba(196,168,130,0.6)' }}>
                ArtiZone Admin Panel
              </p>
            </div>

            <div className="px-8 py-7">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                  <input type="email" placeholder="Email address" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className={inputCls} style={inputStyle} autoComplete="email" />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                  <input type={showPw ? 'text' : 'password'} placeholder="Password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className={inputCls + ' pr-10'} style={inputStyle} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: NAVY, color: '#fff' }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: 'rgba(196,168,130,0.4)' }}>
            ArtiZone Beauty & Aesthetic Clinic
          </p>
        </motion.div>
      </div>
    </>
  );
}
