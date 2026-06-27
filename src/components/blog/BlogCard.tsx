import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '../../lib/blog';
import { formatPostDate, calculateReadingTime } from '../../lib/blog';
import OptimizedImage from '@/components/OptimizedImage';

const GOLD  = '#C4A882'; /* Warm Sand — accent                        */
const TAUPE = '#0E2A3A'; /* Ink Navy — dark bg                        */

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'horizontal' | 'minimal';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatPostDate(post.publishedAt, 'short');

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col sm:flex-row gap-0 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ background: '#fff', boxShadow: '0 2px 20px rgba(61,46,38,0.09)' }}
      >
        {post.featuredImage && (
          <div className="sm:w-64 md:w-72 shrink-0 overflow-hidden aspect-[4/3] sm:aspect-auto sm:h-auto">
            <OptimizedImage
              src={post.featuredImage}
              alt={`${post.title} — ArtiZone beauty clinic blog Amman`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              width={576} height={432}
            />
          </div>
        )}
        <div className="flex-1 p-6 sm:p-8">
          {post.category && (
            <span
              className="inline-block px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full mb-3"
              style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33` }}
            >
              {post.category}
            </span>
          )}
          <h3
            className="font-bold mt-2 leading-tight transition-colors duration-200 group-hover:opacity-80"
            style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}
          >
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed" style={{ color: 'hsl(20 15% 45%)' }}>
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-5 text-xs font-medium" style={{ color: 'hsl(20 15% 55%)' }}>
            <span className="flex items-center gap-1"><Calendar size={11} />{formattedDate}</span>
            <span style={{ color: GOLD }}>•</span>
            <span className="flex items-center gap-1"><Clock size={11} />{readingTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group block py-5 border-b transition-all duration-200"
        style={{ borderColor: 'rgba(184,150,90,0.15)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {post.category && (
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: GOLD }}>
                {post.category}
              </span>
            )}
            <h3
              className="font-semibold mt-1.5 leading-snug transition-colors duration-200 group-hover:opacity-70"
              style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: '1rem' }}
            >
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-medium" style={{ color: 'hsl(20 15% 55%)' }}>
              <span>{formattedDate}</span>
              <span style={{ color: GOLD }}>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
          {post.featuredImage && (
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              <OptimizedImage
                src={post.featuredImage}
                alt={`${post.title} — ArtiZone beauty blog`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                width={80} height={80}
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: '#fff', boxShadow: '0 2px 20px rgba(61,46,38,0.09)' }}
    >
      {/* Image */}
      {post.featuredImage && (
        <div className="aspect-[16/9] overflow-hidden relative">
          <OptimizedImage
            src={post.featuredImage}
            alt={`${post.title} — ArtiZone beauty clinic blog Amman`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            width={800} height={450}
          />
          {/* Category badge over image */}
          {post.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold tracking-wide uppercase rounded-full"
              style={{ background: 'rgba(61,46,38,0.75)', color: GOLD, backdropFilter: 'blur(4px)' }}
            >
              {post.category}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Meta row */}
        <div className="flex items-center gap-2.5 text-xs font-medium mb-3" style={{ color: 'hsl(20 15% 55%)' }}>
          <span className="flex items-center gap-1"><Calendar size={10} />{formattedDate}</span>
          <span style={{ color: GOLD }}>•</span>
          <span className="flex items-center gap-1"><Clock size={10} />{readingTime} min read</span>
        </div>

        {/* Title */}
        <h3
          className="font-bold leading-tight mb-2.5 transition-colors duration-200 group-hover:opacity-75"
          style={{ fontFamily: 'var(--font-heading)', color: TAUPE, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: 'hsl(20 15% 45%)' }}>
          {post.excerpt}
        </p>

        {/* Read more */}
        <div
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5"
          style={{ color: GOLD }}
        >
          Read Article <ArrowRight size={11} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(184,150,90,0.12)' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full"
                style={{ background: `${GOLD}12`, color: GOLD }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
