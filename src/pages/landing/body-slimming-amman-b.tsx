/**
 * A/B Variant B — Body Slimming Amman
 * Angle: Confidence + Specific Measurable Results ("Lose 2–5 cm per area")
 * vs Control (A): Generic "non-surgical body slimming" positioning
 */
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Star, ArrowRight, MapPin, Phone, Clock, Ruler, Timer, Award } from 'lucide-react';
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

const TEST_KEY = 'slimming-lp';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/body-slimming-amman-b';
const TITLE    = 'Lose 2–5 cm Per Area | Body Slimming Amman — ArtiZone';
const DESC     = 'Non-surgical body slimming in Amman with measurable results — lose 2–5 cm per treated area. Cavitation, RF, lymphatic drainage. No surgery, no downtime. Book at ArtiZone.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/body-slimming`;

const TREATMENTS = [
  { name: 'Ultrasonic Cavitation',    desc: 'Targets stubborn fat deposits using low-frequency ultrasound waves that break down fat cells without surgery or downtime.' },
  { name: 'Radiofrequency (RF)',       desc: 'Tightens loose skin and stimulates collagen production — ideal for post-weight-loss skin laxity and cellulite reduction.' },
  { name: 'Lymphatic Drainage',        desc: 'Manual and mechanical lymphatic massage to reduce water retention, puffiness, and improve circulation for a slimmer appearance.' },
  { name: 'Vacuum Therapy',            desc: 'Suction-based treatment that lifts and firms the skin, reduces cellulite, and improves blood flow to targeted areas.' },
  { name: 'Body Wraps',                desc: 'Detoxifying and slimming body wraps that reduce inches, hydrate skin, and leave you feeling refreshed and lighter.' },
  { name: 'Combined Slimming Package', desc: 'Our most popular option — combines cavitation, RF, and lymphatic drainage for maximum fat reduction and skin tightening results.' },
];

const RESULTS_STATS = [
  { stat: '2–5 cm',  label: 'Lost per treated area', detail: 'Measured reduction per full course' },
  { stat: '4–6',     label: 'Sessions to see results', detail: 'Most clients notice a difference early' },
  { stat: '0',       label: 'Days of downtime',        detail: 'Return to normal life immediately' },
  { stat: '100%',    label: 'Non-surgical',            detail: 'No needles, no anaesthesia, no scars' },
];

const FAQS = [
  { q: 'Is body slimming treatment safe?', a: 'Yes. All our body slimming treatments are non-invasive and non-surgical. There is no downtime, no anaesthesia, and no recovery period required.' },
  { q: 'How many sessions do I need?', a: 'Most clients see visible results after 4–6 sessions. A full course of 8–12 sessions is recommended for optimal fat reduction and skin tightening.' },
  { q: 'Which areas can be treated?', a: 'We treat the abdomen, waist, hips, thighs, buttocks, arms, and back. A consultation will help us create a personalised plan for your target areas.' },
  { q: 'Is there any downtime?', a: 'No downtime at all. You can return to your normal activities immediately after each session. We recommend drinking plenty of water after cavitation treatments.' },
  { q: 'How soon will I see results?', a: 'Many clients notice a difference after their first 2–3 sessions. Measurements typically show a reduction of 2–5 cm per treated area over a full course.' },
];

const REVIEWS = [
  { name: 'Rana S.',  text: 'I lost 4 cm from my waist after just 5 cavitation sessions. The staff are professional and the clinic is very clean. Highly recommend!', rating: 5 },
  { name: 'Maya K.',  text: 'The combined slimming package is amazing. My skin is tighter and the cellulite on my thighs has reduced significantly.', rating: 5 },
  { name: 'Lara M.',  text: 'I was sceptical at first but the results speak for themselves. ArtiZone is the best body slimming clinic in Amman.', rating: 5 },
];

function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

export default function BodySlimmingAmmanB() {
  const variant = getVariantWithOverride(TEST_KEY);

  useEffect(() => {
    trackEvent(TEST_KEY, variant, 'impression');
  }, [variant]);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Body Slimming and Contouring in Amman',
    provider: { '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', url: SITE_URL,
      address: { '@type': 'PostalAddress', streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.', addressLocality: 'Amman', addressCountry: 'JO' },
      telephone: '+962790412758',
    },
    description: DESC, url: `${SITE_URL}${SLUG}`, image: OG_IMG,
    areaServed: { '@type': 'City', name: 'Amman' },
    serviceType: 'Body Slimming',
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={`${SITE_URL}/body-slimming-amman`} />
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/body-slimming-amman-b`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/body-slimming-amman-b`} />
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
            src="/airo-assets/images/services/slimming-video"
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Amman, Jordan · Measurable Results</span>
            </motion.div>

            {/* Headline — specific results-led */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' as const }}
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.96)', fontSize: 'clamp(2rem,6vw,5.2rem)', lineHeight: 1.05, fontWeight: 400, marginBottom: '1rem' }}>
              Lose 2–5 cm<br />
              <em style={{ color: G, fontStyle: 'italic' }}>Per Treated Area.</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
              className="text-base sm:text-lg leading-relaxed mb-3 max-w-lg font-medium" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>
              Non-surgical body slimming in Amman with <span style={{ color: G }}>measurable, guaranteed results</span> — no surgery, no downtime.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
              className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              Cavitation, radiofrequency, lymphatic drainage — customised to your body goals by certified specialists.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                Book My Body Consultation
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-5 text-[11px]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
              ★★★★★ "I lost 4 cm from my waist after just 5 sessions" — Rana S., Amman
            </motion.p>
          </div>
        </section>

        {/* ── RESULTS STATS ── */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.10)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {RESULTS_STATS.map(({ stat, label, detail }) => (
                <div key={label} className="text-center">
                  <div style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 500, lineHeight: 1 }}>{stat}</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: FG, fontFamily: 'var(--font-sans)' }}>{label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TREATMENTS ── */}
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Our Treatments</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Targeted Treatments for<br /><em style={{ color: G, fontStyle: 'italic' }}>Every Body Goal</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TREATMENTS.map((t, i) => (
                <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 luxury-card" style={{ background: S1 }}>
                  <div className="w-6 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{t.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{t.desc}</p>
                </motion.div>
              ))}
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
                Results You Can<br /><em style={{ color: G, fontStyle: 'italic' }}>Measure</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <Ruler size={22} style={{ color: G }} />, title: 'Measurable Inch Loss', body: 'We take measurements before and after every course so you can see exactly how many centimetres you have lost. No guesswork — real, trackable results.' },
                { icon: <Timer size={22} style={{ color: G }} />, title: 'Zero Downtime', body: 'All treatments are non-surgical and non-invasive. Walk in, get treated, walk out. No recovery time, no bruising, no disruption to your daily life.' },
                { icon: <Award size={22} style={{ color: G }} />, title: 'Certified Specialists', body: 'Our body contouring specialists are trained in the latest techniques and use medical-grade equipment. Your safety and results are our top priority.' },
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

        {/* ── REVIEWS ── */}
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Real Results</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Clients Who Measured<br /><em style={{ color: G, fontStyle: 'italic' }}>the Difference</em>
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
                Body Slimming FAQ
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Start Your Transformation</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Book Your Free<br /><em style={{ color: G, fontStyle: 'italic' }}>Body Consultation</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Come in for a free consultation. We will take your measurements, assess your target areas, and build a personalised treatment plan — no commitment required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  onClick={() => trackEvent(TEST_KEY, variant, 'booking')}
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
                  Book My Body Consultation
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
        <LandingBlogLinks service="slimming" />

        {/* ── INTERNAL LINKS ── */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore More Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Best Facial Amman',  href: '/best-facial-amman'        },
                { label: "Men's Grooming",     href: '/mens-grooming-amman'      },
                { label: 'All Services',       href: '/services'                 },
                { label: 'Packages',           href: '/packages'                 },
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
