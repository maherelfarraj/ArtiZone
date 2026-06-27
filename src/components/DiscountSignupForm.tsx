import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Tag, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const FOREST = '#0E2A3A';   /* deep warm brown */
const MINT   = '#C4A882';   /* caramel tan */
const GREEN  = '#ADAF10';   /* dusty mauve */

interface FormState {
  name: string;
  email: string;
  phone: string;
}

interface ApiResponse {
  success?: boolean;
  code?: string;
  message?: string;
  error?: string;
  alreadyRegistered?: boolean;
}

export default function DiscountSignupForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<ApiResponse | null>(null);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!form.phone.trim() || form.phone.trim().length < 7) e.phone = 'Please enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/discount-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: ApiResponse = await res.json();
      if (data.success) {
        setResult(data);
        setStatus('success');
      } else {
        setResult(data);
        setStatus('error');
      }
    } catch {
      setResult({ error: 'Something went wrong. Please try again.' });
      setStatus('error');
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'rgba(26,10,2,0.98)', border: '1px solid rgba(156,72,11,0.25)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(156,72,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(156,72,11,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${MINT}50, transparent)` }} />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {status === 'success' && result ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-14 h-14 flex items-center justify-center mb-5"
                style={{ background: 'rgba(156,72,11,0.20)', border: `1px solid rgba(225,149,42,0.30)` }}>
                <CheckCircle size={28} style={{ color: MINT }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.95)', fontSize: '1.5rem' }}>
                {result.alreadyRegistered ? 'Welcome Back!' : 'You\'re In!'}
              </h3>
              <p className="text-sm mb-6 max-w-xs" style={{ color: 'rgba(235,242,238,0.55)', fontFamily: 'var(--font-sans)' }}>
                {result.alreadyRegistered
                  ? 'You\'re already registered. Your discount code has been resent to your email.'
                  : 'Your 10% discount code has been sent to your email. Check your inbox!'}
              </p>

              {/* Code display */}
              <div className="w-full max-w-xs mb-6 py-5 px-6 text-center"
                style={{ background: '#0d0200', border: `1px solid rgba(225,149,42,0.25)` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.20em] mb-2" style={{ color: 'rgba(225,149,42,0.60)', fontFamily: 'var(--font-sans)' }}>
                  Your Discount Code
                </p>
                <p className="text-2xl font-bold tracking-[0.12em]"
                  style={{ color: MINT, fontFamily: 'monospace' }}>
                  {result.code}
                </p>
                <p className="text-[10px] mt-2" style={{ color: 'rgba(235,242,238,0.35)', fontFamily: 'var(--font-sans)' }}>
                  10% off all services — mention when booking
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} style={{ color: MINT }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>
                    Exclusive Offer
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.95)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 400, lineHeight: 1.2 }}>
                  Sign Up & Get <em style={{ color: MINT, fontStyle: 'italic' }}>10% Off</em> All Services
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'rgba(235,242,238,0.45)', fontFamily: 'var(--font-sans)' }}>
                  Enter your details below and we'll send your personal discount code straight to your inbox.
                </p>
              </div>

              {/* Error banner */}
              {status === 'error' && result?.error && (
                <div className="flex items-center gap-2 px-4 py-3 mb-5 text-sm"
                  style={{ background: 'rgba(220,39,67,0.12)', border: '1px solid rgba(220,39,67,0.25)', color: '#ff6b7a', fontFamily: 'var(--font-sans)' }}>
                  <AlertCircle size={14} className="shrink-0" />
                  {result.error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] mb-1.5"
                    style={{ color: 'rgba(235,242,238,0.50)', fontFamily: 'var(--font-sans)' }}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(225,149,42,0.45)' }} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(26,10,2,0.70)',
                        border: `1px solid ${errors.name ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)'}`,
                        color: 'rgba(250,246,240,0.85)',
                        fontFamily: 'var(--font-sans)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(225,149,42,0.55)')}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.name ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)')}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-[11px]" style={{ color: '#ff6b7a', fontFamily: 'var(--font-sans)' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] mb-1.5"
                    style={{ color: 'rgba(235,242,238,0.50)', fontFamily: 'var(--font-sans)' }}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(225,149,42,0.45)' }} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(26,10,2,0.70)',
                        border: `1px solid ${errors.email ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)'}`,
                        color: 'rgba(250,246,240,0.85)',
                        fontFamily: 'var(--font-sans)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(225,149,42,0.55)')}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.email ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)')}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-[11px]" style={{ color: '#ff6b7a', fontFamily: 'var(--font-sans)' }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] mb-1.5"
                    style={{ color: 'rgba(235,242,238,0.50)', fontFamily: 'var(--font-sans)' }}>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(225,149,42,0.45)' }} />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="+962 79 000 0000"
                      className="w-full pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(26,10,2,0.70)',
                        border: `1px solid ${errors.phone ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)'}`,
                        color: 'rgba(250,246,240,0.85)',
                        fontFamily: 'var(--font-sans)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(225,149,42,0.55)')}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.phone ? 'rgba(220,39,67,0.50)' : 'rgba(156,72,11,0.30)')}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-[11px]" style={{ color: '#ff6b7a', fontFamily: 'var(--font-sans)' }}>{errors.phone}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-[0.20em] transition-all duration-200 hover:opacity-85 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ background: `linear-gradient(135deg, ${MINT} 0%, ${GREEN} 100%)`, color: FOREST, fontFamily: 'var(--font-sans)', boxShadow: '0 0 20px rgba(225,149,42,0.20)' }}
                >
                  {status === 'loading'
                    ? <><Loader2 size={13} className="animate-spin" /> Sending Code...</>
                    : <><Tag size={13} /> Get My 10% Discount Code</>
                  }
                </button>

                <p className="text-[10px] text-center" style={{ color: 'rgba(235,242,238,0.28)', fontFamily: 'var(--font-sans)' }}>
                  Your information is kept private and never shared.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
