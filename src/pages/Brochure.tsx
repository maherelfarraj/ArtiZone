/**
 * ArtiZone — Luxury Services Brochure
 * Printable / saveable as PDF via browser print dialog.
 * Route: /brochure
 */
import { useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { Printer, Phone, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

/* ── Palette ──────────────────────────────────────────────────────────────── */
const BARK        = '#0E2A3A';
const BARK_DEEP   = '#3D2218';
const PARCHMENT   = '#F5EFE4';
const PARCHMENT2  = '#EDE4D6';
const TEAL        = '#C4A882';
const TERRACOTTA  = '#C4A882';
const GOLD        = '#C4A882';
const CREAM       = '#FBF7F2';
const DARK        = '#0E2A3A';

/* ── Service data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    num: '01', id: 'face-skin-care',
    title: 'Face & Skin Care',
    tagline: 'Reveal your natural glow',
    image: '/airo-assets/images/services/face-skin-care',
    description: 'Your skin is your most visible asset — and it deserves expert attention. Our face and skin care treatments are individually tailored to your skin type, tone, and concerns. Whether you struggle with acne, dullness, uneven texture, or early signs of aging, our certified aestheticians design a personalised protocol using medical-grade products and advanced technology.',
    benefits: ['Deeply cleanses pores and removes blackheads', 'Boosts collagen and elastin for firmer skin', 'Reduces fine lines, wrinkles, and age spots', 'Evens skin tone and fades hyperpigmentation', 'Restores hydration and natural radiance', 'Controls acne and prevents future breakouts'],
    treatments: ['Deep Cleansing Facial', 'Hydrafacial', 'Chemical Peel', 'LED Light Therapy', 'Microneedling', 'Anti-Aging Treatment', 'Brightening & Whitening Facial', 'Acne Treatment', 'Oxygen Facial', 'Dermaplaning'],
  },
  {
    num: '02', id: 'laser-hair-removal',
    title: 'Laser Hair Removal',
    tagline: 'Smooth skin, lasting results',
    image: '/airo-assets/images/services/laser-hair-removal',
    description: 'Say goodbye to the endless cycle of shaving, waxing, and threading. Our professional laser hair removal service uses the latest diode and Nd:YAG laser technology, safe for all skin types including darker tones. Treatments are precise, fast, and progressively permanent — with each session reducing hair density until regrowth stops entirely.',
    benefits: ['Permanent reduction of unwanted hair growth', 'Eliminates ingrown hairs and razor bumps', 'Smooth, soft skin with no stubble or regrowth', 'Saves time and money compared to waxing', 'Safe for face, body, and sensitive areas', 'Suitable for all skin tones with proper settings'],
    treatments: ['Full Body Laser', 'Face & Upper Lip', 'Underarms', 'Bikini & Brazilian', 'Legs (Full / Half)', 'Arms (Full / Half)', 'Back & Chest (Men)', 'Neck & Jawline', 'Hands & Feet', 'Touch-Up Sessions'],
  },
  {
    num: '03', id: 'hair-removal',
    title: 'Waxing & Threading',
    tagline: 'Gentle, precise, and professional',
    image: '/airo-assets/images/services/hair-removal',
    description: 'For clients who prefer traditional or non-laser hair removal, we offer a full range of professional waxing, threading, and sugaring services. Our specialists are trained in the most gentle and precise techniques to minimise discomfort while delivering clean, smooth results. We use high-quality wax formulas suited to sensitive skin.',
    benefits: ['Removes hair from the root for longer-lasting smoothness', 'Hair grows back finer and softer with repeated sessions', 'Threading allows precise eyebrow shaping and design', 'Sugaring is 100% natural and gentle on sensitive skin', 'No harsh chemicals — suitable for reactive skin types', 'Immediate results with no recovery time'],
    treatments: ['Waxing — Full Body', 'Waxing — Face', 'Waxing — Bikini & Brazilian', 'Threading — Eyebrows', 'Threading — Upper Lip & Chin', 'Threading — Full Face', 'Sugaring', 'Eyebrow Shaping & Design', 'Eyebrow Tinting', 'Eyelash Tinting'],
  },
  {
    num: '04', id: 'nails-foot-care',
    title: 'Nails & Foot Care',
    tagline: 'Elegance at your fingertips',
    image: '/airo-assets/images/services/nails-foot-care',
    description: 'Beautiful nails are a finishing touch that elevates your entire look. Our nail technicians are skilled in everything from classic manicures and pedicures to intricate nail art, gel extensions, and acrylic overlays. We use premium, long-lasting products and maintain the highest hygiene standards. Our foot care treatments address calluses, dry skin, and nail health.',
    benefits: ['Long-lasting colour and shine with gel formulas', 'Strengthens brittle or damaged nails', 'Prevents and treats nail fungal infections', 'Removes calluses and softens rough skin on feet', 'Cuticle care promotes healthy nail growth', 'Nail art and designs for every occasion'],
    treatments: ['Classic Manicure', 'Gel Manicure', 'Nail Art & Designs', 'Acrylic Nails', 'Nail Extensions', 'Classic Pedicure', 'Spa Pedicure', 'Gel Pedicure', 'Foot Scrub & Mask', 'Nail Repair'],
  },
  {
    num: '05', id: 'body-slimming',
    title: 'Body Slimming & Contouring',
    tagline: 'Shape your confidence',
    image: '/airo-assets/images/services/body-slimming',
    description: 'Achieve the body shape you want without surgery or downtime. Our non-invasive body slimming and contouring treatments use clinically proven technologies to break down stubborn fat deposits, tighten loose skin, reduce cellulite, and sculpt your natural curves. Each treatment plan is customised after a full body assessment.',
    benefits: ['Reduces stubborn fat in targeted areas', 'Tightens loose and sagging skin non-surgically', 'Visibly reduces cellulite and improves skin texture', 'Sculpts and defines natural body contours', 'Stimulates collagen production for firmer skin', 'No surgery, no anaesthesia, no recovery time'],
    treatments: ['Cavitation (Ultrasound Fat Reduction)', 'Radiofrequency Skin Tightening', 'Cryolipolysis (Fat Freezing)', 'Lymphatic Drainage Massage', 'Body Wrap Treatment', 'Cellulite Reduction', 'Vacuum Therapy', 'EMS Body Sculpting', 'Slimming Massage', 'Post-Pregnancy Body Treatment'],
  },
  {
    num: '06', id: 'mens-grooming',
    title: "Men's Grooming & Aesthetics",
    tagline: 'Premium care for men',
    image: '/airo-assets/images/services/mens-grooming',
    description: "Modern men deserve modern grooming. ArtiZone offers a dedicated men's aesthetics service in a private, professional environment — free from judgment and designed around men's specific skin and body needs. From deep cleansing facials and anti-aging treatments to laser hair removal for the back and chest, beard shaping, and body slimming.",
    benefits: ["Facials designed specifically for men's thicker skin", 'Laser hair removal for back, chest, neck, and shoulders', 'Beard shaping and grooming for a sharp, clean look', 'Acne and scar treatment for post-shaving skin damage', 'Body slimming and muscle definition treatments', 'Private, comfortable environment tailored for men'],
    treatments: ["Men's Deep Cleansing Facial", "Men's Anti-Aging Treatment", 'Laser Hair Removal (Back, Chest, Neck)', 'Beard Shaping & Grooming', 'Eyebrow Shaping for Men', 'Body Slimming Treatments', 'Skin Brightening', 'Acne & Scar Treatment', 'Waxing (Back, Chest, Arms)', "Men's Manicure & Pedicure"],
  },
];

/* ── Gold rule divider ────────────────────────────────────────────────────── */
function GoldRule({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: light ? 'rgba(214,162,61,0.22)' : 'rgba(214,162,61,0.35)' }} />
      <div style={{ width: '5px', height: '5px', transform: 'rotate(45deg)', background: GOLD, opacity: light ? 0.45 : 0.8 }} />
      <div style={{ flex: 1, height: '1px', background: light ? 'rgba(214,162,61,0.22)' : 'rgba(214,162,61,0.35)' }} />
    </div>
  );
}

/* ── Cover page ───────────────────────────────────────────────────────────── */
function CoverPage() {
  return (
    <div
      className="print-page"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${BARK_DEEP} 0%, ${BARK} 55%, #7A4A3A 100%)`,
        minHeight: '100vh',
        padding: 'clamp(40px,7vw,96px) clamp(24px,6vw,80px)',
        gap: '32px',
        boxSizing: 'border-box',
      }}
    >
      {/* Corner ornaments — inset enough to never clip on 390px */}
      {[
        { top: 16, left: 16, borderRight: 'none', borderBottom: 'none' },
        { top: 16, right: 16, borderLeft: 'none', borderBottom: 'none' },
        { bottom: 16, left: 16, borderRight: 'none', borderTop: 'none' },
        { bottom: 16, right: 16, borderLeft: 'none', borderTop: 'none' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 40, height: 40, opacity: 0.22, border: `1px solid ${GOLD}`, ...s }} />
      ))}

      {/* Logo + tagline strip */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,6vw,3rem)', fontWeight: 600, color: GOLD, letterSpacing: '0.08em' }}>
          ArtiZone
        </span>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ height: 1, width: 40, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
          <p style={{ color: GOLD, fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
            Beauty · Skin · Body · Laser
          </p>
          <div style={{ height: 1, width: 40, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
        </div>
      </div>

      {/* Main title block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 520 }}>
        <p style={{ color: 'rgba(214,162,61,0.7)', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>
          Services Brochure · 2026
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(2.4rem,7vw,5.5rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.01em', margin: '0 0 16px' }}>
          The Art of<br />
          <span style={{ color: GOLD, fontStyle: 'italic' }}>Beautiful</span> Living
        </h1>
        <GoldRule light />
        <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(253,250,246,0.62)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.8, margin: 0 }}>
          Six categories of premium aesthetic treatments — expertly delivered in Amman's most trusted beauty clinic.
        </p>
      </div>

      {/* Contact strip */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
        <div style={{ height: 1, width: '100%', marginBottom: 20, background: `linear-gradient(to right, transparent, rgba(214,162,61,0.38), transparent)` }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[
            { icon: <Phone size={12} />, text: '+962 79 041 2758' },
            { icon: <MapPin size={12} />, text: 'Arjan St., 2nd Floor, Amman' },
            { icon: <Clock size={12} />, text: 'Sat–Thu 10AM–9PM · Fri 2PM–9PM' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: GOLD, display: 'flex' }}>{icon}</span>
              <span style={{ color: 'rgba(253,250,246,0.52)', fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '0.04em' }}>{text}</span>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(253,250,246,0.22)', fontFamily: 'var(--font-sans)', fontSize: '11px', textAlign: 'center', marginTop: 16, letterSpacing: '0.08em' }}>
          artizonespa.com
        </p>
      </div>
    </div>
  );
}

/* ── Single service spread ────────────────────────────────────────────────── */
function ServiceSpread({ svc, flip }: { svc: typeof SERVICES[0]; flip: boolean }) {
  return (
    <div className={`print-page brochure-spread spread-${svc.id}`} style={{ background: flip ? PARCHMENT2 : PARCHMENT, overflow: 'hidden' }}>

      {/* IMAGE — always first in DOM so it's always on top on mobile */}
      <div
        className="brochure-img-panel"
        style={{ position: 'relative', minHeight: 260, overflow: 'hidden' }}
      >
        <OptimizedImage
          src={svc.image}
          alt={svc.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.88) saturate(0.9)' }}
          width={800} height={260}
        />
        {/* Directional gradient — on desktop points inward toward text */}
        <div style={{
          position: 'absolute', inset: 0,
          background: flip
            ? 'linear-gradient(to right, rgba(14,42,58,0.5) 0%, rgba(14,42,58,0.08) 55%, transparent 100%)'
            : 'linear-gradient(to left, rgba(14,42,58,0.5) 0%, rgba(14,42,58,0.08) 55%, transparent 100%)',
        }} />
        {/* Watermark number */}
        <div style={{
          position: 'absolute', bottom: -16, [flip ? 'left' : 'right']: -8,
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(80px,20vw,180px)',
          fontWeight: 700, color: 'rgba(255,255,255,0.06)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {svc.num}
        </div>
      </div>

      {/* TEXT PANEL */}
      <div
        className="brochure-text-panel"
        style={{ padding: 'clamp(24px,5vw,64px) clamp(20px,4vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* Number + tagline row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: TEAL, letterSpacing: '0.18em', fontWeight: 600 }}>
            {svc.num}
          </span>
          <div style={{ height: 1, width: 28, background: 'rgba(196,168,130,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: TEAL, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {svc.tagline}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 400, color: DARK, lineHeight: 1.1, margin: '0 0 4px' }}>
          {svc.title}
        </h2>

        <GoldRule />

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(44,26,14,0.68)', lineHeight: 1.8, margin: '0 0 20px' }}>
          {svc.description}
        </p>

        {/* Benefits */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL, fontWeight: 700, margin: '0 0 12px' }}>
            Key Benefits
          </p>
          <div className="brochure-benefits-grid">
            {svc.benefits.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.28)' }}>
                  <Check size={10} style={{ color: TEAL }} />
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(44,26,14,0.65)', lineHeight: 1.55 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Treatments */}
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: TERRACOTTA, fontWeight: 700, margin: '0 0 12px' }}>
            Available Treatments
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {svc.treatments.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(44,26,14,0.65)', background: 'rgba(200,110,70,0.08)', border: '1px solid rgba(200,110,70,0.22)', padding: '5px 11px', letterSpacing: '0.02em' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Back cover ───────────────────────────────────────────────────────────── */
function BackCover() {
  return (
    <div
      className="print-page"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        background: `linear-gradient(160deg, #3D2218 0%, ${BARK} 60%, #7A4A3A 100%)`,
        minHeight: '100vh',
        padding: 'clamp(40px,7vw,96px) clamp(24px,6vw,80px)',
        gap: 'clamp(28px,5vw,56px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Corner ornaments */}
      {[
        { top: 16, left: 16, borderRight: 'none', borderBottom: 'none' },
        { top: 16, right: 16, borderLeft: 'none', borderBottom: 'none' },
        { bottom: 16, left: 16, borderRight: 'none', borderTop: 'none' },
        { bottom: 16, right: 16, borderLeft: 'none', borderTop: 'none' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 40, height: 40, opacity: 0.2, border: `1px solid ${GOLD}`, ...s }} />
      ))}

      {/* Brand promise */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 600 }}>
        <p style={{ color: 'rgba(214,162,61,0.6)', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>
          Our Promise
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(1.7rem,4vw,3.2rem)', fontWeight: 300, lineHeight: 1.15, margin: '0 0 16px' }}>
          Every treatment. Every client.<br />
          <span style={{ color: GOLD, fontStyle: 'italic' }}>Exceptional results.</span>
        </h2>
        <GoldRule light />
        <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(253,250,246,0.55)', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
          At ArtiZone, we combine the latest aesthetic technology with the warmth of personalised care. Our certified specialists are committed to your comfort, safety, and satisfaction — every single visit.
        </p>
      </div>

      {/* Contact cards */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 640 }}>
        <div className="brochure-contact-grid">
          {[
            { icon: <Phone size={20} />, label: 'Call Us', lines: ['+962 79 041 2758', '+962 79 282 8024'] },
            { icon: <MapPin size={20} />, label: 'Find Us', lines: ['Arjan Street, 2nd Floor', 'Mazen Al-Kurdi St., Amman'] },
            { icon: <Clock size={20} />, label: 'Hours', lines: ['Sat – Thu: 10AM – 9PM', 'Friday: 2PM – 9PM'] },
          ].map(({ icon, label, lines }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px', background: 'rgba(253,250,246,0.06)', border: `1px solid rgba(214,162,61,0.18)` }}>
              <div style={{ color: GOLD, marginBottom: 10 }}>{icon}</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, fontWeight: 700, marginTop: 0 }}>
                {label}
              </p>
              {lines.map(l => (
                <p key={l} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(253,250,246,0.58)', lineHeight: 1.7, margin: 0 }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Logo + footer */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ height: 1, width: 160, marginBottom: 20, background: `linear-gradient(to right, transparent, rgba(214,162,61,0.38), transparent)` }} />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600, color: `rgba(196,168,130,0.72)`, letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>
          ArtiZone
        </span>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(253,250,246,0.32)', letterSpacing: '0.1em', margin: 0 }}>
          artizonespa.com
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(253,250,246,0.18)', letterSpacing: '0.06em', marginTop: 6 }}>
          © 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan
        </p>
      </div>
    </div>
  );
}

/* ── Responsive + print styles ────────────────────────────────────────────── */
const BROCHURE_CSS = `
  /* ── Mobile default: single column, image on top ── */
  .brochure-spread {
    display: flex;
    flex-direction: column;
  }
  .brochure-img-panel {
    width: 100%;
    min-height: 260px;
    max-height: 380px;
    flex-shrink: 0;
  }
  .brochure-text-panel {
    width: 100%;
  }
  .brochure-benefits-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .brochure-contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* ── Tablet / landscape phone (600px+): contact cards go 3-col ── */
  @media (min-width: 600px) {
    .brochure-contact-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* ── Desktop (768px+): side-by-side spreads ── */
  @media (min-width: 768px) {
    .brochure-spread {
      display: grid !important;
      min-height: 100vh;
    }
    .spread-face-skin-care  { grid-template-columns: 1.15fr 1fr; }
    .spread-laser-hair-removal { grid-template-columns: 1fr 1.15fr; }
    .spread-hair-removal    { grid-template-columns: 1.15fr 1fr; }
    .spread-nails-foot-care { grid-template-columns: 1fr 1.15fr; }
    .spread-body-slimming   { grid-template-columns: 1.15fr 1fr; }
    .spread-mens-grooming   { grid-template-columns: 1fr 1.15fr; }

    /* Flip: image goes to the right — push it via order */
    .spread-laser-hair-removal .brochure-img-panel,
    .spread-nails-foot-care .brochure-img-panel,
    .spread-mens-grooming .brochure-img-panel { order: 2; }
    .spread-laser-hair-removal .brochure-text-panel,
    .spread-nails-foot-care .brochure-text-panel,
    .spread-mens-grooming .brochure-text-panel { order: 1; }

    .brochure-img-panel {
      max-height: none !important;
      min-height: 100% !important;
    }
    .brochure-benefits-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ── Print ── */
  @media print {
    @page { size: A4 landscape; margin: 0; }
    body { margin: 0 !important; }
    header, footer, nav, .no-print { display: none !important; }
    .print-page { page-break-after: always; break-after: page; }
    .print-page:last-child { page-break-after: avoid; break-after: avoid; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .brochure-spread { display: grid !important; min-height: 100vh; }
  }
`;

/* ── Main brochure page ───────────────────────────────────────────────────── */
export default function Brochure() {
  const brochureRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => window.print();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Services Brochure | ArtiZone Beauty & Aesthetic Clinic Amman',
    description: 'Download or print the ArtiZone services brochure — all 6 treatment categories including laser hair removal, facials, body slimming, nails, and men\'s grooming.',
    url: 'https://artizonespa.com/brochure',
    publisher: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: 'https://artizonespa.com',
      address: { '@type': 'PostalAddress', streetAddress: 'Al-Sweifieh', addressLocality: 'Amman', addressCountry: 'JO' },
    },
  };

  return (
    <>
      <Helmet>
        <title>Services Brochure | ArtiZone Beauty & Aesthetic Clinic Amman</title>
        <meta name="description" content="Download or print the ArtiZone services brochure — all 6 treatment categories including laser hair removal, facials, body slimming, nails, and men's grooming." />
        <link rel="canonical" href="https://artizonespa.com/brochure" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <meta property="og:title" content="Services Brochure | ArtiZone Beauty & Aesthetic Clinic Amman" />
        <meta property="og:description" content="Download or print the ArtiZone services brochure — all 6 treatment categories including laser hair removal, facials, body slimming, nails, and men's grooming." />
        <meta property="og:image" content="https://artizonespa.com/airo-assets/images/services/face-skin-care" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ArtiZone Services Brochure" />
        <meta property="og:url" content="https://artizonespa.com/brochure" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services Brochure | ArtiZone Beauty & Aesthetic Clinic Amman" />
        <meta name="twitter:description" content="Download or print the ArtiZone services brochure — all 6 treatment categories including laser hair removal, facials, body slimming, nails, and men's grooming." />
        <meta name="twitter:image" content="https://artizonespa.com/airo-assets/images/services/face-skin-care" />
        <style>{BROCHURE_CSS}</style>
      </Helmet>

      {/* ── Screen-only top bar ── */}
      <div
        className="no-print"
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, padding: '0 16px',
          background: BARK,
          borderBottom: `1px solid rgba(214,162,61,0.2)`,
          minHeight: 52,
        }}
      >
        {/* Back link — 48px tap target */}
        <Link
          to="/services"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            minHeight: 48, padding: '0 4px',
            color: 'rgba(253,250,246,0.62)', fontFamily: 'var(--font-sans)',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          ← Back
        </Link>

        {/* Centre label — hidden on small screens */}
        <span
          className="hidden md:block"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(253,250,246,0.3)', letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          ArtiZone Services Brochure 2026
        </span>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link
            to="/booking"
            className="hidden sm:inline-flex"
            style={{
              alignItems: 'center', gap: 6,
              minHeight: 48, padding: '0 16px',
              color: CREAM, border: `1px solid rgba(200,110,70,0.45)`,
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Book Now <ArrowRight size={11} />
          </Link>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              minHeight: 48, padding: '0 18px',
              background: GOLD, color: DARK,
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Save as PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* ── Brochure body ── */}
      <div ref={brochureRef}>
        <CoverPage />
        {SERVICES.map((svc, i) => (
          <ServiceSpread key={svc.id} svc={svc} flip={i % 2 !== 0} />
        ))}
        <BackCover />
      </div>
    </>
  );
}
