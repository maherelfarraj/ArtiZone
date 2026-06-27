import { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';

/* ── 2026 Palette ─────────────────────────────────────────────────────────── */
const CHARCOAL = '#0E2A3A';
const TEAL     = '#C4A882';

const testimonials = [
  { name: 'Rania A.',    service: 'HydraFacial',          rating: 5, text: 'My skin has never looked this good! The team is so professional and the clinic is spotless. I come every month now.' },
  { name: 'Khaled M.',   service: "Men's Laser",           rating: 5, text: 'Finally found a clinic where I feel comfortable as a man. The laser results are incredible — totally worth it.' },
  { name: 'Sara H.',     service: 'Nail Art',              rating: 5, text: 'The nail art is absolutely stunning. They take their time and the quality lasts for weeks. Highly recommend!' },
  { name: 'Lina T.',     service: 'Body Slimming',         rating: 5, text: 'After 5 sessions of cavitation I can see a real difference. The staff explained everything clearly and made me feel at ease.' },
  { name: 'Nour K.',     service: 'Chemical Peel',         rating: 5, text: 'Incredible results after just 2 sessions. My pigmentation has faded so much. The clinic is clean and the staff are lovely.' },
  { name: 'Ahmad S.',    service: 'Laser Hair Removal',    rating: 5, text: 'Best laser clinic in Amman without a doubt. Very professional, no pain, and the results speak for themselves.' },
  { name: 'Dina F.',     service: 'Eyebrow Shaping',       rating: 5, text: 'They shaped my brows perfectly — exactly what I wanted. I get compliments every day now. Will definitely be back!' },
  { name: 'Mariam J.',   service: 'Oxygen Facial',         rating: 5, text: 'The oxygen facial left my skin glowing for days. Such a relaxing experience in a beautiful, clean environment.' },
  { name: 'Omar R.',     service: "Men's Grooming",        rating: 5, text: 'Great experience from start to finish. The team is knowledgeable and the results are exactly what I was looking for.' },
  { name: 'Hana B.',     service: 'Microneedling',         rating: 5, text: 'My acne scars have improved so much after 3 sessions. I feel so much more confident. Thank you ArtiZone!' },
];

// Duplicate for seamless desktop scroll loop
const doubled = [...testimonials, ...testimonials];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < rating ? TEAL : 'none'}
          stroke={i < rating ? TEAL : 'rgba(253,250,246,0.20)'}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="flex flex-col gap-3 p-5"
      style={{
        background: 'rgba(196,168,130,0.08)',
        border: '1px solid rgba(196,168,130,0.18)',
      }}
    >
      <StarRating rating={t.rating} />
      <p className="text-sm leading-relaxed flex-1"
        style={{ color: 'rgba(253,250,246,0.72)', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
        "{t.text}"
      </p>
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(196,168,130,0.14)' }}>
        <div>
          <p className="text-xs font-semibold" style={{ color: 'rgba(253,250,246,0.88)', fontFamily: 'var(--font-sans)' }}>{t.name}</p>
          <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: TEAL, fontFamily: 'var(--font-sans)', opacity: 0.80 }}>{t.service}</p>
        </div>
        <div className="w-6 h-6 flex items-center justify-center"
          style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.28)' }}>
          <span style={{ color: TEAL, fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>★</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsStrip() {
  const [expanded, setExpanded] = useState(false);

  // Mobile: show 3, expand to 6. Desktop: infinite scroll strip.
  const mobileVisible = expanded ? testimonials.slice(0, 6) : testimonials.slice(0, 3);

  return (
    <div style={{ background: CHARCOAL }}>

      {/* ── MOBILE: static grid (< lg) ─────────────────────────────────────── */}
      <div className="lg:hidden px-5 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mobileVisible.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* See More / See Less */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setExpanded(v => !v)}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 hover:opacity-80"
            style={{
              border: `1px solid rgba(196,168,130,0.35)`,
              color: TEAL,
              background: 'rgba(196,168,130,0.10)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {expanded ? 'See Less' : 'See More Reviews'}
            <ChevronDown
              size={13}
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
            />
          </button>
        </div>
      </div>

      {/* ── DESKTOP: infinite scroll strip (≥ lg) ─────────────────────────── */}
      <div className="hidden lg:block relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${CHARCOAL}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${CHARCOAL}, transparent)` }} />

        {/* Scrolling track */}
        <div
          className="flex gap-4 py-2"
          style={{
            animation: 'testimonials-scroll 60s linear infinite',
            width: 'max-content',
          }}
        >
          {doubled.map((t, i) => (
            <div key={i} className="flex-none w-80">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonials-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
