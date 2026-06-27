/**
 * OptimizedImage — drop-in <img> replacement for ArtiZone.
 *
 * Fill-mode (className contains "absolute"/"fixed"/"inset-0", or style.position
 * is absolute/fixed):
 *   - HTML width/height attributes are suppressed (they set intrinsic size that
 *     fights CSS fill styles)
 *   - position/inset/width/height are injected via inline style so the image
 *     fills its container reliably even when the parent uses min-height instead
 *     of height (h-full fails on min-height parents; inset:0 + explicit
 *     width/height:100% via style always works)
 *   - Tailwind layout classes (absolute, inset-0, w-full, h-full) are kept on
 *     the img so they still apply — the inline style just reinforces them
 *
 * Flow-mode (normal block images):
 *   - width/height attributes kept for CLS prevention
 *   - className/style passed through unchanged
 */

import React from 'react';

const SRCSET_WIDTHS = [480, 768, 1024, 1440, 1920] as const;
type FetchPriority = 'high' | 'low' | 'auto';

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'decoding' | 'fetchPriority'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  fetchPriority?: FetchPriority;
  className?: string;
  style?: React.CSSProperties;
}

function isAiroSlot(src: string) {
  return src.startsWith('/airo-assets/images/');
}

function buildSizes(width: number) {
  if (width >= 1440) return '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px';
  if (width >= 800)  return '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1440px';
  return `(max-width: 480px) 480px, (max-width: 768px) ${Math.min(width, 768)}px, ${width}px`;
}

function isFillMode(className?: string, style?: React.CSSProperties): boolean {
  if (className) {
    const parts = className.split(/\s+/);
    if (parts.includes('absolute') || parts.includes('fixed') || parts.includes('inset-0')) return true;
  }
  if (style?.position === 'absolute' || style?.position === 'fixed') return true;
  return false;
}

const FILL_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, width, height, priority = false, fetchPriority, className, style, ...rest }, ref) => {
    const loading = priority ? 'eager' : 'lazy';
    const fp: FetchPriority = fetchPriority ?? (priority ? 'high' : 'auto');
    const fillMode = isFillMode(className, style);

    // In fill-mode: merge FILL_STYLE + caller style so position/inset/size are
    // always set via inline style (not just Tailwind classes). This guarantees
    // the image fills its container even when the parent uses min-height.
    // In flow-mode: pass style through unchanged.
    const resolvedStyle: React.CSSProperties = fillMode
      ? { ...FILL_STYLE, ...style }
      : (style ?? {});

    // Suppress HTML width/height in fill-mode — they create intrinsic size that
    // overrides the CSS fill. In flow-mode keep them for CLS prevention.
    const sizeAttrs = fillMode ? {} : { width, height };

    if (!isAiroSlot(src)) {
      return (
        <img
          ref={ref} src={src} alt={alt} {...sizeAttrs}
          loading={loading}
          // @ts-expect-error fetchpriority is valid HTML but TS types lag
          fetchpriority={fp}
          decoding="async"
          className={className}
          style={resolvedStyle}
          {...rest}
        />
      );
    }

    const srcSet = SRCSET_WIDTHS
      .filter(w => w <= width * 1.5)
      .map(w => `${src}?w=${w} ${w}w`)
      .join(', ');

    return (
      <img
        ref={ref}
        src={src}
        srcSet={srcSet}
        sizes={buildSizes(width)}
        alt={alt}
        {...sizeAttrs}
        loading={loading}
        // @ts-expect-error fetchpriority is valid HTML but TS types lag
        fetchpriority={fp}
        decoding="async"
        className={className}
        style={resolvedStyle}
        {...rest}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
export default OptimizedImage;
