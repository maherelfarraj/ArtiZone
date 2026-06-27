import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown, Shield } from 'lucide-react';
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

/* ── SEO ─────────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/acne-scar-removal-amman';
const TITLE    = 'Acne Scar Removal in Amman | Microneedling, Peels & Laser | ArtiZone';
const DESC     = 'Acne scar removal in Amman — RF microneedling, chemical peels & laser for ice pick, boxcar & rolling scars. Safe for all skin tones. Free consultation at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

/* ── Scar types ──────────────────────────────────────────────────────────── */
const SCAR_TYPES = [
  {
    name:    'Ice Pick Scars',
    desc:    'Deep, narrow, pitted scars that extend into the dermis. The most challenging type to treat.',
    best:    'RF Microneedling + TCA Cross technique',
    icon:    '◆',
  },
  {
    name:    'Boxcar Scars',
    desc:    'Broad, box-shaped depressions with sharp, defined edges. Common on cheeks and temples.',
    best:    'Microneedling + Chemical Peel combination',
    icon:    '▪',
  },
  {
    name:    'Rolling Scars',
    desc:    'Shallow, wave-like depressions that give skin an uneven, rolling texture.',
    best:    'RF Microneedling + Subcision',
    icon:    '◉',
  },
  {
    name:    'Post-Inflammatory Hyperpigmentation (PIH)',
    desc:    'Dark marks left after acne heals. Not true scars — but often the most visible concern.',
    best:    'Chemical Peels + Brightening Facials',
    icon:    '●',
  },
];

/* ── Treatments ──────────────────────────────────────────────────────────── */
const TREATMENTS = [
  {
    id:      'rf-micro',
    name:    'RF Microneedling',
    sub:     'Most Effective for Atrophic Scars',
    tag:     'Gold Standard',
    tagColor: TERRACOTTA,
    what:    'The most powerful non-surgical treatment for depressed acne scars. Combines microneedling with radiofrequency energy delivered directly into the dermis for intense collagen remodelling.',
    how:     'Fine needles create micro-channels while simultaneously delivering RF energy at precise depths. This dual action triggers intense collagen synthesis, gradually filling and smoothing depressed scars from within.',
    bestFor: ['Ice pick scars', 'Boxcar scars', 'Rolling scars', 'Enlarged pores', 'Skin texture', 'Stretch marks'],
    specs: [
      { label: 'Treatment time', value: '45–75 min'     },
      { label: 'Sessions needed', value: '3–6 sessions' },
      { label: 'Downtime',        value: '2–4 days'     },
      { label: 'Results visible', value: '6–12 weeks'   },
    ],
  },
  {
    id:      'microneedling',
    name:    'Microneedling (Collagen Induction)',
    sub:     'Progressive Scar Remodelling',
    tag:     'No Downtime Option',
    tagColor: G,
    what:    'Creates controlled micro-injuries that trigger the body\'s natural wound-healing response, stimulating collagen and elastin to fill and smooth depressed scars.',
    how:     'A device with fine needles creates thousands of micro-channels in the skin. The healing response floods the area with collagen and elastin, gradually remodelling scar tissue over multiple sessions.',
    bestFor: ['Shallow boxcar scars', 'Rolling scars', 'Skin texture', 'PIH', 'Fine lines', 'General skin quality'],
    specs: [
      { label: 'Treatment time', value: '45–60 min'     },
      { label: 'Sessions needed', value: '4–6 sessions' },
      { label: 'Downtime',        value: '2–3 days'     },
      { label: 'Results visible', value: '4–8 weeks'    },
    ],
  },
  {
    id:      'peel',
    name:    'Chemical Peels (TCA / Glycolic)',
    sub:     'Resurfacing & Pigmentation',
    tag:     'Pigmentation Specialist',
    tagColor: MUSTARD,
    what:    'Acid solutions dissolve the outer layers of damaged skin, triggering accelerated renewal and revealing smoother, more even skin beneath.',
    how:     'TCA (trichloroacetic acid) peels penetrate to the mid-dermis, triggering significant resurfacing. Glycolic peels work more superficially, ideal for PIH and mild texture. Both stimulate collagen production.',
    bestFor: ['Post-inflammatory hyperpigmentation', 'Shallow scars', 'Uneven skin tone', 'Skin texture', 'Sun damage', 'Dullness'],
    specs: [
      { label: 'Treatment time', value: '30–45 min'     },
      { label: 'Sessions needed', value: '4–6 sessions' },
      { label: 'Downtime',        value: '3–7 days'     },
      { label: 'Results visible', value: '1–3 weeks'    },
    ],
  },
  {
    id:      'laser',
    name:    'Laser Resurfacing',
    sub:     'Advanced Scar Correction',
    tag:     'Maximum Results',
    tagColor: S2,
    what:    'Laser energy removes damaged skin layers with precision, triggering intensive renewal and collagen remodelling for dramatic scar improvement.',
    how:     'Fractional laser creates thousands of micro-treatment zones in the skin, leaving surrounding tissue intact to accelerate healing. Each zone triggers a collagen response, progressively smoothing scar tissue.',
    bestFor: ['Moderate-to-severe scarring', 'Deep boxcar scars', 'Skin resurfacing', 'Sun damage', 'Wrinkles', 'Uneven texture'],
    specs: [
      { label: 'Treatment time', value: '45–90 min'     },
      { label: 'Sessions needed', value: '2–4 sessions' },
      { label: 'Downtime',        value: '5–10 days'    },
      { label: 'Results visible', value: '4–8 weeks'    },
    ],
  },
];

/* ── Programme phases ────────────────────────────────────────────────────── */
const PHASES = [
  {
    phase:   'Phase 1 — Assessment',
    weeks:   'Week 1',
    steps:   ['Skin assessment and scar mapping', 'Scar type classification', 'Treatment plan design', 'Baseline photos taken'],
  },
  {
    phase:   'Phase 2 — Active Treatment',
    weeks:   'Months 1–3',
    steps:   ['RF microneedling or microneedling sessions (3–4 weeks apart)', 'Chemical peel sessions between needling', 'LED red light therapy for healing', 'Customised home care protocol'],
  },
  {
    phase:   'Phase 3 — Refinement',
    weeks:   'Months 3–5',
    steps:   ['Remaining sessions to target stubborn scars', 'Brightening treatments for PIH', 'Skin texture optimisation', 'Progress photos and comparison'],
  },
  {
    phase:   'Phase 4 — Maintenance',
    weeks:   'Ongoing',
    steps:   ['Monthly brightening facials', 'Quarterly microneedling maintenance', 'Daily SPF 50+ (essential)', 'Annual review session'],
  },
];

/* ── Reviews ─────────────────────────────────────────────────────────────── */
const REVIEWS = [
  { name: 'Sara A.',   rating: 5, text: 'I had acne scars for 8 years and tried everything. After 5 RF microneedling sessions at ArtiZone, my skin looks completely different. I finally feel confident without makeup.' },
  { name: 'Nadia K.',  rating: 5, text: 'The dark marks from my acne cleared up so much faster than I expected. The chemical peel series was exactly what my skin needed. The team really knows what they are doing.' },
  { name: 'Omar T.',   rating: 5, text: 'As a man I was nervous about getting skin treatments but the team made me feel completely comfortable. My acne scars have improved dramatically after 4 sessions.' },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Can acne scars be completely removed?',
    a: 'Complete removal depends on the scar type and depth. Superficial scars and post-inflammatory hyperpigmentation (dark marks) can often be fully resolved. Deeper atrophic scars (ice pick, boxcar, rolling) can be significantly improved — typically 60–80% reduction in visibility — but complete elimination is not always possible. Your specialist will give you an honest assessment at your consultation.',
  },
  {
    q: 'How many sessions do I need?',
    a: 'Most clients need 4–6 sessions for meaningful improvement. Severe scarring may require 6–10 sessions over 4–6 months. Sessions are spaced 3–4 weeks apart to allow full healing between treatments. Your specialist will recommend a realistic plan based on your scar type and severity.',
  },
  {
    q: 'Is acne scar treatment safe for darker skin tones?',
    a: 'Yes — with the right protocols. Darker skin tones (common in Jordan and the Arab world) are more prone to post-inflammatory hyperpigmentation from aggressive treatments. We use protocols specifically designed for darker skin: lower-intensity peels with gradual build-up, RF microneedling (safe for all skin tones), and brightening serums formulated for melanin-rich skin.',
  },
  {
    q: 'Do I need to stop active acne before treating scars?',
    a: 'Ideally yes — treating active acne first prevents new scars from forming while you are treating existing ones. However, many of our treatments (microneedling, chemical peels, LED therapy) address both active acne and scarring simultaneously. Your specialist will assess your current skin condition and recommend the right starting point.',
  },
  {
    q: 'What is the difference between acne scars and dark marks?',
    a: 'Acne scars are structural changes in the skin — depressions (atrophic scars) or raised tissue (hypertrophic scars) caused by damage to the dermis. Dark marks (post-inflammatory hyperpigmentation) are flat discolouration caused by excess melanin production after inflammation — not true scars. Dark marks are generally easier and faster to treat than structural scars.',
  },
];

/* ── Sub-components ──────────────────────────────────────────────────────── */
function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={11} fill={MUSTARD} stroke="none" />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid rgba(196,168,130,0.12)` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>{q}</span>
        <ChevronDown size={16} style={{ color: G, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{a}</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function AcneScarRemovalAmmanPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Acne Scar Removal Amman',
    description: DESC,
    url: `${SITE_URL}${SLUG}`,
    provider: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: SITE_URL,
      telephone: '+962790412758',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.',
        addressLocality: 'Amman',
        addressCountry: 'JO',
      },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2500', bestRating: '5' },
    },
    areaServed: { '@type': 'City', name: 'Amman' },
    serviceType: 'Acne Scar Removal',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content="acne scar removal Amman, acne scar treatment Jordan, microneedling acne scars Amman, chemical peel acne scars, RF microneedling Amman, acne marks treatment Amman" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={OG_IMG} />
        <meta property="og:image:alt" content="Acne scar removal treatment at ArtiZone Amman" />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMG} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
              <meta property="og:locale" content="en_US" />
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/acne-scar-removal-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/acne-scar-removal-amman`} />
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(480px,65svh,720px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/facial-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={720}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.15) 0%,rgba(61,61,63,0.55) 45%,rgba(61,61,63,0.97) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.55) 0%,transparent 60%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(480px,65svh,720px)' }}>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <Link to="/services" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Services</Link>
              <span>/</span>
              <span style={{ color: G }}>Acne Scar Removal</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: G, fontFamily: 'var(--font-sans)' }}>All Scar Types · All Skin Tones · Amman</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(230,215,185,0.95)', fontSize: 'clamp(2rem,5.5vw,5rem)', lineHeight: 1.05, fontWeight: 400, marginBottom: '1rem' }}>
              Acne Scar Removal<br />
              <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Clinically proven treatments for all acne scar types — ice pick, boxcar, rolling scars, and dark marks. RF microneedling, chemical peels, and laser resurfacing at ArtiZone Amman.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.30 }}
              className="flex flex-wrap gap-2 mb-8">
              {['4.9★ Google Rating', '2,500+ Clients', 'All Scar Types', 'All Skin Tones'].map(pill => (
                <span key={pill} className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: 'rgba(196,168,130,0.15)', border: `1px solid rgba(196,168,130,0.30)`, color: G, fontFamily: 'var(--font-sans)' }}>
                  {pill}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Free Consultation <ArrowRight size={12} />
              </Link>
              <a href="tel:+962790412758"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ border: `1px solid rgba(196,168,130,0.40)`, color: G, fontFamily: 'var(--font-sans)' }}>
                <Phone size={12} /> Call Now
              </a>
            </motion.div>
          </div>
        </section>

        {/* ══ SCAR TYPES ════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-16 sm:py-20" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Know Your Scars</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Identifying Your<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Scar Type</em>
              </h2>
              <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Different scar types respond to different treatments. Correct identification is the first step to effective treatment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SCAR_TYPES.map((s, i) => (
                <motion.div key={s.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6" style={{ background: S1, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="text-2xl mb-4" style={{ color: G }}>{s.icon}</div>
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{s.name}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{s.desc}</p>
                  <div className="pt-3" style={{ borderTop: `1px solid rgba(196,168,130,0.15)` }}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Best Treatment</p>
                    <p className="text-xs font-medium" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{s.best}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TREATMENTS ════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Our Treatments</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Clinically Proven<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Scar Treatments</em>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {TREATMENTS.map((t, i) => (
                <motion.div key={t.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 sm:p-9" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.20em] px-2.5 py-1"
                          style={{ background: `${t.tagColor}22`, color: t.tagColor, border: `1px solid ${t.tagColor}44`, fontFamily: 'var(--font-sans)' }}>
                          {t.tag}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 400, marginBottom: '0.25rem' }}>{t.name}</h3>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{t.sub}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>What It Does</p>
                          <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{t.what}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>How It Works</p>
                          <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{t.how}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Best For</p>
                        <div className="flex flex-wrap gap-3">
                          {t.bestFor.map(b => (
                            <span key={b} className="flex items-center gap-1.5 text-xs"
                              style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                              <CheckCircle2 size={11} style={{ color: G, flexShrink: 0 }} /> {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sm:w-52 shrink-0 grid grid-cols-2 sm:grid-cols-1 gap-3">
                      {t.specs.map(s => (
                        <div key={s.label} className="p-3" style={{ background: 'rgba(196,168,130,0.07)', border: `1px solid rgba(196,168,130,0.14)` }}>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>{s.label}</p>
                          <p className="text-sm font-medium" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TREATMENT PROGRAMME ═══════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>The ArtiZone Approach</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Your 4-Phase<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Scar Treatment Programme</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PHASES.map((p, i) => (
                <motion.div key={p.phase} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7" style={{ background: S1, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="w-9 h-9 flex items-center justify-center mb-5"
                    style={{ background: 'rgba(196,168,130,0.12)', border: `1px solid rgba(196,168,130,0.25)` }}>
                    <span className="text-sm font-bold" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{p.phase}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{p.weeks}</p>
                  <ul className="space-y-2">
                    {p.steps.map(s => (
                      <li key={s} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                        <Shield size={10} style={{ color: G, flexShrink: 0, marginTop: 2 }} /> {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ═══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Client Stories</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Real Results,<br /><em style={{ color: G, fontStyle: 'italic' }}>Real Confidence</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.10)' }}>
                  <StarRow n={r.rating} />
                  <p className="text-sm leading-relaxed my-4" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{r.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24" style={{ background: BLACK }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>FAQ</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Common Questions
              </h2>
            </motion.div>
            <div style={{ borderTop: `1px solid rgba(196,168,130,0.12)` }}>
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: S1 }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, rgba(196,168,130,0.07) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Take the First Step</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Clear Skin Is<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Within Reach</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Book a free skin assessment. Our specialists will identify your scar types, explain which treatments will work best for your skin, and give you a realistic, honest treatment plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                  Book Free Consultation <ArrowRight size={12} />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                  style={{ border: `1px solid rgba(196,168,130,0.35)`, color: G, fontFamily: 'var(--font-sans)' }}>
                  Contact Us
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: 'rgba(14,42,58,0.50)', fontFamily: 'var(--font-sans)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: GDIM }} /> Arjan St., 2nd Floor, Amman</span>
                <span className="flex items-center gap-1.5"><Phone size={11} style={{ color: GDIM }} /> +962 79 041 2758</span>
                <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: GDIM }} /> Sat–Thu 10AM–9PM · Fri 2PM–9PM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ BLOG LINKS ════════════════════════════════════════════════════ */}
        <LandingBlogLinks service="acne" background={BLACK} />

        {/* ══ INTERNAL LINKS ════════════════════════════════════════════════ */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Related Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Skin Tightening',    href: '/skin-tightening-amman'   },
                { label: 'Facials & Skin Care', href: '/best-facial-amman'       },
                { label: 'Laser Hair Removal',  href: '/laser-hair-removal-amman'},
                { label: 'Body Slimming',       href: '/body-slimming-amman'     },
                { label: "Men's Grooming",      href: '/mens-grooming-amman'     },
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
