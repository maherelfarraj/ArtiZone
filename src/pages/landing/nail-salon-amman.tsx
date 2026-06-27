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
const SLUG     = '/nail-salon-amman';
const TITLE    = 'Premium Nail Salon Amman | Gel Manicure, Pedicure & Nail Art | ArtiZone';
const DESC     = 'Best nail salon in Amman — gel manicures, spa pedicures, acrylic nails & nail art. 100% sterilized tools, walk-ins welcome. Book your nail appointment at ArtiZone today.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/nails-foot-care`;

/* ── Trend data ──────────────────────────────────────────────────────────── */
const TRENDS_2026 = [
  { icon: '✨', name: 'Shimmering Metallics',      desc: 'Gold, silver, and bronze reflecting festive lights — perfect for Eid and celebrations.' },
  { icon: '💎', name: 'Crystal-Embellished Nails', desc: 'Glamorous rhinestone and crystal details for weddings, engagements, and special occasions.' },
  { icon: '🌸', name: 'Minimalist French',          desc: 'The "quiet luxury" trend — thin, elegant lines for a refined, understated look.' },
  { icon: '🪞', name: 'Glass Nails',               desc: 'High-shine, translucent finishes for a modern, editorial edge.' },
  { icon: '🌿', name: 'Natural Short Nails',        desc: 'Healthy, breathable looks with sheer polish — clean and effortlessly chic.' },
];

/* ── Service menu ────────────────────────────────────────────────────────── */
const MANICURES = [
  { name: 'Classic Manicure',    desc: 'Cut, file, cuticle care, polish',                  tag: '' },
  { name: 'Gel Manicure',        desc: 'Long-lasting, chip-free for 2–3 weeks',            tag: 'Most Popular' },
  { name: 'Builder Gel / BIAB',  desc: 'Strengthen and protect natural nails',             tag: '' },
  { name: 'Acrylic Full Set',    desc: 'Length & shape customization',                     tag: '' },
  { name: 'Acrylic Fill',        desc: 'Maintenance for existing acrylic sets',            tag: '' },
  { name: "Men's Manicure",      desc: 'Clean, groomed, professional finish',              tag: '' },
];

const PEDICURES = [
  { name: 'Classic Pedicure',    desc: 'Soak, scrub, file, polish',                       tag: '' },
  { name: 'Spa Pedicure',        desc: 'Exfoliation, massage, mask, polish',              tag: 'Best Value' },
  { name: 'Gel Pedicure',        desc: 'Long-lasting polish on toes',                     tag: '' },
  { name: 'Medical Pedicure',    desc: 'For ingrown nails & calluses',                    tag: '' },
  { name: "Men's Pedicure",      desc: 'Groomed feet, no polish',                         tag: '' },
];

const NAIL_ART = [
  { name: 'French Tips',              desc: 'Classic or colored — timeless elegance' },
  { name: 'Ombre / Baby Boomer',      desc: 'Soft gradient from natural to white or color' },
  { name: 'Chrome / Holographic',     desc: 'Mirror-finish powder for a futuristic look' },
  { name: 'Hand-Painted Designs',     desc: 'Custom artwork by our nail artists' },
  { name: 'Crystal / Rhinestone',     desc: 'Glamorous accents for special occasions' },
  { name: 'Nail Repair (per nail)',   desc: 'Fix breaks and chips without a full redo' },
  { name: 'Paraffin Wax Treatment',   desc: 'Deep moisturizing for hands and feet' },
];

/* ── Hygiene standards ───────────────────────────────────────────────────── */
const HYGIENE = [
  'Single-use files and buffers for every client',
  'Autoclave sterilization for all metal tools',
  'No drill damage to natural nails',
  'Vegan & cruelty-free polish options available',
  'Licensed technicians with ongoing training',
];

/* ── FAQs ────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How long does a gel manicure last?',
    a: 'A gel manicure at ArtiZone typically lasts 2–3 weeks without chipping. Longevity depends on your nail growth and daily activities. We recommend a fill or fresh set every 3 weeks.' },
  { q: 'Do you accept walk-ins?',
    a: 'Yes! Walk-ins are welcome for classic manicures and pedicures. For gel, acrylic, and nail art appointments, we recommend booking in advance to secure your preferred time slot.' },
  { q: 'Are your products safe for sensitive skin?',
    a: 'We offer vegan and cruelty-free polish options and use professional-grade products. Please let your technician know about any allergies or sensitivities before your appointment.' },
  { q: 'Can men get nail services at ArtiZone?',
    a: 'Absolutely. We offer dedicated men\'s manicure and pedicure services in a comfortable, private setting. Clean, groomed nails are for everyone.' },
  { q: 'How do I remove gel or acrylic nails safely?',
    a: 'We strongly recommend professional removal at our salon to avoid nail damage. We use a safe soak-off method that protects your natural nails. DIY removal can cause breakage and thinning.' },
];

/* ── Reviews ─────────────────────────────────────────────────────────────── */
const REVIEWS = [
  { name: 'Lina K.',  text: 'Best nail salon in Amman, hands down. The gel manicure lasted over 3 weeks and the nail art was exactly what I wanted. The hygiene standards are impeccable.', rating: 5 },
  { name: 'Rima S.',  text: 'I came for a spa pedicure before my wedding and it was absolutely divine. The technicians are so skilled and the atmosphere is so relaxing.', rating: 5 },
  { name: 'Nour A.',  text: 'Finally a nail salon in Amman that does proper crystal nail art! The results were stunning and lasted through my entire trip abroad.', rating: 5 },
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

function ServiceTag({ tag }: { tag: string }) {
  if (!tag) return null;
  return (
    <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 shrink-0"
      style={{ background: `rgba(196,168,130,0.18)`, color: G, fontFamily: 'var(--font-sans)' }}>
      {tag}
    </span>
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
export default function NailSalonAmman() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${SLUG}#service`,
        name: 'Nails & Foot Care in Amman',
        serviceType: 'Manicure and pedicure',
        url: `${SITE_URL}${SLUG}`,
        image: OG_IMG,
        description: DESC,
        category: 'Nails',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'City', name: 'Amman', '@id': 'https://www.wikidata.org/wiki/Q3805' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'JOD',
          priceRange: '8–80',
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
          name: 'Nail Services',
          itemListElement: [
            ...MANICURES.map((s, i) => ({ '@type': 'Offer', position: i + 1, itemOffered: { '@type': 'Service', name: s.name, description: s.desc } })),
            ...PEDICURES.map((s, i) => ({ '@type': 'Offer', position: MANICURES.length + i + 1, itemOffered: { '@type': 'Service', name: s.name, description: s.desc } })),
          ],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${SLUG}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: 'Nails & Foot Care' },
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
        <meta property="og:title"        content={TITLE} />
        <meta property="og:description"  content={DESC} />
        <meta property="og:image"        content={OG_IMG} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Nail salon services at ArtiZone Amman — gel nails, manicure, pedicure" />
        <meta property="og:url"          content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <meta property="og:locale" content="en_US" />
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/nail-salon-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/nail-salon-amman`} />
        <meta name="twitter:title"       content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image"       content={OG_IMG} />
        <meta name="twitter:image:alt"   content="Nail salon services at ArtiZone Amman — gel nails, manicure, pedicure" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(480px,70svh,780px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/nails-video"
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
              <span style={{ color: G }}>Nail Salon Amman</span>
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
              Elegant Nail Services<br />
              <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Manicures, pedicures, gel nails, acrylics & custom nail art — blending Parisian precision with 2026's hottest trends. Walk-ins welcome.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Nail Appointment
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
                { val: '15+',    label: 'Nail services available'    },
                { val: '2,500+', label: 'Clients in Amman'           },
                { val: '4.9★',   label: 'Google rating'              },
                { val: '100%',   label: 'Sterilized tools every time' },
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
                <SectionLabel>Parisian Precision in Amman</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Your Hands Deserve<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>to Be a Canvas</em>
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${G})` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: G }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${G})` }} />
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  At ArtiZone's nail studio, our skilled technicians blend Parisian precision with 2026's hottest trends — from minimalist "quiet luxury" designs to shimmering crystal embellishments perfect for Jordan's festive celebrations.
                </p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  Using premium polishes, strict sterilization, and hospital-grade hygiene protocols, we deliver flawless results that last. Whether you need a classic French for the office, bold nail art for a wedding, or a relaxing spa pedicure — ArtiZone is your nail destination in Amman.
                </p>
                <Link to="/booking"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:gap-3"
                  style={{ color: G, fontFamily: 'var(--font-sans)' }}>
                  Book Your Appointment <ArrowRight size={12} />
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

        {/* ══ 2026 TRENDS ══════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>What's Hot in 2026</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                2026 Nail Trends<br />
                <em style={{ color: G, fontStyle: 'italic' }}>at ArtiZone</em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Our technicians stay ahead of global trends so you always leave with nails that turn heads.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRENDS_2026.map((trend, i) => (
                <motion.div key={trend.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 group transition-all duration-300"
                  style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.45)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="text-2xl mb-4" aria-hidden>{trend.icon}</div>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{trend.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{trend.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERVICE MENU — MANICURES ══════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
              <SectionLabel>Service Menu</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Manicures
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MANICURES.map((s, i) => (
                <motion.div key={s.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 group transition-all duration-300"
                  style={{ background: S1, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.40)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="w-5 h-px mb-4" style={{ background: G }} />
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{s.name}</h3>
                    <ServiceTag tag={s.tag} />
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{s.desc}</p>
                  <Link to="/booking"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                    style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                    Book Now →
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pedicures */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 mb-10">
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Pedicures
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PEDICURES.map((s, i) => (
                <motion.div key={s.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 group transition-all duration-300"
                  style={{ background: S1, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.40)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="w-5 h-px mb-4" style={{ background: G }} />
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{s.name}</h3>
                    <ServiceTag tag={s.tag} />
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{s.desc}</p>
                  <Link to="/booking"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                    style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                    Book Now →
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Nail Art */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 mb-10">
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Nail Art & Add-Ons
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NAIL_ART.map((s, i) => (
                <motion.div key={s.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 group transition-all duration-300"
                  style={{ background: S1, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.40)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="w-5 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN }}>{s.name}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{s.desc}</p>
                  <Link to="/booking"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                    style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                    Book Now →
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-12">
              <Link to="/booking"
                className="inline-flex items-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Your Nail Appointment <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ HYGIENE STANDARDS ════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionLabel>Hospital-Grade Standards</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Hygiene You Can<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>Trust</em>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>
                  Your safety is our priority. We follow strict sterilization protocols that exceed industry standards — so you can relax completely.
                </p>
                <ul className="space-y-4">
                  {HYGIENE.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(14,42,58,0.75)', fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: DEEP_BROWN }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.40) 0%,transparent 50%)' }} />
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${DEEP_BROWN}`, borderLeft: `2px solid ${DEEP_BROWN}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${DEEP_BROWN}`, borderRight: `2px solid ${DEEP_BROWN}` }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <SectionLabel>Client Reviews</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                What Clients Say
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative" style={{ background: S1, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="absolute top-5 right-6 text-6xl leading-none select-none"
                    style={{ fontFamily: 'var(--font-heading)', color: 'rgba(196,168,130,0.09)' }}>"</div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill={MUSTARD} color={MUSTARD} />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
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
                Nail Salon FAQ
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
              <SectionLabel>Book Your Nail Appointment</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Walk-Ins Welcome.<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Appointments Recommended.</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Classic services accept walk-ins. For gel, acrylic, and nail art, book in advance to secure your preferred time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                  Book Online
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
        <LandingBlogLinks service="nails" />

        {/* ══ INTERNAL LINKS ═══════════════════════════════════════════════ */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5"
              style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Facials & Skin Care', href: '/best-facial-amman'       },
                { label: 'Skin Tightening',    href: '/skin-tightening-amman'    },
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
