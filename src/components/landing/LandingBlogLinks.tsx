/**
 * LandingBlogLinks
 * "From Our Blog" section for SEO landing pages.
 * Shows 3 curated blog post links relevant to the service, with title + excerpt.
 * Adds topical authority signals and internal links pointing back to the blog.
 */
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const G     = '#C4A882';                      /* Cinnamon Stick — primary accent */
const BLACK = '#0E2A3A';                      /* deep dark brown */
const S1    = '#3A2214';                      /* warm dark brown — card bg */
const FG    = 'rgba(253,250,246,0.88)';       /* Vanilla Ice Cream foreground */
const FGDIM = 'rgba(253,250,246,0.48)';       /* Vanilla Ice Cream dim */

interface BlogLink {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
}

const BLOG_LINKS: Record<string, BlogLink[]> = {
  laser: [
    {
      slug: 'laser-hair-removal-dark-skin-amman',
      title: 'Laser Hair Removal for Dark Skin in Amman: What You Need to Know',
      excerpt: 'Nd:YAG laser is safe for all skin tones — why it is the gold standard for olive and darker skin, and what to expect.',
      readTime: '8 min read',
    },
    {
      slug: 'laser-hair-removal-complete-guide',
      title: 'Laser Hair Removal: Everything You Need to Know',
      excerpt: 'How it works, how many sessions you need, and how to prepare for the best results.',
      readTime: '6 min read',
    },
    {
      slug: 'spf-sun-protection-guide',
      title: 'SPF & Sun Protection: The One Step You Cannot Skip',
      excerpt: 'Sun protection is essential after laser treatments. Learn how to do it right.',
      readTime: '7 min read',
    },
  ],
  facial: [
    {
      slug: 'hydrafacial-vs-chemical-peel-amman',
      title: 'HydraFacial vs Chemical Peel: Which Is Right for Your Skin?',
      excerpt: 'A clear comparison of two of the most popular facial treatments — results, downtime, and which suits your skin type.',
      readTime: '8 min read',
    },
    {
      slug: 'best-facial-sensitive-skin-amman',
      title: 'Best Facial Treatments for Sensitive Skin in Amman',
      excerpt: 'Reactive skin does not mean skipping facials — it means choosing the right ones. A guide to what works and what to avoid.',
      readTime: '8 min read',
    },
    {
      slug: 'best-treatments-oily-skin-amman',
      title: 'Best Treatments for Oily Skin in Amman: What Actually Controls Shine',
      excerpt: 'Salicylic peels, HydraFacial and RF microneedling — the most effective professional treatments for oily skin and enlarged pores.',
      readTime: '8 min read',
    },
  ],
  slimming: [
    {
      slug: 'body-slimming-women-amman',
      title: 'Body Slimming for Women in Amman: The Most Effective Non-Surgical Treatments',
      excerpt: 'Cryolipolysis, RF, cavitation and lymphatic drainage — a complete guide to non-surgical body contouring for women in Amman.',
      readTime: '9 min read',
    },
    {
      slug: 'body-slimming-treatments-explained',
      title: 'Body Slimming Treatments: What Actually Works?',
      excerpt: 'An honest breakdown of cavitation, RF, and other contouring options — and realistic results.',
      readTime: '6 min read',
    },
    {
      slug: 'non-invasive-skin-tightening-amman',
      title: 'Non-Invasive Skin Tightening in Amman: RF, HIFU & What to Expect',
      excerpt: 'RF tightening and HIFU for loose skin after weight loss or pregnancy — real lifting results without surgery.',
      readTime: '9 min read',
    },
  ],
  summer: [
    {
      slug: 'daily-skincare-routine-guide',
      title: 'The Perfect Daily Skincare Routine for Glowing Skin',
      excerpt: 'Summer heat demands a smarter routine. Here is how to keep your skin clear and radiant all season.',
      readTime: '5 min read',
    },
    {
      slug: 'spf-sun-protection-guide',
      title: 'SPF & Sun Protection: The One Step You Cannot Skip',
      excerpt: 'Jordan summers are intense. Learn how to protect your skin and prevent sun damage year-round.',
      readTime: '7 min read',
    },
    {
      slug: 'laser-hair-removal-complete-guide',
      title: 'Laser Hair Removal: Everything You Need to Know',
      excerpt: 'Summer is the perfect time to start laser — so you are smooth and ready by next season.',
      readTime: '6 min read',
    },
  ],
  winter: [
    {
      slug: 'anti-aging-treatments-amman',
      title: 'Anti-Aging Treatments: The Complete Guide',
      excerpt: 'Winter is the ideal season for deeper skin treatments. Discover what works and when to start.',
      readTime: '7 min read',
    },
    {
      slug: 'professional-facial-treatments-guide',
      title: 'Which Facial Treatment Is Right for You?',
      excerpt: 'Cold weather strips moisture from skin. Find the right professional facial for winter recovery.',
      readTime: '6 min read',
    },
    {
      slug: 'body-slimming-treatments-explained',
      title: 'Body Slimming Treatments: What Actually Works?',
      excerpt: 'Winter is the best time to start body contouring — results are ready before summer.',
      readTime: '6 min read',
    },
  ],
  mens: [
    {
      slug: 'mens-skincare-grooming-guide',
      title: "Men's Skincare: The No-Nonsense Guide to Better Skin",
      excerpt: "Essential skincare steps and the best treatments for men — straight to the point.",
      readTime: '6 min read',
    },
    {
      slug: 'laser-hair-removal-complete-guide',
      title: 'Laser Hair Removal: Everything You Need to Know',
      excerpt: 'Laser is the most popular grooming treatment for men. Here is the full guide.',
      readTime: '6 min read',
    },
    {
      slug: 'professional-facial-treatments-guide',
      title: 'Which Facial Treatment Is Right for You?',
      excerpt: "Men's skin benefits from professional facials too — find out which one suits you.",
      readTime: '6 min read',
    },
  ],
  acne: [
    {
      slug: 'best-acne-scar-treatment-amman',
      title: 'Best Acne Scar Treatment in Amman: What Actually Works',
      excerpt: 'Ice pick, boxcar, rolling scars or dark marks — the right treatment depends on your scar type. A complete guide to what works in 2026.',
      readTime: '9 min read',
    },
    {
      slug: 'rf-microneedling-amman',
      title: 'RF Microneedling in Amman: Results, Sessions & What to Expect',
      excerpt: 'The most powerful non-surgical treatment for acne scars, pores, and skin tightening — a complete guide before you book.',
      readTime: '10 min read',
    },
    {
      slug: 'acne-treatment-amman',
      title: 'Acne Treatment in Amman: The Most Effective Options for Clear Skin',
      excerpt: 'From salicylic peels to LED therapy — the most effective clinic-based acne treatments available in Amman.',
      readTime: '7 min read',
    },
  ],
  tightening: [
    {
      slug: 'non-invasive-skin-tightening-amman',
      title: 'Non-Invasive Skin Tightening in Amman: RF, HIFU & What to Expect',
      excerpt: 'How RF tightening and HIFU deliver real lifting results without surgery — who each treatment is for and what results to expect.',
      readTime: '9 min read',
    },
    {
      slug: 'rf-microneedling-amman',
      title: 'RF Microneedling in Amman: Results, Sessions & What to Expect',
      excerpt: 'The most powerful non-surgical skin treatment — combining microneedling with RF for scars, tightening, and pores.',
      readTime: '10 min read',
    },
    {
      slug: 'professional-facial-treatments-guide',
      title: 'Which Facial Treatment Is Right for You?',
      excerpt: 'Pair skin tightening with the right facial for a complete skin rejuvenation programme.',
      readTime: '6 min read',
    },
  ],
  nails: [
    {
      slug: 'nail-care-tips-healthy-nails',
      title: 'Nail Care Tips: How to Keep Your Nails Healthy & Beautiful',
      excerpt: 'From gel maintenance to cuticle care — the habits that keep your nails strong and salon-fresh between appointments.',
      readTime: '5 min read',
    },
    {
      slug: 'professional-facial-treatments-guide',
      title: 'Which Facial Treatment Is Right for You?',
      excerpt: 'Pair your nail appointment with a rejuvenating facial for a complete beauty experience.',
      readTime: '6 min read',
    },
    {
      slug: 'daily-skincare-routine-guide',
      title: 'The Perfect Daily Skincare Routine for Glowing Skin',
      excerpt: 'Beautiful nails and glowing skin go hand in hand. Build the routine that keeps you looking your best.',
      readTime: '5 min read',
    },
  ],
};

interface LandingBlogLinksProps {
  service: 'laser' | 'facial' | 'slimming' | 'mens' | 'summer' | 'winter' | 'nails' | 'acne' | 'tightening';
  background?: string;
}

export default function LandingBlogLinks({ service, background }: LandingBlogLinksProps) {
  const posts = BLOG_LINKS[service] ?? BLOG_LINKS.facial;
  const bg = background ?? BLACK;

  return (
    <section style={{ background: bg, borderTop: '1px solid rgba(196,168,130,0.08)' }}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-2" style={{ color: G, fontFamily: 'var(--font-sans)' }}>
              From Our Blog
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.4rem,2.8vw,2.2rem)', fontWeight: 400, lineHeight: 1.1 }}>
              Learn Before You Book
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-70 shrink-0"
            style={{ color: G, fontFamily: 'var(--font-sans)' }}
          >
            All Articles <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {posts.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block p-6 transition-all duration-200 hover:opacity-90"
              style={{ background: S1, border: '1px solid rgba(196,168,130,0.10)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={11} style={{ color: G }} />
                <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{post.readTime}</span>
              </div>
              <h3
                className="text-sm font-medium leading-snug mb-3 group-hover:underline underline-offset-2"
                style={{ fontFamily: 'var(--font-heading)', color: FG, textDecorationColor: G }}
              >
                {post.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>
                {post.excerpt}
              </p>
              <div className="flex items-center gap-1.5 mt-4 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: G, fontFamily: 'var(--font-sans)' }}>
                Read Article <ArrowRight size={9} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
