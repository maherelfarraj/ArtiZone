import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import ShareButtons from '@/components/ShareButtons';

const GOLD       = '#C4A882'; /* Warm Sand — accent                    */
const OLIVE      = '#6B7260'; /* Sage Stone — secondary                */
const YELLOW     = '#C4A882'; /* Warm Sand — highlight                 */
const TAUPE      = '#0E2A3A'; /* Ink Navy — dark bg                    */
const CREAM      = '#FDFAF6'; /* Ivory — light surface                 */
const CREAM_DARK = '#F7F3EE'; /* Parchment — section bg                */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

// ─── Package data ─────────────────────────────────────────────────────────────
const packageCategories = [
  {
    id: 'face-skin-care',
    label: 'Face & Skin Care',
    packages: [
      {
        name: 'Glow Starter Package',
        tag: 'Best for Beginners',
        highlight: false,
        bundlePrice: null,
        originalPrice: null,
        savings: null,
        treatments: [
          'Signature ArtiZone Facial',
          'HydraFacial',
          'LED Light Therapy',
        ],
        note: 'Your introduction to ArtiZone skin care. Ask in clinic or on WhatsApp for current pricing.',
      },
    ],
  },
  {
    id: 'laser-advanced',
    label: 'Laser & Advanced',
    packages: [
      {
        name: 'Laser Essentials Bundle',
        tag: 'Multi-Session Value',
        highlight: true,
        bundlePrice: null,
        originalPrice: null,
        savings: null,
        treatments: [
          'Multi-session laser hair removal',
          'Underarms & Bikini Laser',
          'Face & Neck Laser',
          'Laser Touch-Up Plan',
        ],
        note: 'Multi-session laser hair removal, made simple. Ask in clinic or on WhatsApp for current pricing.',
      },
    ],
  },
  {
    id: 'body-treatments',
    label: 'Body Treatments',
    packages: [
      {
        name: 'Full Body Slimming Plan',
        tag: 'Complete Program',
        highlight: false,
        bundlePrice: null,
        originalPrice: null,
        savings: null,
        treatments: [
          'Cryolipolysis (Fat Freezing)',
          'RF Skin Tightening',
          'EMS Body Sculpting',
          'Lymphatic Drainage Massage',
        ],
        note: 'A complete contouring and tightening program. Ask in clinic or on WhatsApp for current pricing.',
      },
    ],
  },
  {
    id: 'mens-treatments',
    label: "Men's Treatments",
    packages: [
      {
        name: "Men's Grooming Package",
        tag: 'For Men',
        highlight: false,
        bundlePrice: null,
        originalPrice: null,
        savings: null,
        treatments: [
          "Gentleman's Deep-Clean Facial",
          "Men's Laser (Beard Line, Back, Chest)",
          'Beard Trim & Design',
          "Men's Mani & Pedi",
        ],
        note: 'Facials, laser, and beard care for men. Ask in clinic or on WhatsApp for current pricing.',
      },
    ],
  },
  {
    id: 'special-packages',
    label: 'Special Packages',
    packages: [
      {
        name: 'Bridal Beauty Package',
        tag: 'Bridal',
        highlight: true,
        bundlePrice: null,
        originalPrice: null,
        savings: null,
        treatments: [
          'Signature ArtiZone Facial',
          'Full Body Laser',
          'Custom Nail Art',
          'Eyebrow Threading & Shaping',
          'Detox Body Wraps',
        ],
        note: 'Head-to-toe preparation for your big day. Ask in clinic or on WhatsApp for current pricing.',
      },
    ],
  },
];

// ─── Category tab labels ──────────────────────────────────────────────────────
export default function PackagesPage() {
  const SITE_URL = 'https://artizonespa.com';
  const title = 'Packages & Offers | ArtiZone Clinic, Amman';
  const description = "Save with ArtiZone's beauty packages in Amman — Glow Starter, Laser bundles, Body Slimming, Bridal packages & VIP bundles. Book at the best price.";
  const canonicalUrl = `${SITE_URL}/packages`;
  const ogImage = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

  /* Flatten all packages into Offer items for structured data */
  const allOffers = packageCategories.flatMap(cat =>
    cat.packages.map(pkg => ({
      '@type': 'Offer',
      name: pkg.name,
      description: pkg.note,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', '@id': SITE_URL },
    }))
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'ArtiZone Beauty Packages',
    description,
    url: canonicalUrl,
    provider: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      '@id': SITE_URL,
      url: SITE_URL,
      telephone: '+962790412758',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.',
        addressLocality: 'Amman',
        addressCountry: 'JO',
      },
    },
    numberOfItems: allOffers.length,
    itemListElement: allOffers,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Packages', item: canonicalUrl },
      ],
    },
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
        <meta property="og:image:alt"    content="ArtiZone beauty treatment packages in Amman, Jordan" />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="ArtiZone beauty treatment packages in Amman, Jordan" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />

        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
        <section className="relative py-14 sm:py-20 overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`,
              top: '-120px',
              right: '-80px',
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300,
              height: 300,
              background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`,
              bottom: '-60px',
              left: '-60px',
            }}
            animate={{ y: [0, 16, 0] }}
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
              Curated for You
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-bold mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)', fontFamily: 'var(--font-heading)', color: CREAM }}
            >
              Beauty Packages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: 'rgba(249,245,240,0.68)' }}
            >
              Thoughtfully designed packages combining our best treatments — for skin, laser, body, nails, and special occasions.
            </motion.p>

            {/* Quick jump links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex flex-nowrap sm:flex-wrap sm:justify-center gap-2 w-max sm:w-auto sm:mx-auto">
                {packageCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-90 whitespace-nowrap"
                    style={{ background: 'rgba(201,169,110,0.18)', color: GOLD, border: `1px solid rgba(201,169,110,0.3)` }}
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-center mt-6"
            >
              <ShareButtons
                url="https://artizonespa.com/packages"
                title="ArtiZone Beauty Packages — premium treatment bundles in Amman, Jordan"
                hashtags={['ArtiZone', 'BeautyPackages', 'Amman']}
                light
              />
            </motion.div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── PACKAGE SECTIONS ───────────────────────────────────────────────── */}
        {packageCategories.map((cat, catIdx) => (
          <section
            key={cat.id}
            id={cat.id}
            className="py-20 scroll-mt-24"
            style={{ background: catIdx % 2 === 0 ? CREAM : CREAM_DARK }}
          >
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-0.5" style={{ background: GOLD }} />
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    {cat.label} Packages
                  </h2>
                </div>
              </motion.div>

              {/* Package cards */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                {cat.packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.name}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl flex flex-col relative overflow-hidden"
                    style={{
                      background: pkg.highlight ? TAUPE : '#fff',
                      border: pkg.highlight
                        ? `2px solid ${GOLD}`
                        : `1.5px solid rgba(201,169,110,0.25)`,
                      boxShadow: pkg.highlight
                        ? `0 8px 40px rgba(61,46,38,0.22), 0 0 0 1px ${GOLD}44`
                        : '0 4px 20px rgba(61,46,38,0.07)',
                    }}
                  >
                    {/* Highlight glow */}
                    {pkg.highlight && (
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ background: `linear-gradient(90deg, ${GOLD}88, ${GOLD}, ${GOLD}88)` }}
                      />
                    )}

                    <div className="p-7 flex flex-col flex-1">
                      {/* Tag */}
                      <span
                        className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-5"
                        style={{
                          background: pkg.highlight ? `${GOLD}33` : `${GOLD}18`,
                          color: GOLD,
                        }}
                      >
                        {pkg.tag}
                      </span>

                      {/* Name */}
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: pkg.highlight ? CREAM : TAUPE,
                        }}
                      >
                        {pkg.name}
                      </h3>

                      {/* Note */}
                      <p
                        className="text-xs leading-relaxed mb-4"
                        style={{ color: pkg.highlight ? 'rgba(249,245,240,0.6)' : 'hsl(20 15% 50%)' }}
                      >
                        {pkg.note}
                      </p>

                      {/* ── Pricing block ── */}
                      <div
                        className="flex items-center justify-between rounded-xl px-4 py-3 mb-5"
                        style={{
                          background: pkg.highlight ? 'rgba(201,169,110,0.12)' : `${OLIVE}0d`,
                          border: `1px solid ${pkg.highlight ? 'rgba(201,169,110,0.25)' : `${YELLOW}33`}`,
                        }}
                      >
                        <div className="flex items-baseline gap-2">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: pkg.highlight ? GOLD : OLIVE }}
                          >
                            Ask in clinic or on WhatsApp for pricing
                          </span>
                        </div>
                        <span
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: pkg.highlight ? `${YELLOW}25` : `${YELLOW}20`,
                            color: pkg.highlight ? YELLOW : OLIVE,
                          }}
                        >
                          <Sparkles size={10} />
                          Bundle Savings
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px mb-5" style={{ background: pkg.highlight ? 'rgba(201,169,110,0.25)' : 'rgba(61,46,38,0.08)' }} />

                      {/* Treatments */}
                      <ul className="space-y-2.5 flex-1 mb-6">
                        {pkg.treatments.map((t) => (
                          <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: pkg.highlight ? 'rgba(249,245,240,0.8)' : 'hsl(20 15% 35%)' }}>
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${GOLD}22` }}
                            >
                              <Check size={10} style={{ color: GOLD }} />
                            </span>
                            {t}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        to="/booking"
                        className="w-full text-center py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                        style={{
                          background: pkg.highlight ? GOLD : 'transparent',
                          color: pkg.highlight ? TAUPE : GOLD,
                          border: pkg.highlight ? 'none' : `1.5px solid ${GOLD}`,
                        }}
                      >
                        Book This Package <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── CUSTOM PACKAGE NOTE ────────────────────────────────────────────── */}
        <section className="py-16" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl p-10 text-center max-w-2xl mx-auto"
              style={{
                background: '#fff',
                border: `1.5px solid rgba(201,169,110,0.25)`,
                boxShadow: '0 4px 24px rgba(61,46,38,0.08)',
              }}
            >
              <div
                className="text-3xl mb-4"
                style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}
              >
                ✦
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Need a Custom Package?
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'hsl(20 15% 44%)' }}>
                We can create a personalized package tailored to your specific goals and budget. Contact us and we'll put together the perfect combination of treatments for you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
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
                Ready to Begin?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                Book Your Package Today
              </h2>
              <p className="text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(249,245,240,0.65)' }}>
                Contact us to book any package or ask about pricing and availability.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: GOLD, color: TAUPE }}
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
