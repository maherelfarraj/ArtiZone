/**
 * SocialFollowSection
 * Full-width "Stay Connected" band for the homepage.
 * Shows Facebook + Instagram with branded colours and a short CTA.
 * Clean single-export — no duplicate declarations.
 */
import { motion } from 'motion/react';

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const NAVY    = '#0E2A3A'; /* Deep Ocean Navy  */
const TERRA   = '#C4A882'; /* Warm Terracotta  */
const CREAM   = '#FDFAF6'; /* Warm White       */
const CARD_BG = '#0d3d61'; /* Slightly lighter navy for card bg */

const FB_BLUE = '#4F9CF9';
const IG_PINK = '#E1306C';

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function FacebookIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

/* ── Platform card ─────────────────────────────────────────────────────────── */
interface PlatformCardProps {
  href: string;
  icon: React.ReactNode;
  platform: string;
  handle: string;
  description: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  delay?: number;
}

function PlatformCard({
  href, icon, platform, handle, description,
  accentColor, gradientFrom, gradientTo, delay = 0,
}: PlatformCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow ArtiZone on ${platform}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' as const }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden flex flex-col items-center text-center p-8 sm:p-10 transition-all duration-300"
      style={{
        background: CARD_BG,
        border: `1px solid rgba(174,131,99,0.18)`,
      }}
    >
      {/* Gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${gradientFrom}20 0%, transparent 65%)` }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      {/* Icon circle */}
      <div
        className="flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{
          width: 72, height: 72,
          background: `linear-gradient(135deg, ${gradientFrom}22, ${gradientTo}22)`,
          border: `1px solid ${accentColor}35`,
        }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>

      {/* Platform label */}
      <p
        className="text-[11px] font-bold uppercase tracking-[0.28em] mb-2"
        style={{ color: accentColor, fontFamily: 'var(--font-sans)' }}
      >
        {platform}
      </p>

      {/* Handle — prominent */}
      <h3
        className="font-medium mb-4 leading-tight"
        style={{
          fontFamily: 'var(--font-heading)',
          color: CREAM,
          fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
        }}
      >
        {handle}
      </h3>

      {/* Description — readable body size */}
      <p
        className="leading-relaxed mb-7 max-w-xs"
        style={{
          color: 'rgba(250,247,242,0.62)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9375rem', /* 15px — comfortable reading size */
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>

      {/* CTA button */}
      <div
        className="inline-flex items-center gap-2 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.20em] transition-all duration-200 group-hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          color: '#fff',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Follow Us
      </div>
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function SocialFollowSection() {
  return (
    <section style={{ background: NAVY }}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-28">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Eyebrow */}
          <p
            className="text-[11px] font-bold uppercase tracking-[0.28em] mb-4"
            style={{ color: TERRA, fontFamily: 'var(--font-sans)' }}
          >
            Stay Connected
          </p>

          {/* Main heading — large, clear, readable */}
          <h2
            className="font-medium leading-tight mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              color: CREAM,
              fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)',
            }}
          >
            Follow <em style={{ color: TERRA, fontStyle: 'italic' }}>ArtiZone</em>
          </h2>

          {/* Sub-copy — comfortable reading size */}
          <p
            className="max-w-lg mx-auto leading-relaxed"
            style={{
              color: 'rgba(250,247,242,0.58)',
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem', /* 16px — minimum comfortable reading size */
              lineHeight: 1.7,
            }}
          >
            See our latest treatments, before &amp; after results, offers, and beauty tips — updated daily.
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <PlatformCard
            href="https://www.facebook.com/artizone.jo"
            icon={<FacebookIcon size={30} />}
            platform="Facebook"
            handle="artizone.jo"
            description="Latest offers, clinic updates, and beauty tips — like our page to stay in the loop."
            accentColor={FB_BLUE}
            gradientFrom="#1877F2"
            gradientTo="#4F9CF9"
            delay={0}
          />
          <PlatformCard
            href="https://instagram.com/artizone_clinic"
            icon={<InstagramIcon size={30} />}
            platform="Instagram"
            handle="@artizone_clinic"
            description="Before & after results, treatment reels, and exclusive Instagram-only offers."
            accentColor={IG_PINK}
            gradientFrom="#833AB4"
            gradientTo="#E1306C"
            delay={0.1}
          />
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
          style={{
            color: 'rgba(250,247,242,0.32)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem', /* 14px */
          }}
        >
          Tag us in your results — we love seeing your glow-up ✨
        </motion.p>

      </div>
    </section>
  );
}
