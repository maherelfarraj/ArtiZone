import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Instagram, ArrowRight, CheckCircle, Send, Mail,
} from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { buildBeautySalonSchema, SITE_URL } from '@/lib/gbp-schema';

const GOLD       = '#C4A882'; /* Warm Sand — accent                    */
const TAUPE      = '#0E2A3A'; /* Ink Navy — dark bg                    */
const CREAM      = '#FDFAF6'; /* Ivory — light surface                 */
const CREAM_DARK = '#F7F3EE'; /* Parchment — section bg                */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

// ─── Contact info cards ───────────────────────────────────────────────────────
const contactCards = [
  {
    icon: <MapPin size={22} style={{ color: GOLD }} />,
    title: 'Our Location',
    lines: ['Complex Arjan Street, 2nd Floor', 'Mazen Al-Kurdi St., Amman'],
    action: { label: 'Get Directions', href: 'https://maps.app.goo.gl/Scp8Do5U9sgNGpSz7' },
  },
  {
    icon: <Phone size={22} style={{ color: GOLD }} />,
    title: 'Call Us',
    lines: ['+962 79 041 2758', '+962 79 282 8024'],
    action: { label: 'Call Line 1', href: 'tel:+962790412758' },
  },
  {
    icon: <Mail size={22} style={{ color: GOLD }} />,
    title: 'Email Us',
    lines: ['info@artizonespa.com', 'We reply within 24 hours'],
    action: { label: 'Send Email', href: 'mailto:info@artizonespa.com' },
  },
  {
    icon: <Clock size={22} style={{ color: GOLD }} />,
    title: 'Working Hours',
    lines: ['Sat – Thu: 10:00 AM – 9:00 PM', 'Fri: 2:00 PM – 9:00 PM'],
    action: null,
  },
];

// ─── Social channels ──────────────────────────────────────────────────────────
const socials = [
  {
    name: 'Instagram',
    handle: '@artizone.jo',
    href: 'https://instagram.com/artizone_clinic',
    icon: <Instagram size={22} style={{ color: GOLD }} />,
    description: 'Follow us for treatment results, tips, and offers.',
  },
  {
    name: 'TikTok',
    handle: '@artizone.jo',
    href: 'https://tiktok.com/@artizone.jo',
    icon: <TikTokIcon size={22} />,
    description: 'Watch our treatment videos and behind-the-scenes content.',
  },
];

// ─── Form state ───────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    if (!form.message.trim()) e.message = 'Please write a message.';
    return e;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const inputBase: React.CSSProperties = {
    background: CREAM,
    border: `1.5px solid rgba(61,46,38,0.15)`,
    color: TAUPE,
  };

  return (
    <>
      <Helmet>
        <title>Contact ArtiZone — Beauty Clinic in Amman, Jordan</title>
        <meta name="description" content="Contact ArtiZone Beauty & Aesthetic Clinic in Amman. Call 079 041 2758, email info@artizonespa.com, or visit us. Sat–Thu 10AM–9PM, Fri 2PM–9PM." />
        <link rel="canonical" href="https://artizonespa.com/contact" />
        <meta property="og:title"        content="Contact ArtiZone — Beauty Clinic in Amman, Jordan" />
        <meta property="og:description"  content="Reach ArtiZone Beauty & Aesthetic Clinic in Amman by phone, email, or in person. Get directions and book your appointment today." />
        <meta property="og:image"        content={`${SITE_URL}/airo-assets/images/about/clinic-interior`} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="ArtiZone clinic reception and interior, Amman Jordan" />
        <meta property="og:url"          content="https://artizonespa.com/contact" />
        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Contact ArtiZone — Beauty Clinic in Amman, Jordan" />
        <meta name="twitter:description" content="Reach ArtiZone Beauty & Aesthetic Clinic in Amman by phone, email, or in person. Get directions and book your appointment today." />
        <meta name="twitter:image"       content={`${SITE_URL}/airo-assets/images/about/clinic-interior`} />
        <meta name="twitter:image:alt"   content="ArtiZone clinic reception and interior, Amman Jordan" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/contact" />

        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/contact" />
        <script type="application/ld+json">{JSON.stringify(
          buildBeautySalonSchema({
            description: 'Contact ArtiZone Beauty & Aesthetic Clinic in Amman by phone, email, or in person.',
            image: `${SITE_URL}/airo-assets/images/about/clinic-interior`,
          })
        )}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact ArtiZone Beauty & Aesthetic Clinic',
          url: 'https://artizonespa.com/contact',
          description: 'Contact ArtiZone Beauty & Aesthetic Clinic in Amman by phone, email, or in person.',
          mainEntity: {
            '@type': 'BeautySalon',
            '@id': SITE_URL,
            name: 'ArtiZone Beauty & Aesthetic Clinic',
            telephone: '+962790412758',
            email: 'info@artizonespa.com',
            url: SITE_URL,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://artizonespa.com/contact' },
            ],
          },
        })}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative py-14 sm:py-20 overflow-hidden" style={{ background: TAUPE }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`, top: '-120px', right: '-80px' }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 280, height: 280, background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`, bottom: '-50px', left: '-40px' }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
              We're Here for You
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="font-bold mb-4 sm:mb-5" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)', fontFamily: 'var(--font-heading)', color: CREAM }}>
              Contact Us
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(249,245,240,0.68)' }}>
              Reach out by phone, or the form below — we'd love to hear from you.
            </motion.p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── CONTACT CARDS ────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
              {contactCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl p-6 flex flex-col"
                  style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 4px 20px rgba(61,46,38,0.07)' }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: `${GOLD}18` }}>
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    {card.title}
                  </h3>
                  {card.lines.map((line) => (
                    <p key={line} className="text-xs leading-relaxed" style={{ color: 'hsl(20 15% 48%)' }}>{line}</p>
                  ))}
                  {card.action && (
                    <a
                      href={card.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:opacity-75"
                      style={{ color: GOLD }}
                    >
                      {card.action.label} <ArrowRight size={11} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ── FORM + MAP ──────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-10 items-start">

              {/* Contact form */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex-1 w-full"
              >
                <div className="rounded-2xl p-8 md:p-10" style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 8px 40px rgba(61,46,38,0.08)' }}>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${GOLD}22` }}>
                        <CheckCircle size={28} style={{ color: GOLD }} />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                        Message Sent!
                      </h3>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: 'hsl(20 15% 44%)' }}>
                        Thank you, <strong style={{ color: TAUPE }}>{form.name}</strong>. We'll get back to you as soon as possible during working hours.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to="/booking"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                          style={{ background: GOLD, color: TAUPE }}
                        >
                          Book Appointment <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                        Send Us a Message
                      </h2>
                      <p className="text-sm mb-8" style={{ color: 'hsl(20 15% 50%)' }}>
                        Fields marked * are required.
                      </p>

                      <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Name + Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: TAUPE }}>Full Name *</label>
                            <input
                              type="text"
                              placeholder="Your name"
                              value={form.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                              style={{ ...inputBase, border: `1.5px solid ${errors.name ? '#e05252' : 'rgba(61,46,38,0.15)'}` }}
                              onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                              onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? '#e05252' : 'rgba(61,46,38,0.15)')}
                            />
                            {errors.name && <p className="text-xs mt-1.5" style={{ color: '#e05252' }}>{errors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: TAUPE }}>Phone Number *</label>
                            <input
                              type="tel"
                              placeholder="079 041 2758"
                              value={form.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                              style={{ ...inputBase, border: `1.5px solid ${errors.phone ? '#e05252' : 'rgba(61,46,38,0.15)'}` }}
                              onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                              onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? '#e05252' : 'rgba(61,46,38,0.15)')}
                            />
                            {errors.phone && <p className="text-xs mt-1.5" style={{ color: '#e05252' }}>{errors.phone}</p>}
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: TAUPE }}>
                            Subject <span style={{ color: 'hsl(20 15% 55%)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Question about laser treatments"
                            value={form.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={inputBase}
                            onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(61,46,38,0.15)')}
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: TAUPE }}>Message *</label>
                          <textarea
                            rows={5}
                            placeholder="How can we help you?"
                            value={form.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                            style={{ ...inputBase, border: `1.5px solid ${errors.message ? '#e05252' : 'rgba(61,46,38,0.15)'}` }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = errors.message ? '#e05252' : 'rgba(61,46,38,0.15)')}
                          />
                          {errors.message && <p className="text-xs mt-1.5" style={{ color: '#e05252' }}>{errors.message}</p>}
                        </div>

                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
                          style={{ background: GOLD, color: TAUPE }}
                        >
                          Send Message <Send size={14} />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Map + Social sidebar */}
              <div className="w-full lg:w-96 shrink-0 space-y-5">

                {/* Google Maps embed */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 4px 20px rgba(61,46,38,0.07)' }}
                >
                  <div className="relative" style={{ paddingBottom: '65%' }}>
                    <iframe
                      title="ArtiZone Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.9!2d35.88219!3d31.95388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5fb85d7981af%3A0x631c30c0f8dc37e0!2sArtiZone%20Beauty%20%26%20Aesthetic%20Clinic!5e0!3m2!1sen!2sjo!4v1747476000000!5m2!1sen!2sjo"
                      width="100%"
                      height="100%"
                      className="absolute inset-0 w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between" style={{ background: '#fff' }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: TAUPE }}>ArtiZone Clinic</p>
                      <p className="text-xs" style={{ color: 'hsl(20 15% 50%)' }}>Complex Arjan Street, 2nd Floor, Mazen Al-Kurdi St., Amman</p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/Scp8Do5U9sgNGpSz7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:opacity-75"
                      style={{ color: GOLD }}
                    >
                      <MapPin size={12} /> Directions
                    </a>
                  </div>
                </motion.div>

                {/* Social channels */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl p-6"
                  style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 4px 20px rgba(61,46,38,0.07)' }}
                >
                  <h3 className="text-sm font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    Follow & Connect
                  </h3>
                  <div className="space-y-4">
                    {socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-105" style={{ background: `${GOLD}18` }}>
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold transition-colors group-hover:opacity-75" style={{ color: TAUPE }}>
                            {s.name} <span style={{ color: GOLD }}>{s.handle}</span>
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: 'hsl(20 15% 52%)' }}>
                            {s.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Quick booking nudge */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: TAUPE, border: `1.5px solid rgba(201,169,110,0.25)` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: GOLD }}>Ready to visit?</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(249,245,240,0.65)' }}>
                    Skip the message and book your appointment directly.
                  </p>
                  <Link
                    to="/booking"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: GOLD, color: TAUPE }}
                  >
                    Book Appointment <ArrowRight size={13} />
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* ── HOURS BANNER ─────────────────────────────────────────────────── */}
        <section className="py-14" style={{ background: CREAM_DARK }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl px-10 py-8"
              style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 4px 20px rgba(61,46,38,0.07)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GOLD}18` }}>
                  <Clock size={22} style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: GOLD }}>Working Hours</p>
                  <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>We're Open 7 Days a Week</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 text-center sm:text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Sat – Thu</p>
                  <p className="text-sm font-medium" style={{ color: TAUPE }}>10:00 AM – 9:00 PM</p>
                </div>
                <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(61,46,38,0.1)' }} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Friday</p>
                  <p className="text-sm font-medium" style={{ color: TAUPE }}>2:00 PM – 9:00 PM</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
