import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import LandingBlogLinks from '@/components/landing/LandingBlogLinks';
import OptimizedImage from '@/components/OptimizedImage';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const G          = '#C4A882'; /* Warm Sand — accent                    */
const BLACK      = '#0E2A3A'; /* Ink Navy — dark text                  */
const S1         = '#C4A882'; /* Warm Sand                             */
const S2         = '#6B7260'; /* Sage Stone                            */
const FG         = 'rgba(253,250,246,0.92)';
const FGDIM      = 'rgba(253,250,246,0.58)';
const GDIM       = 'rgba(196,168,130,0.50)';
const DEEP_BROWN = '#0E2A3A'; /* Ink Navy                              */
const TERRACOTTA = '#C4A882'; /* Warm Sand                             */
const MUSTARD    = '#6B7260'; /* Sage Stone                            */
const CREAM      = '#F7F3EE'; /* Parchment                             */

/* ── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

/* ── SEO constants ───────────────────────────────────────────────────────── */
const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/best-facial-amman';
const TITLE    = 'Best Facials & Skin Treatments Amman | HydraFacial, Peels, PRP | ArtiZone';
const DESC     = 'Best facials in Amman — HydraFacial, chemical peels, acne treatment & anti-aging skin care. Visible results from session one. Free skin consultation at ArtiZone. Book now.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

/* ── Treatment data ──────────────────────────────────────────────────────── */
const HYDRAFACIAL_BENEFITS = [
  'Deep pore cleansing & blackhead extraction',
  'Hydrating serum infusion with hyaluronic acid',
  'Antioxidant protection',
  'Immediate glow — no redness, no downtime',
  'Ideal for all skin types',
];

const PEELS = [
  { name: 'Glycolic Peel (20–70%)',  tag: 'Brightening',   desc: 'Brightening, fine lines, texture refinement. Ideal for dull or uneven skin tone.' },
  { name: 'Salicylic Peel',          tag: 'Acne & Oily',   desc: 'Active acne, oily skin, pore refinement. Penetrates deep into follicles.' },
  { name: 'TCA Peel',                tag: 'Deep Correction', desc: 'Deep pigmentation, acne scars, aging. Our most powerful resurfacing option.' },
  { name: 'Mandelic Peel',           tag: 'Sensitive',     desc: 'Sensitive skin, rosacea, gentle brightening. Larger molecule — less irritation.' },
];

const ACNE_PHASE1 = [
  'Deep-cleansing facials with extractions',
  'Salicylic acid & LED light therapy',
  'Medical-grade home care regimen',
];
const ACNE_PHASE2 = [
  'Microneedling with PRP (Platelet-Rich Plasma)',
  'Fractional laser resurfacing',
  'Chemical reconstruction of scars (CROSS technique)',
  'Subcision for deep rolling scars',
];

const ANTIAGING = [
  { name: 'PRP Skin Rejuvenation',  sub: '"Vampire Facial"',       desc: 'Natural growth factors from your own blood stimulate collagen production for firmer, younger-looking skin.' },
  { name: 'RF Microneedling',       sub: 'Radiofrequency + Needling', desc: 'Combines microneedling with radiofrequency energy for deep skin tightening and texture improvement.' },
  { name: 'Mesotherapy',            sub: 'Vitamin Infusion',        desc: 'Vitamin cocktails injected into the skin for deep hydration, glow, and nutrient delivery.' },
  { name: 'Thread Lifting',         sub: 'PDO Threads',             desc: 'Non-surgical face lift using dissolvable PDO threads — lift and tighten without surgery or downtime.' },
];

const PRICING = [
  { treatment: 'HydraFacial Signature',         duration: '30 min',  note: '' },
  { treatment: 'HydraFacial Deluxe (+Booster)', duration: '45 min',  note: '' },
  { treatment: 'Deep Cleansing Facial',          duration: '60 min',  note: '' },
  { treatment: 'Chemical Peel (Light)',          duration: '30 min',  note: '' },
  { treatment: 'Chemical Peel (Medium)',         duration: '45 min',  note: '' },
  { treatment: 'Microneedling + PRP',            duration: '90 min',  note: '' },
  { treatment: 'RF Microneedling',               duration: '60 min',  note: '' },
  { treatment: 'Acne Scar Package (6 sessions)', duration: 'Course',  note: 'Best value' },
  { treatment: 'Anti-Aging Facial Package',      duration: 'Course',  note: '' },
  { treatment: 'Glass Skin Program (3 months)',  duration: 'Program', note: 'Most popular' },
];

const FAQS = [
  { q: 'Is laser hair removal safe for dark skin?',
    a: 'Absolutely. Our Nd:YAG laser is specifically designed for darker skin tones (Fitzpatrick IV–VI), minimizing risk of hyperpigmentation while effectively targeting hair follicles.' },
  { q: 'How many sessions do I need?',
    a: 'Most clients need 6–8 sessions for 80–95% permanent reduction. Hormonal areas like face may require 10–12 sessions.' },
  { q: 'Does laser hair removal hurt?',
    a: 'Most clients describe a mild snapping sensation. Our integrated cooling system makes the experience comfortable — much less painful than waxing.' },
  { q: 'Can men get laser hair removal?',
    a: 'Yes! Men\'s laser hair removal is one of our fastest-growing services. Popular areas include back, chest, beard shaping, and full body grooming.' },
  { q: 'What is the best time of year for laser in Amman?',
    a: 'Fall and winter are ideal as skin is less tanned. However, with our advanced technology, we treat safely year-round with proper sun protection.' },
];

const REVIEWS = [
  { name: 'Sara M.',  text: 'The HydraFacial at ArtiZone is incredible. My skin was glowing for weeks. The staff are knowledgeable and genuinely care about results.', rating: 5 },
  { name: 'Hana J.',  text: 'Best facial I have had in Amman. The deep cleansing facial cleared my skin in just two sessions. Highly recommend!', rating: 5 },
  { name: 'Dina R.',  text: 'I have been coming for the anti-aging facial every month for 6 months. The difference in my skin texture and firmness is remarkable.', rating: 5 },
];

/* ── Sub-components ──────────────────────────────────────────────────────── */
function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
      style={{ color: G, fontFamily: 'var(--font-sans)' }}>
      {children}
    </p>
  );
}

function AccordionFaq({ faq, i }: { faq: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="overflow-hidden" style={{ background: S1, border: `1px solid rgba(196,168,130,0.15)` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left transition-opacity hover:opacity-80"
        aria-expanded={open}
      >
        <h3 className="text-sm font-medium leading-snug" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{faq.q}</h3>
        <ChevronDown size={16} style={{ color: G, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>{faq.a}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function BestFacialAmman() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${SLUG}#service`,
        name: 'Facials & Skin Care in Amman',
        serviceType: 'Facial treatment',
        url: `${SITE_URL}${SLUG}`,
        image: OG_IMG,
        description: DESC,
        category: 'Skin Care',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'City', name: 'Amman' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'JOD',
          priceRange: '20–250',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/booking`,
          seller: { '@id': `${SITE_URL}/#business` },
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SITE_URL}/booking`,
          servicePhone: '+962790412758',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Facial Treatments',
          itemListElement: PRICING.map((p, idx) => ({
            '@type': 'Offer', position: idx + 1,
            itemOffered: { '@type': 'Service', name: p.treatment },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${SLUG}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: 'Face & Skin Care' },
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
        <meta property="og:site_name" content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artizone_clinic" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMG} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}${SLUG}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(480px,70svh,780px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/facial-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={780}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.20) 0%,rgba(61,61,63,0.55) 50%,rgba(61,61,63,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.55) 0%,transparent 60%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(480px,70svh,780px)' }}>

            {/* Breadcrumb */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <Link to="/services" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Services</Link>
              <span>/</span>
              <span style={{ color: G }}>Facials & Skin Treatments</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: G, fontFamily: 'var(--font-sans)' }}>Amman, Jordan</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(230,215,185,0.95)', fontSize: 'clamp(1.75rem,5.5vw,4.8rem)', lineHeight: 1.1, fontWeight: 400, marginBottom: '1rem' }}>
              Advanced Skin &{' '}
              <em style={{ color: G, fontStyle: 'italic' }}>Facial Treatments</em>
              <br />in Amman
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              HydraFacial, medical-grade chemical peels, acne treatment, PRP rejuvenation, and anti-aging protocols — customized for your skin type by dermatology-trained specialists.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Free Consultation
              </Link>
              <a href="tel:+962790412758"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ border: `1px solid rgba(196,168,130,0.45)`, color: G, fontFamily: 'var(--font-sans)' }}>
                <Phone size={12} /> Call Now
              </a>
            </motion.div>
          </div>
        </section>

        {/* ══ TRUST BAR ════════════════════════════════════════════════════ */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { val: '10+',    label: 'Skin treatments available'  },
                { val: '2,500+', label: 'Clients treated in Amman'   },
                { val: '4.9★',   label: 'Google rating'              },
                { val: 'Free',   label: 'Skin consultation'          },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ HYDRAFACIAL ══════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionLabel>Celebrity-Favourite Treatment</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  HydraFacial<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${G})` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: G }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${G})` }} />
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  The celebrity-favourite HydraFacial uses patented vortex technology to cleanse, extract, and hydrate in one 30-minute session. Perfect before events or as monthly maintenance.
                </p>
                <ul className="space-y-3 mb-6">
                  {HYDRAFACIAL_BENEFITS.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: G }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4 p-4" style={{ background: 'rgba(196,168,130,0.08)', border: `1px solid rgba(196,168,130,0.20)` }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Duration</p>
                    <p className="text-sm font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>30–45 minutes</p>
                  </div>
                  <div className="w-px h-8" style={{ background: 'rgba(196,168,130,0.25)' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Recommended</p>
                    <p className="text-sm font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>Monthly</p>
                  </div>
                  <div className="w-px h-8" style={{ background: 'rgba(196,168,130,0.25)' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Downtime</p>
                    <p className="text-sm font-medium" style={{ color: G, fontFamily: 'var(--font-sans)' }}>None</p>
                  </div>
                </div>
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

        {/* ══ CHEMICAL PEELS ═══════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Medical-Grade Exfoliation</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Chemical Peels in Amman
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                We offer a range of medical-grade peels tailored to your skin type and concern. All peels include pre-treatment consultation and post-peel care kit.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PEELS.map((peel, i) => (
                <motion.div key={peel.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative overflow-hidden group transition-all duration-300"
                  style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.45)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-6 h-px mt-3" style={{ background: G }} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 shrink-0"
                      style={{ background: `rgba(196,168,130,0.15)`, color: G, fontFamily: 'var(--font-sans)' }}>
                      {peel.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{peel.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{peel.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ACNE TREATMENT ═══════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Multi-Modal Acne Program</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Acne & Scar Treatment<br />
                <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Jordan's climate and hard water can trigger persistent breakouts. Our two-phase program addresses both active acne and the scars it leaves behind.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Phase 1 */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-8" style={{ background: S1, border: `1px solid rgba(196,168,130,0.18)` }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-medium" style={{ fontFamily: 'var(--font-heading)', color: G }}>01</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right,${G}55,transparent)` }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>Phase 1 — Active Acne Control</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>Reduce breakouts, oil, and inflammation</p>
                <ul className="space-y-3">
                  {ACNE_PHASE1.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(14,42,58,0.72)', fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: G }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Phase 2 */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="p-8" style={{ background: S2, border: `1px solid rgba(196,168,130,0.18)` }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-medium" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>02</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right,${DEEP_BROWN}55,transparent)` }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>Phase 2 — Scar Revision</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>Visible improvement in 4–6 sessions</p>
                <ul className="space-y-3">
                  {ACNE_PHASE2.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(14,42,58,0.72)', fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: DEEP_BROWN }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ ANTI-AGING ═══════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Turn Back Time Without Surgery</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Anti-Aging Treatments<br />
                <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                "Refreshed, Not Done" — we prioritize natural results that respect your facial identity, aligned with 2026 global aesthetic trends.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ANTIAGING.map((item, i) => (
                <motion.div key={item.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 group transition-all duration-300"
                  style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.45)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{item.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{item.sub}</p>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PIGMENTATION ═════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionLabel>Safe for All Skin Tones</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Pigmentation &<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>Melasma Treatment</em>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  Melasma and post-inflammatory hyperpigmentation are common concerns in Jordan. Our safe, effective protocols are designed for darker skin tones common in the region.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Picosecond laser for pigment — safer for darker skin tones',
                    'Tranexamic acid peels & infusions',
                    'Vitamin C & glutathione protocols',
                    'Strict sun protection education',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: G }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-4 flex items-start gap-3" style={{ background: 'rgba(200,110,70,0.10)', border: `1px solid rgba(200,110,70,0.25)` }}>
                  <span className="text-lg leading-none mt-0.5" aria-hidden>⚠️</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(253,250,246,0.65)', fontFamily: 'var(--font-sans)' }}>
                    We never use harmful bleaching agents. Our approach is medical, safe, and regulated.
                  </p>
                </div>
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

        {/* ══ PRICING TABLE ════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Treatment Menu</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Pricing & Treatments
              </h2>
              <p className="mt-4 text-sm" style={{ color: 'rgba(14,42,58,0.60)', fontFamily: 'var(--font-sans)' }}>
                Exact pricing provided during your free consultation — tailored to your skin's needs.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="overflow-hidden" style={{ border: `1px solid rgba(196,168,130,0.20)` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: BLACK }}>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: G, fontFamily: 'var(--font-sans)', width: '55%' }}>Treatment</th>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: G, fontFamily: 'var(--font-sans)' }}>Duration</th>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: G, fontFamily: 'var(--font-sans)' }}>Enquire</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map((row, i) => (
                    <tr key={row.treatment}
                      style={{ background: i % 2 === 0 ? 'rgba(220,200,176,0.55)' : 'rgba(220,200,176,0.30)', borderTop: '1px solid rgba(196,168,130,0.10)' }}>
                      <td className="px-6 py-4">
                        <span style={{ fontFamily: 'var(--font-sans)', color: 'rgba(14,42,58,0.85)', fontWeight: 500 }}>{row.treatment}</span>
                        {row.note && (
                          <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5"
                            style={{ background: `rgba(196,168,130,0.18)`, color: G, fontFamily: 'var(--font-sans)' }}>
                            {row.note}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: 'rgba(14,42,58,0.60)', fontFamily: 'var(--font-sans)' }}>{row.duration}</td>
                      <td className="px-6 py-4">
                        <Link to="/booking"
                          className="text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                          style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                          Get Quote →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-8">
              <Link to="/booking"
                className="inline-flex items-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Free Consultation <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ REVIEWS ══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <SectionLabel>Client Reviews</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                What Clients Say
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="absolute top-5 right-6 text-6xl leading-none select-none"
                    style={{ fontFamily: 'var(--font-heading)', color: 'rgba(196,168,130,0.09)' }}>"</div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill={MUSTARD} color={MUSTARD} />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 italic" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(196,168,130,0.12)' }}>
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold"
                      style={{ background: `${G}18`, color: G, fontFamily: 'var(--font-sans)' }}>{r.name[0]}</div>
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{r.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Common Questions</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Skin Treatment FAQ
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => <AccordionFaq key={faq.q} faq={faq} i={i} />)}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: S1 }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 80% 50%, rgba(196,168,130,0.08) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <SectionLabel>Your Best Skin Starts Here</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Free Skin Consultation<br />
                <em style={{ color: G, fontStyle: 'italic' }}>at ArtiZone Amman</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Our skin specialists will analyze your skin type, discuss your goals, and recommend a personalized treatment plan — at no charge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                  Book Free Consultation
                </Link>
                <a href="tel:+962790412758"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                  style={{ border: `1px solid rgba(196,168,130,0.35)`, color: G, fontFamily: 'var(--font-sans)' }}>
                  <Phone size={12} /> +962 79 041 2758
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: GDIM }} /> Arjan St., 2nd Floor, Amman</span>
                <span className="flex items-center gap-1.5"><Phone size={11} style={{ color: GDIM }} /> +962 79 041 2758</span>
                <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: GDIM }} /> Sat–Thu 10AM–9PM · Fri 2PM–9PM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ FROM OUR BLOG ════════════════════════════════════════════════ */}
        <LandingBlogLinks service="facial" />

        {/* ══ INTERNAL LINKS ═══════════════════════════════════════════════ */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5"
              style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Skin Tightening',    href: '/skin-tightening-amman'    },
                { label: 'Acne Scar Removal',  href: '/acne-scar-removal-amman'  },
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Body Slimming',      href: '/body-slimming-amman'      },
                { label: "Men's Grooming",     href: '/mens-grooming-amman'      },
                { label: 'All Services',       href: '/services'                 },
              ].map(l => (
                <Link key={l.href} to={l.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-200 hover:opacity-80"
                  style={{ border: `1px solid rgba(196,168,130,0.18)`, color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  {l.label} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
