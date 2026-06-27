import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const MINT  = '#C4A882';    /* caramel tan */
const FOREST = '#D0BC99';   /* warm taupe */

interface BeforeAfterItem {
  id: number;
  treatment: string;
  category: string;
  result: string;
  image: string; // single image used for both sides with filter trick
}

const items: BeforeAfterItem[] = [
  { id: 1, treatment: 'HydraFacial + LED Therapy',         category: 'Skin Care', result: 'Visibly brighter, smoother skin after 3 sessions',         image: '/airo-assets/images/before-after/skin-care' },
  { id: 2, treatment: 'Full Leg Laser Hair Removal',        category: 'Laser',     result: 'Smooth, hair-free legs after 6 sessions',                  image: '/airo-assets/images/before-after/laser'     },
  { id: 3, treatment: 'Cavitation + RF Body Contouring',    category: 'Body',      result: 'Noticeable inch loss and skin tightening after 5 sessions', image: '/airo-assets/images/before-after/body'      },
  { id: 4, treatment: "Men's Deep Cleansing Facial",        category: "Men's",     result: 'Clearer, healthier skin after 2 sessions',                  image: '/airo-assets/images/before-after/mens'      },
  { id: 5, treatment: 'Eyebrow Shaping & Tinting',          category: 'Brows',     result: 'Defined, natural-looking brows',                            image: '/airo-assets/images/before-after/brows'     },
  { id: 6, treatment: 'Gel Manicure with Nail Art',         category: 'Nails',     result: 'Long-lasting, elegant nail finish',                         image: '/airo-assets/images/before-after/nails'     },
];

function CompareSlider({ item }: { item: BeforeAfterItem }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => { updatePosition(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none cursor-col-resize"
      style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* AFTER side — full image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={item.image}
          alt={`${item.treatment} — after result at ArtiZone beauty clinic Amman`}
          className="w-full h-full object-cover"
          width={800} height={600}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
      </div>

      {/* BEFORE side (left clip) — same image with desaturated overlay */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <OptimizedImage
          src={item.image}
          alt={`${item.treatment} — before treatment at ArtiZone beauty clinic Amman`}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(0.7) brightness(0.85)', width: containerRef.current?.offsetWidth ?? '100%' }}
          width={800} height={600}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(14,42,58,0.35)' }} />
        {/* Before label */}
        <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1"
          style={{ background: 'rgba(28,58,46,0.80)', color: 'rgba(235,242,238,0.80)', fontFamily: 'var(--font-sans)', backdropFilter: 'blur(4px)' }}>
          Before
        </span>
      </div>

      {/* After label */}
      <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1"
        style={{ background: 'rgba(58,140,110,0.80)', color: '#fff', fontFamily: 'var(--font-sans)', backdropFilter: 'blur(4px)' }}>
        After
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
        style={{ left: `${position}%`, background: MINT, boxShadow: `0 0 12px ${MINT}80` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center pointer-events-none"
        style={{ left: `${position}%`, background: MINT, boxShadow: `0 0 0 3px rgba(196,168,130,0.30), 0 4px 16px rgba(0,0,0,0.35)` }}
      >
        <div className="flex items-center gap-0.5">
          <ChevronLeft size={10} style={{ color: '#0E2A3A' }} />
          <ChevronRight size={10} style={{ color: '#0E2A3A' }} />
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const prev = () => goTo((current - 1 + items.length) % items.length, -1);
  const next = () => goTo((current + 1) % items.length, 1);

  const item = items[current];

  return (
    <div className="w-full">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200"
            style={{
              fontFamily: 'var(--font-sans)',
              background: i === current ? FOREST : 'rgba(196,168,130,0.12)',
              color: i === current ? '#FDFAF6' : 'rgba(253,250,246,0.50)',
              border: `1px solid ${i === current ? FOREST : 'rgba(196,168,130,0.22)'}`,
            }}
          >
            {it.category}
          </button>
        ))}
      </div>

      {/* Slider card */}
      <div className="relative overflow-hidden" style={{ background: '#3A2214', border: '1px solid rgba(196,168,130,0.22)' }}>
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
        >
          <CompareSlider item={item} />
        </motion.div>

        {/* Info bar */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>
              {item.category}
            </p>
            <h3 className="font-medium leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.92)', fontSize: '1.1rem' }}>
              {item.treatment}
            </h3>
            <p className="text-xs" style={{ color: 'rgba(235,242,238,0.45)', fontFamily: 'var(--font-sans)' }}>
              {item.result}
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] shrink-0" style={{ color: 'rgba(126,207,176,0.40)', fontFamily: 'var(--font-sans)' }}>
            Drag to compare
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to item ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? MINT : 'rgba(126,207,176,0.25)',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:opacity-80"
            style={{ border: '1px solid rgba(126,207,176,0.25)', color: MINT, background: 'rgba(58,140,110,0.10)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} aria-label="Next"
            className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:opacity-80"
            style={{ border: '1px solid rgba(126,207,176,0.25)', color: MINT, background: 'rgba(58,140,110,0.10)' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
