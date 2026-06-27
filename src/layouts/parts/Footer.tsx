import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Clock } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';

/* ── Premium Palette tokens ─────────────────────────────────────────── */
const BARK       = '#0E2A3A'; /* Ink Navy — footer base bg              */
const TERRACOTTA = '#C4A882'; /* Warm Sand — CTA accent                 */

const TikTokIcon = () =>
<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>;


const FacebookIcon = () =>
<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>;


export default function Footer() {
  return (
    <footer style={{ background: BARK, color: 'rgba(220,200,176,0.65)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Terracotta hairline */}
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${TERRACOTTA}55,transparent)` }} />

      {/* Newsletter band */}
      <div style={{ background: '#0a2030', borderBottom: '1px solid rgba(196,168,130,0.14)' }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>
                Members Only
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'rgba(250,247,242,0.85)', fontSize: 'clamp(1.1rem,2vw,1.45rem)', fontWeight: 400 }}>
                Beauty tips &amp; exclusive offers — delivered to you
              </p>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[300px]">
              <NewsletterSignup variant="strip" source="footer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-1">
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'rgba(196,168,130,0.85)',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: 20,
            }}>
              ArtiZone
            </span>
            
            <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(250,247,242,0.65)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
              Premium beauty &amp; aesthetic treatments for women and men in Amman, Jordan.
            </p>
            <div className="flex gap-2">
              {[
              { href: 'https://www.facebook.com/artizone.jo', label: 'Facebook', icon: <FacebookIcon /> },
              { href: 'https://instagram.com/artizone_clinic', label: 'Instagram', icon: <Instagram size={13} /> },
              { href: 'https://tiktok.com/@artizone.jo', label: 'TikTok', icon: <TikTokIcon /> },
              { href: 'mailto:info@artizonespa.com', label: 'Email', icon: <Mail size={13} /> }].
              map(({ href, label, icon }) =>
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center transition-all duration-200"
                style={{ color: 'rgba(174,131,99,0.70)', border: '1px solid rgba(174,131,99,0.22)', background: 'rgba(174,131,99,0.08)' }}
                onMouseEnter={(e) => {(e.currentTarget as HTMLElement).style.color = TERRACOTTA;(e.currentTarget as HTMLElement).style.borderColor = `${TERRACOTTA}66`;(e.currentTarget as HTMLElement).style.background = 'rgba(174,131,99,0.18)';}}
                onMouseLeave={(e) => {(e.currentTarget as HTMLElement).style.color = 'rgba(174,131,99,0.70)';(e.currentTarget as HTMLElement).style.borderColor = 'rgba(174,131,99,0.22)';(e.currentTarget as HTMLElement).style.background = 'rgba(174,131,99,0.08)';}}>
                
                  {icon}
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.20em] mb-5" style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>Services</p>
            <ul className="space-y-3">
              {[
              { label: "Face & Skin Care", href: '/best-facial-amman' },
              { label: "Laser Hair Removal", href: '/laser-hair-removal-amman' },
              { label: "Nails & Foot Care", href: '/services/nails-foot-care' },
              { label: "Body Slimming", href: '/body-slimming-amman' },
              { label: "Men's Grooming", href: '/mens-grooming-amman' }].
              map((s) =>
              <li key={s.label}>
                  <Link to={s.href} className="text-sm transition-colors duration-200" style={{ color: 'rgba(250,247,242,0.72)', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.72)'}>
                  {s.label}</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Popular Packages */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.20em] mb-5" style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>Popular Packages</p>
            <ul className="space-y-3">
              {[
              { label: 'Glow Starter Package', href: '/packages' },
              { label: 'Laser Essentials Bundle', href: '/packages' },
              { label: 'Full Body Slimming Plan', href: '/packages' },
              { label: 'Men\'s Grooming Package', href: '/packages' },
              { label: 'Bridal Beauty Package', href: '/packages' },
              { label: 'View All Packages', href: '/packages' }].
              map((l) =>
              <li key={l.label}>
                  <Link to={l.href} className="text-sm transition-colors duration-200" style={{ color: 'rgba(250,247,242,0.72)', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.72)'}>
                  {l.label}</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.20em] mb-5" style={{ color: TERRACOTTA, fontFamily: 'var(--font-sans)' }}>Contact</p>

            {/* Mini map */}
            <a
              href="https://maps.app.goo.gl/kkLtw6M3Ub9VaP4M6"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-5 overflow-hidden rounded-xl"
              style={{ border: '1px solid rgba(196,168,130,0.28)', height: 130 }}>
              
              <iframe
                title="ArtiZone Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.9!2d35.88219!3d31.95388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5fb85d7981af%3A0x631c30c0f8dc37e0!2sArtiZone%20Beauty%20%26%20Aesthetic%20Clinic!5e0!3m2!1sen!2sjo!4v1747476000000!5m2!1sen!2sjo"
                width="100%"
                height="130"
                style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
              
            </a>

            <ul className="space-y-4">
              <li>
                <a href="https://maps.app.goo.gl/kkLtw6M3Ub9VaP4M6" target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm leading-relaxed transition-colors duration-200"
                style={{ color: 'rgba(250,247,242,0.68)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.68)'}>
                  
                  <MapPin size={11} className="mt-0.5 shrink-0" style={{ color: 'rgba(174,131,99,0.65)' }} />
                  Complex Arjan Street, 2nd Floor, Mazen Al-Kurdi St., Amman
                </a>
              </li>
              <li>
                <a href="tel:+962790412758" className="flex items-center gap-2.5 text-sm transition-colors duration-200" style={{ color: 'rgba(250,247,242,0.68)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.68)'}>
                  
                  <Phone size={11} style={{ color: 'rgba(174,131,99,0.65)' }} /> +962 79 041 2758
                </a>
              </li>
              <li>
                <a href="tel:+962792828024" className="flex items-center gap-2.5 text-sm transition-colors duration-200" style={{ color: 'rgba(250,247,242,0.68)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.68)'}>
                  
                  <Phone size={11} style={{ color: 'rgba(174,131,99,0.65)' }} /> +962 79 282 8024
                </a>
              </li>
              <li>
                <a href="mailto:info@artizonespa.com" className="flex items-center gap-2.5 text-sm transition-colors duration-200" style={{ color: 'rgba(250,247,242,0.68)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.95)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.68)'}>
                  
                  <Mail size={11} style={{ color: 'rgba(174,131,99,0.65)' }} /> info@artizonespa.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={11} className="mt-0.5 shrink-0" style={{ color: 'rgba(174,131,99,0.65)' }} />
                <div className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span className="block" style={{ color: 'rgba(250,247,242,0.70)' }}>Sat – Thu: 10:00 AM – 9:00 PM</span>
                  <span className="block" style={{ color: 'rgba(250,247,242,0.68)' }}>Friday: 2:00 PM – 9:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(174,131,99,0.18)' }}>
          <p className="text-xs" style={{ color: 'rgba(250,247,242,0.55)', fontFamily: 'var(--font-sans)' }}>
            © 2026 ArtiZone Beauty &amp; Aesthetic Clinic. All rights reserved.
          </p>
          <p className="text-xs tracking-[0.10em]" style={{ color: 'rgba(174,131,99,0.65)', fontFamily: 'var(--font-sans)' }}>
            Amman, Jordan
          </p>
        </div>
      </div>
      </div>{/* end z-index wrapper */}
    </footer>);

}