import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogIn, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ── Premium Palette ─────────────────────────────────────────────────────── */
const TERRA     = '#C4A882'; /* Warm Sand — Book Now CTA / active nav    */
const CREAM     = '#FDFAF6'; /* Ivory — nav text                         */
const OLIVE     = '#6B7260'; /* Sage Stone — hover underline accent      */

const NAV = [
  { href: '/',             label: 'Home' },
  { href: '/services',     label: 'Services' },
  { href: '/packages',     label: 'Packages' },
  { href: '/before-after', label: 'Results' },
  { href: '/reviews',      label: 'Reviews' },
  { href: '/loyalty',      label: 'Rewards' },
  { href: '/blog',         label: 'Blog' },
  { href: '/about',        label: 'About' },
  { href: '/contact',      label: 'Contact' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clientUser, setClientUser] = useState<{ fullName: string } | null | undefined>(undefined);

  // Check client session on mount
  useEffect(() => {
    fetch('/api/client/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setClientUser(data?.user ?? null))
      .catch(() => setClientUser(null));
  }, [pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(14,42,58,0.98)' : 'rgba(14,42,58,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid rgba(196,168,130,${scrolled ? '0.22' : '0.10'})`,
        boxShadow: scrolled
          ? '0 4px 32px rgba(14,42,58,0.30), 0 1px 0 rgba(196,168,130,0.12)'
          : '0 2px 16px rgba(14,42,58,0.16)',
      }}>

      {/* Top glow line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${TERRA}66 25%, ${TERRA}99 50%, ${TERRA}66 75%, transparent 100%)`,
      }} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between" style={{ height: 'clamp(72px,6.5vw,96px)' }}>

          {/* ── Logo (text) ── */}
          <Link to="/" aria-label="ArtiZone" className="shrink-0 group flex items-center gap-3">
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.3rem,2.5vw,1.8rem)',
              fontWeight: 600,
              color: '#C4A882',
              letterSpacing: '0.06em',
              transition: 'opacity 0.3s ease',
            }}>
              ArtiZone
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5">
            {NAV.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className="relative px-1.5 md:px-2 lg:px-3 py-2 text-[9px] md:text-[9px] lg:text-[11px] font-semibold uppercase tracking-[0.08em] lg:tracking-[0.13em] transition-all duration-200 group whitespace-nowrap"
                  style={{
                    color: active ? TERRA : 'rgba(250,247,242,0.72)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = CREAM;
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.72)';
                  }}>
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10"
                      style={{
                        background: 'rgba(196,168,130,0.12)',
                        border: '1px solid rgba(196,168,130,0.28)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className="absolute bottom-1 left-3 right-3 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    style={{ background: `linear-gradient(90deg, ${TERRA}, ${OLIVE})` }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5 lg:gap-2">

            {/* ── Client auth buttons — desktop ── */}
            {clientUser === undefined ? null : clientUser ? (
              <Link
                to="/client/dashboard"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-80"
                style={{ color: TERRA, border: '1px solid rgba(196,168,130,0.25)', fontFamily: 'var(--font-sans)', background: 'rgba(196,168,130,0.07)' }}
              >
                <User size={11} />
                {clientUser.fullName.split(' ')[0]}
              </Link>
            ) : (
              <>
                <Link
                  to="/client/login"
                  className="hidden md:flex items-center gap-1.5 px-2 lg:px-3 py-2 text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-80"
                  style={{ color: TERRA, border: '1px solid rgba(196,168,130,0.25)', fontFamily: 'var(--font-sans)', background: 'rgba(196,168,130,0.07)' }}
                >
                  <LogIn size={11} />
                  Login
                </Link>
                <Link
                  to="/client/signup"
                  className="hidden md:flex items-center gap-1.5 px-2 lg:px-3 py-2 text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200"
                  style={{ color: CREAM, background: 'rgba(196,168,130,0.18)', border: '1px solid rgba(196,168,130,0.40)', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(196,168,130,0.28)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(196,168,130,0.18)'}
                >
                  <UserPlus size={11} />
                  Sign Up
                </Link>
              </>
            )}

            {/* Book Now — desktop */}
            <Link
              to="/booking"
              className="hidden md:inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] lg:tracking-[0.22em] transition-all duration-300 whitespace-nowrap"
              style={{ color: CREAM, background: TERRA, border: `1px solid ${TERRA}`, fontFamily: 'var(--font-sans)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#c49070';
                (e.currentTarget as HTMLElement).style.borderColor = '#c49070';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = TERRA;
                (e.currentTarget as HTMLElement).style.borderColor = TERRA;
              }}>
              Book Now
            </Link>

            {/* Mobile book */}
            <Link
              to="/booking"
              className="md:hidden inline-flex items-center px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest min-h-[44px]"
              style={{ color: CREAM, background: TERRA, fontFamily: 'var(--font-sans)', boxShadow: '0 0 14px rgba(174,131,99,0.40)' }}>
              Book Now
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden w-11 h-11 flex items-center justify-center transition-colors duration-200"
              style={{ color: 'rgba(250,247,242,0.80)' }}
              aria-label={open ? 'Close menu' : 'Open menu'}>
              <AnimatePresence mode="wait" initial={false}>
                {open
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={20} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(4px)', top: 'clamp(74px,6.5vw,98px)' }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' as const }}
              className="absolute top-full left-0 right-0 z-50 md:hidden"
              style={{
                background: 'rgba(14,42,58,0.99)',
                borderBottom: '1px solid rgba(174,131,99,0.18)',
                boxShadow: '0 16px 48px rgba(14,42,58,0.45)',
              }}>

              <nav className="max-w-screen-xl mx-auto px-5 py-2 flex flex-col">
                {NAV.map(({ href, label }, i) => {
                  const active = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}>
                      <Link
                        to={href}
                        className="flex items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.16em] border-b min-h-[52px] transition-colors duration-150"
                        style={{
                          color: active ? TERRA : 'rgba(250,247,242,0.78)',
                          borderColor: 'rgba(174,131,99,0.14)',
                          fontFamily: 'var(--font-sans)',
                        }}>
                        <span>{label}</span>
                        {active
                          ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: TERRA, boxShadow: `0 0 6px ${TERRA}` }} />
                          : <span className="w-4 h-px" style={{ background: 'rgba(174,131,99,0.28)' }} />
                        }
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile CTA block */}
                <div className="py-5 flex flex-col gap-3">
                  <Link
                    to="/booking"
                    className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold uppercase tracking-[0.20em] transition-all duration-200"
                    style={{ background: TERRA, color: CREAM, fontFamily: 'var(--font-sans)', boxShadow: '0 0 24px rgba(174,131,99,0.35)' }}>
                    <Sparkles size={12} /> Book Appointment
                  </Link>

                  {/* Mobile auth buttons */}
                  {clientUser ? (
                    <Link
                      to="/client/dashboard"
                      className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200"
                      style={{ color: TERRA, border: '1px solid rgba(174,131,99,0.30)', fontFamily: 'var(--font-sans)', background: 'rgba(174,131,99,0.08)' }}
                    >
                      <User size={12} /> My Account
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        to="/client/login"
                        className="flex items-center justify-center gap-1.5 flex-1 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200"
                        style={{ color: TERRA, border: '1px solid rgba(174,131,99,0.30)', fontFamily: 'var(--font-sans)', background: 'rgba(174,131,99,0.08)', borderRadius: 8 }}
                      >
                        <LogIn size={12} /> Login
                      </Link>
                      <Link
                        to="/client/signup"
                        className="flex items-center justify-center gap-1.5 flex-1 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200"
                        style={{ color: CREAM, border: '1px solid rgba(174,131,99,0.40)', fontFamily: 'var(--font-sans)', background: 'rgba(174,131,99,0.18)', borderRadius: 8 }}
                      >
                        <UserPlus size={12} /> Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
