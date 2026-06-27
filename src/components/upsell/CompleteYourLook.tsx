/**
 * CompleteYourLook — shown on the booking page after a service is selected.
 * Suggests 2 complementary add-ons based on the chosen service category.
 * Animates in when a service is selected, swaps smoothly when service changes.
 */
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, MessageCircle } from 'lucide-react';

const GOLD   = '#C4A882';
const OLIVE  = '#706d49';
const YELLOW = '#b4af53';
const TAUPE  = '#0E2A3A';
const CREAM  = '#FDFAF6';

// Map service keywords → add-on suggestions
const ADDONS: Record<string, { name: string; desc: string; link: string; discount?: string }[]> = {
  facial: [
    { name: 'LED Light Therapy', desc: 'Boosts collagen, reduces redness. Perfect post-facial.', link: '/services/face-skin-care', discount: '20% off when combined' },
    { name: 'Eyebrow Shaping', desc: 'Frame your fresh glow with perfectly shaped brows.', link: '/services/hair-removal', discount: '15% off when combined' },
  ],
  laser: [
    { name: 'Skin Tightening RF', desc: 'Tighten and smooth skin in the same session.', link: '/skin-tightening-amman', discount: '20% off when combined' },
    { name: 'Brightening Facial', desc: 'Soothe and brighten post-laser skin instantly.', link: '/services/face-skin-care', discount: '15% off when combined' },
  ],
  nail: [
    { name: 'Foot Scrub & Mask', desc: 'Complete the look — soft feet to match perfect nails.', link: '/services/nails-foot-care', discount: '10% off when combined' },
    { name: 'Gel Pedicure', desc: 'Add a pedicure to your manicure and save.', link: '/services/nails-foot-care', discount: '10% off when combined' },
  ],
  body: [
    { name: 'Lymphatic Drainage', desc: 'Maximise slimming results with a drainage massage.', link: '/body-slimming-amman', discount: '20% off when combined' },
    { name: 'RF Skin Tightening', desc: 'Tighten skin while contouring for best results.', link: '/skin-tightening-amman', discount: '15% off when combined' },
  ],
  men: [
    { name: 'Beard Grooming', desc: 'Add a beard treatment to your facial booking.', link: '/mens-grooming-amman', discount: '15% off when combined' },
    { name: "Men's Manicure", desc: 'Clean, groomed hands to complete the look.', link: '/services/nails-foot-care', discount: '10% off when combined' },
  ],
  default: [
    { name: 'Brightening Facial', desc: 'A radiance boost that pairs with almost any treatment.', link: '/services/face-skin-care', discount: '15% off when combined' },
    { name: 'Eyebrow Shaping', desc: 'Quick, precise brow shaping to frame your results.', link: '/services/hair-removal', discount: '10% off when combined' },
  ],
};

function getAddons(service: string) {
  const s = service.toLowerCase();
  if (s.includes('facial') || s.includes('skin') || s.includes('peel') || s.includes('hydra') || s.includes('brightening') || s.includes('oxygen')) return ADDONS.facial;
  if (s.includes('laser') || s.includes('wax') || s.includes('thread') || s.includes('sugar') || s.includes('hair removal')) return ADDONS.laser;
  if (s.includes('nail') || s.includes('manicure') || s.includes('pedicure')) return ADDONS.nail;
  if (s.includes('slim') || s.includes('body') || s.includes('cavit') || s.includes('cryo') || s.includes('ems') || s.includes('contour')) return ADDONS.body;
  if (s.includes('men') || s.includes('beard') || s.includes('grooming')) return ADDONS.men;
  return ADDONS.default;
}

interface Props {
  selectedService: string;
}

export default function CompleteYourLook({ selectedService }: Props) {
  if (!selectedService) return null;

  const addons = getAddons(selectedService);
  const waLink = `https://wa.me/962790412758?text=${encodeURIComponent(`Hi! I'd like to book ${selectedService} and add an extra treatment. Can you help?`)}`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedService}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' as const }}
        className="rounded-2xl p-5"
        style={{
          background: `linear-gradient(135deg, ${CREAM} 0%, #f0ede6 100%)`,
          border: `1.5px solid ${YELLOW}55`,
          boxShadow: '0 4px 20px rgba(112,109,73,0.10)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${YELLOW}25` }}
          >
            <Sparkles size={14} style={{ color: OLIVE }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: OLIVE }}>
              Complete Your Look
            </p>
            <p className="text-xs" style={{ color: 'hsl(20 15% 48%)' }}>
              Clients who book{' '}
              <strong style={{ color: TAUPE }}>{selectedService}</strong>{' '}
              also add:
            </p>
          </div>
        </div>

        {/* Add-on cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {addons.map((addon, i) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: 'easeOut' as const }}
            >
              <Link
                to={addon.link}
                className="group flex items-start gap-3 rounded-xl p-3.5 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: '#fff',
                  border: `1.5px solid rgba(180,175,83,0.2)`,
                  display: 'flex',
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${GOLD}20` }}
                >
                  <Plus size={13} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight" style={{ color: TAUPE }}>
                    {addon.name}
                  </p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: 'hsl(20 15% 50%)' }}>
                    {addon.desc}
                  </p>
                  {addon.discount && (
                    <span
                      className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${YELLOW}22`, color: OLIVE }}
                    >
                      {addon.discount}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            background: `${OLIVE}15`,
            color: OLIVE,
            border: `1px solid ${OLIVE}30`,
          }}
        >
          <MessageCircle size={13} />
          Ask us about combining treatments on WhatsApp
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
