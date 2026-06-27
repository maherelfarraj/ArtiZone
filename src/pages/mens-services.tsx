import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Clock, Star } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';

const GOLD       = '#C4A882'; /* Warm Sand — accent                    */
const TAUPE      = '#0E2A3A'; /* Ink Navy — dark bg                    */
const CREAM      = '#FDFAF6'; /* Ivory — light surface                 */
const CREAM_DARK = '#F7F3EE'; /* Parchment — section bg                */
const DARK       = '#0E2A3A'; /* Ink Navy — body text                  */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

// ─── Service categories for men ───────────────────────────────────────────────
const mensServices = [
  {
    id: 'mens-skin-care',
    title: "Men's Skin Care",
    icon: '✦',
    treatments: [
      "Gentleman's Deep-Clean Facial",
      'Hot Towel Ritual',
      'Acne & Scar Care',
      'Skin Boosters',
      'Carbon Laser Facial',
      'RF Microneedling',
      'Anti-Aging Collagen Lift',
      'LED Light Therapy',
    ],
  },
  {
    id: 'mens-laser',
    title: 'Laser Hair Removal for Men',
    icon: '✦',
    treatments: [
      'Beard Line Shaping',
      'Back & Shoulders Laser',
      'Chest Laser',
      'Full Body Laser',
      'Face & Neck Laser',
      'Underarms',
      'Small Zone Sessions',
      'Laser Touch-Up Plan',
    ],
  },
  {
    id: 'mens-grooming',
    title: 'Grooming & Shaping',
    icon: '✦',
    treatments: [
      'Beard Trim & Design',
      'Eyebrow Threading & Shaping',
      'Full Face Threading',
      'Waxing — Back & Chest',
      'Waxing — Arms & Legs',
      'Forehead & Hairline Shaping',
      'Scalp & Hair Therapy',
      'Full Face Grooming',
    ],
  },
  {
    id: 'mens-body',
    title: 'Body Slimming & Contouring',
    icon: '✦',
    treatments: [
      "Men's Body Contouring",
      'Cryolipolysis (Fat Freezing)',
      'RF Skin Tightening',
      'EMS Body Sculpting',
      'Lymphatic Drainage Massage',
      'Cellulite Therapy',
      'Detox Body Wraps',
      'Custom Slimming Programs',
    ],
  },
  {
    id: 'mens-nails',
    title: "Men's Nails & Foot Care",
    icon: '✦',
    treatments: [
      "Men's Mani & Pedi",
      'Classic Mani & Pedi',
      'Nail Cleaning & Shaping',
      'Medical Pedicure',
      'Paraffin Hand Treatment',
      'Callus Removal',
    ],
  },
];

// ─── Why men choose ArtiZone ──────────────────────────────────────────────────
const reasons = [
  {
    icon: <Shield size={22} style={{ color: GOLD }} />,
    title: 'Private & Comfortable',
    body: 'A dedicated, discreet space designed specifically for men — no awkwardness, just professional care.',
  },
  {
    icon: <Star size={22} style={{ color: GOLD }} />,
    title: 'Tailored for Men',
    body: "Every treatment is adapted to men's skin type, hair texture, and grooming goals.",
  },
  {
    icon: <Clock size={22} style={{ color: GOLD }} />,
    title: 'Efficient & Results-Driven',
    body: 'We respect your time. Focused sessions that deliver visible results without unnecessary extras.',
  },
];

export default function MensServicesPage() {
  const SITE_URL = 'https://artizonespa.com';
  const title = "Men's Grooming & Aesthetic Treatments in Amman — ArtiZone";
  const description = "Dedicated men's treatments at ArtiZone Amman: deep cleansing facials, laser hair removal for back & chest, beard grooming, body contouring, and nail care. Private and professional.";
  const canonicalUrl = `${SITE_URL}/mens-services`;
  const ogImage = `${SITE_URL}/airo-assets/images/services/mens-grooming`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: "Men's Grooming at ArtiZone",
    description,
    url: canonicalUrl,
    image: ogImage,
    serviceType: "Men's Grooming & Aesthetic Treatments",
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
    areaServed: { '@type': 'City', name: 'Amman' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: "Men's Grooming Services",
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Gentleman's Deep-Clean Facial" } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Men's Laser (Beard Line, Back, Chest)" } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Beard Trim & Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Men's Body Contouring" } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Scalp & Hair Therapy' } },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',          item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: "Men's Services", item: canonicalUrl },
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
        <meta property="og:image:alt"    content="Men's grooming and aesthetic treatments at ArtiZone Amman" />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="Men's grooming and aesthetic treatments at ArtiZone Amman" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/mens-services" />
        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/mens-services" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative flex items-end overflow-hidden" style={{ minHeight: 'clamp(340px, 60svh, 750px)', background: DARK }}>
          {/* Background (no image) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)' }}>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.95) 0%, rgba(28,20,16,0.5) 50%, rgba(28,20,16,0.2) 100%)' }}
            />
          </div>

          <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 pt-16 sm:pt-28 safe-x">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-3 sm:mb-4"
              style={{ color: GOLD }}
            >
              ArtiZone · Exclusively for Men
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-bold leading-tight mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(1.75rem, 6vw, 4.5rem)', fontFamily: 'var(--font-heading)', color: CREAM }}
            >
              Men's Grooming<br />
              <span style={{ color: GOLD }}>&amp; Aesthetics</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-base max-w-lg leading-relaxed mb-8"
              style={{ color: 'rgba(249,245,240,0.72)' }}
            >
              Professional skin care, laser hair removal, grooming, and body treatments — designed specifically for men in a private and comfortable environment.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: GOLD, color: TAUPE }}
              >
                Book Appointment
              </Link>
            </motion.div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                Why ArtiZone for Men
              </p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Built Around You
              </h2>
              <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: GOLD }} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: '#fff',
                    border: `1.5px solid rgba(201,169,110,0.2)`,
                    boxShadow: '0 4px 20px rgba(61,46,38,0.07)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: `${GOLD}18` }}
                  >
                    {r.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(20 15% 44%)' }}>
                    {r.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                Full Treatment Menu
              </p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                Men's Services
              </h2>
              <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: GOLD }} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mensServices.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl p-7"
                  style={{
                    background: CREAM,
                    border: `1.5px solid rgba(201,169,110,0.22)`,
                    boxShadow: '0 4px 20px rgba(61,46,38,0.07)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ background: `${GOLD}22`, color: GOLD }}
                    >
                      {cat.icon}
                    </span>
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                      {cat.title}
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {cat.treatments.map((t) => (
                      <li key={t} className="flex items-center gap-2.5 text-sm" style={{ color: 'hsl(20 15% 38%)' }}>
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${GOLD}22` }}
                        >
                          <Check size={9} style={{ color: GOLD }} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOOKING CTA ──────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: `radial-gradient(circle, ${GOLD}1a, transparent 70%)`,
              top: '-120px',
              right: '-80px',
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
                  Ready to Book?
                </p>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>
                  Your First Step to<br />
                  <span style={{ color: GOLD }}>Looking Your Best</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed" style={{ color: 'rgba(249,245,240,0.65)' }}>
                  Book your appointment or call us — we'll help you choose the right treatment.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: GOLD, color: TAUPE }}
                >
                  Book Appointment <ArrowRight size={15} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
