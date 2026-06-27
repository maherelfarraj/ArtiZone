/**
 * /offers-deals — Landing page for all current deals & promotions
 * SEO-optimised, full OG tags, FAQPage JSON-LD
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useState, useEffect } from 'react';
import {
  Tag, Clock, ArrowRight, Check, Phone, Sparkles, ChevronDown, ChevronUp,
} from 'lucide-react';

import type { } from 'react';
import { GBP_PROVIDER_REF } from '@/lib/gbp-schema';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const TAUPE   = '#0E2A3A'; /* Ink Navy                              */
const GOLD    = '#C4A882'; /* Warm Sand — accent                    */
const OLIVE   = '#6B7260'; /* Sage Stone                            */
const YELLOW  = '#C4A882'; /* Warm Sand                             */
const CREAM   = '#FDFAF6'; /* Ivory                                 */
const CREAM_D = '#F7F3EE'; /* Parchment                             */
const SITE_URL = 'https://artizonespa.com';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: 'easeOut' as const },
  }),
};

// ─── Live countdown ───────────────────────────────────────────────────────────
function calcLeft(endsAt: string) {
  const d = new Date(endsAt).getTime() - Date.now();
  if (d <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  return {
    d: Math.floor(d / 86_400_000),
    h: Math.floor((d % 86_400_000) / 3_600_000),
    m: Math.floor((d % 3_600_000) / 60_000),
    s: Math.floor((d % 60_000) / 1_000),
    expired: false,
  };
}
function Countdown({ endsAt, dark = false }: { endsAt: string; dark?: boolean }) {
  const [t, setT] = useState(() => calcLeft(endsAt));
  useEffect(() => {
    const id = setInterval(() => setT(calcLeft(endsAt)), 1_000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (t.expired) return <span className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'hsl(20 15% 55%)' }}>Offer ended</span>;
  const units = [{ v: t.d, l: 'd' }, { v: t.h, l: 'h' }, { v: t.m, l: 'm' }, { v: t.s, l: 's' }];
  return (
    <div className="flex items-center gap-1.5">
      <Clock size={11} style={{ color: dark ? YELLOW : OLIVE }} />
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? YELLOW : OLIVE }}>Ends in:</span>
      {units.map(({ v, l }, i) => (
        <span key={l} className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold tabular-nums" style={{ color: dark ? '#fff' : TAUPE }}>{String(v).padStart(2, '0')}</span>
          <span className="text-[10px]" style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'hsl(20 15% 55%)' }}>{l}</span>
          {i < 3 && <span className="text-xs font-bold mx-0.5" style={{ color: dark ? 'rgba(180,175,83,0.6)' : YELLOW }}>:</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Offer data ───────────────────────────────────────────────────────────────
const DEALS = [
  {
    tag: 'Eid Special', tagColor: GOLD, featured: true,
    title: 'Eid Glow Facial', subtitle: 'Face & Skin Care',
    bundlePrice: '42 JD', originalPrice: '60 JD', savings: 'Save 18 JD', discount: '30% OFF',
    endsAt: '2026-06-10T23:59:59',
    desc: 'Instant radiance for Eid — deep cleanse, brightening mask, and hydration boost.',
    includes: ['Signature ArtiZone Facial', 'Brightening Mask', 'Hydration Boost', 'Skin Consultation'],
    image: '/airo-assets/images/services/face-skin-care',
  },
  {
    tag: 'Best Value', tagColor: '#C4A882', featured: false,
    title: 'Laser Hair Removal — Full Body', subtitle: 'Laser Treatments',
    bundlePrice: '175 JD', originalPrice: '250 JD', savings: 'Save 75 JD', discount: '30% OFF',
    endsAt: '2026-06-15T23:59:59',
    desc: 'Permanent hair reduction for the entire body — 6 sessions with certified laser technicians.',
    includes: ['6 Full-Body Sessions', 'Certified Laser Technician', 'Post-Treatment Care', 'Free Touch-Up'],
    image: '/airo-assets/images/services/laser-hair-removal',
  },
  {
    tag: 'Bridal', tagColor: '#C4A882', featured: false,
    title: 'Bridal Glow Package', subtitle: 'Bridal Special',
    bundlePrice: '248 JD', originalPrice: '310 JD', savings: 'Save 62 JD', discount: '20% OFF',
    endsAt: '2026-07-01T23:59:59',
    desc: 'Complete bridal beauty — facial, brows, nails, and a full consultation for your big day.',
    includes: ['Bridal Facial & Glow Peel', 'Eyebrow Shaping & Tinting', 'Manicure & Pedicure', 'Bridal Consultation'],
    image: '/airo-assets/images/services/nails-foot-care',
  },
  {
    tag: 'Flash Sale', tagColor: '#dc2743', featured: false,
    title: 'Glow Starter Bundle', subtitle: 'Face & Skin Care',
    bundlePrice: '45 JD', originalPrice: '60 JD', savings: 'Save 15 JD', discount: '25% OFF',
    endsAt: '2026-05-31T23:59:59',
    desc: 'Kickstart your skin journey with our most popular introductory facial package.',
    includes: ['Signature ArtiZone Facial', 'Hydration Boost Mask', 'Skin Analysis & Consultation'],
    image: '/airo-assets/images/services/face-skin-care',
  },
  {
    tag: "Men's", tagColor: '#0E2A3A', featured: false,
    title: "Men's Grooming Bundle", subtitle: "Men's Services",
    bundlePrice: '64 JD', originalPrice: '75 JD', savings: 'Save 11 JD', discount: '15% OFF',
    endsAt: '2026-05-25T23:59:59',
    desc: 'A complete grooming session tailored for men — fast, effective, and discreet.',
    includes: ["Gentleman's Deep-Clean Facial", 'Beard Trim & Design', 'Back Treatment'],
    image: '/airo-assets/images/services/mens-grooming',
  },
  {
    tag: 'Seasonal', tagColor: '#7c5a8a', featured: false,
    title: 'Body Slimming Intensive', subtitle: 'Body Treatments',
    bundlePrice: '124 JD', originalPrice: '155 JD', savings: 'Save 31 JD', discount: '20% OFF',
    endsAt: '2026-06-30T23:59:59',
    desc: 'Sculpt and tone with advanced body contouring — visible results guaranteed.',
    includes: ['4 Ultrasound Cavitation Sessions', '4 RF Skin Tightening Sessions', 'Detox Body Wraps', 'Progress Measurement'],
    image: '/airo-assets/images/services/body-slimming',
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How do I claim a special offer?', a: 'Simply call us on +962 790 412 758 or book online via our booking page. Mention the offer name when booking and our team will apply the discount.' },
  { q: 'Can I combine multiple offers?', a: 'Offers cannot be combined with each other or with other promotions unless explicitly stated. Each offer is valid as a standalone booking.' },
  { q: 'Are the offers available for both women and men?', a: 'Yes — all offers are available for both women and men unless the offer is specifically labelled for one gender (e.g. Bridal or Men\'s Grooming).' },
  { q: 'What happens if an offer expires before I book?', a: 'Offers are time-limited and subject to availability. We recommend booking as soon as possible to secure your slot. New offers are added regularly.' },
  { q: 'Do you have a loyalty program?', a: 'Yes! We reward our regular clients with exclusive offers and perks. Ask our team about current promotions when you visit.' },
];

export default function OffersDealsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const title = 'Special Offers & Beauty Deals in Amman | ArtiZone Clinic';
  const description = 'Exclusive beauty deals at ArtiZone Amman — up to 30% off facials, laser hair removal, body slimming, nails, and more. Limited time offers. Book now.';
  const canonical = `${SITE_URL}/offers-deals`;
  const ogImage = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const businessLd = {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: 'ArtiZone Special Offers & Beauty Deals',
    text: description,
    url: canonical,
    datePosted: '2026-05-28',
    expires: '2026-12-31',
    announcementLocation: GBP_PROVIDER_REF,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',          item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Offers & Deals', item: canonical },
      ],
    },
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:image"        content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Special beauty offers and deals at ArtiZone Amman" />
        <meta property="og:url"          content={canonical} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="Special beauty offers and deals at ArtiZone Amman" />
        <link rel="alternate" hrefLang="en" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(businessLd)}</script>
      </Helmet>

      <div style={{ background: CREAM }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: TAUPE }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: GOLD }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ background: GOLD }} />
          </div>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5" style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}>
                <Tag size={12} /> Limited Time Deals
              </span>
              <h1 className="font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5.5vw,4rem)' }}>
                Exclusive Offers &<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>Beauty Deals</em>
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base mb-8" style={{ color: 'rgba(249,245,240,0.72)' }}>
                Save up to 30% on premium treatments at ArtiZone Amman. From facials and laser to nails and body slimming — book before the timer runs out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: GOLD, color: TAUPE }}>
                  Book Now <ArrowRight size={14} />
                </Link>
                <a href="tel:+962790412758" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'rgba(201,169,110,0.40)', color: GOLD }}>
                  <Phone size={14} /> +962 790 412 758
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: OLIVE }}>Current Promotions</p>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                This Month's Best Deals
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEALS.map((deal, i) => (
                <motion.div
                  key={deal.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: deal.featured ? TAUPE : '#fff',
                    border: deal.featured ? `2px solid ${GOLD}` : '1.5px solid rgba(44,26,14,0.09)',
                    boxShadow: deal.featured ? `0 8px 40px rgba(201,169,110,0.18)` : '0 2px 16px rgba(61,46,38,0.06)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={deal.image} alt={`${deal.title} — special offer at ArtiZone beauty clinic Amman`} className="w-full h-full object-cover" loading="lazy" decoding="async" width={600} height={176} />
                    <div className="absolute inset-0" style={{ background: deal.featured ? 'rgba(61,46,38,0.45)' : 'rgba(61,46,38,0.25)' }} />
                    {/* Discount badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: deal.tagColor, color: '#fff' }}>
                      {deal.discount}
                    </div>
                    {/* Tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                      {deal.tag}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: deal.featured ? 'rgba(249,245,240,0.50)' : 'hsl(20 15% 55%)' }}>
                      {deal.subtitle}
                    </p>
                    <h3 className="font-bold mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: deal.featured ? '#fff' : TAUPE, fontSize: '1.1rem' }}>
                      {deal.title}
                    </h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: deal.featured ? 'rgba(249,245,240,0.65)' : 'hsl(20 15% 45%)' }}>
                      {deal.desc}
                    </p>

                    {/* Includes */}
                    <ul className="space-y-1.5 mb-5">
                      {deal.includes.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs">
                          <Check size={12} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                          <span style={{ color: deal.featured ? 'rgba(249,245,240,0.78)' : 'hsl(20 15% 38%)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex-1" />

                    {/* Pricing */}
                    <div className="flex items-center justify-between py-3 mb-3" style={{ borderTop: `1px solid ${deal.featured ? 'rgba(201,169,110,0.20)' : 'rgba(44,26,14,0.08)'}` }}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: deal.featured ? GOLD : TAUPE }}>{deal.bundlePrice}</span>
                        <span className="text-sm line-through" style={{ color: deal.featured ? 'rgba(249,245,240,0.30)' : 'hsl(20 15% 65%)' }}>{deal.originalPrice}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: deal.featured ? 'rgba(180,175,83,0.18)' : 'rgba(112,109,73,0.10)', color: deal.featured ? YELLOW : OLIVE }}>
                        {deal.savings}
                      </span>
                    </div>

                    {/* Countdown */}
                    <div className="mb-4">
                      <Countdown endsAt={deal.endsAt} dark={deal.featured} />
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Link to="/booking" className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: deal.featured ? GOLD : OLIVE, color: deal.featured ? TAUPE : CREAM }}>
                        Book Now <ArrowRight size={13} />
                      </Link>
                      <a href="tel:+962790412758" className="flex items-center justify-center px-3 py-3 rounded-xl transition-all hover:opacity-80" style={{ background: deal.featured ? 'rgba(201,169,110,0.15)' : 'rgba(61,46,38,0.06)', color: deal.featured ? GOLD : TAUPE, border: `1px solid ${deal.featured ? 'rgba(201,169,110,0.25)' : 'rgba(61,46,38,0.12)'}` }} title="Call to book">
                        <Phone size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24" style={{ background: CREAM_D }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.5rem,3.5vw,2.4rem)' }}>
                Frequently Asked Questions
              </h2>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(44,26,14,0.08)' }}>
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-semibold" style={{ color: TAUPE }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} style={{ color: OLIVE, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: OLIVE, flexShrink: 0 }} />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'hsl(20 15% 42%)' }}>
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 text-center" style={{ background: TAUPE }}>
          <div className="max-w-xl mx-auto px-5">
            <Sparkles size={32} className="mx-auto mb-4" style={{ color: GOLD }} />
            <h2 className="font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,4vw,2.5rem)' }}>
              Don't Miss Out
            </h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(249,245,240,0.65)' }}>
              Offers are limited and sell out fast. Book your spot today or call us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: GOLD, color: TAUPE }}>
                Book Now <ArrowRight size={14} />
              </Link>
              <Link to="/special-offers" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'rgba(201,169,110,0.40)', color: GOLD }}>
                View All Offers <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
