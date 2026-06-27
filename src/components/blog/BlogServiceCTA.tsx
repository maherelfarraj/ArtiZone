/**
 * BlogServiceCTA
 * Renders a contextual "Explore This Service" CTA block at the bottom of a blog post.
 * The CTA is chosen based on the post's tags and slug — linking to the most relevant
 * SEO landing page. Falls back to a generic "View All Services" CTA.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const G     = '#C4A882';
const BLACK = '#0E2A3A';
const S1    = '#3A2214';
const FG    = 'rgba(253,250,246,0.88)';
const FGDIM = 'rgba(253,250,246,0.52)';

interface ServiceCTAConfig {
  label: string;
  headline: string;
  body: string;
  href: string;
  ctaText: string;
  secondaryHref?: string;
  secondaryText?: string;
}

const LASER_CTA: ServiceCTAConfig = {
  label: 'Laser Hair Removal in Amman',
  headline: 'Ready to Stop Waxing for Good?',
  body: 'ArtiZone offers professional laser hair removal in Amman — permanent results, all skin tones, zero downtime. Book a free consultation today.',
  href: '/laser-hair-removal-amman',
  ctaText: 'Explore Laser Hair Removal',
  secondaryHref: '/booking',
  secondaryText: 'Book a Consultation',
};

const FACIAL_CTA: ServiceCTAConfig = {
  label: 'Professional Facials in Amman',
  headline: 'See the Difference After One Session',
  body: 'From Hydrafacials to anti-aging and brightening treatments — ArtiZone facials are customised to your skin type for visible, lasting results.',
  href: '/best-facial-amman',
  ctaText: 'Explore Our Facials',
  secondaryHref: '/booking',
  secondaryText: 'Book a Skin Consultation',
};

const SLIMMING_CTA: ServiceCTAConfig = {
  label: 'Body Slimming in Amman',
  headline: 'Lose 2–5 cm Per Treated Area',
  body: 'Non-surgical cavitation, radiofrequency, and lymphatic drainage — measurable results with zero downtime at ArtiZone Amman.',
  href: '/body-slimming-amman',
  ctaText: 'Explore Body Slimming',
  secondaryHref: '/booking',
  secondaryText: 'Book a Body Consultation',
};

const MENS_CTA: ServiceCTAConfig = {
  label: "Men's Grooming in Amman",
  headline: "Grooming That Works for Men",
  body: "Laser hair removal, facials, and skin treatments designed specifically for men — at ArtiZone's dedicated men's grooming clinic in Amman.",
  href: '/mens-grooming-amman',
  ctaText: "Explore Men's Grooming",
  secondaryHref: '/booking',
  secondaryText: 'Book a Consultation',
};

const DEFAULT_CTA: ServiceCTAConfig = {
  label: 'ArtiZone Beauty & Aesthetic Clinic',
  headline: 'Ready to Transform Your Skin?',
  body: 'Explore our full range of professional beauty and aesthetic treatments in Amman — facials, laser, body contouring, and more.',
  href: '/services',
  ctaText: 'View All Services',
  secondaryHref: '/booking',
  secondaryText: 'Book a Consultation',
};

/** Determine which CTA to show based on post slug + tags */
function resolveCTA(slug: string, tags: string[]): ServiceCTAConfig {
  const allText = [slug, ...tags].join(' ').toLowerCase();

  if (/laser|hair.remov|wax|shav/.test(allText) && !/mens|men'?s/.test(allText)) return LASER_CTA;
  if (/mens|men'?s|grooming/.test(allText)) return MENS_CTA;
  if (/slim|cavitat|contour|fat|cellulite|radiofreq|rf|lymph/.test(allText)) return SLIMMING_CTA;
  if (/facial|hydra|peel|acne|anti.ag|brightening|pigment|dark.spot|spf|sun|skincare|skin.care|moistur|serum|retinol/.test(allText)) return FACIAL_CTA;

  return DEFAULT_CTA;
}

interface BlogServiceCTAProps {
  slug: string;
  tags?: string[];
}

export default function BlogServiceCTA({ slug, tags = [] }: BlogServiceCTAProps) {
  const cta = resolveCTA(slug, tags);

  return (
    <div
      className="my-12 p-7 sm:p-9 relative overflow-hidden"
      style={{ background: S1, borderLeft: `3px solid ${G}` }}
    >
      {/* Decorative radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 90% 50%, rgba(196,168,130,0.07) 0%, transparent 65%)` }}
      />

      <div className="relative z-10">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.26em] mb-3"
          style={{ color: G, fontFamily: 'var(--font-sans)' }}
        >
          {cta.label}
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            color: FG,
            fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: '0.75rem',
          }}
        >
          {cta.headline}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6 max-w-xl"
          style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}
        >
          {cta.body}
        </p>

        <div className="flex flex-col xs:flex-row flex-wrap gap-3">
          <Link
            to={cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-85"
            style={{ background: G, color: BLACK, fontFamily: 'var(--font-sans)' }}
          >
            {cta.ctaText} <ArrowRight size={12} />
          </Link>
          {cta.secondaryHref && (
            <Link
              to={cta.secondaryHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-80"
              style={{ border: `1px solid rgba(196,168,130,0.30)`, color: FG, background: 'transparent', fontFamily: 'var(--font-sans)' }}
            >
              {cta.secondaryText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
