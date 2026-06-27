import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, Loader2, MessageSquarePlus } from 'lucide-react';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

const SERVICES = [
  'Face & Skin Care',
  'Laser Hair Removal',
  'Body Slimming',
  'Nails & Foot Care',
  "Men's Grooming",
  'Hair Removal',
  'Other',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 18px',
  borderRadius: '50px',
  border: '1.5px solid rgba(61,46,38,0.15)',
  background: '#fff',
  fontSize: '14px',
  color: TAUPE,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  borderRadius: '16px',
  resize: 'vertical',
  minHeight: '110px',
  padding: '14px 18px',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233D2E26' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 18px center',
  paddingRight: '40px',
};

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setErrorMsg('Please select a star rating.'); return; }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email || undefined, rating, title: title || undefined, body, service: service || undefined }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setStatus('success');
        onSuccess?.();
      } else {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = GOLD;
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(61,46,38,0.15)';
  };

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-10 text-center"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)' }}>
            <CheckCircle size={28} style={{ color: GOLD }} />
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
            Thank you for your review!
          </h3>
          <p className="text-sm" style={{ color: 'hsl(20 15% 50%)' }}>
            Your review has been submitted and is awaiting approval. We appreciate your feedback.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Star rating */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(20 15% 50%)' }}>
              Your Rating *
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star`}
                >
                  <Star
                    size={28}
                    fill={(hovered || rating) >= star ? GOLD : 'none'}
                    stroke={(hovered || rating) >= star ? GOLD : 'rgba(61,46,38,0.25)'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Name *</label>
              <input
                style={inputStyle}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                minLength={2}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Email <span style={{ color: 'hsl(20 15% 65%)' }}>(optional)</span></label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
          </div>

          {/* Service + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Service <span style={{ color: 'hsl(20 15% 65%)' }}>(optional)</span></label>
              <select
                style={selectStyle}
                value={service}
                onChange={(e) => setService(e.target.value)}
                onFocus={focusBorder}
                onBlur={blurBorder}
              >
                <option value="">Select a service…</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Review Title <span style={{ color: 'hsl(20 15% 65%)' }}>(optional)</span></label>
              <input
                style={inputStyle}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Amazing results!"
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'hsl(20 15% 50%)' }}>Your Review *</label>
            <textarea
              style={textareaStyle}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell us about your experience…"
              required
              minLength={10}
              onFocus={focusBorder as React.FocusEventHandler<HTMLTextAreaElement>}
              onBlur={blurBorder as React.FocusEventHandler<HTMLTextAreaElement>}
            />
          </div>

          {/* Error */}
          {(status === 'error' || errorMsg) && (
            <p className="text-sm" style={{ color: '#dc2626' }}>{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-sans)' }}
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <MessageSquarePlus size={16} />}
            {status === 'loading' ? 'Submitting…' : 'Submit Review'}
          </button>

          <p className="text-xs" style={{ color: 'hsl(20 15% 60%)' }}>
            Reviews are moderated before publishing. We never share your email.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
