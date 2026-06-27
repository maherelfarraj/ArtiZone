import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import OptimizedImage from '@/components/OptimizedImage';

/* ── Palette (from uploaded design files) ───────────────────────────────── */
const MIDNIGHT = '#070F1A';
const NAVY     = '#0C1B2C';
const NAVY_CARD= '#0E2034';
const GOLD     = '#C9A26B';
const GOLD_HOT = '#F3D9A4';
const ROSE     = '#E8B4A0';
const IVORY    = '#F7F2E7';
const BODY_CLR = '#C9D3DE';
const TAG_CLR  = '#E2D2B2';

/* ── Service data ────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'face-skin-care',
    num: '01',
    title: 'Face & Skin Care',
    tagline: 'Reveal your natural glow',
    image: '/airo-assets/images/services/face-skin-care',
    heroImage: '/airo-assets/images/services/facial-video',
    short: 'Tailored facials, chemical peels, advanced skin therapies, waxing, and threading for every skin type.',
    description:
      'Your skin is your most visible asset — and it deserves expert attention. Our face and skin care treatments are individually tailored to your skin type, tone, and concerns. Whether you struggle with acne, dullness, uneven texture, or early signs of aging, our certified aestheticians design a personalised protocol using medical-grade products and advanced technology to deliver visible, lasting results.',
    whyUsed:
      'Professional treatments remove dead skin cells, unclog pores, stimulate collagen production, and deliver active ingredients at concentrations that are only safe and effective when applied by a trained specialist. Regular sessions maintain skin health, slow the aging process, and address specific concerns like pigmentation, acne scars, and dehydration.',
    benefits: [
      'Deeply cleanses pores and removes blackheads',
      'Boosts collagen and elastin for firmer skin',
      'Reduces fine lines, wrinkles, and age spots',
      'Evens skin tone and fades hyperpigmentation',
      'Restores hydration and natural radiance',
      'Controls acne and prevents future breakouts',
      'Precise eyebrow threading and brow shaping',
      'Gentle waxing and sugaring for all skin types',
    ],
    treatments: [
      'Signature ArtiZone Facial', 'HydraFacial', '24K Gold Facial', 'Carbon Laser Facial',
      'Chemical Peels', 'RF Microneedling', 'LED Light Therapy',
      'Acne & Scar Care', 'Skin Boosters', 'Anti-Aging Collagen Lift',
      'Eyebrow Threading & Shaping', 'Full Face Threading',
      'Full Body Wax', 'Bikini & Brazilian Wax', 'Underarm & Leg Wax', 'Natural Sugaring', 'Brow Tinting',
    ],
  },
  {
    id: 'body-treatments',
    num: '02',
    title: 'Body Treatments',
    tagline: 'Sculpt, slim & contour',
    image: '/airo-assets/images/services/body-slimming',
    heroImage: '/airo-assets/images/services/slimming-video',
    short: 'Non-surgical fat reduction, skin tightening, and body sculpting — no downtime required.',
    description:
      'Achieve the body shape you want without surgery or downtime. Our non-invasive body treatments use clinically proven technologies to break down stubborn fat deposits, tighten loose skin, reduce cellulite, and sculpt your natural curves. Each treatment plan is customised after a full body assessment.',
    whyUsed:
      'Even with a healthy diet and regular exercise, stubborn fat in areas like the abdomen, thighs, and flanks can be extremely resistant to change. Ultrasound cavitation breaks fat cell membranes, radiofrequency heats and tightens collagen fibres, and cryolipolysis freezes and destroys fat cells.',
    benefits: [
      'Reduces stubborn fat in targeted areas',
      'Tightens loose and sagging skin non-surgically',
      'Visibly reduces cellulite and improves skin texture',
      'Sculpts and defines natural body contours',
      'Stimulates collagen production for firmer skin',
      'Improves lymphatic drainage and reduces bloating',
      'No surgery, no anaesthesia, no recovery time',
      'Results improve progressively over multiple sessions',
    ],
    treatments: [
      'Cryolipolysis (Fat Freezing)', 'Ultrasound Cavitation', 'RF Skin Tightening',
      'EMS Body Sculpting', 'Lymphatic Drainage Massage', 'Cellulite Therapy',
      'Detox Body Wraps', 'Custom Slimming Programs',
    ],
  },
  {
    id: 'laser-advanced',
    num: '03',
    title: 'Laser & Advanced',
    tagline: 'Smooth skin, lasting results',
    image: '/airo-assets/images/services/laser-hair-removal',
    heroImage: '/airo-assets/images/services/laser-video',
    short: 'Permanent hair reduction using the latest diode and Nd:YAG laser technology, safe for all skin types.',
    description:
      'Say goodbye to the endless cycle of shaving, waxing, and threading. Our professional laser hair removal service uses the latest diode and Nd:YAG laser technology, safe for all skin types including darker tones. Treatments are precise, fast, and progressively permanent.',
    whyUsed:
      'Laser hair removal targets the melanin in the hair follicle with concentrated light energy. The heat destroys the follicle at its root, preventing future hair growth without damaging surrounding skin. Most clients achieve 80–95% permanent reduction after a full course.',
    benefits: [
      'Permanent reduction of unwanted hair growth',
      'Eliminates ingrown hairs and razor bumps',
      'Smooth, soft skin with no stubble or regrowth',
      'Saves time and money compared to waxing',
      'Safe for face, body, and sensitive areas',
      'Suitable for all skin tones with proper settings',
      'No downtime — return to daily activities immediately',
      'Reduces skin darkening caused by repeated shaving',
    ],
    treatments: [
      'Full Body Laser', 'Face & Neck Laser', 'Underarms & Bikini Laser',
      'Full Legs & Arms Laser', 'Back & Shoulders Laser', 'Beard Line Laser Shaping',
      'Small Zone Laser Session', 'Laser Touch-Up Plan',
    ],
  },
  {
    id: 'nails-extensions',
    num: '04',
    title: 'Nails & Extensions',
    tagline: 'Elegance at your fingertips',
    image: '/airo-assets/images/services/nails-foot-care',
    heroImage: '/airo-assets/images/services/nails-video',
    short: 'Classic manicures, gel nails, intricate nail art, extensions, and relaxing spa pedicures.',
    description:
      'Beautiful nails are a finishing touch that elevates your entire look. Our nail technicians are skilled in everything from classic manicures and pedicures to intricate nail art, gel extensions, and acrylic overlays. We use premium, long-lasting products and maintain the highest hygiene standards.',
    whyUsed:
      'Regular manicures and pedicures maintain nail health, prevent fungal infections, and keep cuticles and skin in good condition. Gel and acrylic treatments provide strength and length for clients with brittle or short nails.',
    benefits: [
      'Long-lasting colour and shine with gel formulas',
      'Strengthens brittle or damaged nails',
      'Prevents and treats nail fungal infections',
      'Removes calluses and softens rough skin on feet',
      'Cuticle care promotes healthy nail growth',
      'Nail art and designs for every occasion',
      'Relaxing hand and foot massage included',
      'Hygienic tools and sterilised equipment every session',
    ],
    treatments: [
      'Classic Mani & Pedi', 'Gel Polish', 'Acrylic & Gel Extensions', 'Custom Nail Art',
      'Luxury Spa Pedicure', 'Paraffin Hand Treatment', 'Medical Pedicure', 'French Forever',
    ],
  },
  {
    id: 'mens-treatments',
    num: '05',
    title: "Men's Treatments",
    tagline: 'Premium care for men',
    image: '/airo-assets/images/services/mens-grooming',
    heroImage: '/airo-assets/images/services/mens-video',
    short: "A private, professional space for men — facials, laser, beard grooming, and body treatments.",
    description:
      "Modern men deserve modern grooming. ArtiZone offers a dedicated men's treatments service in a private, professional environment — free from judgment and designed around men's specific skin and body needs. From the Gentleman's Deep-Clean Facial and hot towel ritual to laser hair removal for the beard line, back and chest.",
    whyUsed:
      "Men's skin is thicker, oilier, and more prone to ingrown hairs, enlarged pores, and razor irritation. Laser hair removal for men eliminates the discomfort of back and chest hair permanently. Facials designed for men's skin control oil, reduce pores, and treat shaving-related irritation.",
    benefits: [
      "Facials designed specifically for men's thicker skin",
      'Laser hair removal for beard line, back, and chest',
      'Beard trim and design for a sharp, clean look',
      'Hot towel ritual for deep relaxation and skin prep',
      'Scalp and hair therapy for a healthier scalp',
      'Body contouring for a more defined physique',
      'Private, comfortable environment tailored for men',
      "Men's mani & pedi for complete grooming",
    ],
    treatments: [
      "Gentleman's Deep-Clean Facial", 'Beard Trim & Design', 'Hot Towel Ritual',
      "Men's Laser (Beard Line, Back, Chest)", "Men's Mani & Pedi",
      'Scalp & Hair Therapy', "Men's Body Contouring",
    ],
  },
];

/* ── Ribbon (auto-scrolling treatment tags) ─────────────────────────────── */
function TreatmentRibbon({ treatments, reverse = false }: { treatments: string[]; reverse?: boolean }) {
  const doubled = [...treatments, ...treatments];
  return (
    <div
      className="relative overflow-hidden my-5"
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        margin: '0 -26px 22px',
      }}
    >
      <div
        className="flex gap-2.5 w-max py-0.5"
        style={{
          animation: `ribbon-scroll ${reverse ? '30s' : '26s'} linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            className="flex-none text-[13px] font-normal whitespace-nowrap px-4 py-2.5 rounded-full"
            style={{
              color: i === 0 || i === treatments.length ? MIDNIGHT : TAG_CLR,
              background: i === 0 || i === treatments.length
                ? `linear-gradient(110deg, ${GOLD}, ${GOLD_HOT})`
                : `rgba(201,162,107,0.10)`,
              border: i === 0 || i === treatments.length ? 'none' : `1px solid rgba(201,162,107,0.30)`,
              fontWeight: i === 0 || i === treatments.length ? 500 : 400,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Service Card ────────────────────────────────────────────────────────── */
function ServiceCard({ svc, index, onExplore }: {
  svc: typeof SERVICES[0];
  index: number;
  onExplore: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' as const }}
      className="relative rounded-[18px] p-[2px] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(201,162,107,0.55), rgba(201,162,107,0.12) 35%, rgba(232,180,160,0.40) 70%, rgba(201,162,107,0.55))`,
        backgroundSize: '300% 300%',
        animation: `border-flow ${9 + index * 0.8}s ease infinite`,
      }}
    >
      {/* Inner card */}
      <div
        className="relative rounded-[16px] px-7 pt-9 pb-8 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${NAVY_CARD} 0%, #0A1726 60%, ${NAVY} 100%)`,
        }}
      >
        {/* Sheen sweep */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            width: '55%',
            left: '-70%',
            background: 'linear-gradient(100deg, transparent, rgba(243,217,164,0.10), transparent)',
            transform: 'skewX(-18deg)',
            animation: `sheen 6s ease-in-out ${index * 1.2}s infinite`,
          }}
        />

        {/* Service image */}
        <div className="relative overflow-hidden rounded-[10px] mb-6" style={{ height: 220 }}>
          <OptimizedImage
            src={svc.image}
            alt={`${svc.title} treatment at ArtiZone beauty clinic Amman`}
            className="w-full h-full object-cover"
            width={800} height={220}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,26,0.65) 0%, transparent 55%)' }} />
          {/* Number watermark */}
          <span
            className="absolute bottom-3 right-4 pointer-events-none select-none"
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 72,
              lineHeight: 1,
              color: 'rgba(243,217,164,0.22)',
            }}
          >
            {svc.num}
          </span>
        </div>

        {/* Ghost number — behind text only */}
        <span
          className="absolute pointer-events-none select-none"
          style={{
            top: -26,
            right: -6,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 1,
            background: 'linear-gradient(180deg, rgba(243,217,164,0.30), rgba(243,217,164,0.02))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {svc.num}
        </span>

        {/* Kicker */}
        <div className="relative z-10 flex items-center gap-2.5 mb-2.5">
          <div className="h-px w-7" style={{ background: GOLD }} />
          <p className="text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: GOLD_HOT, fontFamily: 'var(--font-sans)' }}>
            {svc.tagline}
          </p>
        </div>

        {/* Title */}
        <h3
          className="relative z-10 mb-3"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'clamp(1.9rem,5vw,2.6rem)',
            color: IVORY,
            lineHeight: 1.12,
          }}
        >
          {svc.title}
        </h3>

        {/* Short description */}
        <p className="relative z-10 text-[15.5px] mb-1 max-w-[46ch]" style={{ color: BODY_CLR, fontFamily: 'var(--font-sans)' }}>
          {svc.short}
        </p>

        {/* Ribbon */}
        <div className="relative z-10">
          <TreatmentRibbon treatments={svc.treatments} reverse={index % 2 !== 0} />
        </div>

        {/* Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3.5 mt-1">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.20em] transition-all duration-200 hover:opacity-80"
            style={{
              color: MIDNIGHT,
              background: `linear-gradient(110deg, ${GOLD} 10%, ${GOLD_HOT} 50%, ${GOLD} 90%)`,
              backgroundSize: '200% 100%',
              animation: 'shine 4s linear infinite',
              padding: '13px 26px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: `0 4px 18px rgba(201,162,107,0.30)`,
            }}
          >
            Explore Service
          </button>

          <Link
            to="/booking"
            className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.20em] transition-all duration-200 hover:opacity-80"
            style={{
              color: GOLD_HOT,
              borderBottom: `1px solid rgba(201,162,107,0.50)`,
              paddingBottom: 4,
              fontFamily: 'var(--font-sans)',
              textDecoration: 'none',
            }}
          >
            Book now <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Service Drawer ──────────────────────────────────────────────────────── */
function ServiceDrawer({ svc, onClose }: { svc: typeof SERVICES[0]; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(7,15,26,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 70 }}
          transition={{ duration: 0.42, ease: 'easeOut' as const }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto"
          style={{ background: IVORY }}
          onClick={e => e.stopPropagation()}
        >
          {/* 3px gold gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: `linear-gradient(to right, transparent, ${GOLD}, ${GOLD_HOT}, ${GOLD}, transparent)` }} />

          {/* Hero colour strip (no image) */}
          <div className="relative overflow-hidden flex items-end" style={{ height: 280, background: 'linear-gradient(135deg, #0e2034 0%, #0C1B2C 100%)' }}>
            <button onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: 'rgba(7,15,26,0.65)', backdropFilter: 'blur(8px)', color: IVORY, border: `1px solid rgba(201,162,107,0.25)` }}>
              <X size={15} />
            </button>

            <div className="absolute bottom-6 left-8 right-16">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>{svc.num}</span>
                <div className="h-px flex-1 max-w-[40px]" style={{ background: `${GOLD}60` }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: `${GOLD_HOT}90`, fontFamily: 'var(--font-sans)' }}>{svc.tagline}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 600, lineHeight: 1.1 }}>
                {svc.title}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 sm:px-12 py-10">
            <p className="text-[15px] leading-[1.85] mb-10" style={{ color: 'rgba(12,27,44,0.75)', fontFamily: 'var(--font-sans)' }}>
              {svc.description}
            </p>

            {/* Why it's used — parchment block */}
            <div className="mb-10 px-7 py-6 relative" style={{ background: '#F7F3EE', borderLeft: `2px solid ${GOLD}` }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                Why It's Used
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(12,27,44,0.65)', fontFamily: 'var(--font-sans)' }}>
                {svc.whyUsed}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {/* Benefits */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                  Key Benefits
                </p>
                <ul className="space-y-3">
                  {svc.benefits.map(b => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'rgba(12,27,44,0.75)', fontFamily: 'var(--font-sans)' }}>
                      <span className="mt-1.5 shrink-0 text-[8px]" style={{ color: GOLD }}>◆</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatments — warm sand pills */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>
                  Available Treatments
                </p>
                <div className="flex flex-wrap gap-2">
                  {svc.treatments.map(t => (
                    <span key={t}
                      className="text-[12.5px] px-3.5 py-2 rounded-full"
                      style={{
                        color: 'rgba(12,27,44,0.75)',
                        background: 'rgba(196,168,130,0.14)',
                        border: '1px solid rgba(196,168,130,0.32)',
                        fontFamily: 'var(--font-sans)',
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-12 pt-8" style={{ borderTop: `1px solid rgba(201,162,107,0.20)` }}>
              <Link to="/booking" onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:opacity-90"
                style={{ background: NAVY, color: GOLD_HOT, fontFamily: 'var(--font-sans)', border: `1px solid rgba(201,162,107,0.30)` }}>
                Book This Service <ArrowRight size={12} />
              </Link>
              <a href={`https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20${encodeURIComponent(svc.title)}%20at%20ArtiZone%20Amman`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:opacity-90"
                style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
                <MessageCircle size={12} /> WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSvc = SERVICES.find(s => s.id === activeId) ?? null;

  const SITE_URL = 'https://artizonespa.com';
  const title = 'ArtiZone Amman | Laser, Skin, Body Slimming & Nails Clinic';
  const description = "ArtiZone is a premium beauty & aesthetic clinic in Amman offering laser hair removal, skin care, body slimming, nails & men's grooming. Book your free consultation today.";
  const canonicalUrl = `${SITE_URL}/services`;
  const ogImage = `${SITE_URL}/airo-assets/images/services/face-skin-care`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ArtiZone Beauty Services',
    description,
    url: canonicalUrl,
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.short,
        url: `${SITE_URL}/services/${s.id}`,
        image: `${SITE_URL}${s.image}`,
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'City', name: 'Amman' },
        serviceType: s.tagline,
      },
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Services', item: canonicalUrl },
      ],
    },
  };

  return (
    <>
      <style>{`
        @keyframes shine {
          to { background-position: -200% 0; }
        }
        @keyframes border-flow {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes sheen {
          0%, 55% { left: -70%; }
          85%, 100% { left: 130%; }
        }
        @keyframes ribbon-scroll {
          to { transform: translateX(-50%); }
        }
        @keyframes aurora-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(7vw, 5vh) scale(1.18); }
        }
        @keyframes scroll-cue {
          to { top: 110%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ribbon-track { animation: none !important; }
        }
      `}</style>

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:image"        content={ogImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="ArtiZone beauty and aesthetic services in Amman, Jordan" />
        <meta property="og:url"          content={canonicalUrl} />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Dark page background */}
      <div className="fixed inset-0 -z-10" style={{ background: MIDNIGHT }} />

      {/* Drawer */}
      {activeSvc && <ServiceDrawer svc={activeSvc} onClose={() => setActiveId(null)} />}

      <div style={{ background: 'transparent', minHeight: '100vh' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-24 sm:pt-40 sm:pb-36 overflow-hidden text-center">
          {/* Luxury hero image */}
          <div className="absolute inset-0 -z-10">
            <OptimizedImage
              src="/airo-assets/images/services/hero-video"
              alt="ArtiZone luxury beauty clinic — premium aesthetic treatments Amman Jordan"
              className="w-full h-full object-cover"
              priority
              width={1920} height={900}
            />
            {/* Multi-layer dark overlay for legibility */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,15,26,0.72) 0%, rgba(7,15,26,0.55) 50%, rgba(7,15,26,0.85) 100%)' }} />
            {/* Gold vignette glow */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(201,162,107,0.18) 0%, transparent 70%)' }} />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
              className="inline-flex items-center gap-3.5 justify-center text-[11.5px] font-normal uppercase tracking-[0.32em] mb-6"
              style={{ color: GOLD_HOT, fontFamily: 'var(--font-sans)' }}
            >
              <span style={{ color: GOLD, fontSize: 10 }}>✦</span>
              ArtiZone · Amman, Jordan
              <span style={{ color: GOLD, fontSize: 10 }}>✦</span>
            </motion.p>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-heading)',
                color: IVORY,
                fontSize: 'clamp(2.6rem,8vw,5.2rem)',
                lineHeight: 1.05,
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              Glow like<br />
              <em style={{
                fontStyle: 'italic',
                display: 'inline-block',
                background: `linear-gradient(110deg, ${GOLD} 15%, #FFF3D6 40%, ${ROSE} 60%, ${GOLD} 85%)`,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'shine 4.5s linear infinite',
                filter: 'drop-shadow(0 0 26px rgba(243,217,164,0.35))',
              }}>
                never before
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38 }}
              className="text-[17px] leading-relaxed mb-10 mx-auto"
              style={{ color: BODY_CLR, maxWidth: 480, fontFamily: 'var(--font-sans)' }}
            >
              Five worlds of premium beauty for women and men — facials, body sculpting, laser, nails, and gentlemen's grooming, all under one roof.
            </motion.p>

            {/* Quick-jump pills */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.52 }}
              className="flex flex-wrap gap-2.5 justify-center"
              aria-label="Browse services"
            >
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    const el = document.getElementById(`svc-${s.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-[12px] font-normal uppercase tracking-[0.14em] px-4 py-2.5 rounded-full transition-all duration-250"
                  style={{
                    color: GOLD_HOT,
                    border: `1px solid rgba(201,162,107,0.40)`,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,162,107,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,107,0.40)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {s.num} · {s.title}
                </button>
              ))}
            </motion.nav>

            {/* Scroll cue */}
            <div className="mx-auto mt-14 w-px h-14 relative overflow-hidden" style={{ background: 'rgba(201,162,107,0.20)' }}>
              <div className="absolute left-0 w-full h-1/2" style={{
                top: '-50%',
                background: GOLD_HOT,
                animation: 'scroll-cue 2s cubic-bezier(.22,1,.36,1) infinite',
              }} />
            </div>
          </div>
        </section>

        {/* ── SERVICE CARDS ─────────────────────────────────────────────────── */}
        <section className="pb-20 relative">
          {/* Subtle aurora glow behind cards */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute rounded-full" style={{ width: '55vw', height: '55vw', background: 'rgba(201,162,107,0.10)', top: '10%', left: '-20%', filter: 'blur(100px)' }} />
            <div className="absolute rounded-full" style={{ width: '50vw', height: '50vw', background: 'rgba(232,180,160,0.08)', bottom: '10%', right: '-15%', filter: 'blur(100px)' }} />
          </div>
          <div className="max-w-[760px] lg:max-w-[900px] mx-auto px-5 sm:px-8 lg:px-[6vw] flex flex-col gap-9">
            {SERVICES.map((svc, i) => (
              <div key={svc.id} id={`svc-${svc.id}`}>
                <ServiceCard svc={svc} index={i} onExplore={() => setActiveId(svc.id)} />
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32 text-center relative overflow-hidden">
          {/* Candlelight glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 100%, rgba(201,162,107,0.14), transparent 70%)' }} />

          {/* Ornament divider */}
          <div className="flex items-center justify-center gap-4 mb-10 max-w-[260px] mx-auto">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } } }}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-screen-xl mx-auto px-6 sm:px-10 relative z-10"
          >
            <p className="text-[11.5px] font-normal uppercase tracking-[0.32em] mb-5" style={{ color: GOLD_HOT, fontFamily: 'var(--font-sans)' }}>
              Ready to Begin?
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                color: IVORY,
                fontSize: 'clamp(2rem,5vw,3.4rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: '1rem',
              }}
            >
              Ready to{' '}
              <em style={{
                fontStyle: 'italic',
                background: `linear-gradient(110deg, ${GOLD}, #FFF3D6, ${ROSE}, ${GOLD})`,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'shine 4.5s linear infinite',
              }}>
                shine?
              </em>
            </h2>
            <p className="text-[15px] max-w-[42ch] mx-auto mb-12 leading-relaxed" style={{ color: BODY_CLR, fontFamily: 'var(--font-sans)' }}>
              Reserve your treatment in under a minute — same-day appointments often available.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <Link to="/booking"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-4 text-[11.5px] font-semibold uppercase tracking-[0.22em] transition-all duration-200"
                style={{
                  background: `linear-gradient(110deg, ${GOLD} 10%, ${GOLD_HOT} 45%, ${ROSE} 90%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shine 4s linear infinite',
                  color: MIDNIGHT,
                  fontFamily: 'var(--font-sans)',
                  boxShadow: `0 4px 22px rgba(201,162,107,0.35)`,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                Book Appointment <ArrowRight size={12} />
              </Link>
              <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20ArtiZone%20Amman"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-4 text-[11.5px] font-semibold uppercase tracking-[0.22em] transition-all duration-200 hover:opacity-90"
                style={{ background: 'transparent', color: GOLD_HOT, border: `1px solid rgba(201,162,107,0.50)`, fontFamily: 'var(--font-sans)' }}>
                <MessageCircle size={12} /> WhatsApp Us
              </a>
            </div>

            <p className="mt-10 text-[11px] uppercase tracking-[0.34em]" style={{ color: 'rgba(201,211,222,0.45)', fontFamily: 'var(--font-sans)' }}>
              ArtiZone · Amman, Jordan
            </p>
          </motion.div>
        </section>
      </div>

      {/* ── STICKY MOBILE BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ background: 'rgba(7,15,26,0.97)', backdropFilter: 'blur(16px)', borderTop: `1px solid rgba(201,162,107,0.18)`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch">
          <a href="tel:+962790412758"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ color: 'rgba(247,242,231,0.70)', fontFamily: 'var(--font-sans)' }}>
            <Phone size={15} style={{ color: GOLD }} /> Call
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <a href="https://wa.me/962790412758?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services%20at%20ArtiZone%20Amman"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: '#25D366', color: '#fff', fontFamily: 'var(--font-sans)' }}>
            <MessageCircle size={15} /> WhatsApp
          </a>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <Link to="/booking"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] active:opacity-80"
            style={{ background: GOLD, color: MIDNIGHT, fontFamily: 'var(--font-sans)' }}>
            <Sparkles size={13} /> Book Now
          </Link>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
