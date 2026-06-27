/**
 * A/B Test Utility — ArtiZone
 *
 * - Assigns each visitor to variant 'a' or 'b' via a cookie (persists across sessions)
 * - Tracks impressions and conversions to /api/ab-events
 * - Variants: 'a' = control (original), 'b' = challenger
 */

const COOKIE_PREFIX = 'az_ab_';
const COOKIE_TTL_DAYS = 90;

/** Get or assign a variant for a given test key */
export function getVariant(testKey: string): 'a' | 'b' {
  const cookieName = `${COOKIE_PREFIX}${testKey}`;
  const existing = getCookie(cookieName);
  if (existing === 'a' || existing === 'b') return existing;
  const assigned: 'a' | 'b' = Math.random() < 0.5 ? 'a' : 'b';
  setCookie(cookieName, assigned, COOKIE_TTL_DAYS);
  return assigned;
}

/** Force a specific variant (useful for preview/QA via ?variant=b in URL) */
export function getVariantWithOverride(testKey: string): 'a' | 'b' {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const override = params.get('variant');
    if (override === 'a' || override === 'b') return override;
  }
  return getVariant(testKey);
}

/** Track an event (impression or conversion) */
export async function trackEvent(
  testKey: string,
  variant: 'a' | 'b',
  event: 'impression' | 'click_cta' | 'whatsapp' | 'booking',
): Promise<void> {
  try {
    await fetch('/api/ab-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testKey, variant, event, ts: Date.now() }),
    });
  } catch {
    // Non-blocking — never break the page for analytics
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
