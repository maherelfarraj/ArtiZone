import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

/* ── Types ────────────────────────────────────────────────────────────────── */
export interface Review {
  reviewId: string;
  reviewer: { displayName: string; profilePhotoUrl?: string };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
}

interface GoogleReviewsProps {
  reviews: Review[];
  title?: string;
  maxVisible?: number;
  className?: string;
}

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const IVORY = '#FDFAF6';
const PARCH = '#F7F3EE';
const SAGE  = '#6B7260';

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' as const },
  }),
};

/* ── Google logo SVG ──────────────────────────────────────────────────────── */
function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Google" role="img">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Star row ─────────────────────────────────────────────────────────────── */
function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} fill={i <= n ? GOLD : 'none'} stroke={i <= n ? GOLD : '#ccc'} />
      ))}
    </div>
  );
}

/* ── Avatar ───────────────────────────────────────────────────────────────── */
function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        width={44} height={44}
        loading="lazy"
        decoding="async"
        className="rounded-full object-cover shrink-0"
        style={{ width: 44, height: 44 }}
      />
    );
  }
  return (
    <div className="rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
      style={{ width: 44, height: 44, background: `rgba(196,168,130,0.18)`, color: GOLD, border: `1px solid rgba(196,168,130,0.30)` }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ── Truncate comment with "read more" ───────────────────────────────────── */
function Comment({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const MAX = 160;
  const needsTrunc = text.length > MAX;
  const shown = expanded || !needsTrunc ? text : text.slice(0, MAX) + '…';

  return (
    <p className="text-sm leading-relaxed" style={{ color: SAGE }}>
      {shown}
      {needsTrunc && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: GOLD }}>
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </p>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function GoogleReviews({
  reviews,
  title = 'What Our Clients Say',
  maxVisible = 6,
  className = '',
}: GoogleReviewsProps) {
  /* Only show 5-star reviews publicly */
  const fiveStars = reviews.filter(r => r.starRating === 'FIVE');
  const visible   = fiveStars.slice(0, maxVisible);

  if (visible.length === 0) return null;

  /* Compute aggregate */
  const avg = (reviews.reduce((s, r) => s + (STAR_MAP[r.starRating] ?? 5), 0) / reviews.length).toFixed(1);

  return (
    <section className={`py-16 sm:py-20 ${className}`} style={{ background: PARCH }}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GoogleLogo />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>
                Google Reviews
              </span>
            </div>
            <h2 className="font-medium leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}>
              {title}
            </h2>
          </div>
          {/* Aggregate badge */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl shrink-0"
            style={{ background: NAVY, boxShadow: '0 4px 16px rgba(14,42,58,0.14)' }}>
            <div className="text-center">
              <p className="text-2xl font-bold leading-none" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>{avg}</p>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={GOLD} stroke={GOLD} />)}
              </div>
            </div>
            <div className="border-l pl-3" style={{ borderColor: 'rgba(196,168,130,0.20)' }}>
              <p className="text-xs font-medium" style={{ color: IVORY }}>{reviews.length} reviews</p>
              <div className="flex items-center gap-1 mt-0.5">
                <GoogleLogo />
                <span className="text-[10px]" style={{ color: 'rgba(253,250,246,0.50)' }}>Google</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((review, i) => {
            const stars = STAR_MAP[review.starRating] ?? 5;
            const date  = new Date(review.createTime).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
            return (
              <motion.div key={review.reviewId} custom={i} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-col gap-4 rounded-2xl p-6"
                style={{
                  background: IVORY,
                  border: '1px solid rgba(196,168,130,0.18)',
                  boxShadow: '0 2px 16px rgba(14,42,58,0.06)',
                }}>

                {/* Quote icon */}
                <Quote size={20} style={{ color: 'rgba(196,168,130,0.35)' }} />

                {/* Comment */}
                {review.comment
                  ? <Comment text={review.comment} />
                  : <p className="text-sm italic" style={{ color: 'rgba(107,114,96,0.60)' }}>No written comment.</p>
                }

                {/* Stars */}
                <StarRow n={stars} />

                {/* Reviewer row */}
                <div className="flex items-center gap-3 mt-auto pt-3"
                  style={{ borderTop: '1px solid rgba(196,168,130,0.14)' }}>
                  <Avatar name={review.reviewer.displayName} photoUrl={review.reviewer.profilePhotoUrl} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
                      {review.reviewer.displayName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <GoogleLogo />
                      <span className="text-[10px]" style={{ color: 'rgba(107,114,96,0.60)' }}>{date}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
