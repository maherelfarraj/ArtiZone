import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag, ArrowRight, Star, MessageCircle } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

/* ── Brand tokens — Ocean Wellness ───────────────────────────────────────── */
const TEAL        = '#C4A882'; /* Warm Terracotta — primary accent       */
const TERRACOTTA  = '#C4A882'; /* alias                                  */
const MUSTARD     = '#6B7260'; /* Forest Olive — secondary accent        */
const CREAM       = '#FDFAF6'; /* Warm White                             */

/* ── Social icons (inline SVG) ────────────────────────────────────────────── */
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

/* ── Slide data ───────────────────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    eyebrow: 'Beauty Clinic in Amman, Jordan',
    heading: 'Skin, Laser & Beauty',
    headingEm: 'Clinic in Amman',
    headingSuffix: 'for Women & Men',
    desc: 'Laser hair removal, HydraFacial, body slimming, nails & more — all in one premium aesthetic clinic. 4.9★ on Google · 200+ reviews · Free consultation.',
    image: '/airo-assets/images/services/hero-video',
    cta: { label: 'Book Appointment', to: '/booking' },
    ctaSecondary: { label: 'View Services', to: '/services' },
    badge: null,
    accent: TEAL,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.72) 0%, rgba(14,42,58,0.28) 50%, rgba(14,42,58,0.95) 100%)`,
    shimmer: `radial-gradient(ellipse at 75% 25%, rgba(174,131,99,0.22) 0%, transparent 55%)`,
  },
  {
    id: 5,
    eyebrow: 'Eid Mubarak — Limited Time',
    heading: 'Celebrate Eid',
    headingEm: 'with Radiant',
    headingSuffix: 'Skin & Beauty',
    desc: 'Up to 30% off on facials, laser, nails, and body treatments — exclusively for Eid. Book now before slots fill up.',
    image: '/airo-assets/images/services/facial-video',
    cta: { label: 'See Eid Offers', to: '/special-offers' },
    ctaSecondary: { label: 'Book Now', to: '/booking' },
    badge: 'Up to 30% Off',
    accent: TERRACOTTA,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.65) 0%, rgba(14,42,58,0.22) 45%, rgba(14,42,58,0.95) 100%)`,
    shimmer: `radial-gradient(ellipse at 70% 30%, rgba(174,131,99,0.28) 0%, transparent 60%)`,
  },
  {
    id: 6,
    eyebrow: 'Special Offer',
    heading: 'Book 3 Sessions,',
    headingEm: 'Get the 4th',
    headingSuffix: 'Completely Free',
    desc: 'Every visit brings you closer to a free treatment. Book a bundle and enjoy premium care at unbeatable value.',
    image: '/airo-assets/images/services/booking-cta-video',
    cta: { label: 'View Packages', to: '/packages' },
    ctaSecondary: { label: 'Book Now', to: '/booking' },
    badge: '4th Session Free',
    accent: MUSTARD,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.70) 0%, rgba(14,42,58,0.22) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 72% 28%, rgba(85,92,76,0.28) 0%, transparent 58%)`,
  },
  {
    id: 7,
    eyebrow: 'Premium Packages',
    heading: 'Bundle & Save',
    headingEm: 'Up to 30%',
    headingSuffix: 'on Top Treatments',
    desc: 'Curated treatment bundles at unbeatable prices — Radiance Skin, Laser Smooth, Bridal Glow, and more. One booking, total transformation.',
    image: '/airo-assets/images/services/slimming-video',
    cta: { label: 'View All Packages', to: '/packages-amman' },
    ctaSecondary: { label: 'Book a Package', to: '/booking' },
    badge: 'Save up to 30%',
    accent: TEAL,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.68) 0%, rgba(14,42,58,0.18) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 68% 28%, rgba(174,131,99,0.22) 0%, transparent 56%)`,
  },
  {
    id: 2,
    eyebrow: 'Special Offer',
    heading: 'Get',
    headingEm: '10% Off',
    headingSuffix: 'All Services',
    desc: 'Sign up with your name, email, and phone number to receive your personal discount code — valid on every treatment we offer.',
    image: '/airo-assets/images/services/booking-cta-video',
    cta: { label: 'Claim My Discount', to: '/special-offers#discount-signup' },
    ctaSecondary: { label: 'View Offers', to: '/offers-deals' },
    badge: '10% Off',
    accent: MUSTARD,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.62) 0%, rgba(14,42,58,0.18) 45%, rgba(14,42,58,0.95) 100%)`,
    shimmer: `radial-gradient(ellipse at 65% 25%, rgba(85,92,76,0.20) 0%, transparent 55%)`,
  },
  {
    id: 3,
    eyebrow: 'Laser Treatments',
    heading: 'Smooth Skin,',
    headingEm: 'Lasting Results',
    headingSuffix: 'with Precision Laser',
    desc: 'Advanced laser hair removal for all body areas — safe, effective, and long-lasting. For both women and men.',
    image: '/airo-assets/images/services/laser-video',
    cta: { label: 'Book Laser Session', to: '/booking' },
    ctaSecondary: { label: 'Learn More', to: '/laser-hair-removal-amman' },
    badge: null,
    accent: TEAL,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.65) 0%, rgba(14,42,58,0.16) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 65% 25%, rgba(174,131,99,0.20) 0%, transparent 55%)`,
  },
  {
    id: 8,
    eyebrow: 'Face & Skin Care',
    heading: 'Reveal Your',
    headingEm: 'Best Skin',
    headingSuffix: 'with Expert Facials',
    desc: 'HydraFacial, chemical peels, microneedling, and brightening treatments — tailored to your skin type by certified specialists.',
    image: '/airo-assets/images/services/facial-video',
    cta: { label: 'Explore Facials', to: '/services/face-skin-care' },
    ctaSecondary: { label: 'Book Now', to: '/booking' },
    badge: null,
    accent: '#C4A882',
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.62) 0%, rgba(14,42,58,0.18) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 72% 26%, rgba(174,131,99,0.22) 0%, transparent 56%)`,
  },
  {
    id: 9,
    eyebrow: 'Nails & Foot Care',
    heading: 'Elegant Nails,',
    headingEm: 'Flawless Finish',
    headingSuffix: 'Every Time',
    desc: 'Gel manicures, pedicures, nail art, and foot care — using premium polishes and strict sterilization standards.',
    image: '/airo-assets/images/services/nails-video',
    cta: { label: 'Book Nail Session', to: '/booking' },
    ctaSecondary: { label: 'Nail Services', to: '/services/nails-foot-care' },
    badge: null,
    accent: TERRACOTTA,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.58) 0%, rgba(14,42,58,0.16) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 70% 28%, rgba(174,131,99,0.20) 0%, transparent 56%)`,
  },
  {
    id: 4,
    eyebrow: "Men's Grooming",
    heading: 'Premium Care',
    headingEm: 'for Men',
    headingSuffix: 'in a Private Setting',
    desc: "Professional grooming, skin care, and laser treatments designed specifically for men — in a comfortable, private environment.",
    image: '/airo-assets/images/services/mens-video',
    cta: { label: "Book Men's Service", to: '/booking' },
    ctaSecondary: { label: "Men's Services", to: '/mens-services' },
    badge: null,
    accent: TEAL,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.62) 0%, rgba(14,42,58,0.16) 45%, rgba(14,42,58,0.95) 100%)`,
    shimmer: `radial-gradient(ellipse at 70% 30%, rgba(85,92,76,0.16) 0%, transparent 55%)`,
  },
  {
    id: 11,
    eyebrow: 'ArtiZone Rewards',
    heading: 'Earn Points,',
    headingEm: 'Unlock Perks',
    headingSuffix: 'on Every Visit',
    desc: 'Join ArtiZone Rewards and earn points on every treatment. Silver, Gold & Platinum tiers — the more you visit, the more we give back. Free to join.',
    image: '/airo-assets/images/services/loyalty-video',
    cta: { label: 'Join Rewards', to: '/loyalty' },
    ctaSecondary: { label: 'Learn More', to: '/loyalty' },
    badge: 'Free to Join',
    accent: TEAL,
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.68) 0%, rgba(14,42,58,0.20) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 72% 28%, rgba(196,168,130,0.26) 0%, transparent 58%)`,
  },
  {
    id: 10,
    eyebrow: 'Body Slimming',
    heading: 'Sculpt &',
    headingEm: 'Contour',
    headingSuffix: 'Your Body',
    desc: 'Cryolipolysis, radiofrequency tightening, and ultrasound cavitation — visible results with zero surgery and zero downtime.',
    image: '/airo-assets/images/services/slimming-video',
    cta: { label: 'Explore Body Treatments', to: '/services/body-slimming' },
    ctaSecondary: { label: 'Book Now', to: '/booking' },
    badge: null,
    accent: '#7c5a8a',
    overlay: `linear-gradient(160deg, rgba(14,42,58,0.65) 0%, rgba(14,42,58,0.18) 45%, rgba(14,42,58,0.96) 100%)`,
    shimmer: `radial-gradient(ellipse at 68% 28%, rgba(124,90,138,0.20) 0%, transparent 56%)`,
  },
];

/* ── Floating ambient words ───────────────────────────────────────────────── */
const AMBIENT = ['Glow', 'Laser', 'Nails', 'Skin', 'Beauty', 'Care', 'Radiance', 'Style'];

/* ── Social pill button ───────────────────────────────────────────────────── */
function SocialPill({
  href, icon, label, followers, accent,
}: {
  href: string; icon: React.ReactNode; label: string; followers: string; accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow ArtiZone on ${label}`}
      className="group flex items-center gap-2 px-3 py-2 transition-all duration-300 hover:scale-[1.03] active:scale-95"
      style={{
        background: 'rgba(253,250,246,0.06)',
        border: `1px solid rgba(253,250,246,0.12)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <span style={{ color: accent }} className="transition-transform duration-200 group-hover:scale-110 shrink-0">
        {icon}
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[8px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'rgba(253,250,246,0.40)', fontFamily: 'var(--font-sans)' }}>
          Follow on
        </span>
        <span className="text-[10px] font-semibold"
          style={{ color: 'rgba(253,250,246,0.80)', fontFamily: 'var(--font-sans)' }}>
          {label}
        </span>
      </div>
    </a>
  );
}

export default function HeroCarousel() {
  const [current, setCurrent]     = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused]       = useState(false);
  const [mounted, setMounted]     = useState(false);
  const sectionRef                = useRef<HTMLElement>(null);

  /* Defer ambient animations until after hydration to unblock FCP */
  useEffect(() => { setMounted(true); }, []);

  /* Disable ambient text on mobile — too many animated nodes hurts perf */
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  /* Parallax */
  const { scrollY } = useScroll();
  void useTransform(scrollY, [0, 600], ['0%', '18%']);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length, 1),  [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next, paused]);

  const slide = slides[current];

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: 'clamp(480px, 78svh, 780px)', perspective: '1200px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── Slide background image ──────────────────────────────────────── */}
      <AnimatePresence initial={true}>
        <motion.div
          key={slide.id + '-bg'}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' as const }}
        >
          {/* Fallback dark background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)' }} />
          <OptimizedImage
            src={slide.image}
            alt={`${slide.eyebrow} — ArtiZone Beauty Clinic Amman`}
            className="absolute inset-0 w-full h-full object-cover"
            priority={slide.id === 1}
            width={1920}
            height={1080}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ───────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id + '-overlay'}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ background: slide.overlay }}
        />
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id + '-shimmer'}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          style={{ background: slide.shimmer }}
        />
      </AnimatePresence>

      {/* Hard left vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(90deg, rgba(14,42,58,0.75) 0%, transparent 55%)` }} />

      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(0deg, rgba(14,42,58,0.88) 0%, rgba(14,42,58,0.32) 35%, transparent 65%)` }} />

      {/* ── Floating ambient text — only after hydration, only on desktop ── */}
      {mounted && !isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden>
          {AMBIENT.map((word, i) => (
            <motion.span
              key={word}
              className="absolute font-medium"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${10 + (i % 3) * 6}px, ${1.2 + (i % 3) * 0.6}vw, ${22 + (i % 3) * 10}px)`,
                color: i % 2 === 0 ? `rgba(174,131,99,0.10)` : `rgba(250,247,242,0.07)`,
                left: `${8 + (i * 11.5) % 82}%`,
                top:  `${10 + (i * 13.7) % 72}%`,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
              animate={{ y: [0, -14 - (i % 3) * 6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 5 + (i % 4) * 1.5, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' as const }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}



      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-lg sm:max-w-xl lg:max-w-md xl:max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ opacity: 0, y: d > 0 ? 40 : -40, filter: 'blur(6px)' }),
                center: { opacity: 1, y: 0, filter: 'blur(0px)' },
                exit:   (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30, filter: 'blur(4px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.60, ease: 'easeOut' as const }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <motion.div
                  className="h-px shrink-0"
                  style={{ background: slide.accent, width: 0 }}
                  animate={{ width: 18 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] leading-tight"
                  style={{ color: slide.accent, fontFamily: 'var(--font-sans)' }}>
                  {slide.eyebrow}
                </span>
                {slide.badge && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${TEAL}, #8a6245)`,
                      color: CREAM,
                      fontFamily: 'var(--font-sans)',
                    }}>
                    <Tag size={7} /> {slide.badge}
                  </span>
                )}
              </div>

              {/* Heading */}
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                color: CREAM,
                fontSize: 'clamp(1.45rem, 5.5vw, 4rem)',
                lineHeight: 1.1,
                fontWeight: 400,
                letterSpacing: '0.01em',
                marginBottom: '0.75rem',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                {slide.heading}{' '}
                <em style={{ color: slide.accent, fontStyle: 'italic' }}>{slide.headingEm}</em>
                <br className="hidden sm:block" />
                {' '}{slide.headingSuffix}
              </h1>

              {/* Accent rule */}
              <motion.div
                className="mb-4 sm:mb-5"
                style={{ height: 1, background: `linear-gradient(to right, ${slide.accent}, transparent)`, width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' as const }}
              />

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-xs sm:max-w-md"
                style={{ color: 'rgba(250,247,242,0.65)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                {slide.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2.5 mb-6 sm:mb-7">
                <Link
                  to={slide.cta.to}
                  className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3 sm:py-2.5 text-[10px] font-semibold uppercase tracking-[0.20em] transition-all duration-200 hover:opacity-90 active:scale-95 min-h-[44px] sm:min-h-0"
                  style={{ background: slide.accent, color: CREAM, fontFamily: 'var(--font-sans)' }}
                >
                  {slide.cta.label} <ArrowRight size={10} />
                </Link>
                <a
                  href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3 sm:py-2.5 text-[10px] font-semibold uppercase tracking-[0.20em] transition-all duration-200 hover:opacity-90 active:scale-95 min-h-[44px] sm:min-h-0"
                  style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}
                >
                  <MessageCircle size={11} /> WhatsApp Us
                </a>
                <Link
                  to={slide.ctaSecondary.to}
                  className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3 sm:py-2.5 sm:border text-[10px] font-semibold uppercase tracking-[0.20em] transition-all duration-200 border hover:opacity-80 min-h-[44px] sm:min-h-0"
                  style={{
                    color: 'rgba(250,247,242,0.70)',
                    fontFamily: 'var(--font-sans)',
                    borderColor: 'rgba(250,247,242,0.22)',
                    background: 'transparent',
                  }}
                >
                  {slide.ctaSecondary.label}
                </Link>
              </div>

              {/* ── Social follow pills ─────────────────────────────────── */}
              <div className="flex flex-wrap gap-2">
                <SocialPill
                  href="https://www.facebook.com/artizone.jo"
                  icon={<FacebookIcon size={13} />}
                  label="Facebook"
                  followers="Follow"
                  accent="#4F9CF9"
                />
                <SocialPill
                  href="https://instagram.com/artizone_clinic"
                  icon={<InstagramIcon size={13} />}
                  label="Instagram"
                  followers="Follow"
                  accent="#E1306C"
                />
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Social proof bar (bottom strip) ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 hidden sm:block"
        style={{
          background: 'rgba(14,42,58,0.80)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(174,131,99,0.14)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-3 flex items-center justify-between gap-6">
          {/* Rating */}
          <div className="flex items-center gap-2.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={11} fill={TEAL} color={TEAL} />
              ))}
            </div>
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(250,247,242,0.80)', fontFamily: 'var(--font-sans)' }}>
              4.9 on Google
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(250,247,242,0.35)', fontFamily: 'var(--font-sans)' }}>
              · 200+ reviews
            </span>
          </div>

          {/* Dot indicators (moved here on desktop) */}
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width:  i === current ? 22 : 5,
                  height: 5,
                  background: i === current ? TEAL : 'rgba(250,247,242,0.22)',
                }}
              />
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'rgba(250,247,242,0.30)', fontFamily: 'var(--font-sans)' }}>
              Follow us
            </span>
            <a
              href="https://www.facebook.com/artizone.jo"
              target="_blank" rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
              style={{ color: '#4F9CF9' }}
            >
              <FacebookIcon size={14} />
              <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Facebook</span>
            </a>
            <a
              href="https://instagram.com/artizone_clinic"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
              style={{ color: '#E1306C' }}
            >
              <InstagramIcon size={14} />
              <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile dot indicators — 44×44px tap targets wrapping the visual dot */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex sm:hidden items-center gap-0.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex items-center justify-center transition-all duration-300"
            style={{ width: 44, height: 44 }}
          >
            <span
              className="block transition-all duration-300"
              style={{
                width:  i === current ? 26 : 6,
                height: 6,
                background: i === current ? TEAL : 'rgba(250,247,242,0.22)',
                borderRadius: 3,
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Prev / Next arrows ──────────────────────────────────────────── */}
      {[
        { fn: prev, label: 'Previous slide', Icon: ChevronLeft,  side: 'left-4 sm:left-6'  },
        { fn: next, label: 'Next slide',     Icon: ChevronRight, side: 'right-4 sm:right-6' },
      ].map(({ fn, label, Icon, side }) => (
        <button
          key={label}
          onClick={fn}
          aria-label={label}
          className={`absolute ${side} top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:opacity-100 opacity-55`}
          style={{
            background: `rgba(14,42,58,0.60)`,
            border: `1px solid rgba(174,131,99,0.28)`,
            backdropFilter: 'blur(10px)',
            color: TEAL,
          }}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* ── Slide counter ───────────────────────────────────────────────── */}
      <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2"
        style={{ fontFamily: 'var(--font-sans)' }}>
        <span className="text-sm font-semibold" style={{ color: TEAL }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="w-8 h-px" style={{ background: 'rgba(250,247,242,0.25)' }} />
        <span className="text-xs" style={{ color: 'rgba(250,247,242,0.35)' }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      {!paused && (
        <motion.div
          key={current + '-progress'}
          className="absolute top-0 left-0 h-0.5 z-20"
          style={{ background: slide.accent }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6.5, ease: 'linear' as const }}
        />
      )}

    </section>
  );
}
