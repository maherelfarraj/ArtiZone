import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, MessageCircle, Sparkles } from 'lucide-react';
import LandingBlogLinks from '@/components/landing/LandingBlogLinks';
import OptimizedImage from '@/components/OptimizedImage';

const G     = '#C4A882';
const BLACK      = '#0E2A3A'; /* Ink Navy — dark text                  */
const S1         = '#C4A882'; /* Warm Sand                             */
const S2         = '#6B7260'; /* Sage Stone                            */
const FG         = 'rgba(253,250,246,0.88)';
const FGDIM      = 'rgba(253,250,246,0.55)';
const GDIM       = 'rgba(196,168,130,0.50)';
const DEEP_BROWN = '#0E2A3A'; /* Ink Navy                              */
const TERRACOTTA = '#C4A882'; /* Warm Sand                             */

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/mens-grooming-amman';
const TITLE    = "Men's Grooming in Amman | Laser & Skin Care for Men at ArtiZone";
const DESC     = "Men's grooming clinic in Amman — laser hair removal, facials, body slimming & skin care for men. Private rooms, certified specialists. Free consultation at ArtiZone.";
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/mens-grooming`;

const SERVICES = [
  { name: 'Laser Hair Removal for Men', desc: 'Back, chest, shoulders, neck, and full body laser hair removal. Permanent reduction with advanced diode laser technology.' },
  { name: "Men's Facial",               desc: 'Deep cleansing, anti-aging, and brightening facials designed specifically for male skin — thicker, oilier, and more prone to ingrown hairs.' },
  { name: 'Body Slimming for Men',      desc: 'Cavitation and RF treatments to reduce belly fat, love handles, and chest fat — no surgery, no downtime.' },
  { name: 'Skin Care Treatments',       desc: 'Acne treatment, hyperpigmentation correction, and anti-aging skin care for men who want clear, healthy skin.' },
  { name: 'Eyebrow Shaping',            desc: 'Clean, masculine eyebrow shaping and threading for a sharp, well-groomed appearance.' },
  { name: 'Full Grooming Package',      desc: 'Our most popular men\'s package — combines laser, facial, and skin care for a complete grooming transformation.' },
];

const FAQS = [
  { q: 'Is ArtiZone suitable for men?', a: 'Absolutely. We have a dedicated men\'s grooming section with private treatment rooms. Many of our clients are men seeking laser hair removal, facials, and body slimming.' },
  { q: 'Is laser hair removal painful for men?', a: 'The sensation is minimal — most men describe it as a light snap. We use cooling gel and modern diode laser technology to keep you comfortable throughout.' },
  { q: 'How many laser sessions do men need?', a: 'Men typically need 6–10 sessions for areas like the back and chest due to coarser, denser hair. Facial areas may need additional sessions.' },
  { q: 'Are the treatment rooms private?', a: 'Yes. All treatment rooms at ArtiZone are fully private. We understand discretion is important and ensure a comfortable, professional environment for every client.' },
  { q: "What's the best facial for men?", a: 'The Deep Cleansing Facial is most popular with men — it targets clogged pores, ingrown hairs, and oiliness. We customise every treatment to your specific skin concerns.' },
];

const REVIEWS = [
  { name: 'Rami K.',  text: "ArtiZone's men's services are exceptional. The laser back treatment was painless and the results after 6 sessions are incredible. Very professional.", rating: 5 },
  { name: 'Khalid M.',text: 'I was nervous about getting a facial but the team made me feel completely comfortable. My skin has never looked better. Highly recommend for men.', rating: 5 },
  { name: 'Tariq A.', text: 'Did the full grooming package — laser, facial, and skin care. Worth every dinar. The private rooms and professional staff make all the difference.', rating: 5 },
];

function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

export default function MensGroomingAmman() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${SLUG}#service`,
        name: "Men's Grooming in Amman",
        serviceType: "Men's grooming",
        url: `${SITE_URL}${SLUG}`,
        image: OG_IMG,
        description: DESC,
        category: 'Men',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'City', name: 'Amman' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'JOD',
          priceRange: '15–300',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/booking`,
          seller: { '@id': `${SITE_URL}/#business` },
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SITE_URL}/booking`,
          servicePhone: '+962790412758',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${SLUG}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: "Men's Grooming" },
        ],
      },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={OG_IMG} />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={TITLE} />
        <meta property="og:site_name" content="ArtiZone Beauty &amp; Aesthetic Clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artizone_clinic" />
        <meta property="og:locale" content="en_US" />
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/mens-grooming-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/mens-grooming-amman`} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMG} />
        <meta name="twitter:image:alt" content={TITLE} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(480px,70svh,780px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/mens-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={780}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.25) 0%,rgba(61,61,63,0.60) 55%,rgba(61,61,63,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.55) 0%,transparent 60%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24" style={{ minHeight: 'clamp(480px,70svh,780px)' }}>
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <Link to="/mens-services" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Men's Services</Link>
              <span>/</span>
              <span style={{ color: G }}>Men's Grooming Amman</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Amman, Jordan</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(230,215,185,0.95)', fontSize: 'clamp(1.75rem,5.5vw,4.8rem)', lineHeight: 1.1, fontWeight: 400, marginBottom: '1rem' }}>
              Men's Grooming{' '}
              <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Private, professional grooming for men — laser hair removal, facials, body slimming, and skin care in a comfortable, discreet environment.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                Book Now <ArrowRight size={11} />
              </Link>
              <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20men%27s%20grooming%20appointment%20at%20ArtiZone%20Amman"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
                <MessageCircle size={13} /> WhatsApp Us
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(201,160,80,0.10)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { val: '100%',   label: 'Private treatment rooms'    },
                { val: '6+',     label: "Men's services available"   },
                { val: '4.9★',   label: 'Google rating'              },
                { val: '2,500+', label: 'Clients treated in Amman'   },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── INTRO ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>For Men, By Professionals</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Professional Grooming<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>Built for Men</em>
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${G})` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: G }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${G})` }} />
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  ArtiZone offers a full range of grooming and aesthetic treatments designed specifically for men. From laser hair removal to skin care and body slimming — all in private, comfortable treatment rooms with certified specialists.
                </p>
                <ul className="space-y-3">
                  {['Fully private treatment rooms','Certified specialists experienced with male skin','Laser hair removal for all body areas','Facials designed for male skin type','Body slimming with no surgery or downtime','Discreet, professional, and results-focused'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: G }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.50) 0%,transparent 50%)' }} />
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>What We Offer</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Men's Grooming Services
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s, i) => (
                <motion.div key={s.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 luxury-card" style={{ background: BLACK }}>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{s.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-10">
              <Link to="/mens-services"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
                style={{ border: `1px solid ${G}55`, color: G, fontFamily: 'var(--font-sans)' }}>
                View Full Men's Menu <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </section>
        <GoldLine />

        {/* ── REVIEWS ── */}
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Client Reviews</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                What Men Say
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative" style={{ background: BLACK, border: '1px solid rgba(201,160,80,0.10)' }}>
                  <div className="absolute top-5 right-6 text-6xl leading-none select-none" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(201,160,80,0.09)' }}>"</div>
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill={G} color={G} />)}</div>
                  <p className="text-sm leading-relaxed mb-5 italic" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(201,160,80,0.10)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold" style={{ background: `${G}18`, color: G, fontFamily: 'var(--font-sans)' }}>{r.name[0]}</div>
                      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{r.name}</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <GoldLine />

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Common Questions</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Men's Grooming FAQ
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, i) => (
                <motion.div key={faq.q} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6" style={{ background: S1, border: '1px solid rgba(201,160,80,0.10)' }}>
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <GoldLine />
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: S1 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 80% 20%, rgba(201,160,80,0.06) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Book Today</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Look Your Best.<br /><em style={{ color: G, fontStyle: 'italic' }}>Feel Your Best.</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Book your men's grooming appointment at ArtiZone Amman. Private, professional, and results-driven.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Book Now <ArrowRight size={12} />
                </Link>
                <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20men%27s%20grooming%20appointment%20at%20ArtiZone%20Amman"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
                  <MessageCircle size={13} /> WhatsApp Us
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: GDIM }} /> Arjan St., Amman</span>
                <span className="flex items-center gap-1.5"><Phone size={11} style={{ color: GDIM }} /> 079 041 2758</span>
                <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: GDIM }} /> Sat–Thu 10AM–9PM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FROM OUR BLOG ── */}
        <LandingBlogLinks service="mens" />

        {/* ── INTERNAL LINKS ── */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(201,160,80,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Skin Tightening',    href: '/skin-tightening-amman'    },
                { label: 'Acne Scar Removal',  href: '/acne-scar-removal-amman'  },
                { label: 'Body Slimming',      href: '/body-slimming-amman'      },
                { label: "Men's Services",     href: '/mens-services'            },
                { label: 'All Services',       href: '/services'                 },
              ].map(l => (
                <Link key={l.href} to={l.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-200 hover:opacity-80"
                  style={{ border: `1px solid rgba(201,160,80,0.18)`, color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  {l.label} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── STICKY MOBILE BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ background: 'rgba(14,42,58,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(196,168,130,0.20)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch">
          <a href="tel:+962790412758"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ color: 'rgba(253,250,246,0.80)', fontFamily: 'var(--font-sans)' }}>
            <Phone size={15} style={{ color: G }} /> Call
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)' }} />
          <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20men%27s%20grooming%20appointment%20at%20ArtiZone%20Amman"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
            <MessageCircle size={15} /> WhatsApp
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)' }} />
          <Link to="/booking"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: G, color: '#0E2A3A', fontFamily: 'var(--font-sans)' }}>
            <Sparkles size={13} /> Book Now
          </Link>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
