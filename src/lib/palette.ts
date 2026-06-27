/**
 * ArtiZone Premium Palette 2026
 * Single source of truth — import from here in every page/component.
 *
 * Ink Navy   #0E2A3A  — dark backgrounds, hero sections
 * Warm Sand  #C4A882  — primary accent, CTAs, highlights
 * Sage Stone #6B7260  — secondary accent, muted labels
 * Parchment  #F7F3EE  — page background
 * Ivory      #FDFAF6  — card / light surface
 * Slate      rgba(14,42,58,0.55) — muted body text
 */

export const P = {
  /* ── Core ──────────────────────────────────────────────────────────── */
  INK:        '#0E2A3A',   /* Ink Navy — dark bg, hero                 */
  SAND:       '#C4A882',   /* Warm Sand — primary accent / CTA         */
  SAGE:       '#6B7260',   /* Sage Stone — secondary accent            */
  PARCHMENT:  '#F7F3EE',   /* page background                          */
  IVORY:      '#FDFAF6',   /* card / light surface                     */
  DEEP_SAGE:  '#3D4F4A',   /* Deep Sage — section bg (Why, etc.)       */

  /* ── Text on dark ──────────────────────────────────────────────────── */
  FG:         'rgba(253,250,246,0.92)',  /* primary text on dark        */
  FG_DIM:     'rgba(253,250,246,0.58)', /* secondary text on dark       */
  FG_MUTED:   'rgba(253,250,246,0.38)', /* muted text on dark           */

  /* ── Text on light ─────────────────────────────────────────────────── */
  DARK:       '#0E2A3A',               /* body text on light bg         */
  DARK_80:    'rgba(14,42,58,0.80)',   /* secondary body text           */
  DARK_55:    'rgba(14,42,58,0.55)',   /* muted body text               */
  DARK_35:    'rgba(14,42,58,0.35)',   /* placeholder / disabled        */

  /* ── Borders / dividers ────────────────────────────────────────────── */
  BORDER_LIGHT: 'rgba(196,168,130,0.18)',  /* on light bg               */
  BORDER_MED:   'rgba(196,168,130,0.35)',  /* hover / active            */
  BORDER_DARK:  'rgba(196,168,130,0.14)',  /* on dark bg                */

  /* ── Gradients (as inline style strings) ───────────────────────────── */
  SAND_RULE: 'linear-gradient(90deg, transparent, rgba(196,168,130,0.40), transparent)',
  HERO_OVERLAY: 'linear-gradient(to bottom, rgba(14,42,58,0.55) 0%, rgba(14,42,58,0.75) 100%)',
} as const;

/* Convenience aliases used across pages */
export const GOLD       = P.SAND;
export const TAUPE      = P.INK;
export const CREAM      = P.IVORY;
export const CREAM_DARK = P.PARCHMENT;
export const DARK       = P.DARK;
