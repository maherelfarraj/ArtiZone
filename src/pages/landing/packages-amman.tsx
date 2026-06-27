/**
 * /packages-amman — Landing page for all treatment packages in Amman
 * SEO-optimised, full OG tags, FAQPage JSON-LD
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useState } from 'react';
import { ArrowRight, Check, Phone, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { } from 'react';
import { GBP_PROVIDER_REF } from '@/lib/gbp-schema';


// ─── Brand tokens ─────────────────────────────────────────────────────────────
const TAUPE   = '#0E2A3A'; /* Ink Navy                              */
const GOLD    = '#C4A882'; /* Warm Sand — accent                    */
const OLIVE   = '#6B7260'; /* Sage Stone                            */
const YELLOW  = '#C4A882'; /* Warm Sand                             */
const TEAL    = '#C4A882'; /* alias                                 */
const TERRA   = '#C4A882'; /* alias                                 */
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

// ─── Package data ─────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    tag: 'Most Popular', tagColor: GOLD, featured: true,
    icon: '✦', name: 'Radiance Skin Package', subtitle: 'Complete skin transformation',
    bundlePrice: '185 JD', originalPrice: '260 JD', savings: 'Save 75 JD', discount: '29% OFF',
    video: '/airo-assets/images/services/facial-video',
    desc: 'Our most-booked skin package — visible results from session one. Targets acne, pigmentation, dullness, and aging.',
    includes: ['Signature ArtiZone Facial', 'Chemical Peels', 'RF Microneedling', 'Anti-Aging Collagen Lift', 'LED Light Therapy'],
    color: GOLD,
  },
  {
    tag: 'Best Value', tagColor: TEAL, featured: false,
    icon: '◈', name: 'Laser Smooth Package', subtitle: 'Full-body laser coverage',
    bundlePrice: '245 JD', originalPrice: '350 JD', savings: 'Save 105 JD', discount: '30% OFF',
    video: '/airo-assets/images/services/laser-video',
    desc: 'Permanent hair reduction for the entire body — 6 sessions with certified laser technicians and a free touch-up.',
    includes: ['Full Legs Laser (6 sessions)', 'Full Arms Laser', 'Underarms Laser', 'Bikini / Brazilian Laser', 'Upper Lip & Chin Laser'],
    color: TEAL,
  },
  {
    tag: 'Bridal', tagColor: TERRA, featured: false,
    icon: '◉', name: 'Bridal Glow Package', subtitle: 'Everything for your big day',
    bundlePrice: '375 JD', originalPrice: '500 JD', savings: 'Save 125 JD', discount: '25% OFF',
    video: '/airo-assets/images/services/nails-video',
    desc: 'Complete bridal beauty — from skin prep to nails and makeup. Look radiant on your most important day.',
    includes: ['Full Body Laser', 'Bridal Facial Series (3 sessions)', 'Nails, Hair & Makeup', 'Body Scrub & Polish', 'Bridal Consultation'],
    color: TERRA,
  },
  {
    tag: "Men's", tagColor: OLIVE, featured: false,
    icon: '◆', name: "Men's Complete Grooming", subtitle: 'Full grooming experience',
    bundlePrice: '120 JD', originalPrice: '160 JD', savings: 'Save 40 JD', discount: '25% OFF',
    video: '/airo-assets/images/services/mens-video',
    desc: 'A complete men\'s grooming package — skin, beard, laser, and body care in one comprehensive bundle.',
    includes: ["Gentleman's Deep-Clean Facial (3 sessions)", 'Beard Trim & Design', 'Back & Shoulders Laser', 'Detox Body Wraps'],
    color: '#0E2A3A',
  },
  {
    tag: 'Body', tagColor: '#7c5a8a', featured: false,
    icon: '◇', name: 'Body Sculpt Intensive', subtitle: 'Visible contouring results',
    bundlePrice: '195 JD', originalPrice: '260 JD', savings: 'Save 65 JD', discount: '25% OFF',
    video: '/airo-assets/images/services/slimming-video',
    desc: 'Advanced body contouring with cavitation, radiofrequency, and body wrap — visible results guaranteed.',
    includes: ['6 Ultrasound Cavitation Sessions', '6 RF Skin Tightening Sessions', 'Detox Body Wraps (2x)', 'Progress Measurement', 'Aftercare Plan'],
    color: '#7c5a8a',
  },
  {
    tag: 'Nails', tagColor: TERRA, featured: false,
    icon: '◈', name: 'Nails & Pampering Bundle', subtitle: 'Full nail & foot experience',
    bundlePrice: '75 JD', originalPrice: '95 JD', savings: 'Save 20 JD', discount: '21% OFF',
    video: '/airo-assets/images/services/nails-video',
    desc: 'A luxurious nail and foot care bundle — gel manicure, pedicure, foot scrub, and nail art included.',
    includes: ['Gel Manicure', 'Pedicure & Foot Scrub', 'Nail Art (full set)', 'Paraffin Hand Treatment'],
    color: TERRA,
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How do I book a package?', a: 'Call us on +962 790 412 758 or book online via our booking page. Mention the package name and our team will arrange everything for you.' },
  { q: 'Can I split package sessions across multiple visits?', a: 'Yes — all multi-session packages can be split across as many visits as you need. Sessions are valid for 12 months from the date of purchase.' },
  { q: 'Are packages available for both women and men?', a: 'Yes — most packages are available for both. The Men\'s Complete Grooming package is specifically designed for male clients.' },
  { q: 'Can I customise a package?', a: 'Absolutely. Contact us and our team will create a bespoke package tailored to your specific needs and budget.' },
  { q: 'Do packages include a consultation?', a: 'Yes — all packages include a complimentary skin or treatment consultation before your first session.' },
  { q: 'What is the cancellation policy for packages?', a: 'Sessions can be rescheduled with 24 hours notice. Please contact us as soon as possible if you need to change your appointment.' },
];

export default function PackagesAmmanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'skin' | 'laser' | 'body' | 'nails' | 'mens'>('all');

  const title = 'Beauty Treatment Packages in Amman | ArtiZone Clinic — Save up to 30%';
  const description = 'Premium beauty packages at ArtiZone Amman — Radiance Skin, Laser Smooth, Bridal Glow, Body Sculpt, and more. Bundle and save up to 30% on top treatments.';
  const canonical = `${SITE_URL}/packages-amman`;
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

  const offerCatalogLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'ArtiZone Beauty Treatment Packages — Amman',
    description,
    url: canonical,
    provider: GBP_PROVIDER_REF,
    numberOfItems: PACKAGES.length,
    itemListElement: PACKAGES.map((pkg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: pkg.name,
        description: pkg.desc,
        price: pkg.bundlePrice.replace(' JD', ''),
        priceCurrency: 'JOD',
        availability: 'https://schema.org/InStock',
        seller: GBP_PROVIDER_REF,
      },
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Packages', item: canonical },
      ],
    },
  };

  const TABS = [
    { id: 'all', label: 'All Packages' },
    { id: 'skin', label: 'Skin' },
    { id: 'laser', label: 'Laser' },
    { id: 'body', label: 'Body' },
    { id: 'nails', label: 'Nails' },
    { id: 'mens', label: "Men's" },
  ] as const;

  const filtered = activeTab === 'all' ? PACKAGES : PACKAGES.filter(p => {
    if (activeTab === 'skin')  return p.name.toLowerCase().includes('skin') || p.name.toLowerCase().includes('radiance');
    if (activeTab === 'laser') return p.name.toLowerCase().includes('laser');
    if (activeTab === 'body')  return p.name.toLowerCase().includes('body') || p.name.toLowerCase().includes('sculpt');
    if (activeTab === 'nails') return p.name.toLowerCase().includes('nail');
    if (activeTab === 'mens')  return p.name.toLowerCase().includes("men");
    return true;
  });

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
        <meta property="og:image:alt"    content="Beauty treatment packages at ArtiZone Amman — save up to 30%" />
        <meta property="og:url"          content={canonical} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:image:alt"   content="Beauty treatment packages at ArtiZone Amman — save up to 30%" />
        <link rel="alternate" hrefLang="en" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(offerCatalogLd)}</script>
      </Helmet>

      <div style={{ background: CREAM }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: TAUPE }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: GOLD }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ background: TEAL }} />
          </div>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5" style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}>
                <Sparkles size={12} /> Bundle & Save
              </span>
              <h1 className="font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5.5vw,4rem)' }}>
                Treatment Packages<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>in Amman</em>
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base mb-8" style={{ color: 'rgba(249,245,240,0.72)' }}>
                Curated beauty bundles at ArtiZone — save up to 30% when you combine treatments. Skin, laser, body, nails, bridal, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: GOLD, color: TAUPE }}>
                  Book a Package <ArrowRight size={14} />
                </Link>
                <a href="tel:+962790412758" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'rgba(201,169,110,0.40)', color: GOLD }}>
                  <Phone size={14} /> +962 790 412 758
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
        <section className="py-6" style={{ background: OLIVE }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { num: '6', label: 'Package Categories' },
                { num: 'Up to 30%', label: 'Savings on Bundles' },
                { num: '12 Months', label: 'Session Validity' },
                { num: 'Free', label: 'Consultation Included' },
              ].map((s, i) => (
                <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <p className="font-bold text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>{s.num}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(249,245,240,0.60)' }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PACKAGES GRID ─────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: OLIVE }}>Curated Bundles</p>
              <h2 className="font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                All Packages
              </h2>
              {/* Category tabs */}
              <div className="flex flex-wrap justify-center gap-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: activeTab === tab.id ? OLIVE : 'rgba(112,109,73,0.10)',
                      color: activeTab === tab.id ? CREAM : OLIVE,
                      border: `1.5px solid ${activeTab === tab.id ? OLIVE : 'rgba(112,109,73,0.20)'}`,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: pkg.featured ? TAUPE : '#fff',
                    border: pkg.featured ? `2px solid ${GOLD}` : '1.5px solid rgba(44,26,14,0.09)',
                    boxShadow: pkg.featured ? `0 8px 40px rgba(201,169,110,0.18)` : '0 2px 16px rgba(61,46,38,0.06)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.video} alt={`${pkg.name} — treatment package at ArtiZone beauty clinic Amman`} loading="lazy" decoding="async" className="w-full h-full object-cover" width={600} height={192} />
                    <div className="absolute inset-0" style={{ background: 'rgba(61,46,38,0.38)' }} />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: pkg.tagColor, color: '#fff' }}>
                      {pkg.discount}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                      {pkg.tag}
                    </div>
                    <div className="absolute bottom-3 left-3 text-2xl" style={{ color: pkg.featured ? GOLD : '#fff' }}>{pkg.icon}</div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: pkg.featured ? 'rgba(249,245,240,0.50)' : 'hsl(20 15% 55%)' }}>
                      {pkg.subtitle}
                    </p>
                    <h3 className="font-bold mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: pkg.featured ? '#fff' : TAUPE, fontSize: '1.1rem' }}>
                      {pkg.name}
                    </h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: pkg.featured ? 'rgba(249,245,240,0.65)' : 'hsl(20 15% 45%)' }}>
                      {pkg.desc}
                    </p>

                    {/* Includes */}
                    <ul className="space-y-1.5 mb-5">
                      {pkg.includes.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs">
                          <Check size={12} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                          <span style={{ color: pkg.featured ? 'rgba(249,245,240,0.78)' : 'hsl(20 15% 38%)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex-1" />

                    {/* Pricing */}
                    <div className="flex items-center justify-between py-3 mb-4" style={{ borderTop: `1px solid ${pkg.featured ? 'rgba(201,169,110,0.20)' : 'rgba(44,26,14,0.08)'}` }}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: pkg.featured ? GOLD : TAUPE }}>{pkg.bundlePrice}</span>
                        <span className="text-sm line-through" style={{ color: pkg.featured ? 'rgba(249,245,240,0.30)' : 'hsl(20 15% 65%)' }}>{pkg.originalPrice}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: pkg.featured ? 'rgba(180,175,83,0.18)' : 'rgba(112,109,73,0.10)', color: pkg.featured ? YELLOW : OLIVE }}>
                        {pkg.savings}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Link to="/booking" className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: pkg.featured ? GOLD : OLIVE, color: pkg.featured ? TAUPE : CREAM }}>
                        Book This Package <ArrowRight size={13} />
                      </Link>
                      <a href="tel:+962790412758" className="flex items-center justify-center px-3 py-3 rounded-xl transition-all hover:opacity-80" style={{ background: pkg.featured ? 'rgba(201,169,110,0.15)' : 'rgba(61,46,38,0.06)', color: pkg.featured ? GOLD : TAUPE, border: `1px solid ${pkg.featured ? 'rgba(201,169,110,0.25)' : 'rgba(61,46,38,0.12)'}` }} title="Call to book">
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
                Package FAQs
              </h2>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(44,26,14,0.08)' }}>
                  <button className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-sm font-semibold" style={{ color: TAUPE }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} style={{ color: OLIVE, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: OLIVE, flexShrink: 0 }} />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'hsl(20 15% 42%)' }}>{faq.a}</div>
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
              Ready to Bundle & Save?
            </h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(249,245,240,0.65)' }}>
              Book your package today or call us to create a bespoke bundle tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: GOLD, color: TAUPE }}>
                Book a Package <ArrowRight size={14} />
              </Link>
              <Link to="/packages" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'rgba(201,169,110,0.40)', color: GOLD }}>
                View Packages Page <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
