import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ReviewCard, { type ReviewCardData } from './ReviewCard';
import ReviewForm from './ReviewForm';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

function AverageStars({ avg, total }: { avg: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={18}
            fill={s <= Math.round(avg) ? GOLD : 'none'}
            stroke={s <= Math.round(avg) ? GOLD : 'rgba(61,46,38,0.25)'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-sm font-semibold" style={{ color: TAUPE }}>{avg.toFixed(1)}</span>
      <span className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>({total} {total === 1 ? 'review' : 'reviews'})</span>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const PER_PAGE = 3;

  // Auto-open form when ?review=1 is in the URL (from email CTA)
  useEffect(() => {
    if (searchParams.get('review') === '1') {
      setShowForm(true);
      // Scroll section into view smoothly
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
      // Clean the param from the URL without a page reload
      const next = new URLSearchParams(searchParams);
      next.delete('review');
      setSearchParams(next, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json() as { reviews: ReviewCardData[] };
      setReviews(data.reviews ?? []);
    } catch {
      // silently fail — section just shows empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchReviews(); }, []);

  const totalPages = Math.ceil(reviews.length / PER_PAGE);
  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const handleFormSuccess = () => {
    setTimeout(() => setShowForm(false), 2800);
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24" style={{ background: CREAM }}>
      <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}
            >
              <Star size={12} fill={GOLD} stroke={GOLD} />
              Client Reviews
            </span>
            <h2
              className="font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: TAUPE }}
            >
              What Our Clients Say
            </h2>
            {reviews.length > 0 && <AverageStars avg={avg} total={reviews.length} />}
          </motion.div>

          <motion.button
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shrink-0"
            style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-sans)' }}
          >
            <MessageSquarePlus size={16} />
            Leave a Review
          </motion.button>
        </div>

        {/* Reviews grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: 'rgba(61,46,38,0.06)' }} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center py-16 rounded-2xl"
            style={{ background: 'rgba(201,169,110,0.06)', border: '1.5px dashed rgba(201,169,110,0.3)' }}
          >
            <Star size={32} className="mx-auto mb-3 opacity-30" style={{ color: GOLD }} />
            <p className="font-semibold mb-1" style={{ color: TAUPE }}>No reviews yet</p>
            <p className="text-sm mb-4" style={{ color: 'hsl(20 15% 55%)' }}>Be the first to share your experience!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: GOLD, color: '#fff' }}
            >
              Write a Review
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
              >
                {visible.map((review, i) => (
                  <motion.div key={review.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <ReviewCard review={review} compact />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
                  style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ background: i === page ? GOLD : 'rgba(61,46,38,0.2)' }}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
                  style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(61,46,38,0.55)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowForm(false)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[5vh] sm:top-[8vh] z-50 w-full sm:w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: CREAM, boxShadow: '0 24px 64px rgba(61,46,38,0.25)' }}
            >
              <div className="p-6 sm:p-8">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                      Share Your Experience
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                      We'd love to hear about your visit to ArtiZone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70 shrink-0 ml-4"
                    style={{ background: 'rgba(61,46,38,0.08)', color: TAUPE }}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <ReviewForm onSuccess={handleFormSuccess} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
