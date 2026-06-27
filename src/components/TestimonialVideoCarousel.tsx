/**
 * TestimonialVideoCarousel
 * Full-bleed video cards with overlaid client quotes.
 * Auto-advances every 6 s; pauses on hover / when video is playing.
 * Swipe-friendly on mobile via pointer drag.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Play, Pause, Quote } from 'lucide-react';

const GOLD   = '#C4A882';
const TAUPE  = '#0E2A3A';

interface Testimonial {
  id: number;
  name: string;
  service: string;
  quote: string;
  rating: number;
  videoSlot: string;
  fallbackSlot: string;
  poster?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Rania Al-Hassan',
    service: 'Facial & Skin Care',
    quote: 'My skin has never looked this radiant. The team at ArtiZone truly understands what your skin needs — I left glowing every single time.',
    rating: 5,
    videoSlot: '/airo-assets/videos/testimonials/video-1',
    fallbackSlot: '/airo-assets/images/services/facial-video',
  },
  {
    id: 2,
    name: 'Lina Mansour',
    service: 'Laser Hair Removal',
    quote: 'After years of waxing, laser at ArtiZone was a game-changer. Painless, professional, and the results are permanent. Absolutely worth it.',
    rating: 5,
    videoSlot: '/airo-assets/videos/testimonials/video-2',
    fallbackSlot: '/airo-assets/images/services/laser-video',
  },
  {
    id: 3,
    name: 'Sara Khalil',
    service: 'Nails & Foot Care',
    quote: 'The nail technicians here are artists. My gel manicure lasted three weeks without a single chip. I won\'t go anywhere else.',
    rating: 5,
    videoSlot: '/airo-assets/videos/testimonials/video-3',
    fallbackSlot: '/airo-assets/images/services/nails-video',
  },
  {
    id: 4,
    name: 'Nour Abboud',
    service: 'Body Slimming',
    quote: 'I\'ve tried so many clinics but ArtiZone\'s body contouring treatments are on another level. The staff are warm, knowledgeable, and genuinely caring.',
    rating: 5,
    videoSlot: '/airo-assets/videos/testimonials/video-4',
    fallbackSlot: '/airo-assets/images/services/slimming-video',
  },
];

const AUTO_INTERVAL = 6000;

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13}
          fill={s <= count ? GOLD : 'none'}
          stroke={s <= count ? GOLD : 'rgba(255,255,255,0.4)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function TestimonialVideoCarousel() {
  const [active, setActive]     = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [paused, setPaused]     = useState(false);   // user-paused auto-advance
  const videoRefs               = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStart               = useRef<number | null>(null);

  const count = TESTIMONIALS.length;

  const goTo = useCallback((idx: number) => {
    // Pause any playing video
    videoRefs.current.forEach((v) => { if (v) { v.pause(); v.currentTime = 0; } });
    setPlaying(false);
    setActive(((idx % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, playing, next]);

  const toggleVideo = () => {
    const vid = videoRefs.current[active];
    if (!vid) return;
    if (playing) {
      vid.pause();
      setPlaying(false);
    } else {
      void vid.play();
      setPlaying(true);
      setPaused(true); // pause auto-advance while video plays
    }
  };

  // When video ends, resume auto-advance
  void (() => {
    setPlaying(false);
    setPaused(false);
  });

  // Pointer drag for swipe
  const handlePointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const handlePointerUp   = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStart.current = null;
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 overflow-hidden" style={{ background: TAUPE }}>
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}
          >
            <Quote size={11} />
            Client Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}
            className="font-bold"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem,4vw,2.5rem)', color: '#fff' }}
          >
            Real Results, Real Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-3 text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Hear directly from our clients about their ArtiZone experience.
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { if (!playing) setPaused(false); }}
        >
          {/* Main card — taller on mobile for readability */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ aspectRatio: '16/9', minHeight: 220 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {/* Solid background (no image/video) */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)' }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(20,13,8,0.82) 0%, rgba(20,13,8,0.35) 55%, rgba(20,13,8,0.1) 100%)' }}
                />

                {/* Quote content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="px-5 sm:px-10 lg:px-14 max-w-xs sm:max-w-md lg:max-w-lg">
                    <Quote size={22} style={{ color: GOLD, opacity: 0.7 }} className="mb-3" />
                    <p className="text-white font-medium leading-relaxed mb-4"
                      style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1.1rem)', fontFamily: 'var(--font-heading)' }}>
                      "{TESTIMONIALS[active].quote}"
                    </p>
                    <StarRow count={TESTIMONIALS[active].rating} />
                    <div className="mt-2 sm:mt-3">
                      <p className="font-semibold text-white text-xs sm:text-sm">{TESTIMONIALS[active].name}</p>
                      <p className="text-xs mt-0.5" style={{ color: GOLD }}>{TESTIMONIALS[active].service}</p>
                    </div>
                  </div>
                </div>

                {/* Play / Pause button */}
                <button
                  onClick={toggleVideo}
                  className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: 'rgba(201,169,110,0.85)', backdropFilter: 'blur(6px)' }}
                  aria-label={playing ? 'Pause video' : 'Play video'}
                >
                  {playing
                    ? <Pause size={16} color="#fff" fill="#fff" />
                    : <Play  size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                  }
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button onClick={prev}
            className="hidden sm:flex absolute left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.35)', color: GOLD }}
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="hidden sm:flex absolute right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.35)', color: GOLD }}
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Thumbnail strip — hidden on 360px, shown from sm */}
        <div className="hidden sm:flex items-center justify-center gap-3 mt-5">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => goTo(i)}
              className="relative rounded-xl overflow-hidden transition-all duration-300 shrink-0"
              style={{
                width: i === active ? 72 : 52,
                height: i === active ? 48 : 36,
                outline: i === active ? `2px solid ${GOLD}` : '2px solid transparent',
                outlineOffset: 2,
                opacity: i === active ? 1 : 0.5,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            >
              <video
                src={t.videoSlot}
                className="w-full h-full object-cover pointer-events-none"
                muted playsInline preload="metadata"
                onError={(e) => {
                  const vid = e.currentTarget;
                  if (!vid.src.endsWith(t.fallbackSlot)) {
                    vid.src = t.fallbackSlot;
                    vid.load();
                  }
                }}
              />
              <div className="absolute inset-0" style={{ background: 'rgba(20,13,8,0.3)' }} />
            </button>
          ))}
        </div>

        {/* Dot progress bar */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 24 : 6,
                height: 6,
                background: i === active ? GOLD : 'rgba(201,169,110,0.3)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
