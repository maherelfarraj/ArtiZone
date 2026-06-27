/**
 * /admin/setup — One-time database migration page.
 * Creates admin_users + admin_sessions tables and seeds the first superadmin.
 * Shows the generated password on screen. Should only be used once.
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Database, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAVY = '#0E2A3A';
const GOLD = '#C4A882';

export default function AdminSetupPage() {
  const [secret,     setSecret]     = useState('');
  const [running,    setRunning]    = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  void setAutoFilled;
  const [result,     setResult]     = useState<{
    ok: boolean;
    message?: string;
    credentials?: { email: string; password: string; note: string };
    error?: string;
  } | null>(null);

  // Migration is complete — secret must be entered manually from Settings → Secrets
  useEffect(() => {
    // reveal-secret endpoint has been removed for security.
    // Enter SEQUENCE_SECRET manually from your app's Secrets settings.
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true); setResult(null);
    try {
      const res = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'x-migrate-secret': secret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: 'Network error.' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Setup — ArtiZone</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/setup" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a4a 60%, #0a1e2a 100%)` }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff' }}>

            {/* Header */}
            <div className="px-8 py-6 text-center" style={{ background: NAVY }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.3)' }}>
                <Database size={20} style={{ color: GOLD }} />
              </div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
                Admin Setup
              </h1>
              <p className="text-xs mt-1" style={{ color: 'rgba(196,168,130,0.6)' }}>
                One-time database migration
              </p>
            </div>

            <div className="px-8 py-7">
              {!result ? (
                <form onSubmit={handleRun} className="space-y-4">
                  <p className="text-sm" style={{ color: '#7a6a5a' }}>
                    Creates the admin tables and sets up <strong>info@artizonespa.com</strong> as superadmin.
                  </p>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>
                      Admin Secret (SEQUENCE_SECRET)
                    </label>
                    <input type="password" required placeholder="Paste your SEQUENCE_SECRET here"
                      value={secret} onChange={e => setSecret(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 bg-white"
                      style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY }} />
                    {autoFilled && (
                      <p className="text-xs mt-1" style={{ color: '#1e7a44' }}>✓ Secret auto-filled from server</p>
                    )}
                  </div>
                  <button type="submit" disabled={running}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: NAVY, color: '#fff' }}>
                    {running ? <Loader2 size={16} className="animate-spin" /> : <Database size={15} />}
                    {running ? 'Running migration…' : 'Run Migration'}
                  </button>
                </form>
              ) : result.ok ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(60,180,100,0.1)' }}>
                      <CheckCircle size={20} style={{ color: '#1e7a44' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>{result.message}</p>
                  </div>

                  {result.credentials && (
                    <div className="rounded-xl p-4 space-y-3" style={{ background: '#f0ebe3', border: '1px solid rgba(196,168,130,0.3)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                        ⚠️ Save these credentials now
                      </p>
                      <div>
                        <p className="text-[11px]" style={{ color: '#9a8a7a' }}>Email</p>
                        <p className="text-sm font-bold" style={{ color: NAVY }}>{result.credentials.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px]" style={{ color: '#9a8a7a' }}>Temporary Password</p>
                        <p className="text-lg font-bold tracking-widest" style={{ color: NAVY }}>{result.credentials.password}</p>
                      </div>
                      <p className="text-xs" style={{ color: '#b02828' }}>{result.credentials.note}</p>
                    </div>
                  )}

                  <Link to="/admin/login"
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: NAVY, color: '#fff' }}>
                    Go to Login <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(220,60,60,0.1)' }}>
                      <AlertCircle size={20} style={{ color: '#b02828' }} />
                    </div>
                    <p className="text-sm" style={{ color: '#b02828' }}>{result.error ?? 'Migration failed.'}</p>
                  </div>
                  <button onClick={() => setResult(null)}
                    className="text-sm underline" style={{ color: GOLD }}>
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
