import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, Sun } from 'lucide-react';
import LandingBlogLinks from '@/components/landing/LandingBlogLinks';
import OptimizedImage from '@/components/OptimizedImage';

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const G          = '#C4A882'; /* Warm Sand — accent                    */
const BLACK      = '#0E2A3A'; /* Ink Navy                              */
const S1         = '#C4A882'; /* Warm Sand                             */
const S2         = '#6B7260'; /* Sage Stone                            */
const FG         = 'rgba(253,250,246,0.88)';
const FGDIM      = 'rgba(253,250,246,0.55)';
const GDIM       = 'rgba(196,168,130,0.50)';
const DEEP_BROWN = '#0E2A3A'; /* Ink Navy                              */
const TERRACOTTA = '#C4A882'; /* Warm Sand                             */
const MUSTARD    = '#6B7260'; /* Sage Stone                            */

const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/summer-skincare-amman';
const TITLE    = 'Summer Skincare Treatments in Amman | ArtiZone Beauty Clinic';
const DESC     = 'Summer skincare in Amman — protect, repair & glow all season. HydraFacials, sun damage repair, laser hair removal & body care. SPF aftercare included. Book at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

const TREATMENTS = [
  { name: 'Hydrafacial',            desc: 'Deep hydration + gentle exfoliation — perfect for heat-stressed skin.' },
  { name: 'Brightening Facial',     desc: 'Targets sun-induced dullness and uneven tone for a radiant summer glow.' },
  { name: 'Chemical Peel (Light)',  desc: 'Resurfaces sun-damaged skin and fades dark spots safely.' },
  { name: 'Laser Hair Removal',     desc: 'Start now — be smooth and ready for next summer with 6–8 sessions.' },
  { name: 'Body Slimming',          desc: 'Cavitation and RF contouring to feel confident in summer clothes.' },
  { name: 'SPF Skin Consultation',  desc: 'Personalised sun-protection plan from our certified skin specialists.' },
];

const TIPS = [
  { step: '01', title: 'Hydrate Daily',       body: 'Amman summers are dry and intense. A hyaluronic acid serum morning and night keeps skin plump and protected.' },
  { step: '02', title: 'SPF Every Day',        body: 'SPF 50+ is non-negotiable. Reapply every 2 hours outdoors. It is the single most effective anti-aging step.' },
  { step: '03', title: 'Professional Facials', body: 'Monthly Hydrafacials remove dead cells, unclog pores, and deliver deep hydration that home products cannot match.' },
  { step: '04', title: 'Start Laser Early',    body: 'Begin laser hair removal in spring or early summer — avoid sun exposure for 2 weeks before and after each session.' },
];

const REVIEWS = [
  { name: 'Rima S.',  text: 'Got a Hydrafacial before my beach holiday and my skin looked incredible. The team at ArtiZone really know what they are doing.', rating: 5 },
  { name: 'Dana K.',  text: 'My skin was so dull from the summer heat. After two brightening facials at ArtiZone it is completely transformed.', rating: 5 },
  { name: 'Lara M.',  text: 'Started laser in May and by August I was completely smooth. Best decision I made this summer.', rating: 5 },
];

const FAQS = [
  { q: 'Is laser hair removal safe in summer?', a: 'Yes, with proper precautions. Avoid direct sun exposure for 2 weeks before and after each session, and always apply SPF 50+. We adjust laser settings for sun-exposed skin.' },
  { q: 'Which facial is best for summer skin?', a: 'Hydrafacial is our top recommendation for summer — it hydrates, exfoliates, and brightens without downtime, making it perfect for the hot season.' },
  { q: 'Can I get a chemical peel in summer?', a: 'Light peels are safe in summer with strict sun protection. We recommend starting with a gentle peel and following our post-care protocol carefully.' },
  { q: 'How do I protect my skin after treatments?', a: 'SPF 50+, gentle cleansing, and avoiding direct sun for 48–72 hours post-treatment. We provide a full aftercare guide with every session.' },
  { q: 'Do you offer summer packages?', a: 'Yes — our seasonal packages bundle facials, laser, and body treatments at a discounted rate. Ask our team about current summer offers when you book.' },
];

function TealLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

export default function SummerSkincareAmman() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Summer Skincare Treatments in Amman',
    provider: {
      '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', url: SITE_URL,
      address: { '@type': 'PostalAddress', streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.', addressLocality: 'Amman', addressCountry: 'JO' },
      telephone: '+962790412758',
    },
    description: DESC, url: `${SITE_URL}${SLUG}`, image: OG_IMG,
    areaServed: { '@type': 'City', name: 'Amman' },
    serviceType: 'Skincare & Beauty Treatments',
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/summer-skincare-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/summer-skincare-amman`} />
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
            src="/airo-assets/images/services/facial-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={780}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(14,42,58,0.22) 0%,rgba(14,42,58,0.58) 50%,rgba(61,61,63,0.96) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.60) 0%,transparent 65%)' }} />
          {/* Sun glow */}
          <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(214,162,61,0.18) 0%, transparent 65%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24" style={{ minHeight: 'clamp(480px,70svh,780px)' }}>
            {/* Breadcrumb */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]" style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <Link to="/services" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Services</Link>
              <span>/</span>
              <span style={{ color: G }}>Summer Skincare</span>
            </motion.div>

            {/* Season badge */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3 mb-4">
              <Sun size={14} style={{ color: MUSTARD }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ color: MUSTARD, fontFamily: 'var(--font-sans)' }}>Summer 2026 — Amman, Jordan</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(230,215,185,0.95)', fontSize: 'clamp(1.75rem,5.5vw,4.8rem)', lineHeight: 1.1, fontWeight: 400, marginBottom: '1rem' }}>
              Summer Skincare{' '}
              <em style={{ color: G, fontStyle: 'italic' }}>in Amman</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Protect, repair, and glow through the Amman summer. Expert facials, laser, and body treatments tailored for the season — at ArtiZone Beauty Clinic.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                Book Summer Treatment
              </Link>
              <Link to="/special-offers"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: 'transparent', color: 'rgba(230,215,185,0.80)', border: '1px solid rgba(230,215,185,0.25)', fontFamily: 'var(--font-sans)' }}>
                View Summer Offers
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.10)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { val: '6+',     label: 'Summer treatments available'   },
                { val: '2,000+', label: 'Happy clients in Amman'        },
                { val: '5★',     label: 'Google rating'                 },
                { val: 'SPF',    label: 'Aftercare guidance included'   },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TREATMENTS ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>What We Offer</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Summer Treatment Menu
              </h2>
              <p className="mt-4 text-sm max-w-xl mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Every treatment is adapted for summer skin — heat, humidity, and sun exposure all considered.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TREATMENTS.map((t, i) => (
                <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 luxury-card" style={{ background: S1 }}>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(14,42,58,0.95)' }}>{t.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY ARTIZONE ── */}
        <TealLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: DEEP_BROWN, fontFamily: 'var(--font-sans)' }}>Why Choose ArtiZone</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Amman's Summer Skincare<br />
                  <em style={{ color: DEEP_BROWN, fontStyle: 'italic', opacity: 0.7 }}>Specialists</em>
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${DEEP_BROWN}55)` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: DEEP_BROWN, opacity: 0.4 }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${DEEP_BROWN}55)` }} />
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(14,42,58,0.72)', fontFamily: 'var(--font-sans)' }}>
                  Jordan's summer is one of the most intense in the region. Our specialists understand how heat, UV exposure, and humidity affect skin — and tailor every treatment accordingly. We use professional-grade products and equipment suited for the season.
                </p>
                <ul className="space-y-3">
                  {[
                    'Treatments adapted for summer skin conditions',
                    'SPF aftercare guidance with every session',
                    'Certified skin specialists with local expertise',
                    'Private, air-conditioned treatment rooms',
                    'Seasonal packages at competitive prices',
                    'Convenient location in central Amman',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(14,42,58,0.72)', fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: DEEP_BROWN }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(14,42,58,0.40) 0%,transparent 50%)' }} />
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
              </motion.div>
            </div>
          </div>
        </section>
        <TealLine />

        {/* ── SUMMER TIPS ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: MUSTARD, fontFamily: 'var(--font-sans)' }}>Expert Advice</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Summer Skincare Essentials
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TIPS.map((s, i) => (
                <motion.div key={s.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 luxury-card" style={{ background: S1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', color: 'rgba(214,162,61,0.14)', fontSize: '3rem', lineHeight: 1, marginBottom: '0.75rem', fontWeight: 500 }}>{s.step}</div>
                  <div className="w-6 h-px mb-4" style={{ background: MUSTARD }} />
                  <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(14,42,58,0.95)' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <TealLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Client Reviews</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'rgba(14,42,58,0.95)', fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                What Clients Say
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <motion.div key={r.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative" style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.10)' }}>
                  <div className="absolute top-5 right-6 text-6xl leading-none select-none" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(196,168,130,0.09)' }}>"</div>
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill={G} color={G} />)}</div>
                  <p className="text-sm leading-relaxed mb-5 italic" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>"{r.text}"</p>
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(196,168,130,0.10)' }}>
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold" style={{ background: `${G}18`, color: G, fontFamily: 'var(--font-sans)' }}>{r.name[0]}</div>
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{r.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <TealLine />

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Common Questions</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Summer Skincare FAQ
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, i) => (
                <motion.div key={faq.q} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6" style={{ background: S1, border: '1px solid rgba(196,168,130,0.10)' }}>
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(14,42,58,0.95)' }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <TealLine />
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: DEEP_BROWN }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, rgba(214,162,61,0.08) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: MUSTARD, fontFamily: 'var(--font-sans)' }}>Book This Summer</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Glow Through the<br /><em style={{ color: G, fontStyle: 'italic' }}>Amman Summer</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Book your summer skincare consultation today. Our specialists will build a personalised treatment plan for your skin type and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Book Summer Treatment
                </Link>
                <Link to="/special-offers"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: 'transparent', color: FG, border: `1px solid rgba(253,250,246,0.22)`, fontFamily: 'var(--font-sans)' }}>
                  See Summer Offers
                </Link>
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
        <LandingBlogLinks service="summer" />

        {/* ── INTERNAL LINKS ── */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal',  href: '/laser-hair-removal-amman'  },
                { label: 'Skin Tightening',     href: '/skin-tightening-amman'     },
                { label: 'Acne Scar Removal',   href: '/acne-scar-removal-amman'   },
                { label: 'Body Slimming',        href: '/body-slimming-amman'       },
                { label: 'Winter Treatments',    href: '/winter-treatments-amman'   },
                { label: 'All Services',         href: '/services'                  },
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
