import { Star, Quote } from 'lucide-react';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';

export interface ReviewCardData {
  id: string;
  name: string;
  rating: number;
  title?: string;
  body: string;
  service?: string;
  submittedAt: string;
}

interface ReviewCardProps {
  review: ReviewCardData;
  compact?: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          fill={s <= rating ? GOLD : 'none'}
          stroke={s <= rating ? GOLD : 'rgba(61,46,38,0.2)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReviewCard({ review, compact = false }: ReviewCardProps) {
  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5 sm:p-6 relative"
      style={{
        background: '#fff',
        border: '1.5px solid rgba(61,46,38,0.08)',
        boxShadow: '0 2px 16px rgba(61,46,38,0.05)',
      }}
    >
      {/* Quote icon */}
      <div
        className="absolute top-5 right-5 opacity-10"
        aria-hidden="true"
      >
        <Quote size={28} style={{ color: GOLD }} />
      </div>

      {/* Stars + service */}
      <div className="flex items-center justify-between mb-3">
        <Stars rating={review.rating} />
        {review.service && (
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}
          >
            {review.service}
          </span>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <h3
          className="font-semibold text-sm mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}
        >
          {review.title}
        </h3>
      )}

      {/* Body */}
      <p
        className={`text-sm leading-relaxed flex-1 ${compact ? 'line-clamp-4' : ''}`}
        style={{ color: 'hsl(20 15% 40%)' }}
      >
        {review.body}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(61,46,38,0.07)' }}>
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
          style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}
        >
          {initials(review.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: TAUPE }}>{review.name}</p>
          <p className="text-xs" style={{ color: 'hsl(20 15% 60%)' }}>{formatDate(review.submittedAt)}</p>
        </div>
      </div>
    </div>
  );
}
