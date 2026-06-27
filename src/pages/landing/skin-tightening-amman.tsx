import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown, Zap } from 'lucide-react';
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
const SLUG     = '/skin-tightening-amman';
const TITLE    = 'Skin Tightening in Amman | RF & Non-Invasive Lifting | ArtiZone';
const DESC     = 'Skin tightening in Amman without surgery — RF, HIFU & RF microneedling for face, neck & body. Visible lifting from session 4. Free skin assessment at ArtiZone. Book now.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

/* ── Treatments ──────────────────────────────────────────────────────────── */
const TREATMENTS = [
  {
    id:      'rf',
    name:    'Radiofrequency (RF) Tightening',
    sub:     'Face, Neck & Body',
    tag:     'Most Popular',
    tagColor: TERRACOTTA,
    what:    'RF energy heats the deep dermis to contract existing collagen and stimulate new collagen production — lifting and firming skin without any incisions.',
    how:     'A handheld device delivers controlled RF waves to the target area. The heat triggers an immediate tightening response and a longer-term collagen remodelling process that continues for months.',
    bestFor: ['Jawline & jowls', 'Neck laxity', 'Nasolabial folds', 'Under-eye area', 'Abdomen', 'Arms & thighs'],
    specs: [
      { label: 'Treatment time', value: '30–60 min'       },
      { label: 'Sessions needed', value: '4–6 sessions'   },
      { label: 'Downtime',        value: 'None'           },
      { label: 'Results visible', value: '4–8 weeks'      },
    ],
    comfort: 'A warm, deeply relaxing sensation throughout. Most clients find it enjoyable.',
  },
  {
    id:      'rf-micro',
    name:    'RF Microneedling',
    sub:     'Collagen Induction + Tightening',
    tag:     'Advanced',
    tagColor: MUSTARD,
    what:    'Combines microneedling with radiofrequency energy delivered directly into the dermis — the most powerful non-surgical skin tightening available.',
    how:     'Fine needles create micro-channels while simultaneously delivering RF energy at precise depths. This dual action triggers intense collagen and elastin remodelling, producing dramatic tightening and texture improvement.',
    bestFor: ['Significant laxity', 'Deep wrinkles', 'Acne scars', 'Enlarged pores', 'Stretch marks', 'Crepey skin'],
    specs: [
      { label: 'Treatment time', value: '45–75 min'       },
      { label: 'Sessions needed', value: '3–4 sessions'   },
      { label: 'Downtime',        value: '2–3 days'       },
      { label: 'Results visible', value: '6–12 weeks'     },
    ],
    comfort: 'Topical numbing cream applied 30 minutes before. Mild warmth and pressure during treatment.',
  },
  {
    id:      'hifu',
    name:    'HIFU (Ultrasound Lifting)',
    sub:     'Deep Tissue Lifting',
    tag:     'Non-Surgical Facelift',
    tagColor: G,
    what:    'High-Intensity Focused Ultrasound targets the SMAS layer — the same layer surgeons address in a facelift — for genuine structural lifting without surgery.',
    how:     'Focused ultrasound energy bypasses the skin surface and deposits heat precisely at 1.5mm, 3mm, and 4.5mm depths, triggering collagen contraction and new collagen synthesis at each layer.',
    bestFor: ['Brow lifting', 'Cheek lifting', 'Jawline definition', 'Neck tightening', 'Décolletage', 'Mild-to-moderate laxity'],
    specs: [
      { label: 'Treatment time', value: '60–90 min'       },
      { label: 'Sessions needed', value: '1–2 per year'   },
      { label: 'Downtime',        value: 'None'           },
      { label: 'Results visible', value: '8–12 weeks'     },
    ],
    comfort: 'Mild tingling and warmth. Topical numbing available for sensitive clients.',
  },
  {
    id:      'collagen',
    name:    'Collagen Induction Facial',
    sub:     'Preventive & Maintenance',
    tag:     'Zero Downtime',
    tagColor: S2,
    what:    'A targeted facial combining microneedling, peptide serums, and LED red light therapy to stimulate collagen and maintain skin firmness over time.',
    how:     'Micro-channels created by fine needles allow deep penetration of collagen-boosting peptides and growth factors. Red LED light accelerates cellular repair and collagen synthesis.',
    bestFor: ['Early signs of ageing', 'Preventive care (20s–30s)', 'Maintenance between RF sessions', 'Dull or thinning skin', 'Fine lines'],
    specs: [
      { label: 'Treatment time', value: '45–60 min'       },
      { label: 'Sessions needed', value: 'Monthly'        },
      { label: 'Downtime',        value: 'None–1 day'     },
      { label: 'Results visible', value: '2–4 weeks'      },
    ],
    comfort: 'Gentle and relaxing. Mild redness for a few hours post-treatment.',
  },
];

/* ── Packages ────────────────────────────────────────────────────────────── */
const PACKAGES = [
  {
    name:     'Starter Lift',
    sessions: '3 RF sessions',
    areas:    '1 area (face or neck)',
    includes: ['Full skin assessment', 'RF tightening x3', 'Post-treatment serum', 'Home care guidance'],
    badge:    null,
  },
  {
    name:     'Full Face & Neck',
    sessions: '6 RF sessions',
    areas:    'Face + neck',
    includes: ['Full skin assessment', 'RF tightening x6', 'LED red light add-on', 'Post-treatment serum', 'Home care kit'],
    badge:    'Most Popular',
  },
  {
    name:     'Advanced Remodel',
    sessions: '4 RF Microneedling sessions',
    areas:    'Face + neck + décolletage',
    includes: ['Full skin assessment', 'RF microneedling x4', 'LED therapy each session', 'Peptide infusion', 'Home care kit', 'Progress review'],
    badge:    'Best Results',
  },
  {
    name:     'Bridal Glow',
    sessions: '6-week pre-event programme',
    areas:    'Face + neck',
    includes: ['Skin assessment & plan', 'RF tightening x3', 'HydraFacial x2', 'LED therapy x4', 'Brightening serum', 'Event-day facial'],
    badge:    'Bridal',
  },
];

/* ── Results timeline ────────────────────────────────────────────────────── */
const TIMELINE = [
  { phase: 'Session 1–2',    result: 'Immediate warmth and mild tightening. Skin feels firmer within 24–48 hours.' },
  { phase: 'Weeks 2–4',      result: 'Visible improvement in skin texture and tone. Early collagen response begins.' },
  { phase: 'Weeks 6–8',      result: 'Noticeable lifting and firming. Jawline more defined. Fine lines visibly softened.' },
  { phase: 'Months 3–6',     result: 'Full collagen remodelling complete. Maximum tightening and lifting results visible.' },
];

/* ── Reviews ─────────────────────────────────────────────────────────────── */
const REVIEWS = [
  { name: 'Dina H.',   rating: 5, text: 'After 4 RF sessions my jawline looks completely different. I was sceptical but the results are genuinely impressive — and no surgery, no downtime.' },
  { name: 'Rania M.',  rating: 5, text: 'I started RF tightening at 38 and I wish I had started sooner. My neck and lower face look years younger. The team at ArtiZone are so professional.' },
  { name: 'Lara K.',   rating: 5, text: 'The RF microneedling was life-changing for my skin texture. My pores are smaller, my skin is firmer, and the acne scars I had for years are almost gone.' },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Is skin tightening safe for all skin tones?',
    a: 'Yes. RF and HIFU treatments work on all skin tones, including the olive and darker skin tones common in Jordan and the Arab world. Unlike some laser treatments, RF and HIFU carry no risk of pigmentation changes on darker skin.',
  },
  {
    q: 'How long do skin tightening results last?',
    a: 'RF tightening results typically last 12–18 months. HIFU results last 12–24 months. Results are prolonged by maintenance sessions (1–2 per year) and consistent daily SPF use. Natural ageing continues, but treated skin ages more slowly.',
  },
  {
    q: 'At what age should I start skin tightening treatments?',
    a: 'Prevention is always easier than correction. Many clients start in their late 20s or 30s with collagen induction facials and light RF to maintain firmness. More intensive RF and HIFU treatments are typically recommended from the mid-30s onwards when laxity becomes visible.',
  },
  {
    q: 'Can skin tightening replace a surgical facelift?',
    a: 'For mild-to-moderate laxity, non-invasive treatments like HIFU and RF can deliver results comparable to a surgical facelift — without the risks, recovery, or cost. For significant sagging, surgery may still be the most effective option. Our specialists will give you an honest assessment at your consultation.',
  },
  {
    q: 'Can I combine skin tightening with other treatments?',
    a: 'Yes — combination protocols often deliver the best results. RF tightening pairs well with HydraFacial, chemical peels, and LED therapy. RF microneedling can be combined with PRP (platelet-rich plasma) for enhanced collagen stimulation. Your specialist will design a safe, effective combination plan.',
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
export default function SkinTighteningAmmanPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Skin Tightening Amman',
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
    serviceType: 'Skin Tightening',
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
        <meta name="keywords" content="skin tightening Amman, RF tightening Amman, non-invasive facelift Jordan, HIFU Amman, radiofrequency skin tightening, collagen treatment Amman, face lifting Amman" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={OG_IMG} />
        <meta property="og:image:alt" content="Skin tightening treatment at ArtiZone Amman" />
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/skin-tightening-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/skin-tightening-amman`} />
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(480px,65svh,720px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/slimming-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={720}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.15) 0%,rgba(61,61,63,0.55) 45%,rgba(61,61,63,0.97) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.55) 0%,transparent 60%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(480px,65svh,720px)' }}>

            {/* Breadcrumb */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <Link to="/services" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Services</Link>
              <span>/</span>
              <span style={{ color: G }}>Skin Tightening</span>
            </motion.div>

            {/* Label */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: G, fontFamily: 'var(--font-sans)' }}>Non-Invasive · No Surgery · No Downtime</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(230,215,185,0.95)', fontSize: 'clamp(2rem,5.5vw,5rem)', lineHeight: 1.05, fontWeight: 400, marginBottom: '1rem' }}>
              Skin Tightening<br />
              <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Lift, firm, and tighten skin on your face, neck, and body — without surgery, injections, or downtime. RF, HIFU, and collagen induction at ArtiZone Amman.
            </motion.p>

            {/* Stats pills */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.30 }}
              className="flex flex-wrap gap-2 mb-8">
              {['4.9★ Google Rating', '2,500+ Clients', 'No Surgery', 'All Skin Tones'].map(pill => (
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

        {/* ══ INTRO ═════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-16 sm:py-20" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Why Skin Tightening?</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1.25rem' }}>
                  Firmer Skin Without Surgery —<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>It Is Possible</em>
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  As we age, collagen and elastin production slows — leading to skin laxity, sagging, and the loss of the firm, lifted appearance we associate with youth. In Amman's climate, sun exposure accelerates this process significantly.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  Modern non-invasive skin tightening treatments — Radiofrequency, HIFU, and RF Microneedling — work by stimulating your body's own collagen production. The result is genuine, progressive tightening that looks natural because it <em style={{ color: G }}>is</em> natural — your own collagen, rebuilt.
                </p>
              </motion.div>
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
                4 Ways We Tighten<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Your Skin</em>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {TREATMENTS.map((t, i) => (
                <motion.div key={t.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 sm:p-9" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                    {/* Left */}
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

                      <div className="mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>Best For</p>
                        <div className="flex flex-wrap gap-2">
                          {t.bestFor.map(b => (
                            <span key={b} className="flex items-center gap-1.5 text-xs"
                              style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                              <CheckCircle2 size={11} style={{ color: G, flexShrink: 0 }} /> {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs italic" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
                        <Zap size={10} style={{ display: 'inline', marginRight: 4, color: MUSTARD }} />
                        {t.comfort}
                      </p>
                    </div>

                    {/* Right — specs */}
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

        {/* ══ RESULTS TIMELINE ══════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>What to Expect</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Your Results<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Timeline</em>
              </h2>
            </motion.div>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom,transparent,${G}55,transparent)` }} />
              <div className="space-y-8">
                {TIMELINE.map((t, i) => (
                  <motion.div key={t.phase} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex gap-6 pl-14 relative">
                    <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(196,168,130,0.12)', border: `1px solid rgba(196,168,130,0.30)` }}>
                      <span className="text-[11px] font-bold" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{t.phase}</p>
                      <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{t.result}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center text-xs mt-12 max-w-lg mx-auto" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              Results vary by individual, treatment type, and skin condition. Your specialist will provide a realistic timeline at your consultation.
            </motion.p>
          </div>
        </section>

        {/* ══ PACKAGES ══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Treatment Packages</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Choose Your<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Programme</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PACKAGES.map((pkg, i) => (
                <motion.div key={pkg.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="relative p-7 flex flex-col"
                  style={{ background: BLACK, border: pkg.badge === 'Most Popular' ? `1px solid ${G}` : '1px solid rgba(196,168,130,0.15)' }}>
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em]"
                      style={{ background: pkg.badge === 'Bridal' ? TERRACOTTA : G, color: CREAM, fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                      {pkg.badge}
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: '1.15rem', fontWeight: 400, marginBottom: '0.25rem' }}>{pkg.name}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{pkg.sessions}</p>
                  <p className="text-xs mb-5" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{pkg.areas}</p>
                  <ul className="space-y-2 mb-7 flex-1">
                    {pkg.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                        <CheckCircle2 size={11} style={{ color: G, flexShrink: 0, marginTop: 2 }} /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-80"
                    style={{ border: `1px solid rgba(196,168,130,0.35)`, color: G, fontFamily: 'var(--font-sans)' }}>
                    Get Quote <ArrowRight size={10} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center text-xs mt-8" style={{ color: 'rgba(14,42,58,0.50)', fontFamily: 'var(--font-sans)' }}>
              All packages include a free skin assessment. Pricing provided at consultation. No hidden fees.
            </motion.p>
          </div>
        </section>

        {/* ══ REVIEWS ═══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Client Results</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Real People,<br /><em style={{ color: G, fontStyle: 'italic' }}>Real Results</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7" style={{ background: S1, border: '1px solid rgba(196,168,130,0.10)' }}>
                  <StarRow n={r.rating} />
                  <p className="text-sm leading-relaxed my-4" style={{ color: 'rgba(14,42,58,0.75)', fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{r.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-24" style={{ background: S1 }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>FAQ</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.1 }}>
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
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: BLACK }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 70% 50%, rgba(196,168,130,0.07) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Start Your Journey</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Firmer Skin Starts<br />
                <em style={{ color: G, fontStyle: 'italic' }}>With One Consultation</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Book a free skin assessment. Our specialists will evaluate your skin, explain which treatment is right for you, and give you a realistic results timeline — with no pressure.
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
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={11} /> Arjan St., 2nd Floor, Amman</span>
                <span className="flex items-center gap-1.5"><Phone size={11} /> +962 79 041 2758</span>
                <span className="flex items-center gap-1.5"><Clock size={11} /> Sat–Thu 10AM–9PM · Fri 2PM–9PM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ INTERNAL LINKS ════════════════════════════════════════════════ */}
        <LandingBlogLinks service="tightening" background={S1} />

        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Related Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Body Slimming',       href: '/body-slimming-amman'     },
                { label: 'Facials & Skin Care',  href: '/best-facial-amman'       },
                { label: 'Laser Hair Removal',   href: '/laser-hair-removal-amman'},
                { label: 'Acne Scar Removal',    href: '/acne-scar-removal-amman' },
                { label: "Men's Grooming",       href: '/mens-grooming-amman'     },
                { label: 'All Services',         href: '/services'                },
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
