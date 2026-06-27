/**
 * BlogNewsletterSignup
 * Compact newsletter signup block rendered at the bottom of every blog post.
 * Passes source='blog' to the newsletter API so blog-originated subscribers
 * receive the Day-14 blog-reader nurture email in addition to the standard sequence.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Loader2, BookOpen } from 'lucide-react';

const G      = '#C4A882';   // terracotta / cinnamon
const BLACK  = '#0E2A3A';   // deep warm brown
const S1     = '#3A2214';   // card background
const FG     = 'rgba(253,250,246,0.88)';
const FGDIM  = 'rgba(253,250,246,0.52)';
const FGFAINT = 'rgba(253,250,246,0.28)';

export default function BlogNewsletterSignup() {
  const [email, setEmail]   = useState('');
  const [name,  setName]    = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name:  name.trim() || undefined,
          source: 'blog',   // ← tags this subscriber for the Day-14 blog nurture email
        }),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'You\'re subscribed!');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div
      className="my-12 p-7 sm:p-9 relative overflow-hidden"
      style={{ background: S1, borderLeft: `3px solid ${G}` }}
    >
      {/* Decorative radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 95% 50%, rgba(196,168,130,0.08) 0%, transparent 60%)` }}
      />

      <div className="relative z-10">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={13} style={{ color: G }} />
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: G, fontFamily: 'var(--font-sans)' }}
          >
            ArtiZone Insider
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            /* ── Success state ─────────────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 py-2"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `rgba(196,168,130,0.18)` }}
              >
                <CheckCircle size={18} style={{ color: G }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: FG, fontFamily: 'var(--font-sans)' }}
                >
                  {message}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  Check your inbox — your welcome email is on its way. We'll also send you exclusive skincare tips and clinic news.
                </p>
              </div>
            </motion.div>
          ) : (
            /* ── Form state ────────────────────────────────────────────────── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: FG,
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: '0.5rem',
                }}
              >
                Enjoyed this article? Get more like it.
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}
              >
                Subscribe for expert skincare tips, treatment guides, and exclusive subscriber-only offers — straight from the ArtiZone team.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                {/* Name + Email row */}
                <div className="flex flex-col xs:flex-row gap-2.5">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="flex-1 px-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(253,250,246,0.06)',
                      border: `1px solid rgba(196,168,130,0.28)`,
                      color: FG,
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = G)}
                    onBlur={(e)  => (e.target.style.borderColor = 'rgba(196,168,130,0.28)')}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address *"
                    required
                    className="flex-1 px-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(253,250,246,0.06)',
                      border: `1px solid rgba(196,168,130,0.28)`,
                      color: FG,
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = G)}
                    onBlur={(e)  => (e.target.style.borderColor = 'rgba(196,168,130,0.28)')}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <p className="text-xs" style={{ color: '#f87171', fontFamily: 'var(--font-sans)' }}>
                    {message}
                  </p>
                )}

                {/* Submit */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: G, color: BLACK, fontFamily: 'var(--font-sans)' }}
                  >
                    {status === 'loading'
                      ? <><Loader2 size={12} className="animate-spin" /> Subscribing…</>
                      : <><Mail size={12} /> Subscribe for Free</>
                    }
                  </button>
                  <p className="text-[11px]" style={{ color: FGFAINT, fontFamily: 'var(--font-sans)' }}>
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
