import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import OptimizedImage from '@/components/OptimizedImage';

const GOLD       = '#C4A882'; /* Warm Sand — accent                    */
const TAUPE      = '#0E2A3A'; /* Ink Navy — dark bg                    */
const CREAM      = '#FDFAF6'; /* Ivory — light surface                 */
const CREAM_DARK = '#F7F3EE'; /* Parchment — section bg                */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

// ─── Gallery data ─────────────────────────────────────────────────────────────
const categories = ['All', 'Skin Care', 'Laser', 'Nails', 'Body', 'Brows', "Men's"];

const galleryItems = [
  {
    id: 1,
    category: 'Skin Care',
    treatment: 'Hydrafacial + LED Therapy',
    result: 'Visibly brighter, smoother skin after 3 sessions',
    image: '/airo-assets/images/before-after/skin-care',
    tag: 'Skin Care',
  },
  {
    id: 2,
    category: 'Laser',
    treatment: 'Full Leg Laser Hair Removal',
    result: 'Smooth, hair-free legs after 6 sessions',
    image: '/airo-assets/images/before-after/laser',
    tag: 'Laser',
  },
  {
    id: 3,
    category: 'Nails',
    treatment: 'Gel Manicure with Nail Art',
    result: 'Long-lasting, elegant nail finish',
    image: '/airo-assets/images/before-after/nails',
    tag: 'Nails',
  },
  {
    id: 4,
    category: 'Body',
    treatment: 'Cavitation + RF Body Contouring',
    result: 'Noticeable inch loss and skin tightening after 5 sessions',
    image: '/airo-assets/images/before-after/body',
    tag: 'Body',
  },
  {
    id: 5,
    category: 'Brows',
    treatment: 'Eyebrow Shaping & Tinting',
    result: 'Defined, natural-looking brows',
    image: '/airo-assets/images/before-after/brows',
    tag: 'Brows',
  },
  {
    id: 6,
    category: "Men's",
    treatment: "Men's Deep Cleansing Facial",
    result: 'Clearer, healthier skin after 2 sessions',
    image: '/airo-assets/images/before-after/mens',
    tag: "Men's",
  },
  {
    id: 7,
    category: 'Skin Care',
    treatment: 'Chemical Peel + Microneedling',
    result: 'Reduced pigmentation and improved texture',
    image: '/airo-assets/images/before-after/skin-care',
    tag: 'Skin Care',
  },
  {
    id: 8,
    category: 'Laser',
    treatment: 'Underarm Laser Hair Removal',
    result: 'Permanently smooth underarms after 5 sessions',
    image: '/airo-assets/images/before-after/laser',
    tag: 'Laser',
  },
  {
    id: 9,
    category: 'Nails',
    treatment: 'Spa Pedicure + Foot Scrub',
    result: 'Soft, refreshed feet with polished nails',
    image: '/airo-assets/images/before-after/nails',
    tag: 'Nails',
  },
  {
    id: 10,
    category: 'Body',
    treatment: 'EMS Sculpting + Lymphatic Drainage',
    result: 'Improved muscle tone and reduced bloating',
    image: '/airo-assets/images/before-after/body',
    tag: 'Body',
  },
  {
    id: 11,
    category: 'Brows',
    treatment: 'Threading + Eyebrow Tinting',
    result: 'Fuller, more defined brow shape',
    image: '/airo-assets/images/before-after/brows',
    tag: 'Brows',
  },
  {
    id: 12,
    category: "Men's",
    treatment: 'Back Laser Hair Removal (Men)',
    result: 'Smooth, clean back after 6 sessions',
    image: '/airo-assets/images/before-after/mens',
    tag: "Men's",
  },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: typeof galleryItems;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,20,16,0.92)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
        style={{ background: TAUPE }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(249,245,240,0.15)', color: CREAM }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <OptimizedImage
            src={item.image}
            alt={`${item.treatment} — before and after results at ArtiZone beauty clinic Amman`}
            className="w-full h-full object-cover"
            width={800} height={600}
          />
          {/* Category badge */}
          <span
            className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: `${GOLD}dd`, color: TAUPE }}
          >
            {item.tag}
          </span>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
            {item.treatment}
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(249,245,240,0.65)' }}>
            ✦ {item.result}
          </p>
          <Link
            to="/booking"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: GOLD, color: TAUPE }}
          >
            Book This Treatment <ArrowRight size={13} />
          </Link>
        </div>

        {/* Prev / Next */}
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(249,245,240,0.15)', color: CREAM }}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(249,245,240,0.15)', color: CREAM }}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BeforeAfterPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const nextItem = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <>
      <Helmet>
        <title>Before & After Results — ArtiZone Beauty Clinic Amman</title>
        <meta name="description" content="See real client transformation results at ArtiZone Amman — skin care, laser hair removal, nails, body slimming, brow shaping, and men's treatments." />
        <link rel="canonical" href="https://artizonespa.com/before-after" />
        <meta property="og:title"        content="Before & After Results — ArtiZone Beauty Clinic Amman" />
        <meta property="og:description"  content="See real client transformation results at ArtiZone Amman — skin care, laser hair removal, nails, body slimming, brow shaping, and men's treatments." />
        <meta property="og:image"        content="https://artizonespa.com/airo-assets/images/before-after/skin-care" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Real before and after skin care results at ArtiZone Amman" />
        <meta property="og:url"          content="https://artizonespa.com/before-after" />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Before & After Results — ArtiZone Beauty Clinic Amman" />
        <meta name="twitter:description" content="See real client transformation results at ArtiZone Amman — skin care, laser hair removal, nails, body slimming, brow shaping, and men's treatments." />
        <meta name="twitter:image"       content="https://artizonespa.com/airo-assets/images/before-after/skin-care" />
        <meta name="twitter:image:alt"   content="Real before and after skin care results at ArtiZone Amman" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'ArtiZone Before & After Results',
          description: 'Real client transformation photos from ArtiZone Beauty & Aesthetic Clinic in Amman, Jordan.',
          url: 'https://artizonespa.com/before-after',
          image: galleryItems.map(item => ({
            '@type': 'ImageObject',
            contentUrl: `https://artizonespa.com${item.image}`,
            name: item.treatment,
            description: item.result,
            keywords: item.tag,
          })),
          provider: {
            '@type': 'BeautySalon',
            name: 'ArtiZone Beauty & Aesthetic Clinic',
            '@id': 'https://artizonespa.com',
            url: 'https://artizonespa.com',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://artizonespa.com' },
              { '@type': 'ListItem', position: 2, name: 'Before & After', item: 'https://artizonespa.com/before-after' },
            ],
          },
        })}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── BEFORE & AFTER COMPARISON SLIDER ──────────────────────────────── */}
        <section className="py-16 sm:py-24" style={{ background: '#0f2318' }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.20em] mb-4"
                style={{ background: 'rgba(196,168,130,0.18)', color: '#C4A882', border: '1px solid rgba(196,168,130,0.28)', fontFamily: 'var(--font-sans)' }}>
                Interactive Comparison
              </span>
              <h2 className="font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.95)', fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
                Drag to See the Difference
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(235,242,238,0.45)', fontFamily: 'var(--font-sans)' }}>
                Slide the handle left and right to compare before and after results from real ArtiZone treatments.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="max-w-2xl mx-auto"
            >
              <BeforeAfterSlider />
            </motion.div>
          </div>
        </section>

        {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
        <section className="relative py-14 sm:py-20 overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 480,
              height: 480,
              background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`,
              top: '-100px',
              right: '-60px',
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 280,
              height: 280,
              background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`,
              bottom: '-50px',
              left: '-40px',
            }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-4"
              style={{ color: GOLD }}
            >
              Real Results
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-bold mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)', fontFamily: 'var(--font-heading)', color: CREAM }}
            >
              Before & After
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base max-w-xl mx-auto leading-relaxed"
              style={{ color: 'rgba(249,245,240,0.68)' }}
            >
              A showcase of real treatment results from our clients — with their permission. See what's possible at ArtiZone.
            </motion.p>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── FILTER TABS ────────────────────────────────────────────────────── */}
        <section className="pt-14 pb-4" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? GOLD : 'transparent',
                    color: activeCategory === cat ? TAUPE : 'hsl(20 15% 44%)',
                    border: activeCategory === cat
                      ? `1.5px solid ${GOLD}`
                      : `1.5px solid rgba(61,46,38,0.18)`,
                    fontWeight: activeCategory === cat ? 600 : 400,
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── GALLERY GRID ───────────────────────────────────────────────────── */}
        <section className="py-12 pb-24" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl overflow-hidden cursor-pointer group"
                    style={{
                      background: '#fff',
                      boxShadow: '0 4px 20px rgba(61,46,38,0.08)',
                      border: '1.5px solid rgba(201,169,110,0.15)',
                    }}
                    onClick={() => openLightbox(i)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <OptimizedImage
                        src={item.image}
                        alt={`${item.treatment} — before and after results at ArtiZone beauty clinic Amman`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={600} height={800}
                      />
                      {/* Overlay on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                        style={{ background: 'linear-gradient(to top, rgba(61,46,38,0.75) 0%, transparent 60%)' }}
                      >
                        <span className="text-xs font-medium" style={{ color: CREAM }}>
                          Tap to view
                        </span>
                      </div>
                      {/* Category badge */}
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: `${GOLD}dd`, color: TAUPE }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                        {item.treatment}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'hsl(20 15% 50%)' }}>
                        {item.result}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-20" style={{ color: 'hsl(20 15% 55%)' }}>
                No results in this category yet.
              </div>
            )}
          </div>
        </section>

        {/* ── PERMISSION NOTE ────────────────────────────────────────────────── */}
        <section className="py-10" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-8 h-0.5 mx-auto mb-4" style={{ background: GOLD }} />
              <p className="text-xs leading-relaxed" style={{ color: 'hsl(20 15% 52%)' }}>
                All photos are shared with the full knowledge and permission of our clients. We respect privacy and only publish results that clients have explicitly approved for display.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: `radial-gradient(circle, ${GOLD}1a, transparent 70%)`,
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
                Your Turn
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                Start Your Transformation
              </h2>
              <p className="text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(249,245,240,0.65)' }}>
                Book your first appointment and let us help you achieve the results you've been looking for.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: GOLD, color: TAUPE }}
                >
                  Book Appointment <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevItem}
            onNext={nextItem}
          />
        )}
      </AnimatePresence>
    </>
  );
}
