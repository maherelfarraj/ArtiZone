/**
 * ClientsAlsoBook — shown at the bottom of each ServiceDetailPage.
 * Shows 3 complementary services to drive cross-sells.
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const GOLD  = '#C4A882';
const OLIVE = '#706d49';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

export interface RelatedService {
  name: string;
  tagline: string;
  href: string;
  emoji: string;
}

interface Props {
  services: RelatedService[];
  currentServiceName?: string;
}

export default function ClientsAlsoBook({ services, currentServiceName }: Props) {
  if (!services.length) return null;

  return (
    <section className="py-14 px-4" style={{ background: CREAM }}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: OLIVE }}>
            Clients Also Book
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}
          >
            {currentServiceName
              ? `Pairs perfectly with ${currentServiceName}`
              : 'Popular combinations'}
          </h2>
          <p className="text-sm mt-2" style={{ color: 'hsl(20 15% 50%)' }}>
            Book together in one visit and get the most out of your time with us.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' as const }}
            >
              <Link
                to={svc.href}
                className="group flex flex-col h-full rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#fff',
                  border: `1.5px solid rgba(201,169,110,0.18)`,
                  boxShadow: '0 2px 12px rgba(61,46,38,0.06)',
                }}
              >
                <span className="text-3xl mb-3">{svc.emoji}</span>
                <h3
                  className="text-base font-bold mb-1 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}
                >
                  {svc.name}
                </h3>
                <p className="text-xs leading-relaxed flex-1" style={{ color: 'hsl(20 15% 50%)' }}>
                  {svc.tagline}
                </p>
                <div
                  className="flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wider transition-opacity group-hover:opacity-70"
                  style={{ color: GOLD }}
                >
                  Learn more <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: OLIVE, color: '#f5f3ee' }}
          >
            Book a Combined Session <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
