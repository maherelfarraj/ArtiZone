// homepage — ArtiZone 2026 rebuild
import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Star, Sparkles, Phone, ExternalLink,
  CheckCircle2, ArrowRight, Zap, Shield, Award, Users, QrCode,
} from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { buildBeautySalonSchema, buildOgTags } from '@/lib/gbp-schema';
import HeroCarousel from '@/components/HeroCarousel';
import OptimizedImage from '@/components/OptimizedImage';

const NewsletterSignup = lazy(() => import('@/components/NewsletterSignup'));

/* ── Palette ─────────────────────────────────────────────────────────────── */
const NAVY   = '#0E2A3A';
const GOLD   = '#C4A882';
const SAGE   = '#6B7260';
const PARCH  = '#F7F3EE';
const IVORY  = '#FDFAF6';

/* ── Animation variants ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.10, ease: 'easeOut' as const },
  }),
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

/* ── Divider ─────────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(196,168,130,0.28),transparent)' }} />
  );
}

/* ── Section label ───────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3"
      style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
      {children}
    </p>
  );
}

/* ── Services data ───────────────────────────────────────────────────────── */
const SERVICES_PREVIEW = [
  { id: 'face-skin-care',   num: '01', title: 'Face & Skin Care',    tagline: 'Facials, peels & advanced skin',  image: '/airo-assets/images/services/face-skin-care',     href: '/best-facial-amman' },
  { id: 'body-treatments',  num: '02', title: 'Body Treatments',     tagline: 'Sculpt, slim & contour',          image: '/airo-assets/images/services/body-slimming',      href: '/body-slimming-amman' },
  { id: 'laser-advanced',   num: '03', title: 'Laser & Advanced',    tagline: 'Permanent hair reduction',        image: '/airo-assets/images/services/laser-hair-removal', href: '/laser-hair-removal-amman' },
  { id: 'nails-extensions', num: '04', title: 'Nails & Extensions',  tagline: 'Flawless nails, every time',      image: '/airo-assets/images/services/nails-foot-care',    href: '/services/nails-foot-care' },
  { id: 'mens-treatments',  num: '05', title: "Men's Treatments",    tagline: 'Premium care for men',            image: '/airo-assets/images/services/mens-grooming',      href: '/mens-grooming-amman' },
];

/* ── Reviews ─────────────────────────────────────────────────────────────── */
const REVIEWS = [
  { name: 'Rania A.',  service: 'Laser Hair Removal', text: 'Best laser clinic in Amman! The staff are so professional and the results after 4 sessions are incredible. My skin is so smooth. Highly recommend ArtiZone to everyone.', stars: 5 },
  { name: 'Lara M.',   service: 'HydraFacial',        text: 'I had a HydraFacial and my skin looked amazing the same day. Zero redness, instant glow. The team explained everything and made me feel so comfortable. Will definitely be back!', stars: 5 },
  { name: 'Sara K.',   service: 'Bridal Package',     text: 'I did my full bridal package at ArtiZone — laser, facials, nails, everything. On my wedding day my skin was absolutely glowing. My makeup artist was so impressed. Thank you ArtiZone!', stars: 5 },
  { name: 'Nour H.',   service: 'Body Slimming',      text: 'After 6 sessions of body slimming I can see a real difference. The team is so knowledgeable and the clinic is very clean and modern. Great experience every time.', stars: 5 },
  { name: 'Ahmad S.',  service: "Men's Grooming",     text: "As a man I was nervous about going to a beauty clinic but ArtiZone made me feel completely at ease. The men's grooming services are excellent and the results speak for themselves.", stars: 5 },
  { name: 'Dina R.',   service: 'Nail Care',          text: 'The nail technicians at ArtiZone are so talented. My gel manicure lasted 3 weeks without chipping. The salon is beautiful and the service is always 5 stars.', stars: 5 },
];

/* ── Google G logo ───────────────────────────────────────────────────────── */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const SITE_URL    = 'https://artizonespa.com';
  const title       = 'ArtiZone Amman | Skin, Laser, Nails & Body Slimming for Women & Men';
  const description = 'ArtiZone in Amman, Jordan offers professional skin treatments, laser hair removal, nail services & body slimming. Book your glow-up today. Women & men welcome. Free consultation.';
  const ogImage     = `${SITE_URL}/airo-assets/images/pages/home/hero`;
  const og = buildOgTags({ title, description, image: ogImage, url: SITE_URL,
    imageAlt: 'ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan' });

  const jsonLd = buildBeautySalonSchema({
    description,
    foundingDate: '2019',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Beauty & Aesthetic Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Face & Skin Care',    url: `${SITE_URL}/best-facial-amman` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Body Treatments',     url: `${SITE_URL}/body-slimming-amman` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laser & Advanced',    url: `${SITE_URL}/laser-hair-removal-amman` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nails & Extensions',  url: `${SITE_URL}/services/nails-foot-care` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Men's Treatments",    url: `${SITE_URL}/mens-grooming-amman` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Acne Scar Removal',   url: `${SITE_URL}/acne-scar-removal-amman` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HydraFacial',         url: `${SITE_URL}/hydrafacial-amman` } },
      ],
    },
    subjectOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  });

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'ArtiZone Beauty & Aesthetic Clinic',
    description,
    inLanguage: 'en',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
  };

  return (
    <>
      <Helmet>
        {/* @ts-ignore fetchpriority */}
        <link rel="preload" as="image" href="/airo-assets/images/services/hero-video" fetchpriority="high" />
        {/* @ts-ignore fetchpriority */}
        <link rel="preload" as="image" href="/airo-assets/images/services/facial-video" fetchpriority="low" />
        {/* @ts-ignore fetchpriority */}
        <link rel="preload" as="image" href="/airo-assets/images/services/booking-cta-video" fetchpriority="low" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title"        content={og['og:title']} />
        <meta property="og:description"  content={og['og:description']} />
        <meta property="og:image"        content={og['og:image']} />
        <meta property="og:image:width"  content={og['og:image:width']} />
        <meta property="og:image:height" content={og['og:image:height']} />
        <meta property="og:image:alt"    content={og['og:image:alt']} />
        <meta property="og:url"          content={og['og:url']} />
        <meta property="og:type"         content={og['og:type']} />
        <meta property="og:site_name"    content={og['og:site_name']} />
        <meta property="og:locale"       content={og['og:locale']} />

        <meta name="twitter:card"        content={og['twitter:card']} />
        <meta name="twitter:title"       content={og['twitter:title']} />
        <meta name="twitter:description" content={og['twitter:description']} />
        <meta name="twitter:image"       content={og['twitter:image']} />
        <meta name="twitter:image:alt"   content={og['twitter:image:alt']} />
        <meta name="twitter:site"        content={og['twitter:site']} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <link rel="alternate" hrefLang="en" href={SITE_URL} />

        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </Helmet>

      <div style={{ background: PARCH }}>

        {/* ══ HERO CAROUSEL ══════════════════════════════════════════════════ */}
        <HeroCarousel />

        {/* ══ STATS BAR ══════════════════════════════════════════════════════ */}
        <div style={{ background: '#132333', borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-white/10">
              {[
                { val: '4.9★', label: '200+ Google Reviews', highlight: true },
                { val: '2,500+', label: 'Clients in Amman' },
                { val: 'FDA', label: 'Approved Equipment' },
                { val: 'Free', label: 'Consultation' },
              ].map(({ val, label, highlight }, i) => (
                <motion.div key={label} custom={i} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex flex-col items-center px-3 sm:px-8 gap-1 py-3 sm:py-0">
                  <span style={{ fontFamily: 'var(--font-heading)', color: highlight ? '#FFD700' : GOLD, fontSize: 'clamp(1.3rem,3.2vw,2.2rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[9px] sm:text-xs uppercase tracking-[0.10em] sm:tracking-[0.14em] text-center leading-tight" style={{ color: 'rgba(253,250,246,0.58)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ══ ABOUT ══════════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28" style={{ background: IVORY }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left — text */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Label>About ArtiZone</Label>
                <h2 className="font-medium leading-tight mb-5"
                  style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.9rem,4vw,3.2rem)' }}>
                  Amman's Premium{' '}
                  <em style={{ color: GOLD, fontStyle: 'italic' }}>Beauty & Aesthetic</em>{' '}
                  Clinic
                </h2>
                <p className="text-sm sm:text-base leading-[1.85] mb-5" style={{ color: SAGE, fontFamily: 'var(--font-sans)' }}>
                  ArtiZone is a full-service beauty and aesthetic clinic in the heart of Amman, Jordan. Since 2019 we have helped thousands of clients look and feel their best — with a team of certified specialists, FDA-approved equipment, and a warm, welcoming environment for both women and men.
                </p>
                <p className="text-sm sm:text-base leading-[1.85] mb-8" style={{ color: SAGE, fontFamily: 'var(--font-sans)' }}>
                  From advanced laser hair removal and HydraFacial treatments to body slimming, nail care, and men's grooming — every service is tailored to your skin type and goals.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    'FDA-approved equipment',
                    'Certified beauty specialists',
                    'Women & men welcome',
                    'Free first consultation',
                    '4.9★ on Google — 200+ reviews',
                    'Loyalty rewards program',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 size={15} style={{ color: GOLD, flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: NAVY, fontFamily: 'var(--font-sans)' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-all hover:opacity-90"
                    style={{ background: GOLD, color: IVORY, fontFamily: 'var(--font-sans)' }}>
                    Our Story
                  </Link>
                  <Link to="/booking"
                    className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] border transition-all hover:opacity-80"
                    style={{ color: NAVY, borderColor: 'rgba(196,168,130,0.45)', fontFamily: 'var(--font-sans)', background: 'transparent' }}>
                    Book Free Consultation
                  </Link>
                </div>
              </motion.div>

              {/* Right — clinic image grid */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="grid grid-cols-2 gap-3">
                <div className="col-span-2 rounded-2xl overflow-hidden aspect-[16/7]">
                  <OptimizedImage src="/airo-assets/images/about/clinic-interior"
                    alt="ArtiZone beauty clinic interior — luxury aesthetic spa Amman Jordan"
                    className="w-full h-full object-cover"
                    width={800} height={350} />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <OptimizedImage src="/airo-assets/images/services/facial-video"
                    alt="Professional facial treatment at ArtiZone skin care clinic Amman"
                    className="w-full h-full object-cover"
                    width={400} height={400} />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <OptimizedImage src="/airo-assets/images/services/laser-video"
                    alt="Laser hair removal treatment at ArtiZone aesthetic clinic Amman"
                    className="w-full h-full object-cover"
                    width={400} height={400} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ SERVICES PREVIEW ═══════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 overflow-hidden" style={{ background: PARCH }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">

            {/* Header row */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <Label>Our Services</Label>
                <h2 className="font-medium leading-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                  Everything You Need,{' '}
                  <em style={{ color: GOLD, fontStyle: 'italic' }}>Under One Roof</em>
                </h2>
              </div>
              <Link to="/services"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] shrink-0 transition-all hover:opacity-70"
                style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                View All Services <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* ── Featured card (Face & Skin Care) — full width ── */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
              <Link to={SERVICES_PREVIEW[0].href}
                className="group relative flex overflow-hidden rounded-3xl"
                style={{ height: 'clamp(280px, 38vw, 480px)', boxShadow: '0 8px 40px rgba(14,42,58,0.18)' }}>
                <OptimizedImage
                  src={SERVICES_PREVIEW[0].image}
                  alt={`${SERVICES_PREVIEW[0].title} — ArtiZone beauty clinic Amman`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  priority width={1440} height={480}
                />
                {/* Gradient */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(105deg, rgba(14,42,58,0.82) 0%, rgba(14,42,58,0.40) 55%, transparent 100%)' }} />
                {/* Gold accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end p-8 sm:p-12 max-w-xl">
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
                    style={{ color: GOLD, fontFamily: 'var(--font-mono)' }}>{SERVICES_PREVIEW[0].num}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 500, lineHeight: 1.15 }}>
                    {SERVICES_PREVIEW[0].title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'rgba(253,250,246,0.65)', fontFamily: 'var(--font-sans)' }}>
                    {SERVICES_PREVIEW[0].tagline}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 group-hover:gap-3"
                    style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                    Explore <ArrowRight size={12} />
                  </div>
                </div>
                {/* Decorative number watermark */}
                <div className="absolute right-8 bottom-6 text-[120px] font-black leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(196,168,130,0.06)', fontFamily: 'var(--font-heading)' }}>01</div>
              </Link>
            </motion.div>

            {/* ── 4 smaller cards in a row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES_PREVIEW.slice(1).map((s, i) => (
                <motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to={s.href}
                    className="group relative flex flex-col overflow-hidden rounded-2xl"
                    style={{ height: 'clamp(200px, 22vw, 320px)', boxShadow: '0 4px 20px rgba(14,42,58,0.10)' }}>
                    <OptimizedImage
                      src={s.image}
                      alt={`${s.title} — ArtiZone beauty clinic Amman`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      width={600} height={320}
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(14,42,58,0.90) 0%, rgba(14,42,58,0.20) 60%, transparent 100%)' }} />
                    {/* Top number */}
                    <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.20em]"
                      style={{ color: 'rgba(196,168,130,0.60)', fontFamily: 'var(--font-mono)' }}>{s.num}</span>
                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-semibold leading-tight text-sm sm:text-base"
                        style={{ fontFamily: 'var(--font-heading)', color: IVORY }}>{s.title}</p>
                      <p className="text-[11px] mt-0.5 leading-snug"
                        style={{ color: 'rgba(196,168,130,0.75)', fontFamily: 'var(--font-sans)' }}>{s.tagline}</p>
                    </div>
                    {/* Hover gold border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-opacity-60"
                      style={{ borderColor: 'rgba(196,168,130,0)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.55)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0)')} />
                    {/* Arrow pill on hover */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                      style={{ background: 'rgba(196,168,130,0.18)', backdropFilter: 'blur(6px)', border: '1px solid rgba(196,168,130,0.35)' }}>
                      <ArrowRight size={11} style={{ color: GOLD }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        <Divider />

        {/* ══ WHY ARTIZONE — value pillars ═══════════════════════════════════ */}
        <section className="py-16 sm:py-20" style={{ background: NAVY }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-12">
              <Label>Why ArtiZone</Label>
              <h2 className="font-medium leading-tight"
                style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                The Standard for{' '}
                <em style={{ color: GOLD, fontStyle: 'italic' }}>Premium Beauty</em>{' '}
                in Amman
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <Shield size={22} style={{ color: GOLD }} />, title: 'FDA-Approved Equipment', body: 'Every device we use is certified, clinically tested, and maintained to the highest standards.' },
                { icon: <Award size={22} style={{ color: GOLD }} />, title: 'Certified Specialists', body: 'Our team holds international certifications and undergoes continuous training in the latest techniques.' },
                { icon: <Users size={22} style={{ color: GOLD }} />, title: 'Women & Men Welcome', body: 'A comfortable, inclusive environment designed for every client — with dedicated men\'s grooming services.' },
                { icon: <Zap size={22} style={{ color: GOLD }} />, title: 'Results-Driven Care', body: 'We measure success by your results. Every treatment plan is tailored to your skin type and goals.' },
              ].map(({ icon, title, body }, i) => (
                <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(196,168,130,0.10)' }}>
                    {icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: IVORY, fontFamily: 'var(--font-sans)' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(253,250,246,0.52)', fontFamily: 'var(--font-sans)' }}>{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ NEWSLETTER — dark bg ═══════════════════════════════════════════ */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)', zIndex: 0 }} />
          <div className="absolute inset-0" style={{ background: 'rgba(14,42,58,0.40)', zIndex: 1 }} />
          <div className="relative" style={{ zIndex: 2 }}>
            <Suspense fallback={<div style={{ height: 200 }} />}>
              <NewsletterSignup variant="section" source="homepage" />
            </Suspense>
          </div>
        </div>

        <Divider />

        {/* ══ GOOGLE REVIEWS ═════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24" style={{ background: PARCH }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-12">
              <Label>What Our Clients Say</Label>
              <h2 className="font-medium leading-tight mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                4.9 Stars on{' '}
                <em style={{ color: GOLD, fontStyle: 'italic' }}>Google</em>
              </h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1,2,3,4,5].map(n => <Star key={n} size={20} fill={GOLD} style={{ color: GOLD }} />)}
                <span className="text-lg font-bold ml-1" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>4.9</span>
              </div>
              <p className="text-sm" style={{ color: SAGE }}>200+ verified Google reviews · Beauty clinic in Amman</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {REVIEWS.map(({ name, service, text, stars }, i) => (
                <motion.div key={name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-2xl p-6 shadow-sm flex flex-col"
                  style={{ background: '#fff', border: '1px solid rgba(196,168,130,0.15)' }}>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(stars)].map((_, j) => <Star key={j} size={13} fill={GOLD} style={{ color: GOLD }} />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 italic flex-1"
                    style={{ color: SAGE, fontFamily: 'var(--font-sans)' }}>
                    "{text}"
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(196,168,130,0.12)' }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: NAVY, fontFamily: 'var(--font-sans)' }}>{name}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>{service}</p>
                    </div>
                    <GoogleG />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 pt-2">

              {/* QR code — scan to review */}
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{ background: '#fff', border: '1px solid rgba(196,168,130,0.22)', boxShadow: '0 2px 12px rgba(14,42,58,0.07)' }}>
                <img
                  src="/assets/qr-codes/qr-leave-a-review-ycW1tF.png"
                  alt="QR code to leave a Google review for ArtiZone"
                  width={72} height={72}
                  loading="lazy"
                  decoding="async"
                  className="rounded-lg shrink-0"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <QrCode size={13} style={{ color: GOLD }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Scan to Review</span>
                  </div>
                  <p className="text-xs leading-snug max-w-[140px]" style={{ color: SAGE }}>
                    Point your camera — takes less than a minute
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-14" style={{ background: 'rgba(196,168,130,0.20)' }} />

              {/* Text CTA */}
              <div className="text-center sm:text-left">
                <a href="https://g.page/r/artizone-amman/review" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold border transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(196,168,130,0.5)', color: NAVY, background: '#fff' }}>
                  <ExternalLink size={14} style={{ color: GOLD }} />
                  Leave Us a Google Review
                </a>
                <p className="text-xs mt-2" style={{ color: SAGE }}>Your review helps other clients in Amman find us — thank you!</p>
              </div>

            </motion.div>
          </div>
        </section>

        <Divider />

        {/* ══ BOOKING CTA — dark bg ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)', zIndex: 0 }} />
          <div className="absolute inset-0" style={{ background: 'rgba(14,42,58,0.82)', zIndex: 1 }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(196,168,130,0.08) 0%, transparent 55%)', zIndex: 2 }} />

          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-28 relative" style={{ zIndex: 3 }}>
            <div className="max-w-2xl mx-auto text-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Label>Ready to Begin?</Label>
                <h2 className="font-medium leading-tight mb-5"
                  style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
                  Start Your{' '}
                  <em style={{ color: GOLD, fontStyle: 'italic' }}>Beauty Journey</em>
                </h2>
                <p className="leading-[1.75] mb-10 text-base" style={{ color: 'rgba(250,247,242,0.62)', fontFamily: 'var(--font-sans)' }}>
                  Book your appointment today and experience premium beauty care in the heart of Amman. Free consultation on your first visit.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/booking"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-200 hover:opacity-90"
                    style={{ background: GOLD, color: IVORY, fontFamily: 'var(--font-sans)', minWidth: 220 }}>
                    <Sparkles size={13} /> Book Appointment
                  </Link>
                  <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-200 hover:opacity-90"
                    style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)', minWidth: 220 }}>
                    <MessageCircle size={13} /> WhatsApp Us
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 mt-8">
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill={GOLD} style={{ color: GOLD }} />)}
                  <span className="text-xs ml-1" style={{ color: 'rgba(253,250,246,0.48)', fontFamily: 'var(--font-sans)' }}>
                    4.9 · 200+ Google Reviews · Free Consultation
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </div>

      {/* ══ STICKY MOBILE BAR ══════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{
          background: 'rgba(14,42,58,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(196,168,130,0.18)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
        <div className="flex items-stretch">
          <a href="tel:+962790412758"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:opacity-80"
            style={{ color: 'rgba(253,250,246,0.78)', fontFamily: 'var(--font-sans)' }}>
            <Phone size={15} style={{ color: GOLD }} />
            Call
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:opacity-80"
            style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
            <MessageCircle size={15} />
            WhatsApp
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <Link to="/booking"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:opacity-80"
            style={{ background: GOLD, color: IVORY, fontFamily: 'var(--font-sans)' }}>
            <Sparkles size={13} />
            Book Now
          </Link>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
