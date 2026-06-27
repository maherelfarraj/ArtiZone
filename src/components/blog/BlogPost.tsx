import { useEffect, useState } from 'react';
import type { BlogPost as BlogPostType } from '../../lib/blog';
import { formatPostDate, calculateReadingTime } from '../../lib/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import OptimizedImage from '@/components/OptimizedImage';

const GOLD  = '#C4A882'; /* Warm Sand — accent                        */
const TAUPE = '#0E2A3A'; /* Ink Navy — dark bg                        */
const CREAM = '#F7F3EE'; /* Parchment — light surface                 */
const BODY  = 'hsl(20 20% 28%)';   /* readable dark brown on cream bg */
const META  = 'hsl(20 15% 38%)';   /* secondary meta text */
const LIGHT = 'hsl(20 12% 46%)';   /* tertiary / timestamps */

/**
 * BlogPost Component Props
 */
interface BlogPostProps {
  /** Blog post data to display */
  post: BlogPostType;
}

/**
 * BlogPost Component
 *
 * Displays a full blog post with metadata, content, and navigation.
 * Features reading progress indicator, decorative elements, and stylish typography.
 * Automatically inherits site colors from CSS variables.
 *
 * @param props - Component props
 * @returns BlogPost component
 */
export default function BlogPost({ post }: BlogPostProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatPostDate(post.publishedAt, 'full');
  const updatedDate = post.updatedAt ? formatPostDate(post.updatedAt, 'long') : null;

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: 'rgba(184,150,90,0.15)' }}>
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%`, background: GOLD }}
        />
      </div>

      <article className="relative" style={{ background: CREAM }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
          <div className="absolute bottom-1/4 -left-24 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">

          {/* Article header */}
          <header className="mb-10 sm:mb-14">
            {post.category && (
              <span
                className="inline-block px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full mb-5"
                style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33` }}
              >
                {post.category}
              </span>
            )}

            <h1
              className="font-bold leading-tight mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.6rem, 4vw, 2.75rem)' }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg leading-relaxed mb-7" style={{ color: META }}>
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium pb-7"
              style={{ color: LIGHT, borderBottom: `1px solid ${GOLD}22` }}
            >
              {post.author && <span style={{ color: TAUPE, fontWeight: 600 }}>{post.author}</span>}
              {post.author && <span style={{ color: GOLD }}>•</span>}
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              <span style={{ color: GOLD }}>•</span>
              <span>{readingTime} min read</span>
              {updatedDate && (
                <>
                  <span style={{ color: GOLD }}>•</span>
                  <span>Updated {updatedDate}</span>
                </>
              )}
            </div>
          </header>

          {/* Featured image */}
          {post.featuredImage && (
            <div className="mb-10 sm:mb-14 rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(61,46,38,0.12)' }}>
              <OptimizedImage
                src={post.featuredImage}
                alt={`${post.title} — ArtiZone beauty clinic Amman`}
                className="w-full h-auto object-cover max-h-[60vw] sm:max-h-[480px]"
                priority
                width={1200} height={630}
              />
            </div>
          )}

          {/* Article body */}
          <div className="blog-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({node, ...props}) => (
                  <div className="mt-12 mb-5">
                    <h2
                      className="font-bold leading-tight"
                      style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
                      {...props}
                    />
                    <div className="mt-2 h-0.5 w-12 rounded-full" style={{ background: GOLD }} />
                  </div>
                ),
                h3: ({node, ...props}) => (
                  <h3
                    className="font-bold leading-tight mt-9 mb-3"
                    style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.05rem, 2vw, 1.35rem)' }}
                    {...props}
                  />
                ),
                h4: ({node, ...props}) => (
                  <h4
                    className="font-semibold mt-7 mb-2"
                    style={{ color: TAUPE, fontSize: '1rem' }}
                    {...props}
                  />
                ),
                p: ({node, ...props}) => (
                  <p className="text-sm sm:text-base leading-[1.85] mb-5" style={{ color: BODY }} {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <div
                    className="my-8 pl-5 pr-5 py-5 rounded-xl"
                    style={{ borderLeft: `3px solid ${GOLD}`, background: `${GOLD}0D` }}
                  >
                    <blockquote className="text-base italic leading-relaxed" style={{ color: TAUPE }} {...props} />
                  </div>
                ),
                ul: ({node, ...props}) => (
                  <ul className="my-5 space-y-2.5 text-sm sm:text-base" style={{ color: BODY }} {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="my-5 space-y-2.5 text-sm sm:text-base list-decimal list-inside" style={{ color: BODY }} {...props} />
                ),
                li: ({node, ...props}) => (
                  <li className="leading-relaxed flex gap-2.5 items-start">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                    <span {...props} />
                  </li>
                ),
                a: ({node, ...props}) => (
                  <a className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70" style={{ color: GOLD }} {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong style={{ color: TAUPE, fontWeight: 700 }} {...props} />
                ),
                hr: ({node, ...props}) => (
                  <div className="my-10 flex items-center justify-center gap-3">
                    <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD}66)` }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                    <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD}66)` }} />
                  </div>
                ),
                table: ({node, ...props}) => (
                  <div className="my-8 rounded-xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(61,46,38,0.08)', border: `1px solid ${GOLD}22` }}>
                    <table className="w-full text-sm" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => (
                  <thead style={{ background: TAUPE }} {...props} />
                ),
                th: ({node, ...props}) => (
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: GOLD }} {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="px-4 py-3 text-sm border-b" style={{ color: BODY, borderColor: `${GOLD}18` }} {...props} />
                ),
                tr: ({node, ...props}) => (
                  <tr className="transition-colors" style={{ background: 'transparent' }} {...props} />
                ),
                img: ({node, ...props}) => (
                  <img className="w-full rounded-xl my-8" style={{ boxShadow: '0 2px 20px rgba(61,46,38,0.10)' }} loading="lazy" decoding="async" width={800} height={450} {...props} />
                ),
                code: ({inline, ...props}: {node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode}) => {
                  if (inline) {
                    return <code className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ background: `${GOLD}18`, color: TAUPE }} {...props} />;
                  }
                  return <code className="block" {...props} />;
                },
                pre: ({node, ...props}) => (
                  <pre className="my-6 p-5 rounded-xl overflow-x-auto text-xs" style={{ background: TAUPE, color: CREAM }} {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${GOLD}22` }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>Topics</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs rounded-full font-medium"
                    style={{ background: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}28` }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author card */}
          {post.author && (
            <div className="mt-10 p-6 rounded-2xl flex items-center gap-5" style={{ background: `${GOLD}0D`, border: `1px solid ${GOLD}22` }}>
              <div
                className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold"
                style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-heading)' }}
              >
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-0.5" style={{ color: GOLD }}>Written by</p>
                <p className="font-bold text-sm" style={{ color: TAUPE, fontFamily: 'var(--font-heading)' }}>{post.author}</p>
                <p className="text-xs mt-0.5" style={{ color: LIGHT }}>
                  Certified beauty & aesthetic specialists at ArtiZone Clinic, Amman.
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
