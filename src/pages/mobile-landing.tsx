import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';

const FOREST = '#C4A882';   /* caramel tan */
const TEAL   = '#ADAF10';   /* dusty mauve */
const BARK   = '#0E2A3A';   /* deep warm brown */
const IVORY  = '#FDFAF6';   /* blush */
const MINT   = '#D0BC99';   /* warm greige */
const MOSS   = '#EFF2EB';   /* warm blush */

const SERVICES = [
  { title: 'Face & Skin Care',          icon: '✦', href: '/services', color: FOREST },
  { title: 'Laser Hair Removal',        icon: '◈', href: '/services', color: TEAL   },
  { title: 'Hair Removal',              icon: '◇', href: '/services', color: FOREST },
  { title: 'Nails & Foot Care',         icon: '◆', href: '/services', color: TEAL   },
  { title: 'Body Slimming',             icon: '◉', href: '/services', color: FOREST },
  { title: "Men's Grooming",            icon: '◎', href: '/services', color: TEAL   },
];

export default function MobileLanding() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan</title>
        <meta name="description" content="Premium beauty and aesthetic treatments in Amman. Facials, laser hair removal, nails, body slimming, and men's grooming." />
        <link rel="canonical" href="https://artizonespa.com" />
        <meta property="og:title" content="ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan" />
        <meta property="og:description" content="Premium beauty and aesthetic treatments in Amman. Facials, laser hair removal, nails, body slimming, and men's grooming." />
        <meta property="og:image" content="https://artizonespa.com/airo-assets/images/pages/home/hero" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ArtiZone Beauty & Aesthetic Clinic Amman" />
        <meta property="og:url" content="https://artizonespa.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan" />
        <meta name="twitter:description" content="Premium beauty and aesthetic treatments in Amman. Facials, laser hair removal, nails, body slimming, and men's grooming." />
        <meta name="twitter:image" content="https://artizonespa.com/airo-assets/images/pages/home/hero" />
      </Helmet>

      <div style={{ background: BARK, minHeight: '100svh' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>

          {/* Background (no image) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)' }} />

          {/* Overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(18,42,30,0.30) 0%, rgba(18,42,30,0.10) 25%, rgba(18,42,30,0.65) 60%, rgba(18,42,30,0.97) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(18,42,30,0.40) 0%, transparent 70%)' }} />

          {/* Top glow */}
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${MINT}55, transparent)` }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-10 pt-28" style={{ minHeight: '100svh' }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-5 h-px" style={{ background: FOREST }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>
                ArtiZone · Amman, Jordan
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'rgba(235,242,238,0.96)',
                fontSize: 'clamp(2.6rem, 11vw, 4.5rem)',
                lineHeight: 1.08,
                fontWeight: 400,
                marginBottom: '1rem',
              }}
            >
              Beauty &amp; <em style={{ color: MINT, fontStyle: 'italic' }}>Aesthetic</em>{' '}
              Care
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-sm leading-relaxed mb-8 max-w-xs"
              style={{ color: 'rgba(235,242,238,0.58)', fontFamily: 'var(--font-sans)' }}
            >
              Professional skin care, laser, nails, body slimming &amp; men's grooming — all in one modern clinic.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
              className="flex flex-col gap-3 mb-8"
            >
              <Link to="/booking"
                className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.20em] transition-all duration-200 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${MINT} 0%, ${FOREST} 100%)`, color: BARK, fontFamily: 'var(--font-sans)', boxShadow: `0 0 24px rgba(126,207,176,0.30)` }}>
                <Sparkles size={13} /> Book Appointment
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="grid grid-cols-4 gap-2 pt-6"
              style={{ borderTop: '1px solid rgba(126,207,176,0.12)' }}
            >
              {[
                { val: '5+',     label: 'Years'    },
                { val: '2K+',    label: 'Clients'  },
                { val: '20+',    label: 'Services' },
                { val: '5★',     label: 'Rating'   },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span style={{ fontFamily: 'var(--font-heading)', color: MINT, fontSize: '1.3rem', fontWeight: 500 }}>{val}</span>
                  <span className="text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(235,242,238,0.38)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SERVICES GRID ─────────────────────────────────────────────────── */}
        <section className="px-5 py-10" style={{ background: 'rgba(18,42,30,0.98)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>What We Offer</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.92)', fontSize: '1.8rem', fontWeight: 400 }}>Our Services</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link to={svc.href}
                  className="flex flex-col gap-2 p-4 h-full transition-all duration-200 active:scale-95"
                  style={{ background: 'rgba(28,58,46,0.55)', border: '1px solid rgba(58,140,110,0.18)' }}>
                  <span className="text-lg" style={{ color: svc.color }}>{svc.icon}</span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: 'rgba(235,242,238,0.80)', fontFamily: 'var(--font-sans)' }}>{svc.title}</span>
                  <span className="mt-auto flex items-center gap-1 text-[9px] uppercase tracking-[0.14em]" style={{ color: svc.color, fontFamily: 'var(--font-sans)' }}>
                    Explore <ArrowRight size={9} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4"
          >
            <Link to="/services"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200"
              style={{ border: '1px solid rgba(58,140,110,0.30)', color: MINT, background: 'transparent', fontFamily: 'var(--font-sans)' }}>
              View All Services <ArrowRight size={11} />
            </Link>
          </motion.div>
        </section>

        {/* ── WHY ARTIZONE ──────────────────────────────────────────────────── */}
        <section className="px-5 py-10" style={{ background: MOSS }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: FOREST, fontFamily: 'var(--font-sans)' }}>Why Choose Us</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: BARK, fontSize: '1.8rem', fontWeight: 400 }}>The ArtiZone Difference</h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {[
              { num: '01', title: 'Professional Care',       body: 'Personalised treatments based on your unique skin type and needs.' },
              { num: '02', title: 'For Women & Men',         body: 'A comfortable, private, and welcoming space for everyone.' },
              { num: '03', title: 'Modern Treatments',       body: 'Laser, skin care, body slimming — professional and effective.' },
              { num: '04', title: 'Clean & Relaxing Clinic', body: 'Hygiene, comfort, and high-quality service every single visit.' },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 p-4"
                style={{ background: IVORY, borderLeft: `3px solid ${FOREST}` }}
              >
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: FOREST, fontFamily: 'var(--font-sans)' }}>{item.num}</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: BARK, fontFamily: 'var(--font-sans)' }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,58,46,0.55)', fontFamily: 'var(--font-sans)' }}>{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CONTACT STRIP ─────────────────────────────────────────────────── */}
        <section className="px-5 py-10" style={{ background: BARK }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>Find Us</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.92)', fontSize: '1.8rem', fontWeight: 400 }}>Visit the Clinic</h2>
          </motion.div>

          {/* Map thumbnail */}
          <a href="https://maps.app.goo.gl/Scp8Do5U9sgNGpSz7" target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 mb-5 py-8 relative overflow-hidden"
            style={{ border: '1px solid rgba(58,140,110,0.22)', background: 'rgba(28,58,46,0.60)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(58,140,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(58,140,110,0.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={MINT} strokeWidth="1.5" className="relative z-10">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill={MINT} stroke="none"/>
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] relative z-10" style={{ color: 'rgba(126,207,176,0.80)', fontFamily: 'var(--font-sans)' }}>
              Open in Google Maps
            </span>
          </a>

          <div className="flex flex-col gap-4">
            {[
              { icon: <MapPin size={14} />, text: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St., Amman', href: 'https://maps.app.goo.gl/Scp8Do5U9sgNGpSz7' },
              { icon: <Phone size={14} />, text: '+962 79 041 2758', href: 'tel:+962790412758' },
              { icon: <Phone size={14} />, text: '+962 79 282 8024', href: 'tel:+962792828024' },
              { icon: <Clock size={14} />, text: 'Sat–Thu 10am–9pm · Fri 2pm–9pm', href: undefined },
            ].map(({ icon, text, href }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" style={{ color: FOREST }}>{icon}</span>
                {href
                  ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm leading-relaxed" style={{ color: 'rgba(235,242,238,0.55)', fontFamily: 'var(--font-sans)' }}>{text}</a>
                  : <span className="text-sm leading-relaxed" style={{ color: 'rgba(235,242,238,0.55)', fontFamily: 'var(--font-sans)' }}>{text}</span>
                }
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
        <section className="px-5 py-10 text-center" style={{ background: 'rgba(18,42,30,0.98)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(58,140,110,0.12) 0%, transparent 70%)' }} />
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: MINT, fontFamily: 'var(--font-sans)' }}>Ready to Begin?</p>
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(235,242,238,0.95)', fontSize: '1.9rem', fontWeight: 400 }}>
              Book Your <em style={{ color: MINT, fontStyle: 'italic' }}>Treatment</em> Today
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(235,242,238,0.45)', fontFamily: 'var(--font-sans)' }}>
              Contact us to schedule or ask about any of our services.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/booking"
                className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.20em]"
                style={{ background: `linear-gradient(135deg, ${MINT} 0%, ${FOREST} 100%)`, color: BARK, fontFamily: 'var(--font-sans)', boxShadow: `0 0 24px rgba(126,207,176,0.25)` }}>
                <Sparkles size={13} /> Book Appointment
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}
