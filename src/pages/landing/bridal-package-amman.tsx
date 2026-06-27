import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown, Heart, Sparkles, Calendar, Crown } from 'lucide-react';
import { useState } from 'react';
import LandingBlogLinks from '@/components/landing/LandingBlogLinks';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const NAVY   = '#0E2A3A';
const GOLD   = '#C4A882';
const SAGE   = '#6B7260';
const CREAM  = '#F7F3EE';
const IVORY  = '#FDFAF6';
const FG     = 'rgba(253,250,246,0.92)';
const FGDIM  = 'rgba(253,250,246,0.58)';
const GDIM   = 'rgba(196,168,130,0.50)';

/* ── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

/* ── SEO ─────────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/bridal-package-amman';
const TITLE    = 'Bridal Beauty Package Amman | Bridal Facial & Skin Prep | ArtiZone';
const DESC     = 'Bridal beauty packages in Amman — complete skin prep, HydraFacial, laser hair removal, nails & glow treatments for your wedding day. Book your bridal consultation at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bridal Beauty Package Amman',
  description: DESC,
  provider: {
    '@type': 'BeautySalon',
    name: 'ArtiZone Beauty & Aesthetic Clinic',
    address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' },
    telephone: '+962790412758',
    url: SITE_URL,
  },
  areaServed: { '@type': 'City', name: 'Amman' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'When should I start my bridal beauty treatments?', acceptedAnswer: { '@type': 'Answer', text: 'We recommend starting your bridal skin plan 3–6 months before your wedding. This allows time for laser hair removal sessions, skin treatments, and any adjustments. For a basic glow package, 4–6 weeks is sufficient.' } },
    { '@type': 'Question', name: 'What is included in the bridal package at ArtiZone?', acceptedAnswer: { '@type': 'Answer', text: 'Our bridal packages include a combination of HydraFacial, chemical peels, laser hair removal, body treatments, nail care, and a bridal glow facial on the day before your wedding. Packages are fully customisable.' } },
    { '@type': 'Question', name: 'Can I get laser hair removal before my wedding?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — laser hair removal is one of the most popular bridal treatments. You need 6–8 sessions spaced 4–6 weeks apart for best results, so start at least 6 months before your wedding date.' } },
    { '@type': 'Question', name: 'Do you offer a bridal trial session?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We offer a free bridal consultation where we assess your skin, discuss your goals, and create a personalised treatment plan. We also offer trial sessions for any treatment before committing to a full package.' } },
    { '@type': 'Question', name: 'How much does a bridal package cost in Amman?', acceptedAnswer: { '@type': 'Answer', text: 'Bridal packages at ArtiZone start from 150 JOD for a basic glow package. Full 3-month bridal programs are also available. Contact us for a personalised quote based on your needs and timeline.' } },
  ],
};

/* ── Data ────────────────────────────────────────────────────────────────── */
const TIMELINE = [
  {
    months: '6 Months Before',
    icon: Calendar,
    treatments: ['Laser hair removal (session 1 of 6)', 'Skin assessment & personalised plan', 'Start acne or pigmentation treatment if needed'],
    note: 'Foundation phase — address long-term concerns',
  },
  {
    months: '3 Months Before',
    icon: Sparkles,
    treatments: ['Laser hair removal (sessions 3–4)', 'HydraFacial or chemical peel series', 'Body slimming or contouring (if desired)', 'Eyebrow shaping & tinting'],
    note: 'Transformation phase — visible skin improvement',
  },
  {
    months: '1 Month Before',
    icon: Heart,
    treatments: ['Final laser hair removal session', 'Brightening facial or peel', 'Nail care & gel manicure/pedicure', 'Waxing or threading'],
    note: 'Refinement phase — polish and perfect',
  },
  {
    months: 'Day Before Wedding',
    icon: Crown,
    treatments: ['Bridal Glow HydraFacial', 'Relaxing body treatment', 'Final nail touch-up', 'Eyebrow & lash tint'],
    note: 'Glow day — arrive radiant and confident',
  },
];

const PACKAGES = [
  {
    name: 'Bridal Glow',
    subtitle: '4–6 weeks before wedding',
    tag: 'Quick Start',
    includes: [
      '2× HydraFacial sessions',
      '1× Chemical peel (brightening)',
      'Eyebrow shaping & tinting',
      'Gel manicure & pedicure',
      'Bridal glow facial (day before)',
    ],
  },
  {
    name: 'Bridal Radiance',
    subtitle: '3 months before wedding',
    tag: 'Most Popular',
    includes: [
      '4× HydraFacial sessions',
      '2× Chemical peels',
      '3× Laser hair removal sessions',
      'Body scrub & wrap treatment',
      'Eyebrow & lash tint',
      'Gel manicure & pedicure',
      'Bridal glow facial (day before)',
    ],
  },
  {
    name: 'Bridal Luxury',
    subtitle: '6 months before wedding',
    tag: 'Complete Package',
    includes: [
      '6× HydraFacial sessions',
      '4× Chemical peels or microneedling',
      '6× Laser hair removal sessions (full body)',
      'Body slimming treatment (4 sessions)',
      'PRP skin rejuvenation',
      'Eyebrow & lash tint (monthly)',
      'Monthly gel manicure & pedicure',
      'Bridal glow facial + massage (day before)',
      'Dedicated bridal coordinator',
    ],
  },
];

const TREATMENTS = [
  { name: 'HydraFacial',          desc: 'Instant glow, deep hydration, zero downtime. Perfect for pre-wedding skin prep.' },
  { name: 'Chemical Peels',       desc: 'Brighten skin tone, fade pigmentation, and smooth texture for a flawless base.' },
  { name: 'Laser Hair Removal',   desc: 'Permanent hair reduction for silky smooth skin on your wedding day and beyond.' },
  { name: 'Microneedling + PRP',  desc: 'Stimulate collagen for firmer, younger-looking skin. Ideal for acne scars.' },
  { name: 'Body Slimming',        desc: 'Non-invasive contouring to help you look and feel your best in your dress.' },
  { name: 'Nail Care',            desc: 'Gel manicure, pedicure, and nail art for picture-perfect hands and feet.' },
];

const REVIEWS = [
  { name: 'Sara A.', stars: 5, text: 'I started my bridal package at ArtiZone 4 months before my wedding and the results were incredible. My skin was glowing on the day and I received so many compliments. Highly recommend!' },
  { name: 'Dina H.', stars: 5, text: 'The team at ArtiZone created a personalised plan for me and guided me through every step. The laser hair removal was so smooth and the HydraFacial before my wedding was perfect.' },
  { name: 'Maya R.', stars: 5, text: 'Best decision I made for my wedding prep. The bridal glow facial the day before was amazing — my makeup artist said my skin was the best she\'d ever worked on!' },
];

const FAQS = [
  { q: 'When should I start my bridal beauty treatments?', a: 'We recommend starting your bridal skin plan 3–6 months before your wedding. This allows time for laser hair removal sessions, skin treatments, and any adjustments. For a basic glow package, 4–6 weeks is sufficient.' },
  { q: 'What is included in the bridal package?', a: 'Our bridal packages include a combination of HydraFacial, chemical peels, laser hair removal, body treatments, nail care, and a bridal glow facial on the day before your wedding. Packages are fully customisable.' },
  { q: 'Can I get laser hair removal before my wedding?', a: 'Yes — laser hair removal is one of the most popular bridal treatments. You need 6–8 sessions spaced 4–6 weeks apart for best results, so start at least 6 months before your wedding date.' },
  { q: 'Do you offer a bridal trial session?', a: 'Yes. We offer a free bridal consultation where we assess your skin, discuss your goals, and create a personalised treatment plan. We also offer trial sessions for any treatment before committing to a full package.' },
  { q: 'How much does a bridal package cost in Amman?', a: 'Bridal packages at ArtiZone start from 150 JOD for a basic glow package. Full 3-month bridal programs are also available. Contact us for a personalised quote based on your needs and timeline.' },
  { q: 'Can my bridesmaids also get treatments?', a: 'Absolutely! We offer group bookings for bridesmaids and family members. Contact us to arrange a group session and ask about our group discount.' },
];

/* ── Component ───────────────────────────────────────────────────────────── */
export default function BridalPackageAmmanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
              <meta property="og:locale" content="en_US" />
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/bridal-package-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/bridal-package-amman`} />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a4a 55%, #0a1e2a 100%)` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: GOLD, filter: 'blur(90px)' }} />
          <div className="absolute bottom-1/4 -left-24 w-80 h-80 rounded-full opacity-8"
            style={{ background: SAGE, filter: 'blur(80px)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 py-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: '1px solid rgba(196,168,130,0.3)' }}>
              <Crown size={13} /> Bridal Beauty Amman
            </span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: FG }}>
            Bridal Beauty Package<br />
            <span style={{ color: GOLD }}>Look Radiant on Your Wedding Day</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-4"
            style={{ color: FGDIM }}>
            Complete bridal skin prep in Amman — HydraFacial, laser hair removal, peels, nails, and a personalised glow plan from 3 months to the day before your wedding.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex items-center justify-center gap-2 mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={GOLD} style={{ color: GOLD }} />)}
            <span className="text-sm font-semibold ml-1" style={{ color: GOLD }}>4.9</span>
            <span className="text-sm" style={{ color: FGDIM }}>· 200+ Google Reviews · Beauty Clinic in Amman</span>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20bridal%20beauty%20consultation%20in%20Amman"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: GOLD, color: NAVY }}>
              Book Bridal Consultation <ArrowRight size={16} />
            </a>
            <Link to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold border transition-all hover:opacity-80"
              style={{ borderColor: GDIM, color: FG }}>
              Book Online
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
            className="flex flex-wrap justify-center gap-6 mt-12 text-xs"
            style={{ color: FGDIM }}>
            <span className="flex items-center gap-1.5"><Heart size={13} style={{ color: GOLD }} /> Free bridal consultation</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} style={{ color: GOLD }} /> 3–6 month plans available</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} style={{ color: GOLD }} /> Amman, Jordan</span>
            <span className="flex items-center gap-1.5"><Phone size={13} style={{ color: GOLD }} /> +962 79 041 2758</span>
          </motion.div>
        </div>
      </section>

      {/* ── Bridal Timeline ───────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: IVORY }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Your Bridal Beauty Timeline
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: SAGE }}>
              A step-by-step plan to ensure you look and feel your absolute best on your wedding day.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE.map(({ months, icon: Icon, treatments, note }, i) => (
              <motion.div key={months} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl p-7 shadow-sm relative"
                style={{ background: '#fff', border: '1px solid rgba(196,168,130,0.2)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(196,168,130,0.12)' }}>
                  <Icon size={22} style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>{months}</h3>
                <ul className="space-y-2 mb-4">
                  {treatments.map(t => (
                    <li key={t} className="flex items-start gap-2 text-xs" style={{ color: SAGE }}>
                      <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] italic" style={{ color: GOLD }}>{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Bridal Packages
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: SAGE }}>
              Choose the package that fits your timeline and goals — or let us build a fully custom plan just for you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {PACKAGES.map(({ name, subtitle, tag, includes }, i) => (
              <motion.div key={name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl p-7 shadow-sm relative overflow-hidden flex flex-col"
                style={{ background: i === 1 ? NAVY : '#fff', border: i === 1 ? 'none' : '1px solid rgba(196,168,130,0.2)' }}>
                <span className="absolute top-5 right-5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(196,168,130,0.2)', color: GOLD }}>
                  {tag}
                </span>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: i === 1 ? FG : NAVY }}>{name}</h3>
                <p className="text-xs mb-5 flex items-center gap-1" style={{ color: GOLD }}>
                  <Calendar size={11} /> {subtitle}
                </p>
                <ul className="space-y-2.5 flex-1">
                  {includes.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: i === 1 ? FGDIM : SAGE }}>
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="https://wa.me/962790412758?text=Hi%2C%20I%27m%20interested%20in%20the%20bridal%20package"
                  target="_blank" rel="noopener noreferrer"
                  className="mt-7 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: i === 1 ? GOLD : NAVY, color: i === 1 ? NAVY : '#fff' }}>
                  Ask for Price <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>

          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="text-center text-sm mt-8" style={{ color: SAGE }}>
            All packages are fully customisable. Contact us to build your perfect bridal plan.
          </motion.p>
        </div>
      </section>

      {/* ── Treatments ───────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: NAVY }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: FG }}>
              Bridal Treatments at ArtiZone
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TREATMENTS.map(({ name, desc }, i) => (
              <motion.div key={name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,168,130,0.15)' }}>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>{name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: FGDIM }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: IVORY }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Happy Brides at ArtiZone
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={GOLD} style={{ color: GOLD }} />)}
              <span className="text-sm font-bold ml-2" style={{ color: NAVY }}>4.9 / 5</span>
            </div>
            <p className="text-sm" style={{ color: SAGE }}>200+ verified Google reviews · Beauty clinic in Amman</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {REVIEWS.map(({ name, stars, text }, i) => (
              <motion.div key={name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl p-7 shadow-sm"
                style={{ background: '#fff', border: '1px solid rgba(196,168,130,0.15)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(stars)].map((_, j) => <Star key={j} size={14} fill={GOLD} style={{ color: GOLD }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: SAGE }}>"{text}"</p>
                <p className="text-xs font-bold" style={{ color: NAVY }}>— {name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: CREAM }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Bridal Beauty FAQs
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-xl overflow-hidden shadow-sm"
                style={{ border: '1px solid rgba(196,168,130,0.2)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  style={{ background: openFaq === i ? NAVY : '#fff' }}>
                  <span className="text-sm font-semibold" style={{ color: openFaq === i ? FG : NAVY }}>{q}</span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    style={{ color: GOLD }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 py-5" style={{ background: '#fff' }}>
                    <p className="text-sm leading-relaxed" style={{ color: SAGE }}>{a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Crown size={36} className="mx-auto mb-5" style={{ color: GOLD }} />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: FG }}>
              Start Your Bridal Journey Today
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: FGDIM }}>
              Book your free bridal consultation at ArtiZone Amman. We'll create a personalised plan to make you look and feel absolutely radiant on your wedding day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20bridal%20consultation%20at%20ArtiZone%20Amman"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
                style={{ background: GOLD, color: NAVY }}>
                Book Free Bridal Consultation <ArrowRight size={16} />
              </a>
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold border transition-all hover:opacity-80"
                style={{ borderColor: GDIM, color: FG }}>
                Book Online
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: FGDIM }}>
              <span className="flex items-center gap-2"><MapPin size={15} style={{ color: GOLD }} /> Arjan Street, Amman, Jordan</span>
              <span className="flex items-center gap-2"><Phone size={15} style={{ color: GOLD }} /> +962 79 041 2758</span>
              <span className="flex items-center gap-2"><Clock size={15} style={{ color: GOLD }} /> Sat–Thu: 10am–9pm</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Internal Links ───────────────────────────────────────────────── */}
      <section className="py-14 px-5" style={{ background: CREAM }}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
            Explore More Treatments at ArtiZone Amman
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: '/hydrafacial-amman',          label: 'HydraFacial Amman' },
              { to: '/laser-hair-removal-amman',   label: 'Laser Hair Removal Amman' },
              { to: '/best-facial-amman',          label: 'Best Facial Amman' },
              { to: '/nail-salon-amman',           label: 'Nail Salon Amman' },
              { to: '/acne-scar-removal-amman',    label: 'Acne Scar Treatment' },
              { to: '/body-slimming-amman',        label: 'Body Slimming Amman' },
              { to: '/packages-amman',             label: 'All Packages' },
              { to: '/booking',                    label: 'Book Appointment' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-sm px-4 py-2 rounded-full border transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY, background: '#fff' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LandingBlogLinks service="facial" />
    </>
  );
}
