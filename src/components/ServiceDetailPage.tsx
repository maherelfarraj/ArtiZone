import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import type { ServiceDetail } from '@/data/services';
import { SITE_NAME } from '@/lib/gbp-schema';
import ClientsAlsoBook from '@/components/upsell/ClientsAlsoBook';
import type { RelatedService } from '@/components/upsell/ClientsAlsoBook';


const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';
const CREAM_DARK = '#F7F3EE';

// ── Related services per slug ──────────────────────────────────────────────
const RELATED_MAP: Record<string, RelatedService[]> = {
  'face-skin-care': [
    { name: 'Laser Hair Removal', tagline: 'Smooth, hair-free skin that complements your facial glow.', href: '/services/laser-hair-removal', emoji: '✨' },
    { name: 'Eyebrow & Hair Removal', tagline: 'Perfect brows to frame your refreshed complexion.', href: '/services/hair-removal', emoji: '🌿' },
    { name: 'Nails & Foot Care', tagline: 'Complete your beauty routine from head to toe.', href: '/services/nails-foot-care', emoji: '💅' },
  ],
  'laser-hair-removal': [
    { name: 'Face & Skin Care', tagline: 'Soothe and brighten skin post-laser with a targeted facial.', href: '/services/face-skin-care', emoji: '🌸' },
    { name: 'Body Slimming', tagline: 'Contour and tighten while you smooth — book both in one visit.', href: '/services/body-slimming', emoji: '🔥' },
    { name: 'Nails & Foot Care', tagline: 'Treat yourself to a full beauty session.', href: '/services/nails-foot-care', emoji: '💅' },
  ],
  'hair-removal': [
    { name: 'Face & Skin Care', tagline: 'A brightening facial pairs perfectly with brow shaping.', href: '/services/face-skin-care', emoji: '🌸' },
    { name: 'Laser Hair Removal', tagline: 'Upgrade to permanent laser for long-lasting results.', href: '/services/laser-hair-removal', emoji: '✨' },
    { name: "Men's Grooming", tagline: "Complete your grooming with a full men's treatment.", href: '/services/mens-grooming', emoji: '🧔' },
  ],
  'nails-foot-care': [
    { name: 'Face & Skin Care', tagline: 'Glow from head to toe — add a facial to your nail session.', href: '/services/face-skin-care', emoji: '🌸' },
    { name: 'Eyebrow & Hair Removal', tagline: 'Shape your brows while your nails dry.', href: '/services/hair-removal', emoji: '🌿' },
    { name: 'Body Slimming', tagline: 'Treat your whole body in one luxurious visit.', href: '/services/body-slimming', emoji: '🔥' },
  ],
  'body-slimming': [
    { name: 'Laser Hair Removal', tagline: 'Smooth and contour — the perfect combination.', href: '/services/laser-hair-removal', emoji: '✨' },
    { name: 'Face & Skin Care', tagline: 'Glow inside and out with a skin treatment add-on.', href: '/services/face-skin-care', emoji: '🌸' },
    { name: 'Nails & Foot Care', tagline: 'Complete your self-care day with a nail treatment.', href: '/services/nails-foot-care', emoji: '💅' },
  ],
  'mens-grooming': [
    { name: 'Laser Hair Removal', tagline: 'Permanent hair removal for back, chest, or face.', href: '/services/laser-hair-removal', emoji: '✨' },
    { name: 'Face & Skin Care', tagline: "A men's facial to complement your grooming session.", href: '/services/face-skin-care', emoji: '🌸' },
    { name: 'Nails & Foot Care', tagline: "Men's manicure & pedicure — the finishing touch.", href: '/services/nails-foot-care', emoji: '💅' },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const SITE_URL = 'https://artizonespa.com';
  const canonicalUrl = `${SITE_URL}/services/${service.slug}`;
  const ogImage = `${SITE_URL}/airo-assets/images/${service.imageSlot}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.seoDescription,
    url: canonicalUrl,
    image: ogImage,
    provider: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: SITE_URL,
      address: { '@type': 'PostalAddress', streetAddress: 'Al-Sweifieh', addressLocality: 'Amman', addressCountry: 'JO' },
    },
    areaServed: { '@type': 'City', name: 'Amman' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} Treatments`,
      itemListElement: service.treatments.map((t, i) => ({
        '@type': 'Offer',
        position: i + 1,
        name: t.name,
        description: t.description,
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'JOD', description: t.price },
      })),
    },
    ...(service.faqs.length > 0 && {
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"        content={service.seoTitle} />
        <meta property="og:description"  content={service.seoDescription} />
        <meta property="og:image"        content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content={`${service.name} treatment at ArtiZone Amman`} />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content={SITE_NAME} />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={service.seoTitle} />
        <meta name="twitter:description" content={service.seoDescription} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content={`${service.name} treatment at ArtiZone Amman`} />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative flex items-end overflow-hidden" style={{ minHeight: 'clamp(300px, 50svh, 700px)' }}>
          {/* Background (no image) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)' }}>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(28,18,12,0.88) 0%, rgba(28,18,12,0.45) 55%, rgba(28,18,12,0.2) 100%)' }}
            />
          </div>

          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 pb-10 sm:pb-14 pt-20 sm:pt-28 relative z-10 safe-x">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs mb-4 sm:mb-5"
              style={{ color: 'rgba(249,245,240,0.55)' }}
            >
              <Link to="/services" className="hover:opacity-80 transition-opacity" style={{ color: 'rgba(249,245,240,0.55)' }}>
                Services
              </Link>
              <span>/</span>
              <span style={{ color: GOLD }}>{service.name}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-2 sm:mb-3"
              style={{ color: GOLD }}
            >
              {service.tagline}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="font-bold mb-4 max-w-2xl"
              style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(1.6rem, 5vw, 3.75rem)' }}
            >
              {service.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="text-sm sm:text-base max-w-xl leading-relaxed mb-7 sm:mb-8"
              style={{ color: 'rgba(249,245,240,0.72)' }}
            >
              {service.heroDescription}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: GOLD, color: TAUPE }}
              >
                Book This Treatment <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── INTRO + BENEFITS ─────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 items-start">
              {/* Intro text */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="w-10 h-0.5 mb-5" style={{ background: GOLD }} />
                <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                  About This Treatment
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(20 15% 40%)' }}>
                  {service.intro}
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-80 shrink-0 rounded-2xl p-6 sm:p-7"
                style={{ background: TAUPE, border: `1.5px solid rgba(201,169,110,0.2)` }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: GOLD }}>
                  Key Benefits
                </p>
                <ul className="space-y-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(249,245,240,0.82)' }}>
                      <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TREATMENTS / PRICING ─────────────────────────────────────────── */}
        <section className="py-14 sm:py-20" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                What We Offer
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Treatments & Pricing
              </h2>
              <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: GOLD }} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.treatments.map((t, i) => (
                <motion.div
                  key={t.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative rounded-2xl p-6"
                  style={{
                    background: t.popular ? TAUPE : '#fff',
                    border: `1.5px solid ${t.popular ? `rgba(201,169,110,0.4)` : 'rgba(201,169,110,0.18)'}`,
                    boxShadow: t.popular ? '0 8px 30px rgba(61,46,38,0.18)' : '0 4px 16px rgba(61,46,38,0.06)',
                  }}
                >
                  {t.popular && (
                    <span
                      className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ background: `${GOLD}33`, color: GOLD }}
                    >
                      <Star size={10} fill={GOLD} /> Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3
                      className="text-base font-bold pr-16"
                      style={{ fontFamily: 'var(--font-heading)', color: t.popular ? CREAM : TAUPE }}
                    >
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: t.popular ? 'rgba(249,245,240,0.65)' : 'hsl(20 15% 48%)' }}>
                    {t.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: t.popular ? 'rgba(201,169,110,0.18)' : `${GOLD}18`, color: GOLD }}>
                        {t.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: GOLD, color: TAUPE }}
              >
                Book Your Session <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                Your Experience
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                How It Works
              </h2>
              <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: GOLD }} />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {service.howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative rounded-2xl p-7"
                  style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.18)`, boxShadow: '0 4px 16px rgba(61,46,38,0.06)' }}
                >
                  <span
                    className="block text-4xl font-bold mb-4 leading-none"
                    style={{ fontFamily: 'var(--font-heading)', color: `${GOLD}40` }}
                  >
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'hsl(20 15% 48%)' }}>
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
        <section className="py-16" style={{ background: TAUPE }}>
          <div className="container mx-auto px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
                What to Expect
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                Results
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(249,245,240,0.7)' }}>
                {service.results}
              </p>
              <Link
                to="/before-after"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-75"
                style={{ color: GOLD }}
              >
                View Before & After Gallery <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                Common Questions
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                FAQs
              </h2>
              <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: GOLD }} />
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-3">
              {service.faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.18)` }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-semibold" style={{ color: TAUPE }}>
                      {faq.q}
                    </span>
                    {openFaq === i
                      ? <ChevronUp size={16} style={{ color: GOLD, flexShrink: 0 }} />
                      : <ChevronDown size={16} style={{ color: GOLD, flexShrink: 0 }} />
                    }
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-sm leading-relaxed" style={{ color: 'hsl(20 15% 44%)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLIENTS ALSO BOOK ─────────────────────────────────────────────── */}
        {RELATED_MAP[service.slug] && (
          <ClientsAlsoBook
            services={RELATED_MAP[service.slug]}
            currentServiceName={service.name}
          />
        )}

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, background: `radial-gradient(circle, ${GOLD}1a, transparent 70%)`, top: '-100px', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
                Ready to Begin?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                Book Your {service.name} Session
              </h2>
              <p className="text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(249,245,240,0.65)' }}>
                Our specialists are ready to create a personalised treatment plan just for you.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: GOLD, color: TAUPE }}
                >
                  Book Appointment <ArrowRight size={14} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ border: `1.5px solid rgba(249,245,240,0.2)`, color: 'rgba(249,245,240,0.7)' }}
                >
                  All Services
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
