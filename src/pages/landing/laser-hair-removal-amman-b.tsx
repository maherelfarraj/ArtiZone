/**
 * A/B Variant B — Laser Hair Removal Amman
 * Angle: Urgency + Price Transparency + "Stop Wasting Money on Waxing"
 * vs Control (A): Generic "professional laser" positioning
 */
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Star, ArrowRight, MapPin, Phone, Clock, TrendingDown, Zap, Shield } from 'lucide-react';
import LandingBlogLinks from '@/components/landing/LandingBlogLinks';
import { getVariantWithOverride, trackEvent } from '@/lib/ab-test';
import OptimizedImage from '@/components/OptimizedImage';

const G          = '#C4A882'; /* Warm Sand — accent                    */
const BLACK      = '#0E2A3A'; /* Ink Navy                              */
const S1         = '#C4A882'; /* Warm Sand                             */
const S2         = '#6B7260'; /* Sage Stone                            */
const FG         = 'rgba(253,250,246,0.88)';
const FGDIM      = 'rgba(253,250,246,0.48)';
const GDIM       = 'rgba(196,168,130,0.50)';
const DEEP_BROWN = '#0E2A3A'; /* Ink Navy                              */
const TERRACOTTA = '#C4A882'; /* Warm Sand                             */
const URGENT     = '#C4A882'; /* Warm Sand — urgency accent            */

const TEST_KEY = 'laser-lp';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/laser-hair-removal-amman-b';
const TITLE    = 'Stop Wasting Money on Waxing | Laser Hair Removal Amman — ArtiZone';
const DESC     = 'Permanent laser hair removal in Amman — advanced diode laser, all skin tones, certified specialists. Book your FREE patch test today.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/laser-hair-removal`;

const AREAS = [
  'Full Legs','Full Arms','Underarms','Bikini & Brazilian','Back & Chest (Men)','Face & Upper Lip','Neck','Stomach',
];

const FAQS = [
  { q: 'How many sessions do I need?', a: 'Most clients achieve 80–90% permanent reduction in 6–8 sessions spaced 4–6 weeks apart. Hormonal areas may need a few extra sessions.' },
  { q: 'Is laser hair removal painful?', a: 'Modern diode lasers feel like a light rubber-band snap. We apply a cooling gel before each session to keep you comfortable throughout.' },
  { q: 'Is it safe for all skin tones?', a: 'Yes. We use advanced diode laser technology calibrated for all Fitzpatrick skin types, including darker Mediterranean and Middle Eastern skin tones.' },
  { q: 'How long does a session take?', a: 'Small areas like underarms take 10–15 minutes. Full legs take around 45–60 minutes. We always do a patch test on your first visit.' },
  { q: 'When will I see results?', a: 'Hair starts shedding 1–3 weeks after each session. You will notice significant thinning after sessions 2–3 and near-permanent results by session 6.' },
];

const REVIEWS = [
  { name: 'Nour H.',  text: 'After 6 sessions my legs are completely smooth. The team is professional and the clinic is spotless. Best laser in Amman!', rating: 5 },
  { name: 'Lina A.',  text: 'I tried other clinics before ArtiZone and the difference is huge. The laser is much more effective and the staff actually care.', rating: 5 },
  { name: 'Rami K.',  text: 'Did back and chest laser — painless and very professional. Highly recommend for men too.', rating: 5 },
];

const COST_COMPARE = [
  { label: 'Monthly waxing (1 year)', cost: '~12 sessions', highlight: false },
  { label: 'Monthly waxing (3 years)', cost: '~36 sessions', highlight: false },
  { label: 'Full laser package (permanent)', cost: 'Ask for price', highlight: true },
];

function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

export default function LaserHairRemovalAmmanB() {
  const variant = getVariantWithOverride(TEST_KEY);

  useEffect(() => {
    trackEvent(TEST_KEY, variant, 'impression');
  }, [variant]);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Laser Hair Removal in Amman',
    provider: { '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', url: SITE_URL,
      address: { '@type': 'PostalAddress', streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.', addressLocality: 'Amman', addressCountry: 'JO' },
      telephone: '+962790412758',
    },
    description: DESC, url: `${SITE_URL}${SLUG}`, image: OG_IMG,
    areaServed: { '@type': 'City', name: 'Amman' },
    serviceType: 'Laser Hair Removal',
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${SITE_URL}/laser-hair-removal-amman`} />
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/laser-hair-removal-amman-b`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/laser-hair-removal-amman-b`} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMG} />
        <meta name="twitter:image:alt" content={TITLE} />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ── URGENCY BANNER ── */}
        <div className="w-full py-2.5 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: URGENT, color: '#fff', fontFamily: 'var(--font-sans)' }}>
          Limited slots this week — Free patch test with every booking
        </div>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(520px,75svh,820px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/laser-hair-removal"
            alt="Laser hair removal treatment at ArtiZone Amman — permanent smooth skin"
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={820}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.25) 0%,rgba(61,61,63,0.60) 50%,rgba(61,61,63,0.97) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(61,61,63,0.60) 0%,transparent 65%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(520px,75svh,820px)' }}>

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Amman, Jordan · Advanced Diode Laser</span>
            </motion.div>

            {/* Headline — pain-point led */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.96)', fontSize: 'clamp(2rem,6vw,5.2rem)', lineHeight: 1.05, fontWeight: 400, marginBottom: '1rem' }}>
              Stop Wasting Money<br />
              <em style={{ color: G, fontStyle: 'italic' }}>on Waxing.</em>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
              className="text-base sm:text-lg leading-relaxed mb-3 max-w-lg font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>
              Permanent laser hair removal in Amman — <span style={{ color: G }}>advanced diode laser, all skin tones.</span>
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
              className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              Advanced diode laser safe for all skin tones. Certified specialists. Free patch test included.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                Claim My Free Patch Test
              </Link>
            </motion.div>

            {/* Social proof micro-line */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-5 text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              ★★★★★ Rated 5/5 by 2,000+ clients in Amman
            </motion.p>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.10)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { val: 'Free',       label: 'Patch test included' },
                { val: '6–8',        label: 'Sessions for permanent results' },
                { val: '2,000+',     label: 'Happy clients in Amman' },
                { val: 'All Tones',  label: 'Safe for all skin types' },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── COST COMPARISON ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>The Smart Investment</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Waxing Costs You More<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>Every Single Month</em>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  The average woman in Amman spends hours every month on waxing — and it never ends. One laser package at ArtiZone delivers permanent results that last a lifetime.
                </p>

                {/* Cost comparison table */}
                <div className="space-y-3 mb-8">
                  {COST_COMPARE.map(row => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-4"
                      style={{
                        background: row.highlight ? `${G}18` : S1,
                        border: row.highlight ? `1.5px solid ${G}55` : '1px solid rgba(196,168,130,0.10)',
                      }}>
                      <div className="flex items-center gap-2.5">
                        {row.highlight
                          ? <TrendingDown size={14} style={{ color: G }} />
                          : <span className="w-3.5 h-3.5 rounded-full" style={{ background: 'rgba(196,168,130,0.20)', display: 'inline-block' }} />
                        }
                        <span className="text-sm" style={{ color: row.highlight ? FG : FGDIM, fontFamily: 'var(--font-sans)', fontWeight: row.highlight ? 600 : 400 }}>{row.label}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-heading)', color: row.highlight ? G : FGDIM, fontSize: '1rem', fontWeight: row.highlight ? 600 : 400 }}>{row.cost}</span>
                    </div>
                  ))}
                </div>

                <Link to="/booking"
                  onClick={() => trackEvent(TEST_KEY, variant, 'click_cta')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Book Free Consultation <ArrowRight size={12} />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.50) 0%,transparent 50%)' }} />
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
                {/* Floating badge */}
                <div className="absolute top-5 right-5 px-4 py-3 text-center"
                  style={{ background: URGENT, fontFamily: 'var(--font-sans)' }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white">Save time &</div>
                  <div className="text-xl font-bold text-white leading-tight">Go Permanent</div>
                  <div className="text-[10px] text-white opacity-80">vs. years of waxing</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHY ARTIZONE — 3 PILLARS ── */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Why ArtiZone</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Amman's Most Trusted<br /><em style={{ color: G, fontStyle: 'italic' }}>Laser Clinic</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <Zap size={22} style={{ color: G }} />, title: 'Advanced Diode Laser', body: 'Our medical-grade diode laser is calibrated for all skin tones — including darker Mediterranean and Middle Eastern complexions. Safe, fast, effective.' },
                { icon: <Shield size={22} style={{ color: G }} />, title: 'Certified Specialists', body: 'Every treatment is performed by a certified laser technician. We do a free patch test on your first visit to ensure perfect settings for your skin.' },
                { icon: <TrendingDown size={22} style={{ color: G }} />, title: 'Permanent Results', body: 'No hidden fees. No upsells. One package delivers permanent hair reduction — no more monthly waxing appointments.' },
              ].map((p, i) => (
                <motion.div key={p.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 luxury-card" style={{ background: BLACK }}>
                  <div className="mb-5">{p.icon}</div>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{p.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <GoldLine />

        {/* ── TREATMENT AREAS ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Coverage</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                All Treatment Areas
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AREAS.map((area, i) => (
                <motion.div key={area} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 luxury-card" style={{ background: S1 }}>
                  <span style={{ color: G, fontSize: 8 }}>◆</span>
                  <span className="text-sm" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>{area}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Real Results</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                2,000+ Clients Can't Be Wrong
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
        <GoldLine />

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Common Questions</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Laser Hair Removal FAQ
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, i) => (
                <motion.div key={faq.q} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6" style={{ background: S1, border: '1px solid rgba(196,168,130,0.10)' }}>
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <GoldLine />
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: S1 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, rgba(196,168,130,0.06) 0%, transparent 60%)` }} />
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Limited Slots This Week</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Get Your Free Patch Test<br /><em style={{ color: G, fontStyle: 'italic' }}>Before Slots Fill Up</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                No commitment. No hidden fees. Just come in, meet our team, and see if laser is right for you — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Claim My Free Patch Test
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
        <LandingBlogLinks service="laser" />

        {/* ── INTERNAL LINKS ── */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Face & Skin Care',  href: '/best-facial-amman'    },
                { label: 'Body Slimming',      href: '/body-slimming-amman'  },
                { label: "Men's Grooming",     href: '/mens-grooming-amman'  },
                { label: 'All Services',       href: '/services'             },
                { label: 'Packages',           href: '/packages'             },
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
