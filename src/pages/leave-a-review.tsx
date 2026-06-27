import { useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { GBP_URL, SITE_URL } from '@/lib/gbp-schema';
import { Star, ExternalLink } from 'lucide-react';

/* Direct Google review write URL */
const REVIEW_URL = `${GBP_URL}?hl=en#lrd=0x0:0x0,3`;

const GOLD  = '#C4A882';
const NAVY  = '#0E2A3A';
const IVORY = '#FDFAF6';

export default function LeaveAReviewPage() {
  /* Auto-redirect after 2 seconds */
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = REVIEW_URL;
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Helmet>
        <title>Leave a Review — ArtiZone Beauty Clinic Amman</title>
        <meta name="description" content="Leave a Google review for ArtiZone Beauty & Aesthetic Clinic in Amman, Jordan." />
        <link rel="canonical" href={`${SITE_URL}/leave-a-review`} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #1a3a50 100%)` }}>

        {/* Stars */}
        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map(n => (
            <Star key={n} size={32} fill={GOLD} stroke={GOLD} />
          ))}
        </div>

        <h1 className="font-medium mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(1.6rem,4vw,2.4rem)' }}>
          Thank you for visiting ArtiZone!
        </h1>
        <p className="text-sm mb-8 max-w-sm" style={{ color: 'rgba(253,250,246,0.65)' }}>
          Redirecting you to Google to leave your review…
        </p>

        {/* Spinner */}
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-8"
          style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />

        <a href={REVIEW_URL}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}>
          <ExternalLink size={14} />
          Go to Google Reviews
        </a>
      </div>
    </>
  );
}
