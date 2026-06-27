/**
 * ShareButtons — compact social sharing row.
 * Supports Facebook, Instagram (profile link), and a clipboard copy link.
 *
 * Usage:
 *   <ShareButtons url="https://artizonespa.com/services" title="Our Services" />
 *
 * Props:
 *   url      – canonical URL to share (defaults to window.location.href)
 *   title    – text used in share messages
 *   hashtags – optional array of hashtags (unused but kept for API compat)
 *   compact  – if true, shows icon-only buttons (no labels)
 *   className – extra Tailwind classes on the wrapper
 *   light    – light variant for dark backgrounds
 */
import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

const TAUPE = '#0E2A3A';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  hashtags?: string[];
  compact?: boolean;
  className?: string;
  /** Light variant — for use on dark backgrounds */
  light?: boolean;
}

// ── SVG brand icons ────────────────────────────────────────────────────────────

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildFacebookUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function openPopup(href: string) {
  window.open(href, '_blank', 'width=600,height=480,noopener,noreferrer');
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShareButtons({
  url,
  title = 'ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan',
  hashtags: _hashtags = [],
  compact = false,
  className = '',
  light = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const resolvedUrl = url ?? (typeof window !== 'undefined' ? window.location.href : 'https://artizonespa.com');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = resolvedUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const labelColor = light ? 'rgba(255,255,255,0.75)' : 'hsl(20 15% 50%)';
  const btnBase    = 'inline-flex items-center gap-1.5 rounded-full transition-all hover:scale-105 active:scale-95 font-medium';
  const btnPad     = compact ? 'p-2' : 'px-3.5 py-2';
  const btnText    = compact ? '' : 'text-xs';

  // Instagram gradient via inline style (can't do gradient text on bg easily, use brand purple/pink)
  const igBg = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

  const buttons = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FacebookIcon size={15} />,
      bg: '#1877F2',
      fg: '#fff',
      onClick: () => openPopup(buildFacebookUrl(resolvedUrl)),
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <InstagramIcon size={15} />,
      bg: igBg,
      fg: '#fff',
      onClick: () => openPopup(`https://www.instagram.com/artizone_clinic`),
    },
    {
      key: 'copy',
      label: copied ? 'Copied!' : 'Copy link',
      icon: copied ? <Check size={14} /> : <Link2 size={14} />,
      bg: light ? 'rgba(255,255,255,0.15)' : 'rgba(61,46,38,0.08)',
      fg: light ? '#fff' : TAUPE,
      onClick: () => void handleCopy(),
    },
  ];

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {!compact && (
        <span className="text-xs font-semibold uppercase tracking-wider mr-1" style={{ color: labelColor }}>
          Share
        </span>
      )}
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={btn.onClick}
          className={`${btnBase} ${btnPad} ${btnText}`}
          style={{ background: btn.bg, color: btn.fg }}
          aria-label={`Share on ${btn.label}`}
          title={btn.label}
        >
          {btn.icon}
          {!compact && <span>{btn.label}</span>}
        </button>
      ))}
    </div>
  );
}
