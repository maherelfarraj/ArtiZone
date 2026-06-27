import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Star, ArrowRight, MapPin, Phone, Clock, ChevronDown, Droplets, Sparkles, Shield, Zap, MessageCircle } from 'lucide-react';
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


/* ── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

/* ── SEO ─────────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://artizonespa.com';
const SLUG     = '/hydrafacial-amman';
const TITLE    = 'HydraFacial Amman | Best HydraFacial Treatment in Jordan | ArtiZone';
const DESC     = 'HydraFacial in Amman — deep cleanse, exfoliate, extract & hydrate in one session. Instant glow, zero downtime. Book your HydraFacial at ArtiZone beauty clinic, Amman.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'HydraFacial Treatment Amman',
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
    { '@type': 'Question', name: 'What is HydraFacial and how does it work?', acceptedAnswer: { '@type': 'Answer', text: 'HydraFacial is a patented 3-step treatment that cleanses, exfoliates, and infuses the skin with hydrating serums using a vortex suction device. It removes dead skin, extracts impurities, and delivers antioxidants and hyaluronic acid in one session.' } },
    { '@type': 'Question', name: 'How many HydraFacial sessions do I need?', acceptedAnswer: { '@type': 'Answer', text: 'Most clients see visible results after just one session. For best results, we recommend monthly treatments. A course of 4–6 sessions is ideal for targeting specific concerns like pigmentation or acne.' } },
    { '@type': 'Question', name: 'Is HydraFacial suitable for all skin types?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — HydraFacial is safe for all skin types including sensitive, oily, dry, and combination skin. It is also suitable for men and women of all ages.' } },
    { '@type': 'Question', name: 'Is there any downtime after HydraFacial?', acceptedAnswer: { '@type': 'Answer', text: 'No downtime at all. You can return to work, apply makeup, and go about your day immediately after the treatment. Most clients notice an instant glow.' } },
    { '@type': 'Question', name: 'How much does HydraFacial cost in Amman?', acceptedAnswer: { '@type': 'Answer', text: 'HydraFacial prices at ArtiZone start from 45 JOD for the Signature session. Deluxe and Platinum options with boosters are also available. Contact us for current packages and offers.' } },
  ],
};

/* ── Data ────────────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: Droplets, step: '1', title: 'Cleanse & Peel', desc: 'Gentle exfoliation removes dead skin cells and uncovers a fresh layer of skin.' },
  { icon: Zap,      step: '2', title: 'Extract & Hydrate', desc: 'Painless vortex suction clears pores while nourishing serums are simultaneously delivered.' },
  { icon: Sparkles, step: '3', title: 'Fuse & Protect', desc: 'Antioxidants, peptides, and hyaluronic acid are infused to maximise your glow and protect skin.' },
];

const VARIANTS = [
  { name: 'HydraFacial Signature', duration: '30 min', desc: 'Classic 3-step cleanse, extract & hydrate. Perfect for first-timers and maintenance.', tag: 'Most Popular' },
  { name: 'HydraFacial Deluxe',    duration: '45 min', desc: 'Signature + targeted booster serum (brightening, anti-aging, or acne). Deeper results.', tag: 'Best Value' },
  { name: 'HydraFacial Platinum',  duration: '60 min', desc: 'Full Deluxe + lymphatic drainage + LED light therapy. Our most comprehensive glow treatment.', tag: 'Premium' },
  { name: 'HydraFacial + Peel',    duration: '75 min', desc: 'HydraFacial combined with a light chemical peel for maximum skin renewal and brightness.', tag: 'Advanced' },
];

const BENEFITS = [
  'Instant visible glow after one session',
  'Deep pore cleansing & blackhead extraction',
  'Hydrating hyaluronic acid infusion',
  'Antioxidant & peptide protection',
  'Zero downtime — back to life immediately',
  'Safe for all skin types & tones',
  'Suitable for men and women',
  'Customisable with targeted boosters',
];

const CONCERNS = [
  { concern: 'Dull, tired skin',        solution: 'Signature or Deluxe' },
  { concern: 'Oily skin & large pores', solution: 'Deluxe + Clarifying Booster' },
  { concern: 'Dry & dehydrated skin',   solution: 'Deluxe + Hydrating Booster' },
  { concern: 'Fine lines & aging',      solution: 'Platinum + Anti-Aging Booster' },
  { concern: 'Pigmentation & dark spots', solution: 'Deluxe + Brightening Booster' },
  { concern: 'Acne-prone skin',         solution: 'Deluxe + Clarifying Booster' },
  { concern: 'Pre-event glow',          solution: 'Signature (24h before event)' },
  { concern: 'Sensitive skin',          solution: 'Signature (gentle formula)' },
];

const REVIEWS = [
  { name: 'Rania K.', stars: 5, text: 'I had my first HydraFacial at ArtiZone and my skin looked amazing the same day. No redness, no peeling — just pure glow. I\'m already booked for next month!' },
  { name: 'Lara M.', stars: 5, text: 'Best HydraFacial in Amman, hands down. The staff explained every step and the results lasted weeks. My pores are visibly smaller.' },
  { name: 'Nour S.', stars: 5, text: 'I was nervous about facials because of my sensitive skin but the team at ArtiZone made me feel so comfortable. Zero irritation and my skin has never looked better.' },
];

const FAQS = [
  { q: 'What is HydraFacial and how does it work?', a: 'HydraFacial is a patented 3-step treatment that cleanses, exfoliates, and infuses the skin with hydrating serums using a vortex suction device. It removes dead skin, extracts impurities, and delivers antioxidants and hyaluronic acid in one session.' },
  { q: 'How many sessions do I need?', a: 'Most clients see visible results after just one session. For best results, we recommend monthly treatments. A course of 4–6 sessions is ideal for targeting specific concerns like pigmentation or acne.' },
  { q: 'Is HydraFacial suitable for all skin types?', a: 'Yes — HydraFacial is safe for all skin types including sensitive, oily, dry, and combination skin. It is also suitable for men and women of all ages.' },
  { q: 'Is there any downtime?', a: 'No downtime at all. You can return to work, apply makeup, and go about your day immediately after the treatment. Most clients notice an instant glow.' },
  { q: 'How much does HydraFacial cost in Amman?', a: 'HydraFacial prices at ArtiZone start from 45 JOD for the Signature session. Deluxe and Platinum options with boosters are also available. Contact us for current packages and offers.' },
  { q: 'Can I combine HydraFacial with other treatments?', a: 'Absolutely. HydraFacial pairs beautifully with LED light therapy, microneedling (on separate days), and chemical peels. Our skin specialists will recommend the best combination for your goals.' },
];

/* ── Component ───────────────────────────────────────────────────────────── */
export default function HydraFacialAmmanPage() {
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
        <link rel="alternate" hrefLang="en" href={`https://artizonespa.com/hydrafacial-amman`} />
        <link rel="alternate" hrefLang="x-default" href={`https://artizonespa.com/hydrafacial-amman`} />
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
              <Droplets size={13} /> HydraFacial Amman
            </span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: FG }}>
            HydraFacial in Amman<br />
            <span style={{ color: GOLD }}>Instant Glow. Zero Downtime.</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-4"
            style={{ color: FGDIM }}>
            Amman's most-loved facial treatment — cleanse, extract, and hydrate your skin in one 30-minute session. Walk in dull, walk out glowing.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex items-center justify-center gap-2 mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={GOLD} style={{ color: GOLD }} />)}
            <span className="text-sm font-semibold ml-1" style={{ color: GOLD }}>4.9</span>
            <span className="text-sm" style={{ color: FGDIM }}>· 200+ Google Reviews · Beauty Clinic in Amman</span>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: GOLD, color: NAVY }}>
              Book HydraFacial Now <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20HydraFacial%20in%20Amman"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: '#25D366', color: '#fff' }}>
              <MessageCircle size={15} /> WhatsApp Us
            </a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
            className="flex flex-wrap justify-center gap-6 mt-12 text-xs"
            style={{ color: FGDIM }}>
            <span className="flex items-center gap-1.5"><Clock size={13} style={{ color: GOLD }} /> From 30 minutes</span>
            <span className="flex items-center gap-1.5"><Shield size={13} style={{ color: GOLD }} /> All skin types</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} style={{ color: GOLD }} /> Amman, Jordan</span>
            <span className="flex items-center gap-1.5"><Phone size={13} style={{ color: GOLD }} /> +962 79 041 2758</span>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: IVORY }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              How HydraFacial Works
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: SAGE }}>
              Three powerful steps in one seamless treatment — no needles, no pain, no downtime.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative rounded-2xl p-8 text-center shadow-sm"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `rgba(196,168,130,0.12)` }}>
                  <Icon size={26} style={{ color: GOLD }} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>Step {step}</div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: SAGE }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Treatment Variants ────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Choose Your HydraFacial
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: SAGE }}>
              From a quick lunchtime glow to a full luxury skin experience — we have the right option for you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {VARIANTS.map(({ name, duration, desc, tag }, i) => (
              <motion.div key={name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-2xl p-7 shadow-sm relative overflow-hidden"
                style={{ background: '#fff', border: '1px solid rgba(196,168,130,0.2)' }}>
                <span className="absolute top-5 right-5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
                  {tag}
                </span>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>{name}</h3>
                <p className="text-xs mb-3 flex items-center gap-1" style={{ color: GOLD }}>
                  <Clock size={11} /> {duration}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: SAGE }}>{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="text-center mt-10">
            <p className="text-sm mb-4" style={{ color: SAGE }}>Not sure which is right for you? Our skin specialists will recommend the best option during your free consultation.</p>
            <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20know%20which%20HydraFacial%20is%20best%20for%20my%20skin"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: NAVY, color: '#fff' }}>
              Ask for Free Skin Advice <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: NAVY }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: FG }}>
              Why Choose HydraFacial at ArtiZone?
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: FGDIM }}>
              Amman's trusted aesthetic clinic — certified therapists, medical-grade equipment, and results you can see.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex items-start gap-3 rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,168,130,0.15)' }}>
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                <span className="text-sm leading-snug" style={{ color: FG }}>{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skin Concerns ────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: IVORY }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Which HydraFacial Is Right for Your Skin?
            </h2>
          </motion.div>

          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(196,168,130,0.2)' }}>
            {CONCERNS.map(({ concern, solution }, i) => (
              <motion.div key={concern} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex items-center justify-between px-6 py-4 gap-4"
                style={{ background: i % 2 === 0 ? '#fff' : CREAM, borderBottom: i < CONCERNS.length - 1 ? '1px solid rgba(196,168,130,0.1)' : 'none' }}>
                <span className="text-sm font-medium" style={{ color: NAVY }}>{concern}</span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
                  {solution}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              What Our Clients Say
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
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold" style={{ color: NAVY }}>— {name}</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: IVORY }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              HydraFacial FAQs
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

      {/* ── Location & CTA ───────────────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: FG }}>
              Book Your HydraFacial in Amman Today
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: FGDIM }}>
              Visit ArtiZone Beauty & Aesthetic Clinic — Amman's top-rated skin care clinic. Free skin consultation included with every first visit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
                style={{ background: GOLD, color: NAVY }}>
                Book HydraFacial Now <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20HydraFacial"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90"
                style={{ background: '#25D366', color: '#fff' }}>
                <MessageCircle size={15} /> WhatsApp: +962 79 041 2758
              </a>
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
              { to: '/best-facial-amman',          label: 'Best Facial Amman' },
              { to: '/laser-hair-removal-amman',   label: 'Laser Hair Removal Amman' },
              { to: '/acne-scar-removal-amman',    label: 'Acne Scar Treatment' },
              { to: '/skin-tightening-amman',      label: 'Skin Tightening Amman' },
              { to: '/body-slimming-amman',        label: 'Body Slimming Amman' },
              { to: '/bridal-package-amman',       label: 'Bridal Package Amman' },
              { to: '/services/face-skin-care',    label: 'All Skin Treatments' },
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

      {/* ── STICKY MOBILE BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ background: 'rgba(14,42,58,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(196,168,130,0.20)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch">
          <a href="tel:+962790412758"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ color: 'rgba(253,250,246,0.80)', fontFamily: 'var(--font-sans)' }}>
            <Phone size={15} style={{ color: GOLD }} /> Call
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)' }} />
          <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20a%20HydraFacial%20in%20Amman"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
            <MessageCircle size={15} /> WhatsApp
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)' }} />
          <Link to="/booking"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: GOLD, color: NAVY, fontFamily: 'var(--font-sans)' }}>
            <Sparkles size={13} /> Book Now
          </Link>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
