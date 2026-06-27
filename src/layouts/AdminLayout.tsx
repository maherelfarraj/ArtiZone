import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  LayoutDashboard, Mail, Star, Menu, X, ExternalLink, ChevronRight,
  Send, MessageCircle, FlaskConical, Calendar, CalendarDays, ArrowLeft,
  Users, Gift, ShieldAlert, LogOut,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { canAccess, ROLE_NAV_LABELS } from '@/lib/adminPermissions';

const GOLD  = '#C4A882';
const TAUPE = '#0E2A3A';
const DARK  = '#1e1510';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const ALL_NAV: NavItem[] = [
  { to: '/admin',                 label: 'Overview',        icon: LayoutDashboard },
  { to: '/admin/bookings',        label: 'Bookings',        icon: Calendar },
  { to: '/admin/scheduling',      label: 'Scheduling',      icon: CalendarDays },
  { to: '/admin/newsletter',      label: 'Newsletter',      icon: Mail },
  { to: '/admin/reviews',         label: 'Reviews',         icon: Star },
  { to: '/admin/review-requests', label: 'Review Requests', icon: Send },
  { to: '/admin/support',         label: 'Support',         icon: MessageCircle },
  { to: '/admin/ab-results',      label: 'A/B Tests',       icon: FlaskConical },
  { to: '/admin/loyalty',         label: 'Loyalty',         icon: Gift },
  { to: '/admin/users',           label: 'Users',           icon: Users },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  badges?: { reviews?: number };
}

export default function AdminLayout({ children, badges }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [accessDenied, setAccessDenied]     = useState(false);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate  = useNavigate();
  const { user, loading, error } = useAdminAuth();

  // ── Auth redirect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    if (error === 'setup_required') { navigate('/admin/setup', { replace: true }); return; }
    if (!user)                       { navigate('/admin/login', { replace: true }); return; }

    // Role-based route guard
    if (!canAccess(user.role, location.pathname)) {
      setAccessDenied(true);
      // Redirect staff to overview after a brief moment so they see the message
      const t = setTimeout(() => {
        setAccessDenied(false);
        navigate('/admin', { replace: true });
      }, 2200);
      return () => clearTimeout(t);
    } else {
      setAccessDenied(false);
    }
  }, [loading, error, user, location.pathname, navigate]);

  // ── Pending bookings poll (old + new scheduling) ─────────────────────────
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const [legacyRes, schedRes] = await Promise.all([
          fetch('/api/booking/count').then(r => r.json()).catch(() => ({ pending: 0 })),
          fetch('/api/scheduling/appointments').then(r => r.json()).catch(() => []),
        ]);
        const legacyPending = legacyRes.pending ?? 0;
        const schedPending = Array.isArray(schedRes)
          ? schedRes.filter((a: { status: string }) => a.status === 'requested' || a.status === 'pending').length
          : 0;
        setPendingBookings(legacyPending + schedPending);
      } catch { /* silent */ }
    };
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, [user]);

  // ── Close user menu on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    navigate('/admin/login', { replace: true });
  };

  // ── Loading / unauthenticated spinner ───────────────────────────────────
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: TAUPE }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
      </div>
    );
  }

  // ── Filter nav by role ───────────────────────────────────────────────────
  const allowedLabels = ROLE_NAV_LABELS[user.role];
  const navItems = ALL_NAV
    .filter(n => allowedLabels.includes(n.label))
    .map(item => ({
      ...item,
      badge:
        item.to === '/admin/reviews'     ? badges?.reviews
        : item.to === '/admin/bookings'  ? (pendingBookings > 0 ? pendingBookings : undefined)
        : item.to === '/admin/scheduling'? (pendingBookings > 0 ? pendingBookings : undefined)
        : undefined,
    }));

  const currentNav = navItems.find(n =>
    n.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.to),
  );

  // ── User initials ────────────────────────────────────────────────────────
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(201,169,110,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: GOLD, color: '#fff' }}>
            AZ
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'var(--font-heading)' }}>ArtiZone</p>
            <p className="text-xs" style={{ color: 'rgba(201,169,110,0.6)' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(201,169,110,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: 'rgba(201,169,110,0.18)', color: GOLD }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'rgba(249,245,240,0.85)' }}>{user.name}</p>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background: user.role === 'superadmin' ? 'rgba(201,169,110,0.2)' : 'rgba(100,160,120,0.2)',
                color:      user.role === 'superadmin' ? GOLD : '#7ecfa0',
              }}>
              {user.role === 'superadmin' ? 'Superadmin' : 'Staff'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to} end={to === '/admin'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive ? 'text-white' : 'hover:bg-white/5'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(201,169,110,0.18)' : undefined,
              color:      isActive ? GOLD : 'rgba(249,245,240,0.65)',
            })}
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={{ background: '#d97706', color: '#fff' }}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(201,169,110,0.1)' }}>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all hover:bg-white/5"
          style={{ color: 'rgba(249,245,240,0.4)' }}>
          <ExternalLink size={13} /> View Live Site
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all hover:bg-white/5 text-left"
          style={{ color: 'rgba(249,245,240,0.4)' }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f0e8', fontFamily: 'var(--font-sans)' }}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Access denied toast */}
      <AnimatePresence>
        {accessDenied && (
          <motion.div
            key="access-denied"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl"
            style={{ background: '#7f1d1d', color: '#fecaca', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <ShieldAlert size={16} />
            <span className="text-sm font-semibold">Access restricted — redirecting…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 h-full"
        style={{ background: DARK, borderRight: '1px solid rgba(201,169,110,0.1)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(30,21,16,0.7)', backdropFilter: 'blur(3px)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside key="sidebar"
              initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 bottom-0 z-50 w-56 lg:hidden flex flex-col"
              style={{ background: DARK }}
            >
              <div className="flex items-center justify-end px-4 pt-4 pb-2">
                <button onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(249,245,240,0.6)' }}>
                  <X size={15} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 border-b" style={{ background: '#fff', borderColor: 'rgba(61,46,38,0.08)' }}>
          <div className="flex items-center gap-3 px-5 sm:px-6 h-14">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(61,46,38,0.06)', color: TAUPE }}
              aria-label="Open menu">
              <Menu size={16} />
            </button>

            {location.pathname !== '/admin' && (
              <button onClick={() => navigate(-1)}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(196,168,130,0.4)', color: TAUPE, background: 'rgba(196,168,130,0.07)' }}>
                <ArrowLeft size={13} /> Back
              </button>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span style={{ color: 'hsl(20 15% 55%)' }}>Admin</span>
              {currentNav && (
                <>
                  <ChevronRight size={13} style={{ color: 'hsl(20 15% 70%)' }} />
                  <span className="font-semibold" style={{ color: TAUPE }}>{currentNav.label}</span>
                </>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(196,168,130,0.4)', color: TAUPE, background: 'rgba(196,168,130,0.07)' }}>
                <ExternalLink size={12} /> Live Site
              </a>

              {/* User avatar + dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all hover:bg-black/5"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}>
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold leading-none" style={{ color: TAUPE }}>{user.name}</p>
                    <p className="text-[10px] mt-0.5 leading-none" style={{ color: 'hsl(20 15% 55%)' }}>
                      {user.role === 'superadmin' ? 'Superadmin' : 'Staff'}
                    </p>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      key="user-menu"
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl border overflow-hidden z-50"
                      style={{ background: '#fff', borderColor: 'rgba(61,46,38,0.1)' }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(61,46,38,0.07)' }}>
                        <p className="text-xs font-semibold" style={{ color: TAUPE }}>{user.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>{user.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            background: user.role === 'superadmin' ? 'rgba(201,169,110,0.15)' : 'rgba(100,160,120,0.15)',
                            color:      user.role === 'superadmin' ? '#9a7a4a' : '#3a8a5a',
                          }}>
                          {user.role === 'superadmin' ? 'Superadmin' : 'Staff'}
                        </span>
                      </div>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all hover:bg-red-50 text-left"
                        style={{ color: '#dc2626' }}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Horizontal nav tabs */}
          <nav className="flex items-center gap-0.5 px-4 overflow-x-auto scrollbar-none"
            style={{ borderTop: '1px solid rgba(61,46,38,0.05)' }}>
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} end={to === '/admin'}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                    isActive ? 'border-current' : 'border-transparent hover:border-current/30'
                  }`
                }
                style={({ isActive }) => ({ color: isActive ? GOLD : 'hsl(20 15% 50%)' })}
              >
                <Icon size={13} />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
                    style={{ background: '#d97706', color: '#fff' }}>
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
