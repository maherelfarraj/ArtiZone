import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import BlogPost from '../components/blog/BlogPost';
import BlogGrid from '../components/blog/BlogGrid';
import BlogServiceCTA from '../components/blog/BlogServiceCTA';
import BlogNewsletterSignup from '../components/blog/BlogNewsletterSignup';
import { getPostBySlug, getRelatedPosts } from '../lib/blog';
import type { BlogPost as BlogPostType } from '../lib/blog';

const GOLD  = '#C4A882'; /* Warm Sand — accent                        */
const TAUPE = '#0E2A3A'; /* Ink Navy — dark bg                        */
const CREAM = '#F7F3EE'; /* Parchment — page bg                       */

const SITE_URL = 'https://artizonespa.com';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const foundPost = getPostBySlug(slug);
    setPost(foundPost);
    if (foundPost) setRelatedPosts(getRelatedPosts(foundPost, 3));
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: `${GOLD} transparent transparent transparent` }} />
          <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>Loading article…</p>
        </div>
      </div>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const pageTitle = post.seoTitle || `${post.title} | ArtiZone Blog`;
  const pageDesc  = post.seoDescription || post.excerpt;
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  // Resolve OG image: slot-relative paths get the site URL prepended; absolute URLs used as-is
  const rawImage  = post.featuredImage || '/airo-assets/images/blog/facial-treatment';
  const ogImage   = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: pageDesc,
    url: canonical,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: post.author || 'ArtiZone Team',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'BeautySalon',
      name: 'ArtiZone Beauty & Aesthetic Clinic',
      url: SITE_URL,
      logo: `${SITE_URL}/airo-assets/images/logo/horizontal`,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  };

  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="ArtiZone Beauty &amp; Aesthetic Clinic" />
        <meta property="article:published_time" content={post.publishedAt} />
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        {post.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artizone_clinic" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={post.title} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
          style={{ color: GOLD }}
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>

      {/* Post content */}
      <BlogPost post={post} />

      {/* Service CTA — contextual link to relevant landing page */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogServiceCTA slug={post.slug} tags={post.tags ?? []} />
      </div>

      {/* Newsletter signup — blog-sourced subscribers enter the Day-14 nurture sequence */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogNewsletterSignup />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div
          className="mt-16 pt-12 pb-16"
          style={{ borderTop: '1px solid rgba(196,168,130,0.18)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] mb-2" style={{ color: GOLD }}>
                Keep Reading
              </p>
              <h2
                className="font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
              >
                Related Articles
              </h2>
            </div>
            <BlogGrid posts={relatedPosts} variant="default" columns={3} />
          </div>
        </div>
      )}
    </div>
  );
}
