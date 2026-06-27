import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown, AlertTriangle } from 'lucide-react';
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
const SLUG     = '/body-slimming-amman';
const TITLE    = 'Non-Invasive Body Slimming Amman | Fat Reduction & Cellulite | ArtiZone';
const DESC     = 'Non-surgical body slimming in Amman — lose 2–5 cm per area with Cryolipolysis, RF tightening & cavitation. Zero downtime, zero surgery. Free consultation at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/body-slimming`;

/* ── Treatment data ──────────────────────────────────────────────────────── */
const TREATMENTS = [
  {
    id:       'cryo',
    name:     'Cryolipolysis',
    sub:      'Fat Freezing',
    tag:      'FDA-Cleared',
    tagColor: G,
    what:     'FDA-cleared technology that freezes and eliminates fat cells permanently.',
    how:      'Controlled cooling targets fat cells beneath the skin. Frozen cells crystallize and are naturally eliminated by your body over 8–12 weeks.',
    bestFor:  ['Love handles', 'Belly fat', 'Thigh bulges', 'Double chin', 'Bra fat', 'Back fat'],
    specs: [
      { label: 'Treatment time', value: '35–60 min per area' },
      { label: 'Sessions needed', value: '1–2 per area'      },
      { label: 'Downtime',        value: 'None'              },
      { label: 'Results visible', value: '8–12 weeks'        },
    ],
    comfort: 'Relax and read or scroll during treatment.',
  },
  {
    id:       'rf',
    name:     'Radiofrequency (RF)',
    sub:      'Skin Tightening',
    tag:      'Collagen Boost',
    tagColor: MUSTARD,
    what:     'Heat energy stimulates collagen and elastin production deep in the skin.',
    how:      'RF waves penetrate the dermis, contracting existing collagen fibers and triggering new collagen growth. Skin becomes firmer, tighter, and more youthful.',
    bestFor:  ['Loose skin on abdomen', 'Arms & thighs', 'Face & neck', 'Post-weight loss', 'Cellulite reduction'],
    specs: [
      { label: 'Treatment time',  value: '30–45 min'          },
      { label: 'Sessions needed', value: '6–8 sessions'       },
      { label: 'Spacing',         value: '1 week apart'       },
      { label: 'Results',         value: 'Progressive over 3 months' },
    ],
    comfort: 'Warm, comfortable sensation — no pain.',
  },
  {
    id:       'cavitation',
    name:     'Ultrasonic Cavitation',
    sub:      'Fat Cell Disruption',
    tag:      'Inch Loss',
    tagColor: S2,
    what:     'Low-frequency ultrasound waves break down fat cell membranes.',
    how:      'Sound waves create bubbles in fat tissue, causing cells to rupture. Released fat is metabolized by the liver and eliminated naturally.',
    bestFor:  ['Cellulite reduction', 'Inch loss', 'Body contouring', 'Lymphatic drainage'],
    specs: [
      { label: 'Treatment time',  value: '30–40 min'          },
      { label: 'Sessions needed', value: '6–10 sessions'      },
      { label: 'Downtime',        value: 'None'               },
      { label: 'Best combined',   value: 'RF + lymphatic massage' },
    ],
    comfort: 'Mild buzzing sensation — completely painless.',
  },
  {
    id:       'lymphatic',
    name:     'Lymphatic Drainage',
    sub:      'Detox & Circulation',
    tag:      'Recovery Boost',
    tagColor: TERRACOTTA,
    what:     'Specialized massage technique that stimulates the lymphatic system.',
    how:      'Gentle rhythmic movements guide lymph fluid toward lymph nodes, flushing toxins and reducing fluid retention throughout the body.',
    bestFor:  ['Water retention', 'Post-treatment recovery', 'Detoxification', 'Improved circulation'],
    specs: [
      { label: 'Treatment time',  value: '45–60 min'          },
      { label: 'Frequency',       value: 'Weekly'             },
      { label: 'Best combined',   value: 'Post-cavitation/RF' },
      { label: 'Downtime',        value: 'None'               },
    ],
    comfort: 'Deeply relaxing — many clients fall asleep.',
  },
];

/* ── Packages ────────────────────────────────────────────────────────────── */
const PACKAGES = [
  { name: 'Starter Slimming',           includes: '4 cavitation + 2 RF + 2 lymphatic',                                    note: ''             },
  { name: 'Intensive Contouring',        includes: '6 cavitation + 4 RF + 4 lymphatic',                                    note: 'Best Value'   },
  { name: 'Ultimate Transformation',     includes: '8 cavitation + 6 RF + 6 lymphatic + 1 cryolipolysis area',             note: 'Most Popular' },
  { name: 'Post-Pregnancy Recovery',     includes: 'Custom protocol designed for new moms',                                note: ''             },
  { name: 'Bridal Body Prep (3-month)',  includes: 'Full slimming + skin tightening + nutrition guidance',                  note: 'Ask About This' },
];

/* ── Prep & Aftercare ────────────────────────────────────────────────────── */
const BEFORE = [
  'Stay hydrated — drink 2L water daily for 3 days prior',
  'Avoid heavy meals 2 hours before your session',
  'Wear comfortable, loose clothing',
];
const AFTER = [
  'Drink 2–3L water to flush released fat',
  'Light exercise (30-min walk) within 24 hours',
  'Avoid alcohol for 48 hours',
  'Maintain a healthy diet for best results',
];

/* ── Timeline ────────────────────────────────────────────────────────────── */
const TIMELINE = [
  { week: 'Week 1–2',  result: 'Reduced water retention, smoother skin texture'              },
  { week: 'Week 3–4',  result: 'Visible inch loss, improved body contour'                    },
  { week: 'Week 6–8',  result: 'Significant fat reduction, noticeably tighter skin'          },
  { week: 'Week 12+',  result: 'Final results visible — maintenance sessions as needed'      },
];

/* ── FAQs ────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Is body slimming treatment safe?',
    a: 'Yes. All our body slimming treatments are non-invasive and non-surgical. There is no downtime, no anaesthesia, and no recovery period required. Treatments are clinically proven and FDA-cleared where applicable.' },
  { q: 'How many sessions do I need?',
    a: 'Most clients see visible results after 4–6 sessions. A full course of 8–12 sessions is recommended for optimal fat reduction and skin tightening. Our specialists will create a personalized plan during your free consultation.' },
  { q: 'Which areas can be treated?',
    a: 'We treat the abdomen, waist, hips, thighs, buttocks, arms, and back. Cryolipolysis also targets the double chin and bra fat. A consultation will help us create a personalized plan for your target areas.' },
  { q: 'Is body slimming a weight-loss treatment?',
    a: 'No — body slimming is a contouring treatment for stubborn areas resistant to diet and exercise. It is not a substitute for weight loss. Best results are achieved when combined with a healthy lifestyle. Clients who maintain their weight see the longest-lasting results.' },
  { q: 'Can I combine multiple treatments in one session?',
    a: 'Absolutely. Our most popular approach combines cavitation, RF, and lymphatic drainage in a single session for maximum results. Our specialists will design the optimal combination for your body type and goals.' },
];

/* ── Reviews ─────────────────────────────────────────────────────────────── */
const REVIEWS = [
  { name: 'Nadia H.',  text: 'I lost 8cm from my waist after the Intensive Contouring package. The team at ArtiZone are professional and the results exceeded my expectations.', rating: 5 },
  { name: 'Reem T.',   text: 'The cryolipolysis treatment on my love handles was painless and the results after 8 weeks were incredible. I can finally wear clothes I avoided for years.', rating: 5 },
  { name: 'Yasmin K.', text: 'I did the Bridal Body Prep package before my wedding. My skin was so tight and smooth. Every bride in Amman needs to know about this.', rating: 5 },
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
export default function BodySlimmingAmman() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${SLUG}#service`,
        name: 'Body Slimming in Amman',
        serviceType: 'Body slimming',
        url: `${SITE_URL}${SLUG}`,
        image: OG_IMG,
        description: DESC,
        category: 'Body',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'City', name: 'Amman' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'JOD',
          priceRange: '35–400',
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
          name: 'Body Slimming Packages',
          itemListElement: PACKAGES.map((p, i) => ({
            '@type': 'Offer', position: i + 1,
            itemOffered: { '@type': 'Service', name: p.name, description: p.includes },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${SLUG}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: 'Body Slimming' },
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
            src="/airo-assets/images/services/slimming-video"
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
              <span style={{ color: G }}>Body Slimming Amman</span>
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
              Body Slimming &<br />
              <em style={{ color: G, fontStyle: 'italic' }}>Contouring in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Cryolipolysis, RF tightening, cavitation & lymphatic drainage — no surgery, no scars, no downtime. Clinically proven technologies for measurable results.
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
                { val: '4',      label: 'Advanced technologies'       },
                { val: '5+',     label: 'Slimming packages'           },
                { val: '4.9★',   label: 'Google rating'               },
                { val: 'Zero',   label: 'Downtime, zero surgery'      },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ INTRO ════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionLabel>No Surgery. No Downtime. Real Results.</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Achieve the Body<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>You Have Always Wanted</em>
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${G})` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: G }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${G})` }} />
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  At ArtiZone Amman, our non-invasive body slimming technologies target stubborn fat pockets, smooth cellulite, and tighten loose skin using clinically proven technologies.
                </p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  Whether you are preparing for a wedding, recovering post-pregnancy, or simply investing in your confidence — our customized body contouring programs deliver measurable results. The Middle East aesthetic market is rapidly embracing non-surgical body treatments, and ArtiZone brings these advanced technologies to Jordan.
                </p>
                <Link to="/booking"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:gap-3"
                  style={{ color: G, fontFamily: 'var(--font-sans)' }}>
                  Start Your Transformation <ArrowRight size={12} />
                </Link>
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

        {/* ══ TREATMENTS ═══════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <SectionLabel>Clinically Proven Technologies</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Our Body Slimming<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Treatments</em>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {TREATMENTS.map((t, i) => (
                <motion.div key={t.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="overflow-hidden" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.15)' }}>
                  <div className="grid grid-cols-1 lg:grid-cols-3">

                    {/* Left: header */}
                    <div className="p-8 lg:p-10 flex flex-col justify-between"
                      style={{ borderRight: '1px solid rgba(196,168,130,0.12)', borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
                      <div>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 mb-5"
                          style={{ background: `rgba(196,168,130,0.12)`, color: t.tagColor, fontFamily: 'var(--font-sans)' }}>
                          {t.tag}
                        </span>
                        <div className="w-6 h-px mb-4" style={{ background: G }} />
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, lineHeight: 1.1 }}>{t.name}</h3>
                        <p className="text-[10px] uppercase tracking-[0.18em] mt-1 mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{t.sub}</p>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                          <span className="font-medium" style={{ color: FG }}>What it is: </span>{t.what}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                          <span className="font-medium" style={{ color: FG }}>How it works: </span>{t.how}
                        </p>
                      </div>
                      <p className="text-xs mt-6 italic" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>{t.comfort}</p>
                    </div>

                    {/* Middle: best for */}
                    <div className="p-8 lg:p-10" style={{ borderRight: '1px solid rgba(196,168,130,0.12)', borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.20em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Best For</p>
                      <ul className="space-y-3">
                        {t.bestFor.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                            <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: G }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: specs + CTA */}
                    <div className="p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.20em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Treatment Details</p>
                        <div className="space-y-4">
                          {t.specs.map(s => (
                            <div key={s.label}>
                              <p className="text-[10px] uppercase tracking-[0.14em] mb-0.5" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>{s.label}</p>
                              <p className="text-sm font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>{s.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link to="/booking"
                        className="inline-flex items-center gap-2 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 hover:gap-3"
                        style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                        Book This Treatment <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PACKAGES TABLE ═══════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Bundled for Maximum Results</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Slimming Packages<br />
                <em style={{ color: G, fontStyle: 'italic' }}>& Pricing</em>
              </h2>
              <p className="mt-4 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Exact pricing provided during your free consultation — tailored to your body goals.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="overflow-hidden" style={{ border: `1px solid rgba(196,168,130,0.20)` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: S1 }}>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: DEEP_BROWN, fontFamily: 'var(--font-sans)', width: '30%' }}>Package</th>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: DEEP_BROWN, fontFamily: 'var(--font-sans)' }}>Includes</th>
                    <th className="text-left px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.20em]"
                      style={{ color: DEEP_BROWN, fontFamily: 'var(--font-sans)', width: '18%' }}>Enquire</th>
                  </tr>
                </thead>
                <tbody>
                  {PACKAGES.map((pkg, i) => (
                    <tr key={pkg.name}
                      style={{ background: i % 2 === 0 ? 'rgba(61,61,63,0.95)' : 'rgba(61,61,63,0.80)', borderTop: '1px solid rgba(196,168,130,0.10)' }}>
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span style={{ fontFamily: 'var(--font-heading)', color: FG, fontWeight: 500 }}>{pkg.name}</span>
                          {pkg.note && (
                            <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 shrink-0"
                              style={{ background: `rgba(196,168,130,0.18)`, color: G, fontFamily: 'var(--font-sans)' }}>
                              {pkg.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{pkg.includes}</td>
                      <td className="px-6 py-5">
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

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-6 p-5 flex items-start gap-3"
              style={{ background: 'rgba(214,162,61,0.08)', border: `1px solid rgba(214,162,61,0.20)` }}>
              <span className="text-base mt-0.5" aria-hidden>💬</span>
              <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Ask about our <strong style={{ color: FG }}>3-month Bridal Body Prep Package</strong> — the complete pre-wedding transformation combining slimming, skin tightening, and nutrition guidance.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-10">
              <Link to="/booking"
                className="inline-flex items-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Free Consultation <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ PREP & AFTERCARE ═════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>Maximize Your Results</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Before & After<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Your Session</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-8" style={{ background: BLACK, border: `1px solid rgba(196,168,130,0.18)` }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-medium" style={{ fontFamily: 'var(--font-heading)', color: G }}>Before</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right,${G}55,transparent)` }} />
                </div>
                <ul className="space-y-4">
                  {BEFORE.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: G }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="p-8" style={{ background: BLACK, border: `1px solid rgba(196,168,130,0.18)` }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-medium" style={{ fontFamily: 'var(--font-heading)', color: TERRACOTTA }}>After</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right,${TERRACOTTA}55,transparent)` }} />
                </div>
                <ul className="space-y-4">
                  {AFTER.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: TERRACOTTA }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ RESULTS TIMELINE ═════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>What to Expect</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Your Results<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Timeline</em>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.week} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex gap-6 items-start mb-0">
                  {/* Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ background: `rgba(196,168,130,0.15)`, border: `1px solid ${G}`, color: G, fontFamily: 'var(--font-sans)' }}>
                      {i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 mt-2 mb-2" style={{ background: 'rgba(196,168,130,0.20)', minHeight: 32 }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.20em] mb-1" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{item.week}</p>
                    <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{item.result}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-10 max-w-3xl mx-auto p-5 flex items-start gap-3"
              style={{ background: 'rgba(200,110,70,0.08)', border: `1px solid rgba(200,110,70,0.22)` }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: TERRACOTTA }} />
              <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                <strong style={{ color: FG }}>Important: </strong>
                Body slimming is <em>not</em> a weight-loss solution. It is a contouring treatment for stubborn areas resistant to diet and exercise. Best results are achieved when combined with a healthy lifestyle.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══ REVIEWS ══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <SectionLabel>Client Results</SectionLabel>
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
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{r.name}</span>
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
                Body Slimming FAQ
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
              <SectionLabel>Start Your Body Transformation</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Free Consultation<br />
                <em style={{ color: G, fontStyle: 'italic' }}>at ArtiZone Amman</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Our body specialists will assess your goals, analyze your target areas, and recommend the most effective treatment plan — at no charge.
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
        <LandingBlogLinks service="slimming" />

        {/* ══ INTERNAL LINKS ═══════════════════════════════════════════════ */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5"
              style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Skin Tightening',    href: '/skin-tightening-amman'    },
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Facials & Skin Care', href: '/best-facial-amman'       },
                { label: "Men's Grooming",      href: '/mens-grooming-amman'     },
                { label: 'Nail Salon',          href: '/nail-salon-amman'        },
                { label: 'All Services',        href: '/services'                },
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
