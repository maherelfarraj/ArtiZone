import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Heart, Sparkles, Users, CheckCircle2, FlaskConical, MapPin, Phone, Clock, Wifi, Coffee, Car } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { buildBeautySalonSchema } from '@/lib/gbp-schema';
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
const CREAM      = '#F7F3EE'; /* Parchment                             */

/* ── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease: 'easeOut' as const } }),
};

/* ── SEO ─────────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://artizonespa.com';
const TITLE    = 'About ArtiZone | Leading Beauty Clinic in Amman, Jordan';
const DESC     = 'Meet the team behind ArtiZone Amman. Certified beauty specialists, advanced technology, and a commitment to results. Learn our story & mission.';
const OG_IMG   = `${SITE_URL}/airo-assets/images/about/clinic-interior`;

/* ── Team ────────────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name:        'Nour Al-Hassan',
    role:        'Founder & Lead Aesthetician',
    bio:         'With over 12 years of experience in aesthetic medicine and beauty therapy, Nour founded ArtiZone with a vision to bring world-class treatments to Amman — without the need to travel to Dubai or Beirut.',
    image:       '/airo-assets/images/about/team-1',
    specialties: ['Skin Care', 'Anti-Aging', 'Laser Treatments'],
  },
  {
    name:        'Lina Khalil',
    role:        'Senior Skin Care Specialist',
    bio:         'Certified in advanced skin care and chemical peels, Lina brings precision and care to every facial treatment, with a passion for transforming skin health through evidence-based protocols.',
    image:       '/airo-assets/images/about/team-2',
    specialties: ['Facials', 'Chemical Peels', 'Microneedling'],
  },
  {
    name:        'Kareem Mansour',
    role:        "Men's Grooming Specialist",
    bio:         "Kareem leads our men's grooming department, specializing in laser hair removal, skin care, and body treatments tailored specifically for men's skin and lifestyle needs.",
    image:       '/airo-assets/images/about/team-3',
    specialties: ["Men's Grooming", 'Laser', 'Body Treatments'],
  },
];

/* ── Values ──────────────────────────────────────────────────────────────── */
const VALUES = [
  {
    icon:  <Heart size={20} style={{ color: G }} />,
    title: '"Refreshed, Not Done"',
    body:  'We enhance your natural beauty — not change who you are. Our approach aligns with the 2026 global trend toward subtle, natural results that respect facial identity and body diversity.',
  },
  {
    icon:  <FlaskConical size={20} style={{ color: G }} />,
    title: 'Evidence-Based Treatments',
    body:  'Every service we offer is backed by clinical research, FDA or CE certification, and proven results. We never follow fads — we follow science.',
  },
  {
    icon:  <Users size={20} style={{ color: G }} />,
    title: 'Personalized Care',
    body:  'No two clients are the same. Your skin type, hair texture, body goals, and lifestyle are unique. Every treatment plan is customized after a thorough consultation.',
  },
  {
    icon:  <Shield size={20} style={{ color: G }} />,
    title: 'Safety First',
    body:  'Hospital-grade sterilization, single-use tools where required, certified practitioners, and strict protocols. Your safety is non-negotiable.',
  },
  {
    icon:  <Award size={20} style={{ color: G }} />,
    title: 'Expert Team',
    body:  'Our specialists are certified, continuously trained, and passionate about delivering the best possible results — every single session.',
  },
  {
    icon:  <CheckCircle2 size={20} style={{ color: G }} />,
    title: 'Proven Results',
    body:  'We stand behind our treatments. Our before & after gallery speaks for itself — real results for real clients in Amman.',
  },
];

/* ── Stats ───────────────────────────────────────────────────────────────── */
const STATS = [
  { val: '2,500+', label: 'Clients served'         },
  { val: '4.9★',   label: 'Google rating'           },
  { val: '15+',    label: 'Certified specialists'   },
  { val: '50+',    label: 'Treatments offered'      },
];

/* ── Hygiene ─────────────────────────────────────────────────────────────── */
const HYGIENE = [
  'Single-use disposable tools for every client',
  'Autoclave sterilization for all metal instruments',
  'Fresh linens and covers changed between every appointment',
  'Hospital-grade disinfectants on all surfaces',
  'Staff trained in infection control and hygiene protocols',
  'Gloves worn during all treatments',
  'Sealed, sterile product packaging opened fresh per session',
  'Regular third-party hygiene audits',
];

/* ── Clinic amenities ────────────────────────────────────────────────────── */
const AMENITIES = [
  { icon: <MapPin size={14} style={{ color: G }} />,    label: 'Location',     value: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St., Amman' },
  { icon: <Car size={14} style={{ color: G }} />,       label: 'Parking',      value: 'Free client parking available'                   },
  { icon: <Shield size={14} style={{ color: G }} />,    label: 'Hygiene',      value: 'Hospital-grade sterilization & single-use protocols' },
  { icon: <Sparkles size={14} style={{ color: G }} />,  label: 'Climate',      value: 'Temperature-controlled suites year-round'        },
  { icon: <Wifi size={14} style={{ color: G }} />,      label: 'WiFi',         value: 'Complimentary high-speed internet'               },
  { icon: <Coffee size={14} style={{ color: G }} />,    label: 'Refreshments', value: 'Herbal teas, coffee, and light snacks'           },
];

/* ── Sub-components ──────────────────────────────────────────────────────── */
function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />;
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-3"
      style={{ color: light ? G : G, fontFamily: 'var(--font-sans)' }}>
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: TITLE,
    url: `${SITE_URL}/about`,
    description: DESC,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
      ],
    },
    mainEntity: (() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { '@context': _ctx, ...entity } = buildBeautySalonSchema({
        image: OG_IMG,
        foundingDate: '2019',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 15 },
        description: DESC,
        employee: TEAM.map(member => ({
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role,
          image: `${SITE_URL}${member.image}`,
          worksFor: { '@type': 'BeautySalon', name: 'ArtiZone Beauty & Aesthetic Clinic', url: SITE_URL },
          knowsAbout: member.specialties,
        })),
      });
      return entity;
    })(),
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content="ArtiZone Amman, beauty clinic Amman, aesthetic clinic Jordan, skin care specialists Amman, laser hair removal Amman, about ArtiZone, beauty team Amman" />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title"        content={TITLE} />
        <meta property="og:description"  content={DESC} />
        <meta property="og:image"        content={OG_IMG} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="ArtiZone beauty clinic interior in Amman, Jordan" />
        <meta property="og:url"          content={`${SITE_URL}/about`} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <meta name="twitter:title"       content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image"       content={OG_IMG} />
        <meta name="twitter:image:alt"   content="ArtiZone beauty clinic interior in Amman, Jordan" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/about" />

        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/about" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: DEEP_BROWN }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 'clamp(420px,60svh,680px)' }}>
          <OptimizedImage
            src="/airo-assets/images/services/facial-video"
            alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority
            width={1920} height={680}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(61,61,63,0.20) 0%,rgba(61,61,63,0.55) 50%,rgba(61,61,63,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(14,42,58,0.55) 0%,transparent 60%)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-end h-full pb-16 sm:pb-24"
            style={{ minHeight: 'clamp(420px,60svh,680px)' }}>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: GDIM, fontFamily: 'var(--font-sans)' }}>
              <Link to="/" style={{ color: GDIM }} className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <span style={{ color: G }}>About</span>
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
              About ArtiZone<br />
              <em style={{ color: G, fontStyle: 'italic' }}>Amman's Trusted Beauty Destination</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' as const }}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: 'rgba(230,215,185,0.60)', fontFamily: 'var(--font-sans)' }}>
              Certified beauty specialists, advanced technology, and a genuine commitment to results — all under one roof in Amman.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                Book Appointment
              </Link>
              <Link to="/services"
                className="inline-flex items-center justify-center gap-2 w-full xs:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ border: `1px solid rgba(196,168,130,0.45)`, color: G, fontFamily: 'var(--font-sans)' }}>
                View Services <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS BAR ════════════════════════════════════════════════════ */}
        <div style={{ background: S1, borderBottom: '1px solid rgba(196,168,130,0.12)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {STATS.map(({ val, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: G, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500 }}>{val}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ OUR STORY ════════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionLabel>Our Story</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Bringing World-Class Beauty<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>to Amman</em>
                </h2>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${G})` }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: G }} />
                  <div className="h-px w-10" style={{ background: `linear-gradient(to left,transparent,${G})` }} />
                </div>
                <div className="space-y-4 text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                  <p>
                    ArtiZone was founded with a simple mission: to bring world-class beauty, skin, and body care to Amman, Jordan — without the need to travel to Dubai, Beirut, or beyond.
                  </p>
                  <p>
                    We noticed a gap in the Jordanian market. Clients deserved a modern, hygienic, technology-driven beauty center that treated them with the same standards found in London, Paris, or Dubai clinics. A place where women and men could access advanced laser hair removal, medical-grade facials, premium nail art, and non-invasive body slimming — all under one roof, with certified professionals, transparent pricing, and genuine care.
                  </p>
                  <p>
                    Today, ArtiZone is proud to be Amman's premier destination for aesthetic treatments, serving over 2,500 clients and maintaining a 4.9-star rating across Google and social platforms.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.50) 0%,transparent 50%)' }} />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
                {/* Badge */}
                <div className="absolute bottom-6 left-6 px-5 py-3"
                  style={{ background: 'rgba(61,61,63,0.90)', backdropFilter: 'blur(8px)', border: `1px solid rgba(196,168,130,0.25)` }}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.20em] mb-0.5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>Est. in Amman</p>
                  <p style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: '1.1rem', fontWeight: 400 }}>ArtiZone Clinic</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ CORE VALUES ══════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S1 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>What We Stand For</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Our Philosophy &<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Core Values</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map((v, i) => (
                <motion.div key={v.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-7 group transition-all duration-300"
                  style={{ background: BLACK, border: '1px solid rgba(196,168,130,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `rgba(196,168,130,0.45)`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,168,130,0.15)'}
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-5"
                    style={{ background: 'rgba(196,168,130,0.12)', border: `1px solid rgba(196,168,130,0.20)` }}>
                    {v.icon}
                  </div>
                  <div className="w-5 h-px mb-4" style={{ background: G }} />
                  <h3 className="text-base font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: FG }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{v.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MEET THE TEAM ════════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>The People Behind ArtiZone</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Meet Our<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Specialists</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={member.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="overflow-hidden group"
                  style={{ background: S1, border: '1px solid rgba(196,168,130,0.15)' }}>
                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <OptimizedImage
                      src={member.image}
                      alt={`${member.name} — ${member.role} at ArtiZone Beauty Clinic Amman`}
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      width={600} height={750}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.65) 0%,transparent 55%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: '1.1rem', fontWeight: 400 }}>{member.name}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mt-0.5" style={{ color: G, fontFamily: 'var(--font-sans)' }}>{member.role}</p>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>{member.bio}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialties.map(s => (
                        <span key={s} className="text-[10px] font-medium px-2.5 py-1 uppercase tracking-[0.12em]"
                          style={{ background: 'rgba(196,168,130,0.12)', color: G, fontFamily: 'var(--font-sans)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HYGIENE STANDARDS ════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: S2 }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative aspect-[4/5] overflow-hidden order-last lg:order-first">
                <OptimizedImage
                  src="/airo-assets/images/about/clinic-treatment"
                  alt="ArtiZone beauty clinic treatment room — professional aesthetic equipment Amman"
                  className="absolute inset-0 w-full h-full object-cover"
                  width={800} height={1000}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(61,61,63,0.40) 0%,transparent 50%)' }} />
                <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: `2px solid ${DEEP_BROWN}`, borderLeft: `2px solid ${DEEP_BROWN}` }} />
                <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: `2px solid ${DEEP_BROWN}`, borderRight: `2px solid ${DEEP_BROWN}` }} />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                <SectionLabel>Hospital-Grade Standards</SectionLabel>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(1.8rem,3.8vw,3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Hygiene You Can<br />
                  <em style={{ color: G, fontStyle: 'italic' }}>Trust</em>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>
                  Your safety is our highest priority. We maintain strict sterilization protocols across every treatment room, tool, and surface — every single day.
                </p>
                <ul className="space-y-3">
                  {HYGIENE.map((item, i) => (
                    <motion.li key={item} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      className="flex items-start gap-3 text-sm" style={{ color: 'rgba(14,42,58,0.75)', fontFamily: 'var(--font-sans)' }}>
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(196,168,130,0.15)' }}>
                        <Shield size={10} style={{ color: G }} />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ CLINIC AMENITIES ═════════════════════════════════════════════ */}
        <GoldLine />
        <section className="py-20 sm:py-28" style={{ background: BLACK }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <SectionLabel>The Clinic</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Your Comfort,<br />
                <em style={{ color: G, fontStyle: 'italic' }}>Our Priority</em>
              </h2>
              <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                Every detail of our clinic is designed to make your visit as comfortable and relaxing as possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {AMENITIES.map((a, i) => (
                <motion.div key={a.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6" style={{ background: S1, border: '1px solid rgba(196,168,130,0.12)' }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    {a.icon}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: G, fontFamily: 'var(--font-sans)' }}>{a.label}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(14,42,58,0.70)', fontFamily: 'var(--font-sans)' }}>{a.value}</p>
                </motion.div>
              ))}
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
              <SectionLabel>We'd Love to Meet You</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: DEEP_BROWN, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '1.25rem' }}>
                Come Visit<br />
                <em style={{ color: G, fontStyle: 'italic' }}>ArtiZone Amman</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(14,42,58,0.65)', fontFamily: 'var(--font-sans)' }}>
                Book your first appointment or get in touch — our team is here to help you find the right treatment for your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                  style={{ background: TERRACOTTA, color: CREAM, fontFamily: 'var(--font-sans)' }}>
                  Book Appointment <ArrowRight size={12} />
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                  style={{ border: `1px solid rgba(196,168,130,0.35)`, color: G, fontFamily: 'var(--font-sans)' }}>
                  Contact Us
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: 'rgba(14,42,58,0.55)', fontFamily: 'var(--font-sans)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: GDIM }} /> Arjan St., 2nd Floor, Amman</span>
                <span className="flex items-center gap-1.5"><Phone size={11} style={{ color: GDIM }} /> +962 79 041 2758</span>
                <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: GDIM }} /> Sat–Thu 10AM–9PM · Fri 2PM–9PM</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ INTERNAL LINKS ═══════════════════════════════════════════════ */}
        <div style={{ background: BLACK, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5"
              style={{ color: G, fontFamily: 'var(--font-sans)' }}>Explore Our Services</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Laser Hair Removal', href: '/laser-hair-removal-amman' },
                { label: 'Facials & Skin Care', href: '/best-facial-amman'       },
                { label: 'Body Slimming',       href: '/body-slimming-amman'     },
                { label: 'Nail Salon',          href: '/nail-salon-amman'        },
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
