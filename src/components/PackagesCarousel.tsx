import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const BARK    = '#0E2A3A';   /* Charcoal — section bg */
const MINT    = '#C4A882';   /* Muted Teal — accent */
const CREAM   = '#F5F0E8';   /* Off-white — light text */

const PACKAGES = [
  {
    name: 'Glow Skin Package',
    treatments: ['Deep cleansing facial', 'Hydrafacial', 'LED light therapy'],
    tag: 'Most Popular',
    // Emerald green — matches brand, fresh & vibrant
    accent: '#4ade80',
    accentDim: 'rgba(74,222,128,0.12)',
    border: 'rgba(74,222,128,0.28)',
    cardBg: 'rgba(74,222,128,0.05)',
  },
  {
    name: 'Laser Smooth Package',
    treatments: ['Full body laser', 'Underarm touch-up'],
    tag: 'Best Value',
    // Electric cyan — cool, tech-forward, laser feel
    accent: '#22d3ee',
    accentDim: 'rgba(34,211,238,0.12)',
    border: 'rgba(34,211,238,0.28)',
    cardBg: 'rgba(34,211,238,0.05)',
  },
  {
    name: 'Slim Body Package',
    treatments: ['Cavitation slimming', 'Radiofrequency treatment', 'Lymphatic drainage massage'],
    tag: 'Body Goals',
    // Warm amber gold — energy, transformation
    accent: '#fbbf24',
    accentDim: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.28)',
    cardBg: 'rgba(251,191,36,0.05)',
  },
  {
    name: 'Bride-to-Be Package',
    treatments: ['Facial treatment', 'Full body laser', 'Nails', 'Body scrub', 'Makeup trial'],
    tag: 'Bridal',
    // Soft rose pink — romantic, feminine, bridal
    accent: '#f472b6',
    accentDim: 'rgba(244,114,182,0.12)',
    border: 'rgba(244,114,182,0.28)',
    cardBg: 'rgba(244,114,182,0.05)',
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.10, ease: 'easeOut' as const },
  }),
};

function PackageCard({ pkg, i }: { pkg: typeof PACKAGES[0]; i: number }) {
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="flex flex-col p-6 sm:p-7 h-full relative group transition-all duration-300"
      style={{
        background: pkg.cardBg,
        border: `1px solid ${pkg.border}`,
        boxShadow: `0 0 0 0 ${pkg.accent}00`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = pkg.accentDim;
        el.style.borderColor = pkg.accent + '66';
        el.style.boxShadow = `0 8px 32px ${pkg.accent}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = pkg.cardBg;
        el.style.borderColor = pkg.border;
        el.style.boxShadow = `0 0 0 0 ${pkg.accent}00`;
      }}
    >
      {/* Top accent line — always visible, colored per package */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(to right, ${pkg.accent}, ${pkg.accent}44, transparent)` }}
      />

      {/* Tag */}
      <span
        className="text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 self-start mb-5"
        style={{
          color: pkg.accent,
          border: `1px solid ${pkg.accent}55`,
          background: `${pkg.accent}15`,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {pkg.tag}
      </span>

      <h3
        className="text-xl font-medium mb-5"
        style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.95)' }}
      >
        {pkg.name}
      </h3>

      <ul className="space-y-3 mb-8 flex-1">
        {pkg.treatments.map(t => (
          <li
            key={t}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: 'rgba(253,250,246,0.75)', fontFamily: 'var(--font-sans)' }}
          >
            <span style={{ color: pkg.accent, marginTop: 2, fontSize: 9, flexShrink: 0 }}>◆</span>
            {t}
          </li>
        ))}
      </ul>

      <Link
        to="/booking"
        className="text-center py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-200"
        style={{ background: pkg.accent, color: BARK, fontFamily: 'var(--font-sans)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      >
        Book Now
      </Link>
    </motion.div>
  );
}

export default function PackagesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 sm:py-28" style={{ background: BARK }}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3"
              style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>
              Curated for You
            </p>
            <h2
              className="font-medium leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(2rem,4vw,3.4rem)' }}
            >
              Popular Packages
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${MINT}88)` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: MINT }} />
              <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${MINT}88)` }} />
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs lg:text-right"
            style={{ color: 'rgba(253,250,246,0.65)', fontFamily: 'var(--font-sans)' }}>
            Bundled treatments at better value — designed around your beauty goals.
          </p>
        </motion.div>

        {/* ── Mobile / tablet: Embla carousel ── */}
        <div className="xl:hidden">
          <div ref={emblaRef} className="overflow-hidden -mx-1">
            <div className="flex gap-4 px-1" style={{ touchAction: 'pan-y' }}>
              {PACKAGES.map((pkg, i) => (
                <div key={pkg.name} className="flex-none w-[82vw] sm:w-[44vw]">
                  <PackageCard pkg={pkg} i={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              {PACKAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to package ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: i === selectedIndex ? 20 : 6,
                    height: 6,
                    background: i === selectedIndex ? MINT : 'rgba(196,168,130,0.28)',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous package"
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{ border: '1px solid rgba(196,168,130,0.28)', color: MINT, background: 'rgba(196,168,130,0.10)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next package"
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{ border: '1px solid rgba(196,168,130,0.28)', color: MINT, background: 'rgba(196,168,130,0.10)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop: 4-col grid ── */}
        <div className="hidden xl:grid xl:grid-cols-4 gap-5">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} i={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:gap-3"
            style={{ color: CREAM, fontFamily: 'var(--font-sans)' }}
          >
            View All Packages <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
