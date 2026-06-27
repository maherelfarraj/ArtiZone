import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import BlogHero from '../components/blog/BlogHero';
import BlogGrid from '../components/blog/BlogGrid';
import { getBlogPosts, getPostsByCategory, getPostsByTag, paginatePosts, getAllCategories, getAllTags } from '../lib/blog';
import type { BlogPost } from '../lib/blog';

const GOLD  = '#C4A882'; /* Warm Sand — accent                        */
const TAUPE = '#0E2A3A'; /* Ink Navy — dark text                      */
const CREAM = '#F7F3EE'; /* Parchment — page bg                       */

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    let filteredPosts: BlogPost[];
    if (categoryFilter) {
      filteredPosts = getPostsByCategory(categoryFilter);
    } else if (tagFilter) {
      filteredPosts = getPostsByTag(tagFilter);
    } else {
      filteredPosts = getBlogPosts();
    }
    setPosts(filteredPosts);
    setCategories(getAllCategories());
    setTags(getAllTags());
  }, [categoryFilter, tagFilter]);

  const { posts: paginatedPosts, pagination } = paginatePosts(posts, page, 9);

  const clearFilters = () => setSearchParams({});
  const setCategory = (category: string) => setSearchParams({ category });
  const setTag = (tag: string) => setSearchParams({ tag });
  const goToPage = (newPage: number) => {
    const params: Record<string, string> = { page: newPage.toString() };
    if (categoryFilter) params.category = categoryFilter;
    if (tagFilter) params.tag = tagFilter;
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>Beauty & Skin Tips Blog | ArtiZone Clinic Amman</title>
        <meta name="description" content="Expert skincare advice, beauty tips, treatment guides, and aesthetic insights from the ArtiZone team in Amman, Jordan." />
        <link rel="canonical" href="https://artizonespa.com/blog" />
        <meta property="og:title"        content="Beauty & Skin Tips Blog | ArtiZone Clinic Amman" />
        <meta property="og:description"  content="Expert skincare advice, beauty tips, treatment guides, and aesthetic insights from the ArtiZone team in Amman, Jordan." />
        <meta property="og:type"         content="blog" />
        <meta property="og:url"          content="https://artizonespa.com/blog" />
        <meta property="og:image"        content="https://artizonespa.com/airo-assets/images/blog/facial-treatment" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="ArtiZone Beauty & Skin Tips Blog — Amman, Jordan" />
        <meta property="og:site_name"    content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@artizone_clinic" />
        <meta name="twitter:title"       content="Beauty & Skin Tips Blog | ArtiZone Clinic Amman" />
        <meta name="twitter:description" content="Expert skincare advice, beauty tips, treatment guides, and aesthetic insights from the ArtiZone team in Amman, Jordan." />
        <meta name="twitter:image"       content="https://artizonespa.com/airo-assets/images/blog/facial-treatment" />
        <meta name="twitter:image:alt"   content="ArtiZone Beauty & Skin Tips Blog — Amman, Jordan" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/blog" />

        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/blog" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'ArtiZone Beauty & Skin Tips Blog',
          description: 'Expert skincare advice, beauty tips, treatment guides, and aesthetic insights from the ArtiZone team in Amman, Jordan.',
          url: 'https://artizonespa.com/blog',
          inLanguage: 'en',
          image: 'https://artizonespa.com/airo-assets/images/blog/facial-treatment',
          publisher: {
            '@type': 'BeautySalon',
            '@id': 'https://artizonespa.com',
            name: 'ArtiZone Beauty & Aesthetic Clinic',
            url: 'https://artizonespa.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://artizonespa.com/loogoooo.png',
              width: 400,
              height: 120,
            },
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://artizonespa.com' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://artizonespa.com/blog' },
            ],
          },
        })}</script>
      </Helmet>

      <div style={{ background: CREAM, minHeight: '100vh' }}>
        {/* Hero */}
        <BlogHero
          title="Beauty & Skin Tips"
          subtitle="Expert skincare advice, treatment guides, and beauty insights from the ArtiZone team in Amman"
          variant="default"
          backgroundImage="/airo-assets/images/services/facial-video"
        />

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Filter bar */}
          <div className="mb-8 flex flex-wrap items-center gap-3">

            {/* Active filter chips */}
            {(categoryFilter || tagFilter) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: TAUPE, color: '#F5F0E8' }}
              >
                {categoryFilter ? `Category: ${categoryFilter}` : `Tag: ${tagFilter}`}
                <X size={11} />
              </button>
            )}

            {/* Category pills */}
            {categories.length > 0 && !categoryFilter && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-80"
                    style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33` }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Tag pills */}
            {tags.length > 0 && !tagFilter && !categoryFilter && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTag(tag)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{ background: 'rgba(61,46,38,0.07)', color: TAUPE }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post count */}
          <p className="text-xs font-medium mb-6" style={{ color: 'hsl(20 15% 55%)' }}>
            {pagination.totalPosts} {pagination.totalPosts === 1 ? 'article' : 'articles'}
            {categoryFilter && ` in "${categoryFilter}"`}
            {tagFilter && ` tagged "${tagFilter}"`}
          </p>

          {/* Grid */}
          <BlogGrid posts={paginatedPosts} variant="default" columns={3} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                style={{ background: '#fff', color: TAUPE, border: `1.5px solid rgba(61,46,38,0.15)`, boxShadow: '0 1px 6px rgba(61,46,38,0.07)' }}
              >
                ← Previous
              </button>

              <div className="flex gap-1.5">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className="w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200"
                    style={
                      pageNum === pagination.currentPage
                        ? { background: GOLD, color: '#fff' }
                        : { background: '#fff', color: TAUPE, border: `1.5px solid rgba(61,46,38,0.15)` }
                    }
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                style={{ background: '#fff', color: TAUPE, border: `1.5px solid rgba(61,46,38,0.15)`, boxShadow: '0 1px 6px rgba(61,46,38,0.07)' }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
