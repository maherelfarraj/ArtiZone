/**
 * UpsellBanner — sticky top strip shown on homepage.
 * Dismissible per session. Links to /special-offers.
 * Stays pinned to top of viewport as user scrolls.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OLIVE  = '#0E2A3A'; /* Ink Navy          */
const YELLOW = '#C4A882'; /* Warm Sand         */

export default function UpsellBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('upsell_banner_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('upsell_banner_dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
          className="fixed top-0 left-0 right-0 z-[100] w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium"
          style={{ background: OLIVE, color: '#f5f3ee' }}
          role="banner"
        >
          <Sparkles size={14} style={{ color: YELLOW, flexShrink: 0 }} />
          <span className="text-center leading-snug text-xs sm:text-sm">
            <span className="font-bold" style={{ color: YELLOW }}>Limited Time:</span>{' '}
            Book any 2 services together and save{' '}
            <span className="font-bold" style={{ color: YELLOW }}>15% off</span> your total.{' '}
            <Link
              to="/special-offers"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
              style={{ color: '#f5f3ee' }}
            >
              See all offers <ArrowRight size={11} />
            </Link>
          </span>
          <button
            onClick={dismiss}
            aria-label="Dismiss offer"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: '#f5f3ee' }}
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
