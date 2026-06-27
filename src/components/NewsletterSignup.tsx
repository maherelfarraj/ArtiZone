import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

interface NewsletterSignupProps {
  /** 'section' = full standalone section with heading; 'strip' = compact inline strip */
  variant?: 'section' | 'strip';
  /** Used for analytics source tracking */
  source?: string;
}

async function trackEvent(type: 'form_view' | 'form_submit', source?: string, email?: string) {
  try {
    await fetch('/api/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, source, email }),
    });
  } catch {
    // Silently ignore tracking failures
  }
}

export default function NewsletterSignup({ variant = 'section', source }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const viewTracked = useRef(false);

  // Track form view once when it becomes visible
  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    void trackEvent('form_view', source ?? variant);
  }, [source, variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Track submit attempt
    void trackEvent('form_submit', source ?? variant, email.trim());

    setStatus('loading');
    setMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: normalizedEmail, source: 'website' });

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          setMessage('You are already subscribed!');
          setEmail('');
          setName('');
          return;
        }

        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      setName('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  /* ── STRIP variant ─────────────────────────────────────────────────────── */
  if (variant === 'strip') {
    return (
      <div className="w-full">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm font-medium py-2"
              style={{ color: GOLD }}
            >
              <CheckCircle size={16} />
              {message}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-all"
                style={{
                  background: 'rgba(249,245,240,0.1)',
                  border: '1.5px solid rgba(201,169,110,0.35)',
                  color: '#FDFAF6',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.35)')}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
                style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-sans)' }}
              >
                {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : null}
                Subscribe
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {status === 'error' && (
          <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{message}</p>
        )}
      </div>
    );
  }

  /* ── SECTION variant ───────────────────────────────────────────────────── */
  return (
    <section
      className="py-16 sm:py-20 relative overflow-hidden"
      style={{ background: TAUPE }}
    >
      {/* Decorative blobs */}
      <div
        className="hidden sm:block absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: GOLD }}
      />
      <div
        className="hidden sm:block absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: GOLD }}
      />

      <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}
            >
              <Sparkles size={12} />
              Stay in the Loop
            </span>

            <h2
              className="font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.6rem)' }}
            >
              Get Exclusive Offers & Beauty Tips
            </h2>
            <p className="text-sm sm:text-base mb-8" style={{ color: 'rgba(249,245,240,0.65)' }}>
              Join our newsletter and be the first to know about special deals, new treatments, and expert skincare advice — straight to your inbox.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.2)' }}
                >
                  <CheckCircle size={28} style={{ color: GOLD }} />
                </div>
                <p className="text-base font-semibold text-white">{message}</p>
                <p className="text-sm" style={{ color: 'rgba(249,245,240,0.55)' }}>
                  We'll be in touch with the latest offers and tips.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
              >
                {/* Name + Email row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(249,245,240,0.08)',
                      border: '1.5px solid rgba(201,169,110,0.3)',
                      color: '#FDFAF6',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = GOLD)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address *"
                    required
                    className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(249,245,240,0.08)',
                      border: '1.5px solid rgba(201,169,110,0.3)',
                      color: '#FDFAF6',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = GOLD)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <p className="text-sm text-center" style={{ color: '#f87171' }}>{message}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto mx-auto px-10 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-sans)' }}
                >
                  {status === 'loading' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Mail size={16} />
                  )}
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe Now'}
                </button>

                <p className="text-xs mt-1" style={{ color: 'rgba(249,245,240,0.35)' }}>
                  No spam, ever. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
