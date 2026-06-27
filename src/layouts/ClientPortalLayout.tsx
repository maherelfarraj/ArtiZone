/**
 * ClientPortalLayout — shared sidebar + mobile nav for the /client/* portal
 */
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, Gift, Package, Users, User,
  LogOut, Menu, X,
} from 'lucide-react';

// ── Palette ───────────────────────────────────────────────────────────────────
const NAVY   = '#0E2A3A';
const GOLD   = '#C4A882';
const CREAM  = '#FDFAF6';
const SAGE   = '#6B7260';
const LINE   = 'rgba(196,168,130,0.18)';

const NAV_ITEMS = [
  { to: '/client/portal',         label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/client/portal/bookings',label: 'My Bookings',     icon: CalendarDays },
  { to: '/client/portal/rewards', label: 'My Rewards',      icon: Gift },
  { to: '/client/portal/packages',label: 'My Packages',     icon: Package },
  { to: '/client/portal/refer',   label: 'Refer a Friend',  icon: Users },
  { to: '/client/portal/profile', label: 'My Profile',      icon: User },
];

interface ClientPortalLayoutProps {
  customerName?: string;
  onLogout?: () => void;
}

export default function ClientPortalLayout({
  customerName = 'Sara',
  onLogout,
}: ClientPortalLayoutProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    if (onLogout) onLogout();
    else navigate('/client/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: CREAM, fontFamily: 'var(--font-sans)' }}>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        width: 272,
        flexShrink: 0,
        background: '#fff',
        borderRight: `1px solid ${LINE}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }} className="hidden lg:flex">
        <SidebarContent customerName={customerName} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile overlay sidebar ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(14,42,58,0.55)' }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            style={{
              width: 272, height: '100%', background: '#fff',
              display: 'flex', flexDirection: 'column',
              boxShadow: '4px 0 32px rgba(14,42,58,0.18)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: SAGE }}>
                <X size={22} />
              </button>
            </div>
            <SidebarContent customerName={customerName} onLogout={handleLogout} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile top bar */}
        <div className="lg:hidden" style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: '#fff', borderBottom: `1px solid ${LINE}`,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: '#C4A882', letterSpacing: '0.06em' }}>ArtiZone</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: NAVY, padding: 4 }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px 48px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ── Sidebar inner content ─────────────────────────────────────────────────────
function SidebarContent({
  customerName,
  onLogout,
  onNavClick,
}: {
  customerName: string;
  onLogout: () => void;
  onNavClick?: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 18px' }}>

      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, color: '#C4A882', letterSpacing: '0.06em' }}>ArtiZone</span>
        <p style={{ fontSize: 11, color: SAGE, marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
          Customer Account
        </p>
      </div>

      {/* Avatar + name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 14px', borderRadius: 16,
        background: 'rgba(196,168,130,0.08)',
        border: `1px solid rgba(196,168,130,0.18)`,
        marginBottom: 22,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `linear-gradient(135deg, ${GOLD}, #e9caa8)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 16,
          flexShrink: 0,
        }}>
          {customerName.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: NAVY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {customerName}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: SAGE }}>Loyalty Member</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/client/portal'}
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 14,
              fontWeight: 600, fontSize: 14,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: isActive ? 'rgba(196,168,130,0.14)' : 'transparent',
              color: isActive ? NAVY : SAGE,
              borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          padding: '14px', borderRadius: 16,
          background: '#fbf3ea', border: `1px solid rgba(196,168,130,0.2)`,
          fontSize: 12, color: SAGE, lineHeight: 1.5, marginBottom: 14,
        }}>
          Need help? WhatsApp us for booking support and package questions.
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px', borderRadius: 14,
            background: 'none', border: `1px solid rgba(196,168,130,0.25)`,
            color: SAGE, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
