import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Star, QrCode, ExternalLink, MessageSquarePlus, ChevronDown, Share2, Copy, Check } from 'lucide-react';
import { GBP_NAME, GBP_URL, SITE_URL } from '@/lib/gbp-schema';
import GoogleReviews, { type Review } from '@/components/GoogleReviews';

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const IVORY = '#FDFAF6';
const PARCH = '#F7F3EE';
const SAGE  = '#6B7260';

/* ── Google review write URL ──────────────────────────────────────────────── */
const REVIEW_WRITE_URL = `${GBP_URL}?hl=en#lrd=0x0:0x0,3`;

/* ── Share config ─────────────────────────────────────────────────────────── */
const SHARE_URL  = `${SITE_URL}/reviews`;
const SHARE_TEXT = "ArtiZone Beauty & Aesthetic Clinic in Amman has amazing reviews — check them out! 🌟";
const SHARE_HASHTAGS = 'ArtiZone,BeautyAmman,AestheticClinic';

const SHARE_LINKS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    href: () => `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n${SHARE_URL}`)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    color: '#000000',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}&hashtags=${SHARE_HASHTAGS}`,
  },
];

/* ── ShareBar component ───────────────────────────────────────────────────── */
function ShareBar() {
  const [copied, setCopied] = useState(false);
  const [nativeAvailable] = useState(() => typeof navigator !== 'undefined' && !!navigator.share);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* ignore */ }
  }, []);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: 'ArtiZone Reviews', text: SHARE_TEXT, url: SHARE_URL });
    } catch { /* user cancelled */ }
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.20em] mr-1" style={{ color: 'rgba(107,114,96,0.55)' }}>
        Share
      </span>

      {SHARE_LINKS.map(({ id, label, color, icon, href }) => (
        <a
          key={id}
          href={href()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 hover:opacity-90"
          style={{ background: color, color: '#fff', boxShadow: `0 2px 8px ${color}40` }}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </a>
      ))}

      {/* Copy link */}
      <button
        onClick={handleCopy}
        aria-label="Copy page link"
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
        style={{ background: NAVY, color: IVORY, boxShadow: '0 2px 8px rgba(14,42,58,0.25)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied
            ? <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <Check size={14} />
              </motion.span>
            : <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <Copy size={14} />
              </motion.span>
          }
        </AnimatePresence>
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      {/* Native share (mobile) */}
      {nativeAvailable && (
        <button
          onClick={handleNativeShare}
          aria-label="Share via device"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 sm:hidden"
          style={{ background: GOLD, color: NAVY }}
        >
          <Share2 size={14} />
          Share
        </button>
      )}
    </div>
  );
}

/* ── Seed data — full live GBP dataset (SSR fallback / instant initial state) */
const SEED_REVIEWS: Review[] = [
  {
    reviewId: 'AbFvOqkuiozsKcbSiQN277IQxSoQs4BeiQekJuuZL4O5wAkQhDo-wfenvPeGK0ghZUxDWhNBulj9',
    reviewer: { displayName: 'Lateefa Zaid al Kilani', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIO3dSXjzVoo2ydL3uLsY4JkfxArO3qs1mrdlnCrygoZgNWNw=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: "The only good thing is the receptionist. I booked a package around a 1000 jd before my wedding to do my thighs and hips and they ruined my hips now I have a hip that is very obvious and a one you can barely see I don't recommend this clinic at all it's extremely expensive, they don't handle the responsibility of their mistake, unprofessional job I wish I could show the difference in my hips and instead of fixing they blamed me…..",
    createTime: '2026-06-11T00:42:31.133397Z',
    updateTime: '2026-06-11T00:42:31.133397Z',
  },
  {
    reviewId: 'AbFvOqn6j1nFQIwEdwbAnqBgXhnhkxRCe2iLOTRQ5uq2ZoZ-QKeVNdWB3f4-PB47YmxTubJGVEuQ',
    reviewer: { displayName: 'Rawan Farraj', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIGbLeUMBNAjPG7Fqu1Fc9zDEQqnGKzq7hdTpzpce1QgVHyTA=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    createTime: '2026-06-07T10:02:46.164297Z',
    updateTime: '2026-06-07T10:02:46.164297Z',
  },
  {
    reviewId: 'AbFvOqlmhAKRUe1eKD3K_0HS5hQ83rDHIksthGyU_JLEZ7Uikiv1aZLrVyZBUyEoQ2rSmIhfpG8O8w',
    reviewer: { displayName: 'raghad baniomar', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLpeeCsMi8uJQjtdRgj051KXIXc_d7N3T3015aSpDS1huxs5A=s120-c-rp-mo-ba12-br100' },
    starRating: 'ONE',
    comment: "معملتهم سيئة و كمان بوقعوا المراجع عندهم على اخلاء مسؤوليه الهم انه مو مسؤولين عن اي اشي بصير للمراجع بعد ما يخلص من عندهم علاج بكل اشي وهاد بدل على عدم كفاءة وقلة ثقة بالمنتجات الي بقدموها\n\n(Translated by Google)\nTheir treatment is poor, and they also make patients sign a waiver releasing them from liability for anything that happens to the patient after they finish their treatment. This indicates a lack of competence and a lack of confidence in the products they offer.",
    createTime: '2026-05-12T19:02:35.853776Z',
    updateTime: '2026-05-12T19:02:35.853776Z',
  },
  {
    reviewId: 'AbFvOqmLPUmu44oOVKRppaZCuh1XHq_T_VrWEG3NvFpk49SO2zqTjoklyD1t2jyeMD5xA4H0Ya4K',
    reviewer: { displayName: 'Abdullah Qabazard', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocL4Esg4_3eRU84bvEWPLze0PTINGWOk2z8zTTi9s8ZCsSQwfQ=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "ماشاءالله عيادة ممتازة ونظيفه وستاف ممتاز بالاخص خبيرة البشرة سنا اداء مميز وشغل ممتاز تستاهل التكرار\n\n(Translated by Google)\nMasha'Allah, an excellent and clean clinic with outstanding staff, especially the skin expert, Sana. Her performance and work are exceptional. Deserving of a repeat visit.",
    createTime: '2026-01-08T13:11:24.195807Z',
    updateTime: '2026-01-08T13:11:24.195807Z',
  },
  {
    reviewId: 'AbFvOql3CO7-Pxat5sbD0RQrb53wE58DC83IAUdoSd54wixpHVUabI5V_WxkEr1o-sxuzPmWFvSkow',
    reviewer: { displayName: 'Jana Shaban', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIBzkSp8JFIfTv2lBeIrmWH5QAkYMeJRkkXKOwMPvQiulX1ZQ=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: 'In love with the staff, I had an amazing experience and will definitely keep coming. I would recommend to anyone looking to enhance their radiance',
    createTime: '2025-11-08T08:37:55.962320Z',
    updateTime: '2025-11-08T08:37:55.962320Z',
  },
  {
    reviewId: 'AbFvOqkzhvkm8SY6l0ExKLmbbe8PJHSEoDyR6Fu4yH6umDFhnyQTGQgxTvCSxOZcJpui8WXtcnCFIw',
    reviewer: { displayName: 'Aseel Abusamara', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKhf4Ned_Kpc5VimyBPTYQhNT_KObK1kxHniHUJ6utXYXIlFg=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "Friendly helpful employees\nربحت جائزة جلسه و عملتها وكانوا صادقين وعملوا لصدقتي 😍😍😍 جد مرتبين  بنصح بشدة فيهم\n\n(Translated by Google)\nFriendly, helpful employees. I won a session prize and they were honest and helpful to my charity. 😍😍😍 They are very organized. I highly recommend them.",
    createTime: '2025-11-03T13:37:24.969327Z',
    updateTime: '2025-11-03T13:37:24.969327Z',
  },
  {
    reviewId: 'AbFvOql6ZS-fMFa6nFmiB-h9ixkIuf_PAosj-OrVFg20tvTj4wdAG0L7M5JmOzuUhtkpb76OMOKi2g',
    reviewer: { displayName: 'Reham Hamdan', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKNJNc16v7cnBjaonaN13cspgP3t-Z_CDvsuzB6OebH-NRxJw=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "العيادة من افضل وارقى العيادات مصداقية وتعامل ونظافة ونتائج جد نتائج ، الفينوس خرافي ،،، طبعاً وجيهان بجنن\n\n(Translated by Google)\nThis clinic is one of the best and most prestigious in terms of credibility, service, cleanliness, and truly remarkable results. Venus is phenomenal, and of course, Jihan is amazing.",
    createTime: '2025-11-03T13:35:11.500744Z',
    updateTime: '2025-11-03T13:35:11.500744Z',
  },
  {
    reviewId: 'AbFvOql44064XSKjc3TBDjIW7TWZgyy9JHFpKWRcw06KmhVJwB08L-JYdAh-QtRZhPLjCFD8OdB8mA',
    reviewer: { displayName: 'Meme Malak', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIIos-cwRB7QWrARAelGbZmRPg1B6LA-o8rcHx0if7ZdnY_XA=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "I recently had a double chin treatment at Artizone, and I couldn't be happier with my experience! From the moment I walked in, the staff made me feel comfortable and well cared for. The clinic was clean, modern, and welcoming.\nMy practitioner was incredibly knowledgeable and explained every step of the procedure, which really helped ease my nerves. The treatment itself was quick, virtually painless, and I'm already seeing amazing results — my jawline looks more defined, and my confidence has definitely improved!\nI would highly recommend Artizone clinic to anyone considering cosmetic treatments. Thank you to the entire team especially Jehan and Aseel for such a wonderful experience!",
    createTime: '2025-10-30T14:16:49.686749Z',
    updateTime: '2025-10-30T14:16:49.686749Z',
  },
  {
    reviewId: 'AbFvOqkCFYtz1mO_TV_zX1rzqWl0QZaj1WmIEtQ42scVxHzdTR0W-_yoHMI1g-czyVy6Pb6nwh000g',
    reviewer: { displayName: 'Aseel Shehadeh', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIPaX1PoKFSVqU7weuwWYe8vY9-jxuNe7AoW0SACshPf2CXYA=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: "تعامل سيء\nاخدت موعد مع فيكتوريا الساعة ٣:٣٠ ووصلت عالموعد\nبعدها حكت انها دخلت تعمل جلسة لشخص تاني وانه لازم استنى ١٠ دقايق\nمر اكتر من نص ساعة وهي رفضت تطلع من الجلسة عشان تركبلي الجهاز\nفاستهتار بوقت ومصاري الناس\nوتعامل سيء\n\n(Translated by Google)\nTerrible service.\nI made an appointment with Victoria at 3:30 and arrived on time.\nThen she said she went in to do a session for someone else and that I had to wait 10 minutes.\nMore than half an hour passed and she refused to leave her session to install the device for me.\nThis is disrespectful of people's time and money.\nTerrific service.",
    createTime: '2025-10-26T13:29:59.803525Z',
    updateTime: '2025-10-26T13:29:59.803525Z',
  },
  {
    reviewId: 'AbFvOqkMFH3QwIZY_VOg1r9u2ovOC_4yMlqST_Kc3rdEdpFFGn6V6ofKCzAn0yzoMZ6l3kCSVy1aQw',
    reviewer: { displayName: 'Muna', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocItjnHtEvS04vWwR3_6ZYKEi54oLJnFCNPPTFR1qG0boWtoJg=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: 'Everything is a lie. They made my body worse than before I wish I never went',
    createTime: '2025-10-15T15:20:38.977693Z',
    updateTime: '2025-10-15T15:20:38.977693Z',
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const } }),
};

function StarRow({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={18} fill={i < n ? GOLD : 'none'} stroke={i < n ? GOLD : '#ccc'} />
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  /* Refresh from live API on mount */
  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.reviews?.length) setReviews(data.reviews);
      })
      .catch(() => { /* keep seed data */ });
  }, []);

  const fiveStars = reviews.filter(r => r.starRating === 'FIVE');
  const totalCount = reviews.length;
  const avgRating  = (reviews.reduce((s, r) => {
    const map: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
    return s + (map[r.starRating] ?? 5);
  }, 0) / Math.max(totalCount, 1)).toFixed(1);

  const title       = 'Customer Reviews — ArtiZone Beauty & Aesthetic Clinic Amman';
  const description = "Read what our clients say about ArtiZone — Amman's premier beauty and aesthetic clinic. Laser, facials, nails, body slimming and more.";
  const canonical   = `${SITE_URL}/reviews`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        {/* Open Graph — rich preview when shared on Facebook / WhatsApp / iMessage */}
        <meta property="og:title"       content="⭐⭐⭐⭐⭐ ArtiZone — See What Clients Are Saying" />
        <meta property="og:description" content="Real reviews from real clients at Amman's premier beauty & aesthetic clinic. Laser, facials, nails, body slimming and more." />
        <meta property="og:url"         content={canonical} />
        <meta property="og:type"        content="website" />
        <meta property="og:image"       content={`${SITE_URL}/assets/loogoooo.png`} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name"   content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale"      content="en_US" />
        {/* Twitter card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="⭐⭐⭐⭐⭐ ArtiZone Client Reviews — Amman" />
        <meta name="twitter:description" content="Real experiences from real clients. See why ArtiZone is Amman's most-loved beauty clinic." />
        <meta name="twitter:image"       content={`${SITE_URL}/assets/loogoooo.png`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BeautySalon',
          name: GBP_NAME,
          url: SITE_URL,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: String(totalCount),
            bestRating: '5',
          },
        })}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #1a3a50 60%, #0e2a3a 100%)` }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-8 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />

        <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase mb-4 px-3 py-1 rounded-full"
              style={{ color: GOLD, background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.25)' }}>
              Client Reviews
            </span>
            <h1 className="font-medium leading-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
              What Our Clients{' '}
              <em style={{ color: GOLD, fontStyle: 'italic' }}>Are Saying</em>
            </h1>
            <p className="max-w-xl mx-auto text-base" style={{ color: 'rgba(253,250,246,0.65)' }}>
              Real experiences from real clients at ArtiZone — Amman's trusted beauty and aesthetic clinic.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="flex flex-wrap justify-center gap-10 mt-10">
            {[
              { value: avgRating, label: 'Average Rating', sub: <StarRow n={5} /> },
              { value: `${fiveStars.length}`, label: '5-Star Reviews', sub: null },
              { value: totalCount.toString(), label: 'Total Reviews', sub: null },
            ].map(({ value, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold" style={{ color: IVORY, fontFamily: 'var(--font-heading)' }}>{value}</span>
                {sub && <div className="my-0.5">{sub}</div>}
                <span className="text-xs tracking-wide" style={{ color: 'rgba(253,250,246,0.50)' }}>{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-10 flex justify-center">
            <ChevronDown size={20} style={{ color: 'rgba(196,168,130,0.45)' }} className="animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ── LEAVE A REVIEW — QR CODE SECTION ─────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ background: PARCH }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a50 100%)`, boxShadow: '0 12px 48px rgba(14,42,58,0.22)' }}>

            <div className="flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12 lg:p-16">

              {/* Left — copy */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: GOLD, background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.25)' }}>
                  <MessageSquarePlus size={12} /> Share Your Experience
                </div>
                <h2 className="font-medium leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-heading)', color: IVORY, fontSize: 'clamp(1.6rem,3.5vw,2.6rem)' }}>
                  Loved Your Visit?{' '}
                  <em style={{ color: GOLD, fontStyle: 'italic' }}>Tell Google.</em>
                </h2>
                <p className="text-sm mb-8 max-w-md mx-auto lg:mx-0" style={{ color: 'rgba(253,250,246,0.65)', lineHeight: 1.7 }}>
                  Your review helps other clients in Amman discover ArtiZone and supports our team.
                  It takes less than a minute — scan the QR code or tap the button below.
                </p>

                <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
                  <StarRow n={5} />
                  <span className="text-sm font-medium" style={{ color: 'rgba(253,250,246,0.55)' }}>Rate us 5 stars</span>
                </div>

                <a href={REVIEW_WRITE_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{ background: GOLD, color: NAVY }}>
                  <ExternalLink size={15} />
                  Write a Google Review
                </a>
              </div>

              {/* Right — QR code */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="rounded-2xl p-5 flex flex-col items-center gap-3"
                  style={{ background: IVORY, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode size={16} style={{ color: NAVY }} />
                    <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: NAVY }}>Scan to Review</span>
                  </div>
                  <img
                    src="/assets/qr-codes/qr-leave-a-review-ycW1tF.png"
                    alt="QR code — scan to leave a Google review for ArtiZone beauty clinic Amman"
                    className="rounded-xl"
                    width={200} height={200}
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <p className="text-[11px] text-center max-w-[180px]" style={{ color: SAGE }}>
                    Point your phone camera at this code
                  </p>
                </div>
                <a href="/qr-codes/leave-a-review.png" download="artizone-review-qr.png"
                  className="text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(196,168,130,0.70)' }}>
                  Download QR for printing
                </a>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-14" style={{ background: IVORY }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="font-medium"
              style={{ fontFamily: 'var(--font-heading)', color: NAVY, fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
              How to Leave a Review
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Scan or Tap', body: 'Use your phone camera to scan the QR code, or tap the button above.' },
              { step: '02', title: 'Sign In to Google', body: "You'll be taken to our Google Business Profile. Sign in with any Google account." },
              { step: '03', title: 'Share Your Stars', body: 'Rate us and write a few words about your experience. It means the world to us.' },
            ].map(({ step, title, body }, i) => (
              <motion.div key={step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-2xl"
                style={{ background: PARCH, border: '1px solid rgba(196,168,130,0.18)' }}>
                <span className="text-3xl font-black mb-3"
                  style={{ color: 'rgba(196,168,130,0.25)', fontFamily: 'var(--font-heading)' }}>{step}</span>
                <h3 className="font-semibold mb-2 text-base"
                  style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="text-sm" style={{ color: SAGE, lineHeight: 1.65 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE GOOGLE REVIEWS ───────────────────────────────────────────── */}
      <GoogleReviews
        reviews={reviews}
        title="Recent 5-Star Reviews"
        maxVisible={6}
      />

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-14 text-center" style={{ background: IVORY }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-xl mx-auto px-5">

          {/* Share prompt */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Share2 size={15} style={{ color: GOLD }} />
            <p className="text-sm font-semibold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>
              Know someone who'd love ArtiZone?
            </p>
          </div>
          <p className="text-xs mb-1" style={{ color: SAGE }}>
            Share this page and help them discover Amman's favourite beauty clinic.
          </p>

          <ShareBar />

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(196,168,130,0.15)' }}>
            <p className="text-xs mb-3" style={{ color: SAGE }}>
              Already left a review? Thank you — it genuinely helps our team and our clinic grow.
            </p>
            <a href={REVIEW_WRITE_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:opacity-70"
              style={{ color: GOLD }}>
              View us on Google <ExternalLink size={12} />
            </a>
          </div>

        </motion.div>
      </section>
    </>
  );
}
