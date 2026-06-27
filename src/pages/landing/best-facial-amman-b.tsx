/**
 * A/B Variant B — Best Facial Amman
 * Angle: Transformation + Visible Results + "See the Difference After One Session"
 * vs Control (A): Generic "professional facial" positioning
 */
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Star, ArrowRight, MapPin, Phone, Clock, Sparkles, Eye, Heart } from 'lucide-react';
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

const TEST_KEY = 'facial-lp';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/best-facial-amman-b';
const TITLE    = 'See the Difference After One Session | Facials in Amman — ArtiZone';
const DESC     = 'Professional facials in Amman that deliver visible results from your very first session. Hydrafacial, deep cleansing, anti-aging & brightening. Book today at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

const FACIALS = [
  { name: 'Deep Cleansing Facial',  desc: 'Removes impurities, unclogs pores, and leaves skin fresh and balanced. Ideal for oily and combination skin.' },
  { name: 'Hydrafacial',            desc: 'Multi-step treatment that cleanses, exfoliates, extracts, and hydrates simultaneously for instant glow.' },
  { name: 'Anti-Aging Facial',      desc: 'Targets fine lines, wrinkles, and loss of firmness using peptide-rich serums and lifting massage techniques.' },
  { name: 'Brightening Facial',     desc: 'Reduces dark spots, uneven tone, and dullness for a radiant, luminous complexion.' },
  { name: 'Sensitive Skin Facial',  desc: 'Gentle, calming treatment for reactive skin — reduces redness and strengthens the skin barrier.' },
  { name: 'LED Light Therapy',      desc: 'Red and blue light therapy to stimulate collagen, reduce acne, and accelerate skin healing.' },
];

const RESULTS_TIMELINE = [
  { session: 'After Session 1', result: 'Visibly brighter, more hydrated skin. Pores appear smaller. Clients describe a "glass skin" effect.' },
  { session: 'After Session 3', result: 'Noticeable improvement in texture, tone, and firmness. Acne and dark spots begin to fade.' },
  { session: 'After Session 6', result: 'Transformative results. Clients report looking 3–5 years younger with consistent monthly treatments.' },
];

const FAQS = [
  { q: 'How often should I get a facial?', a: 'For maintenance and glow, once a month is ideal. For specific concerns like acne or hyperpigmentation, every 2–3 weeks may be recommended.' },
  { q: 'Which facial is best for acne-prone skin?', a: 'The Deep Cleansing Facial combined with LED Blue Light Therapy is most effective for acne-prone skin. We customise every treatment to your skin type.' },
  { q: 'Is the Hydrafacial suitable for sensitive skin?', a: 'Yes. The Hydrafacial is one of the gentlest yet most effective treatments available — suitable for all skin types including sensitive and rosacea-prone skin.' },
  { q: 'How long does a facial take?', a: 'Most facials take 45–75 minutes. The Hydrafacial takes around 60 minutes. We recommend arriving 10 minutes early for your skin consultation.' },
  { q: 'Will I see results immediately?', a: 'Most clients notice brighter, smoother skin immediately after their first session. Optimal results for anti-aging or pigmentation concerns build over a course of treatments.' },
];

const REVIEWS = [
  { name: 'Sara M.',  text: 'The Hydrafacial at ArtiZone is incredible. My skin was glowing for weeks. The staff are knowledgeable and genuinely care about results.', rating: 5 },
  { name: 'Hana J.',  text: 'Best facial I have had in Amman. The deep cleansing facial cleared my skin in just two sessions. Highly recommend!', rating: 5 },
  { name: 'Dina R.',  text: 'I have been coming for the anti-aging facial every month for 6 months. The difference in my skin texture and firmness is remarkable.', rating: 5 },
];

function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

export default function BestFacialAmmanB() {
  const variant = getVariantWithOverride(TEST_KEY);

  useEffect(() => {
    trackEvent(TEST_KEY, variant, 'impression');
  }, [variant]);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Professional Facials in Amman',
    provider: { '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', url: SITE_URL,
      address: { '@type': 'PostalAddress', streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.', addressLocality: 'Amman', addressCountry: 'JO' },
      telephone: '+962790412758',
    },
    description: DESC, url: `${SITE_URL}${SLUG}`, image: OG_IMG,
    areaServed: { '@type': 'City', name: 'Amman' },
    serviceType: 'Facial Treatment',
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${SITE_URL}/best-facial-amman`} />
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/best-facial-amman-b`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/best-facial-amman-b`} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMG} />
        <meta name="twitter:image:alt" content={TITLE} />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(520px,75svh,820px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/facial-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority width={1920} height={820}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.20) 0%,rgba(14,42,58,0.55) 50%,rgba(61,61,63,0.97) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.62) 0%,transparent 65%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(520px,75svh,820px)' }}>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: G }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Amman, Jordan · Results-Driven Facials</span>
            </motion.div>

            {/* Headline — transformation-led */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.96)', fontSize: 'clamp(2rem,6vw,5.2rem)', lineHeight: 1.05, fontWeight: 400, marginBottom: '1rem' }}>
              See the Difference<br />
              <em style={{ color: G, fontStyle: 'italic' }}>After One Session.</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
              className="text-base sm:text-lg leading-relaxed mb-3 max-w-lg font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>
              Professional facials in Amman that deliver <span style={{ color: G }}>visible, lasting results</span> — not just a temporary glow.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
              className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              Hydrafacial, deep cleansing, anti-aging, brightening — all customised to your skin type by certified specialists.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                Book My Skin Consultation
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-5 text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              ★★★★★ Rated 5/5 · "My skin was glowing for weeks" — Sara M., Amman
            </motion.p>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.10)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { val: 'Instant',  label: 'Visible results after session 1' },
                { val: '6+',       label: 'Facial types available'          },
                { val: '2,000+',   label: 'Happy clients in Amman'          },
                { val: 'Custom',   label: 'Treatment for every skin type'   },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RESULTS TIMELINE ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Your Skin Journey</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                What to Expect<br /><em style={{ color: G, fontStyle: 'italic' }}>Session by Session</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {RESULTS_TIMELINE.map((item, i) => (
                <motion.div key={item.session} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 relative overflow-hidden" style={{ background: S1, border: `1px solid ${G}22` }}>
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: G }} />
                  <div style={{ fontFamily: 'var(--font-heading)', color: `${G}22`, fontSize: '4rem', lineHeight: 1, position: 'absolute', top: 12, right: 16, fontWeight: 500 }}>{i + 1}</div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{item.session}</p>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{item.result}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FACIAL TYPES ── */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Our Treatments</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                A Facial for<br /><em style={{ color: G, fontStyle: 'italic' }}>Every Skin Concern</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FACIALS.map((f, i) => (
                <motion.div key={f.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 luxury-card" style={{ background: BLACK }}>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{f.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <GoldLine />

        {/* ── WHY ARTIZONE — 3 PILLARS ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Why ArtiZone</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Results You Can<br /><em style={{ color: G, fontStyle: 'italic' }}>See and Feel</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <Eye size={22} style={{ color: G }} />, title: 'Visible from Session 1', body: 'Our facials are designed for real, measurable results — not just a temporary glow. Most clients see a noticeable difference in brightness and texture after their very first visit.' },
                { icon: <Sparkles size={22} style={{ color: G }} />, title: 'Customised to Your Skin', body: 'No two skins are the same. Every treatment starts with a skin analysis so we can select the right facial, products, and techniques for your specific concerns.' },
                { icon: <Heart size={22} style={{ color: G }} />, title: 'Certified Skin Specialists', body: 'Our therapists are trained in advanced facial techniques and use professional-grade products. You are in expert hands from the moment you walk in.' },
              ].map((p, i) => (
                <motion.div key={p.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 luxury-card" style={{ background: S1 }}>
                  <div className="mb-5">{p.icon}</div>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{p.body}</p>
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Client Stories</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Real Skin Transformations
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
                Facial Treatment FAQ
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Your Skin Deserves This</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Book Your Skin Consultation<br /><em style={{ color: G, fontStyle: 'italic' }}>Today</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Walk in with a concern. Walk out with a plan — and glowing skin. Our specialists will match you with the perfect facial for your skin type.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Book My Skin Consultation
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
        <LandingBlogLinks service="facial" />

        {/* ── INTERNAL LINKS ── */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Body Slimming',       href: '/body-slimming-amman'     },
                { label: "Men's Grooming",      href: '/mens-grooming-amman'     },
                { label: 'All Services',        href: '/services'                },
                { label: 'Packages',            href: '/packages'                },
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
