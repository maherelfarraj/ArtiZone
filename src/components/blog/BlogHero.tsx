const GOLD  = '#C4A882'; /* Warm Sand — accent                        */
const TAUPE = '#0E2A3A'; /* Ink Navy — dark bg                        */
const CREAM = '#F7F3EE'; /* Parchment — light surface                 */

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'minimal' | 'centered';
  backgroundImage?: string;
}

export default function BlogHero({
  title = 'Blog',
  subtitle = 'Thoughts, stories, and ideas',
  variant = 'default',
}: BlogHeroProps) {
  if (variant === 'minimal') {
    return (
      <div className="border-b border-border" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className="relative overflow-hidden" style={{ background: TAUPE }}>
        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(ellipse at center, ${GOLD}33, transparent 70%)` }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: GOLD }}>ArtiZone Journal</p>
          <h1 className="font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(247,242,235,0.75)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default variant — ArtiZone branded (no background image)
  return (
    <div className="relative overflow-hidden" style={{ background: TAUPE }}>
      {/* Decorative gold blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)`, transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)`, transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: GOLD }}>
            ArtiZone Journal
          </p>
          <h1
            className="font-bold mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h1>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-16" style={{ background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          </div>
          {subtitle && (
            <p className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(247,242,235,0.72)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
