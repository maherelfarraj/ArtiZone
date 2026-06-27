import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Phone, Star, Sparkles } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BROWN   = '#0E2A3A';
const CHARCOAL = '#0E2A3A'; /* Ink Navy                              */
const BEIGE    = '#F7F3EE'; /* Parchment                             */
const GOLD     = '#C4A882'; /* Warm Sand — accent                    */
const TEAL     = '#6B7260'; /* Sage Stone                            */
const TERRA    = '#C4A882'; /* Warm Sand                             */
const CREAM    = '#FDFAF6'; /* Ivory                                 */
const CREAM_D  = '#F7F3EE'; /* Parchment                             */

const SITE_URL = 'https://artizonespa.com';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

// ─── Package data ─────────────────────────────────────────────────────────────
const FEATURED = [
  {
    id: 'radiance',
    tag: 'Most Popular',
    tagColor: GOLD,
    name: 'Radiance Skin Package',
    subtitle: 'Complete skin transformation',
    highlight: true,
    icon: '✦',
    treatments: [
      'Signature ArtiZone Facial',
      'Chemical Peels',
      'RF Microneedling',
      'Anti-Aging Collagen Lift',
      'LED Light Therapy',
    ],
    note: 'Our most-booked skin package — visible results from session one.',
    cta: 'Book This Package',
  },
  {
    id: 'laser-smooth',
    tag: 'Best Value',
    tagColor: TEAL,
    name: 'Laser Smooth Package',
    subtitle: 'Full-body laser coverage',
    highlight: false,
    icon: '◈',
    treatments: [
      'Full Legs Laser',
      'Full Arms Laser',
      'Underarms Laser',
      'Bikini / Brazilian Laser',
      'Upper Lip & Chin Laser',
    ],
    note: 'Complete upper and lower body laser coverage in one package.',
    cta: 'Book This Package',
  },
  {
    id: 'body-contour',
    tag: 'Visible Results',
    tagColor: TERRA,
    name: 'Body Contour Package',
    subtitle: 'Targeted fat reduction & tightening',
    highlight: false,
    icon: '◉',
    treatments: [
      'Ultrasound Cavitation (5 sessions)',
      'RF Skin Tightening',
      'Lymphatic Drainage Massage',
      'Detox Body Wraps',
    ],
    note: 'Lose 2–5 cm per area — our most effective body contouring programme.',
    cta: 'Book This Package',
  },
  {
    id: 'bridal',
    tag: 'Bridal',
    tagColor: '#B08AA3',
    name: 'Bride-to-Be Package',
    subtitle: 'Complete pre-wedding transformation',
    highlight: false,
    icon: '◇',
    treatments: [
      'Bridal Beauty Package',
      'Full Body Laser',
      'Gel Polish & Luxury Spa Pedicure',
      'Detox Body Wraps',
      'Eyebrow Threading & Shaping',
    ],
    note: 'Everything you need to look and feel your absolute best on your special day.',
    cta: 'Book This Package',
  },
  {
    id: 'anti-aging',
    tag: 'Premium',
    tagColor: GOLD,
    name: 'Anti-Aging Luxury Package',
    subtitle: 'Advanced skin renewal',
    highlight: false,
    icon: '◆',
    treatments: [
      'Anti-Aging Collagen Lift',
      'RF Microneedling',
      'RF Skin Tightening',
      'Skin Boosters',
      'LED Light Therapy',
    ],
    note: 'Advanced treatments targeting fine lines, firmness, and skin renewal.',
    cta: 'Book This Package',
  },
  {
    id: 'mens',
    tag: 'For Men',
    tagColor: CHARCOAL,
    name: "Men's Grooming Package",
    subtitle: 'Complete male grooming',
    highlight: false,
    icon: '◎',
    treatments: [
      "Gentleman's Deep-Clean Facial",
      "Men's Laser (Beard Line, Back, Chest)",
      'Beard Trim & Design',
      "Men's Mani & Pedi",
    ],
    note: 'A complete grooming package designed specifically for men — private treatment rooms.',
    cta: 'Book This Package',
  },
];

const CATEGORIES = [
  {
    id: 'face-skin-care',
    label: 'Face & Skin Care',
    icon: '✦',
    packages: [
      { name: 'Glow Starter Package', tag: 'Beginners', treatments: ['Signature ArtiZone Facial', 'HydraFacial', 'LED Light Therapy'], note: 'Perfect for first-time clients.' },
      { name: 'Radiance Skin Package', tag: 'Most Popular', treatments: ['Signature ArtiZone Facial', 'Chemical Peels', 'RF Microneedling', 'Anti-Aging Collagen Lift', 'LED Light Therapy'], note: 'Our most popular skin transformation package.' },
      { name: 'Anti-Aging Luxury Package', tag: 'Premium', treatments: ['Anti-Aging Collagen Lift', 'RF Microneedling', 'RF Skin Tightening', 'Skin Boosters', 'LED Light Therapy'], note: 'Advanced treatments for firmness and renewal.' },
    ],
  },
  {
    id: 'laser-advanced',
    label: 'Laser & Advanced',
    icon: '◈',
    packages: [
      { name: 'Laser Essentials Bundle', tag: 'Multi-Session Value', treatments: ['Underarms & Bikini Laser', 'Face & Neck Laser', 'Laser Touch-Up Plan'], note: 'Ideal for targeting the most common areas.' },
      { name: 'Laser Smooth Package', tag: 'Best Value', treatments: ['Full Legs & Arms Laser', 'Underarms & Bikini Laser', 'Face & Neck Laser', 'Back & Shoulders Laser'], note: 'Complete lower and upper body laser coverage.' },
      { name: 'Full Body Laser', tag: 'Complete Coverage', treatments: ['Full Body Laser', 'Face & Neck Laser', 'Beard Line Laser Shaping', 'Laser Touch-Up Plan'], note: 'Head-to-toe laser smoothness.' },
    ],
  },
  {
    id: 'body-treatments',
    label: 'Body Treatments',
    icon: '◉',
    packages: [
      { name: 'Full Body Slimming Plan', tag: 'Complete Program', treatments: ['Cryolipolysis (Fat Freezing)', 'RF Skin Tightening', 'EMS Body Sculpting', 'Lymphatic Drainage Massage'], note: 'A complete contouring and tightening program.' },
      { name: 'Body Contour Package', tag: 'Most Popular', treatments: ['Ultrasound Cavitation (5 sessions)', 'RF Skin Tightening', 'Lymphatic Drainage Massage', 'Detox Body Wraps'], note: 'Targeted fat reduction and skin tightening.' },
      { name: 'Custom Slimming Program', tag: 'Tailored', treatments: ['Ultrasound Cavitation', 'RF Skin Tightening', 'EMS Body Sculpting', 'Cellulite Therapy', 'Lymphatic Drainage Massage'], note: 'Our most complete body transformation program.' },
    ],
  },
  {
    id: 'nails-extensions',
    label: 'Nails & Extensions',
    icon: '◇',
    packages: [
      { name: 'Nails Refresh Package', tag: 'Quick & Elegant', treatments: ['Gel Polish', 'Classic Mani & Pedi'], note: 'Keep your hands and feet polished and fresh.' },
      { name: 'Full Nails Package', tag: 'Best Value', treatments: ['Custom Nail Art', 'Luxury Spa Pedicure', 'Paraffin Hand Treatment', 'Acrylic & Gel Extensions (Optional)'], note: 'A complete nails experience from fingertips to toes.' },
    ],
  },
];

const REVIEWS = [
  { name: 'Rania M.', text: 'The Radiance Skin Package completely transformed my skin. After 3 sessions I had compliments I had never received before. Worth every penny.', rating: 5 },
  { name: 'Lina K.', text: 'I did the Laser Smooth Package and the results are incredible. The team is professional and the clinic is spotless. Highly recommend.', rating: 5 },
  { name: 'Nour A.', text: 'The Body Contour Package gave me visible results after just 3 sessions. I lost 4 cm from my waist. The staff are so supportive.', rating: 5 },
];

const FAQS = [
  { q: 'How do I know which package is right for me?', a: 'Book a free consultation at ArtiZone — our specialists will assess your skin, discuss your goals, and recommend the most effective package for your specific concerns and budget.' },
  { q: 'Can I customise a package?', a: 'Yes. We can create a personalised package combining treatments from different categories. Contact us and we will put together the perfect combination for you.' },
  { q: 'How many sessions are included in each package?', a: 'Each package includes a set number of sessions as listed. Some packages (like laser and body slimming) include multiple sessions of the same treatment for progressive results.' },
  { q: 'Do packages expire?', a: 'Package sessions are valid for 6 months from the date of purchase. We recommend spacing sessions as advised by your specialist for best results.' },
  { q: 'Is there a payment plan available?', a: 'Yes — we offer flexible payment options for our packages. Contact us to discuss what works best for you.' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PopularPackagesPage() {
  const title = 'Popular Beauty Packages in Amman | Skin, Laser, Body & Bridal — ArtiZone';
  const description = 'ArtiZone\'s most popular treatment packages in Amman — skin care, laser hair removal, body slimming, bridal, and anti-aging bundles. Free consultation included. Book today.';
  const canonicalUrl = `${SITE_URL}/popular-packages`;
  const ogImage = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'ArtiZone Popular Beauty Packages',
    description,
    url: canonicalUrl,
    provider: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: SITE_URL,
      address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' },
    },
    numberOfItems: FEATURED.length,
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:image"        content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Popular beauty packages at ArtiZone Amman" />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="Popular beauty packages at ArtiZone Amman" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: BROWN }}>
          {/* Ambient orbs */}
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 600, height: 600, background: `radial-gradient(circle, ${GOLD}1a, transparent 70%)`, top: '-160px', right: '-120px' }}
            animate={{ y: [0, -24, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' as const }} />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 350, height: 350, background: `radial-gradient(circle, ${TEAL}18, transparent 70%)`, bottom: '-80px', left: '-60px' }}
            animate={{ y: [0, 18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }} />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: `${BEIGE}88` }}>
                <Link to="/" className="hover:opacity-80 transition-opacity" style={{ color: `${BEIGE}88` }}>Home</Link>
                <span>/</span>
                <span style={{ color: GOLD }}>Popular Packages</span>
              </nav>

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: GOLD }}>
                Curated Treatment Bundles
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(2rem, 5.5vw, 4rem)', lineHeight: 1.08, fontWeight: 400, marginBottom: '1.25rem' }}>
                Our Most Popular<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>Beauty Packages</em>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: `${BEIGE}cc` }}>
                Thoughtfully designed bundles combining our best treatments — for skin, laser, body, nails, and special occasions. More results, better value.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col xs:flex-row gap-3">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: TERRA, color: '#F5F0E8' }}>
                  Book a Free Consultation <ArrowRight size={14} />
                </Link>
                <a href="tel:+962790412758"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ border: `1.5px solid ${GOLD}55`, color: GOLD }}>
                  <Phone size={14} /> Call to Enquire
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-3 mt-7">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill={GOLD} style={{ color: GOLD }} />
                  ))}
                </div>
                <span className="text-xs" style={{ color: `${BEIGE}88` }}>Rated 4.9 / 5 by 2,500+ clients in Amman</span>
              </motion.div>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── QUICK NAV ────────────────────────────────────────────────────── */}
        <div style={{ background: CREAM_D, borderBottom: `1px solid ${GOLD}22` }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex flex-nowrap sm:flex-wrap gap-2 w-max sm:w-auto">
                {CATEGORIES.map(cat => (
                  <a key={cat.id} href={`#${cat.id}`}
                    className="px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-90 whitespace-nowrap"
                    style={{ background: `${GOLD}18`, color: BROWN, border: `1px solid ${GOLD}33` }}>
                    {cat.icon} {cat.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURED 6 PACKAGES ──────────────────────────────────────────── */}
        <section className="py-20 sm:py-28" style={{ background: CREAM }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: GOLD }}>Most Requested</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: BROWN, fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 400 }}>
                Featured Packages
              </h2>
              <p className="text-sm mt-3 max-w-lg mx-auto leading-relaxed" style={{ color: 'hsl(20 15% 48%)' }}>
                Our six most popular treatment bundles — each designed to deliver visible, lasting results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED.map((pkg, i) => (
                <motion.div key={pkg.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  whileHover={{ y: -5 }} transition={{ duration: 0.2 }}
                  className="rounded-2xl flex flex-col relative overflow-hidden"
                  style={{
                    background: pkg.highlight ? CHARCOAL : '#fff',
                    border: pkg.highlight ? `2px solid ${GOLD}` : `1.5px solid ${GOLD}33`,
                    boxShadow: pkg.highlight ? `0 8px 40px rgba(61,46,38,0.22), 0 0 0 1px ${GOLD}44` : '0 4px 20px rgba(61,46,38,0.07)',
                  }}>
                  {/* Top accent bar */}
                  {pkg.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${GOLD}88, ${GOLD}, ${GOLD}88)` }} />
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Tag */}
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-5"
                      style={{ background: `${pkg.tagColor}22`, color: pkg.tagColor }}>
                      {pkg.tag}
                    </span>

                    {/* Icon + name */}
                    <div className="flex items-start gap-3 mb-2">
                      <span style={{ fontFamily: 'var(--font-heading)', color: GOLD, fontSize: '1.4rem', lineHeight: 1 }}>{pkg.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold leading-tight"
                          style={{ fontFamily: 'var(--font-heading)', color: pkg.highlight ? CREAM : BROWN }}>
                          {pkg.name}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: pkg.highlight ? `${BEIGE}88` : 'hsl(20 15% 55%)' }}>
                          {pkg.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Note */}
                    <p className="text-xs leading-relaxed mb-5 mt-2"
                      style={{ color: pkg.highlight ? `${BEIGE}99` : 'hsl(20 15% 50%)' }}>
                      {pkg.note}
                    </p>

                    {/* Divider */}
                    <div className="w-full h-px mb-5"
                      style={{ background: pkg.highlight ? `${GOLD}25` : `${GOLD}20` }} />

                    {/* Treatments */}
                    <ul className="space-y-2.5 flex-1 mb-7">
                      {pkg.treatments.map(t => (
                        <li key={t} className="flex items-start gap-2.5 text-sm"
                          style={{ color: pkg.highlight ? `${BEIGE}cc` : 'hsl(20 15% 35%)' }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: `${GOLD}22` }}>
                            <Check size={10} style={{ color: GOLD }} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link to="/booking"
                      className="w-full text-center py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                      style={{
                        background: pkg.highlight ? GOLD : 'transparent',
                        color: pkg.highlight ? CHARCOAL : GOLD,
                        border: pkg.highlight ? 'none' : `1.5px solid ${GOLD}`,
                      }}>
                      {pkg.cta} <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FULL PACKAGE CATALOGUE ───────────────────────────────────────── */}
        {CATEGORIES.map((cat, catIdx) => (
          <section key={cat.id} id={cat.id} className="py-20 scroll-mt-24"
            style={{ background: catIdx % 2 === 0 ? CREAM_D : CREAM }}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-0.5" style={{ background: GOLD }} />
                  <h2 className="text-2xl md:text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-heading)', color: BROWN }}>
                    {cat.label} Packages
                  </h2>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.packages.map((pkg, i) => (
                  <motion.div key={pkg.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    className="rounded-2xl p-7 flex flex-col bg-white"
                    style={{ border: `1.5px solid ${GOLD}28`, boxShadow: '0 4px 20px rgba(61,46,38,0.06)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4"
                      style={{ background: `${GOLD}18`, color: GOLD }}>
                      {pkg.tag}
                    </span>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: BROWN }}>
                      {pkg.name}
                    </h3>
                    <p className="text-xs leading-relaxed mb-5" style={{ color: 'hsl(20 15% 50%)' }}>
                      {pkg.note}
                    </p>
                    <div className="w-full h-px mb-5" style={{ background: `${GOLD}20` }} />
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {pkg.treatments.map(t => (
                        <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: 'hsl(20 15% 35%)' }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: `${GOLD}22` }}>
                            <Check size={10} style={{ color: GOLD }} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <Link to="/booking"
                      className="w-full text-center py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style={{ border: `1.5px solid ${GOLD}`, color: GOLD }}>
                      Book This Package <ArrowRight size={13} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28" style={{ background: CHARCOAL }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: GOLD }}>Client Results</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 400 }}>
                What Our Clients Say
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-2xl p-7"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${GOLD}25` }}>
                  <div className="flex mb-4">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} size={13} fill={GOLD} style={{ color: GOLD }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: `${BEIGE}cc` }}>"{r.text}"</p>
                  <p className="text-xs font-semibold" style={{ color: GOLD }}>{r.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28" style={{ background: CREAM }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: GOLD }}>Common Questions</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: BROWN, fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 400, lineHeight: 1.1 }}>
                  Frequently Asked<br />Questions
                </h2>
                <p className="text-sm leading-relaxed mt-4 mb-8" style={{ color: 'hsl(20 15% 48%)' }}>
                  Not sure which package is right for you? Book a free consultation and our specialists will guide you.
                </p>
                <Link to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: TERRA, color: '#F5F0E8' }}>
                  Book Free Consultation <ArrowRight size={14} />
                </Link>
              </motion.div>

              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <motion.div key={faq.q} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="rounded-xl p-6"
                    style={{ background: '#fff', border: `1.5px solid ${GOLD}28`, boxShadow: '0 2px 12px rgba(61,46,38,0.05)' }}>
                    <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: BROWN }}>
                      {faq.q}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'hsl(20 15% 45%)' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CUSTOM PACKAGE ───────────────────────────────────────────────── */}
        <section className="py-16" style={{ background: CREAM_D }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl p-10 text-center max-w-2xl mx-auto"
              style={{ background: '#fff', border: `1.5px solid ${GOLD}28`, boxShadow: '0 4px 24px rgba(61,46,38,0.08)' }}>
              <Sparkles size={28} style={{ color: GOLD, margin: '0 auto 1rem' }} />
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: BROWN }}>
                Need a Custom Package?
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'hsl(20 15% 44%)' }}>
                We can create a personalised package tailored to your specific goals. Contact us and we will put together the perfect combination of treatments for you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/booking"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: GOLD, color: CHARCOAL }}>
                  Book a Consultation <ArrowRight size={13} />
                </Link>
                <a href="tel:+962790412758"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                  style={{ border: `1.5px solid ${GOLD}55`, color: BROWN }}>
                  <Phone size={13} /> +962 79 041 2758
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" style={{ background: BROWN }}>
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 600, height: 600, background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`, top: '-100px', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }} />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: GOLD }}>Ready to Begin?</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 400, marginBottom: '1.25rem' }}>
                Book Your Package Today
              </h2>
              <p className="text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: `${BEIGE}99` }}>
                Contact us to book any package or ask about availability. Free consultation included with every booking.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: GOLD, color: CHARCOAL }}>
                  Book Appointment <ArrowRight size={14} />
                </Link>
                <a href="tel:+962790412758"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ border: `1.5px solid ${GOLD}55`, color: GOLD }}>
                  <Phone size={14} /> Call Us Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
