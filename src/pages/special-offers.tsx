import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import ShareButtons from '@/components/ShareButtons';
import DiscountSignupForm from '@/components/DiscountSignupForm';
import OfferCountdown from '@/components/upsell/OfferCountdown';
import type { } from 'react';
import { Tag, Clock, Sparkles, ArrowRight, Check, Phone } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const GOLD       = '#C4A882'; /* Warm Sand — primary accent            */
const TAUPE      = '#0E2A3A'; /* Ink Navy — dark bg                    */
const CREAM      = '#FDFAF6'; /* Ivory — light surface                 */
const CREAM_DARK = '#F7F3EE'; /* Parchment — section bg                */
const SITE_URL = 'https://artizonespa.com';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

// ─── Eid Special Offers ───────────────────────────────────────────────────────
const eidOffers = [
  {
    title: 'Eid Glow Facial',
    subtitle: 'Face & Skin Care',
    discount: '30% OFF',
    bundlePrice: '42 JD',
    originalPrice: '60 JD',
    description: 'Instant radiance for Eid — a deep cleanse, brightening mask, and hydration boost in one luxurious session.',
    includes: ['Signature ArtiZone Facial', 'Brightening Mask', 'Hydration Boost', 'Skin Consultation'],
    icon: '✦',
  },
  {
    title: 'HydraFacial Special',
    subtitle: 'Face & Skin Care',
    discount: '25% OFF',
    bundlePrice: '56 JD',
    originalPrice: '75 JD',
    description: 'Cleanse, exfoliate, extract and hydrate in one treatment. Perfect for all skin types — zero downtime.',
    includes: ['HydraFacial Treatment', 'Pore Extraction', 'Serum Infusion', 'LED Light Therapy'],
    icon: '◈',
  },
  {
    title: 'Chemical Peel & Brighten',
    subtitle: 'Face & Skin Care',
    discount: '20% OFF',
    bundlePrice: '48 JD',
    originalPrice: '60 JD',
    description: 'Reveal fresh, even-toned skin before Eid. Targets pigmentation, dullness, and uneven texture.',
    includes: ['Chemical Peels', 'Post-Peel Soothing Mask', 'SPF Protection', 'Aftercare Kit'],
    icon: '◇',
  },
  {
    title: 'Carbon Laser Glow',
    subtitle: 'Face & Skin Care',
    discount: '25% OFF',
    bundlePrice: '52 JD',
    originalPrice: '70 JD',
    description: 'The ultimate pre-event treatment. Carbon laser infuses nutrients for an immediate, visible glow — no downtime.',
    includes: ['Carbon Laser Facial', 'Vitamin C Serum', 'Skin Radiance Boost', 'LED Light Therapy'],
    icon: '◉',
  },
  {
    title: 'RF Microneedling Collagen Boost',
    subtitle: 'Face & Skin Care',
    discount: '20% OFF',
    bundlePrice: '64 JD',
    originalPrice: '80 JD',
    description: 'Stimulate collagen, reduce fine lines and scars. A powerful treatment for lasting skin improvement.',
    includes: ['RF Microneedling', 'Growth Factor Serum', 'Soothing Mask', 'Post-Care Guidance'],
    icon: '◆',
  },
  {
    title: 'Laser Skin Rejuvenation',
    subtitle: 'Laser Treatments',
    discount: '25% OFF',
    bundlePrice: '75 JD',
    originalPrice: '100 JD',
    description: 'Target pigmentation, sun damage, and uneven tone with precision laser technology.',
    includes: ['Laser Rejuvenation Session', 'Cooling Treatment', 'Brightening Serum', 'Sun Protection'],
    icon: '◎',
  },
  {
    title: 'Acne & Scar Clear Treatment',
    subtitle: 'Face & Skin Care',
    discount: '20% OFF',
    bundlePrice: '56 JD',
    originalPrice: '70 JD',
    description: 'Targeted treatment for active acne and post-acne scarring. Clear, confident skin for Eid.',
    includes: ['Acne & Scar Care', 'Scar Reduction Therapy', 'Anti-Bacterial Mask', 'Home Care Plan'],
    icon: '✧',
  },
  {
    title: 'Skin Brightening & Glow',
    subtitle: 'Face & Skin Care',
    discount: '25% OFF',
    bundlePrice: '45 JD',
    originalPrice: '60 JD',
    description: 'Achieve a luminous, even complexion with our signature brightening protocol — highly popular in the region.',
    includes: ['24K Gold Facial', 'Vitamin C Infusion', 'Skin Boosters', 'Glow Serum'],
    icon: '✦',
  },
];

const offers = [
  {
    badge: 'Limited Time',
    badgeColor: '#dc2743',
    title: 'Glow Starter Bundle',
    subtitle: 'Face & Skin Care',
    discount: '25% OFF',
    bundlePrice: '45 JD',
    originalPrice: '60 JD',
    savings: 'Save 15 JD',
    validUntil: 'Valid until May 31, 2026',
    description: 'Kickstart your skin journey with our most popular introductory facial package.',
    includes: ['Signature ArtiZone Facial', 'Hydration Boost Mask', 'Skin Analysis & Consultation'],
    featured: false,
  },
  {
    badge: 'Best Value',
    badgeColor: GOLD,
    title: 'Laser Hair Removal — Full Body',
    subtitle: 'Laser Treatments',
    discount: '30% OFF',
    bundlePrice: '175 JD',
    originalPrice: '250 JD',
    savings: 'Save 75 JD',
    validUntil: 'Valid until June 15, 2026',
    description: 'Our most sought-after package — permanent hair reduction for the entire body at an unbeatable price.',
    includes: ['6 Full-Body Sessions', 'Certified Laser Technician', 'Post-Treatment Soothing Care', 'Free Touch-Up Session'],
    featured: true,
  },
  {
    badge: 'New',
    badgeColor: '#5a7cb8',
    title: 'Bridal Glow Package',
    subtitle: 'Bridal Special',
    discount: '20% OFF',
    bundlePrice: '248 JD',
    originalPrice: '310 JD',
    savings: 'Save 62 JD',
    validUntil: 'Valid until July 1, 2026',
    description: 'Look radiant on your special day with our curated bridal beauty experience.',
    includes: ['Bridal Facial & Glow Peel', 'Eyebrow Shaping & Tinting', 'Manicure & Pedicure', 'Bridal Consultation'],
    featured: false,
  },
  {
    badge: 'Flash Sale',
    badgeColor: '#e6683c',
    title: "Men's Grooming Bundle",
    subtitle: "Men's Services",
    discount: '15% OFF',
    bundlePrice: '64 JD',
    originalPrice: '75 JD',
    savings: 'Save 11 JD',
    validUntil: 'Valid until May 25, 2026',
    description: 'A complete grooming session tailored specifically for men — fast, effective, and discreet.',
    includes: ["Gentleman's Deep-Clean Facial", 'Beard Trim & Design', 'Back Treatment'],
    featured: false,
  },
  {
    badge: 'Seasonal',
    badgeColor: '#7c5a8a',
    title: 'Body Slimming Intensive',
    subtitle: 'Body Treatments',
    discount: '20% OFF',
    bundlePrice: '124 JD',
    originalPrice: '155 JD',
    savings: 'Save 31 JD',
    validUntil: 'Valid until June 30, 2026',
    description: 'Sculpt and tone with our advanced body contouring sessions — visible results guaranteed.',
    includes: ['4 Ultrasound Cavitation Sessions', '4 RF Skin Tightening Sessions', 'Detox Body Wraps', 'Progress Measurement'],
    featured: false,
  },
  {
    badge: 'Popular',
    badgeColor: GOLD,
    title: 'Nails & Pampering Day',
    subtitle: 'Nails & Foot Care',
    discount: '10% OFF',
    bundlePrice: '40 JD',
    originalPrice: '45 JD',
    savings: 'Save 5 JD',
    validUntil: 'Valid until May 31, 2026',
    description: 'Treat yourself to a full nail and foot care experience — the perfect self-care afternoon.',
    includes: ['Gel Polish', 'Luxury Spa Pedicure', 'Custom Nail Art (2 nails)'],
    featured: false,
  },
];

// ─── Eid Offers end date ──────────────────────────────────────────────────────
const EID_ENDS = '2026-06-10T23:59:59';

// ─── Parse "Valid until Month DD, YYYY" → ISO string ─────────────────────────
function parseValidUntil(str: string): string {
  const match = str.match(/(\w+ \d+,\s*\d+)/);
  if (!match) return '2026-12-31T23:59:59';
  return new Date(match[1] + ' 23:59:59').toISOString().replace('.000Z', '');
}

// ─── Live countdown unit (ticks every second) ─────────────────────────────────
import { useState, useEffect } from 'react';

function calcTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function LiveUnit({ endsAt, unit }: { endsAt: string; unit: 'days' | 'hours' | 'minutes' | 'seconds' }) {
  const [t, setT] = useState(() => calcTimeLeft(endsAt));
  useEffect(() => {
    const id = setInterval(() => setT(calcTimeLeft(endsAt)), 1_000);
    return () => clearInterval(id);
  }, [endsAt]);
  return <>{String(t[unit]).padStart(2, '0')}</>;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpecialOffersPage() {
  const title = 'Special Offers — ArtiZone Beauty & Aesthetic Clinic Amman';
  const description = 'Exclusive beauty deals and limited-time offers at ArtiZone Amman. Save on facials, laser hair removal, bridal packages, body slimming, and more.';
  const canonicalUrl = `${SITE_URL}/special-offers`;
  const ogImage = `${SITE_URL}/airo-assets/images/pages/home/hero`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ArtiZone Special Offers',
    description,
    url: canonicalUrl,
    numberOfItems: offers.length,
    itemListElement: offers.map((offer, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: offer.title,
        description: offer.description,
        price: offer.bundlePrice.replace(' JD', ''),
        priceCurrency: 'JOD',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'BeautySalon',
          name: 'ArtiZone Beauty & Aesthetic Clinic',
          '@id': SITE_URL,
          url: SITE_URL,
        },
      },
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',           item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Special Offers', item: canonicalUrl },
      ],
    },
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:image"        content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Special beauty offers and deals at ArtiZone Amman" />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="Special beauty offers and deals at ArtiZone Amman" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/special-offers" />
        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/special-offers" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="relative py-16 sm:py-24 overflow-hidden"
          style={{ background: TAUPE }}
        >
          {/* Hero background image */}
          <OptimizedImage
            src="/airo-assets/images/services/booking-cta-video"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            priority
            width={1920} height={600}
          />
          {/* Decorative blobs */}
          <div className="hidden sm:block absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: GOLD }} />
          <div className="hidden sm:block absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: GOLD }} />

          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5" style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}>
                <Tag size={13} /> Limited Time Deals
              </span>
              <h1 className="font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 5vw, 3.5rem)' }}>
                Special Offers
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base mb-6" style={{ color: 'rgba(249,245,240,0.72)' }}>
                Exclusive deals on our most-loved treatments — for a limited time only. Book before the timer runs out.
              </p>

              {/* Global countdown */}
              <div className="inline-flex flex-col items-center gap-2 mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(249,245,240,0.45)' }}>
                  All offers expire in
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { label: 'Days',  val: '02' },
                    { label: 'Hours', val: '23' },
                    { label: 'Mins',  val: '59' },
                    { label: 'Secs',  val: '59' },
                  ].map(({ label, val }, i) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>
                          <LiveUnit endsAt={EID_ENDS} unit={['days','hours','minutes','seconds'][i] as 'days'|'hours'|'minutes'|'seconds'} />
                        </span>
                        <span className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(249,245,240,0.40)' }}>{label}</span>
                      </div>
                      {i < 3 && <span className="text-2xl font-bold mb-4" style={{ color: 'rgba(201,169,110,0.50)' }}>:</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: GOLD, color: TAUPE }}>
                  Book Now <ArrowRight size={14} />
                </Link>
                <a href="tel:+962790412758" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'rgba(201,169,110,0.40)', color: GOLD }}>
                  <Phone size={14} /> Call to Book
                </a>
              </div>

              <div className="flex justify-center">
                <ShareButtons url="https://artizonespa.com/special-offers" title="Exclusive beauty deals at ArtiZone Clinic, Amman — limited time only!" hashtags={['ArtiZone', 'BeautyDeals', 'Amman']} light />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── EID SPECIAL SECTION ──────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: '#0E2A3A' }}>
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(196,168,130,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(196,168,130,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,168,130,0.40), transparent)' }} />
          <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,168,130,0.20), transparent)' }} />
          <div className="absolute -top-32 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#C4A882' }} />
          <div className="absolute -bottom-24 left-0 w-72 h-72 rounded-full opacity-8 blur-3xl pointer-events-none" style={{ background: '#6B7260' }} />

          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Eid header */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12" style={{ background: 'rgba(196,168,130,0.35)' }} />
                <span className="text-2xl">☽</span>
                <div className="h-px w-12" style={{ background: 'rgba(196,168,130,0.35)' }} />
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] mb-4"
                style={{ background: 'rgba(196,168,130,0.18)', color: '#C4A882', border: '1px solid rgba(196,168,130,0.28)' }}>
                <Sparkles size={11} /> Eid Al-Adha 2026
              </span>
              <h2 className="font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.95)', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}>
                Eid Mubarak — <em style={{ color: '#C4A882', fontStyle: 'italic' }}>Glow Up</em> for the Celebration
              </h2>
              <p className="max-w-xl mx-auto text-sm" style={{ color: 'rgba(253,250,246,0.72)', fontFamily: 'var(--font-sans)' }}>
                Look and feel your absolute best this Eid. All 8 face & skin treatments available at exclusive Eid prices — for a limited time only.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ background: 'rgba(220,39,67,0.15)', color: '#ff6b7a', border: '1px solid rgba(220,39,67,0.25)', fontFamily: 'var(--font-sans)' }}>
                <Clock size={10} /> Limited Time — Book Before Eid
              </div>
            </motion.div>

            {/* Eid offers grid — 1 col on small phones, 2 col on 390px+, 4 col on lg */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {eidOffers.map((offer, i) => (
                <motion.div
                  key={offer.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col relative group"
                  style={{ background: 'rgba(44,26,14,0.85)', border: '1px solid rgba(196,168,130,0.25)' }}
                >
                  {/* Discount badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                    style={{ background: 'linear-gradient(135deg, #C4A882, #6B7260)', color: '#FDFAF6', fontFamily: 'var(--font-sans)' }}>
                    {offer.discount}
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Icon + subtitle */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base" style={{ color: '#C4A882' }}>{offer.icon}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgba(196,168,130,0.65)', fontFamily: 'var(--font-sans)' }}>{offer.subtitle}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.92)', fontSize: '1.05rem' }}>
                      {offer.title}
                    </h3>

                    {/* Description — hidden on xs to keep cards compact */}
                    <p className="hidden sm:block text-xs leading-relaxed mb-3 flex-1" style={{ color: 'rgba(253,250,246,0.70)', fontFamily: 'var(--font-sans)' }}>
                      {offer.description}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#C4A882' }}>
                        {offer.bundlePrice}
                      </span>
                      <span className="text-sm line-through" style={{ color: 'rgba(253,250,246,0.35)' }}>
                        {offer.originalPrice}
                      </span>
                    </div>

                    {/* Includes */}
                    <ul className="space-y-1.5 mb-4">
                      {offer.includes.map(item => (
                        <li key={item} className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(253,250,246,0.75)', fontFamily: 'var(--font-sans)' }}>
                          <Check size={10} className="mt-0.5 shrink-0" style={{ color: '#C4A882' }} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Countdown */}
                    <div className="mb-4 pt-3" style={{ borderTop: '1px solid rgba(196,168,130,0.18)' }}>
                      <OfferCountdown endsAt={EID_ENDS} label="Offer ends in" dark />
                    </div>

                    {/* Book Now CTA */}
                    <Link
                      to="/booking"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: 'rgba(196,168,130,0.25)', color: '#C4A882', border: '1px solid rgba(196,168,130,0.35)' }}
                    >
                      Book Now <ArrowRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-10">
              <p className="text-xs mb-4" style={{ color: 'rgba(253,250,246,0.65)', fontFamily: 'var(--font-sans)' }}>
                All Eid offers valid for a limited time. Call or book online to secure your appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── DISCOUNT SIGNUP FORM ─────────────────────────────────────────── */}
        <section id="discount-signup" className="py-16 sm:py-20 scroll-mt-20" style={{ background: '#0a2030' }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

              {/* Left — copy */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.20em] mb-5"
                  style={{ background: 'rgba(196,168,130,0.18)', color: '#C4A882', border: '1px solid rgba(196,168,130,0.28)', fontFamily: 'var(--font-sans)' }}>
                  <Tag size={10} /> Members Only
                </span>
                <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(253,250,246,0.95)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400 }}>
                  Get <em style={{ color: '#C4A882', fontStyle: 'italic' }}>10% Off</em><br />Every Service
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(253,250,246,0.72)', fontFamily: 'var(--font-sans)' }}>
                  Sign up once and receive a personal discount code valid on all ArtiZone treatments — facials, laser, nails, body slimming, and men's grooming.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    'Unique code generated just for you',
                    'Sent instantly to your email',
                    'Valid on all services — no exclusions',
                    'One code per client',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(253,250,246,0.60)', fontFamily: 'var(--font-sans)' }}>
                      <Check size={13} style={{ color: '#C4A882', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Right — form */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                <DiscountSignupForm />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── OFFERS GRID ──────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section label */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
                Current Promotions
              </p>
              <h2
                className="font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
              >
                This Month's Best Deals
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: offer.featured ? TAUPE : '#fff',
                    border: offer.featured ? `2px solid ${GOLD}` : '1.5px solid rgba(44,26,14,0.09)',
                    boxShadow: offer.featured
                      ? `0 8px 40px rgba(201,169,110,0.18)`
                      : '0 2px 16px rgba(61,46,38,0.06)',
                  }}
                >
                  {/* Featured ribbon */}
                  {offer.featured && (
                    <div
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: GOLD, color: '#fff' }}
                    >
                      <Sparkles size={11} />
                      Featured
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    {/* Badge + subtitle */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: `${offer.badgeColor}22`, color: offer.badgeColor }}
                      >
                        {offer.badge}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: offer.featured ? 'rgba(249,245,240,0.55)' : 'hsl(20 15% 55%)' }}
                      >
                        {offer.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold mb-2 leading-snug"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: offer.featured ? '#fff' : TAUPE,
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                      }}
                    >
                      {offer.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ color: offer.featured ? 'rgba(249,245,240,0.68)' : 'hsl(20 15% 45%)' }}
                    >
                      {offer.description}
                    </p>

                    {/* Includes */}
                    <ul className="space-y-2 mb-6">
                      {offer.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <Check
                            size={15}
                            className="mt-0.5 shrink-0"
                            style={{ color: GOLD }}
                          />
                          <span style={{ color: offer.featured ? 'rgba(249,245,240,0.8)' : 'hsl(20 15% 38%)' }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Pricing block */}
                    <div
                      className="flex items-center justify-between py-4 mb-2"
                      style={{ borderTop: `1px solid ${offer.featured ? 'rgba(196,168,130,0.25)' : 'rgba(44,26,14,0.08)'}` }}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: offer.featured ? '#C4A882' : TAUPE }}>
                          {offer.bundlePrice}
                        </span>
                        <span className="text-sm line-through" style={{ color: offer.featured ? 'rgba(249,245,240,0.30)' : 'hsl(20 15% 65%)' }}>
                          {offer.originalPrice}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: offer.featured ? 'rgba(180,175,83,0.20)' : 'rgba(112,109,73,0.10)', color: offer.featured ? '#b4af53' : '#706d49' }}
                      >
                        <Sparkles size={10} /> {offer.savings}
                      </span>
                    </div>

                    {/* Validity */}
                    <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: offer.featured ? 'rgba(249,245,240,0.45)' : 'hsl(20 15% 55%)' }}>
                      <Clock size={12} />
                      {offer.validUntil}
                    </div>

                    {/* Countdown */}
                    <div className="mb-5 pb-4" style={{ borderBottom: `1px solid ${offer.featured ? 'rgba(201,169,110,0.15)' : 'rgba(44,26,14,0.07)'}` }}>
                      <OfferCountdown endsAt={parseValidUntil(offer.validUntil)} label="Ends in" dark={offer.featured} />
                    </div>

                    {/* Book Now CTA */}
                    <div className="flex gap-2">
                      <Link
                        to="/booking"
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: offer.featured ? '#C4A882' : '#706d49', color: offer.featured ? TAUPE : '#f5f3ee' }}
                      >
                        Book Now <ArrowRight size={13} />
                      </Link>
                      <a
                        href="tel:+962790412758"
                        className="flex items-center justify-center px-3 py-3 rounded-xl transition-all hover:opacity-80"
                        style={{ background: offer.featured ? 'rgba(201,169,110,0.15)' : 'rgba(61,46,38,0.06)', color: offer.featured ? '#C4A882' : TAUPE, border: `1px solid ${offer.featured ? 'rgba(201,169,110,0.25)' : 'rgba(61,46,38,0.12)'}` }}
                        title="Call to book"
                      >
                        <Phone size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TERMS BANNER ─────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs sm:text-sm max-w-2xl mx-auto" style={{ color: 'hsl(20 15% 50%)' }}>
                * All offers are valid for the stated period and subject to availability. Offers cannot be combined with other promotions.
                To book, call us or visit the clinic. Prices are in Jordanian Dinar (JD).
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24" style={{ background: TAUPE }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <Sparkles size={32} className="mx-auto mb-4" style={{ color: GOLD }} />
              <h2
                className="font-bold text-white mb-3"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
              >
                Don't Miss Out
              </h2>
              <p className="text-sm sm:text-base mb-8" style={{ color: 'rgba(249,245,240,0.68)' }}>
                Offers are limited and sell out fast. Book your spot today or explore our full range of treatments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:opacity-80 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                  style={{ borderColor: 'rgba(196,168,130,0.5)', color: GOLD }}
                >
                  View All Services
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
