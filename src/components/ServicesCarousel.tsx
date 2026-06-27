import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const FOREST = '#C4A882';   /* Muted Teal — accent */
const MINT   = '#C4A882';   /* Muted Teal — accent */
const IVORY  = '#F7F3EE';   /* Warm Beige — card bg */
const BARK   = '#3A2520';   /* Dark text — card text */

const SERVICES = [
  { title: 'Face & Skin Care',           desc: 'Refresh your skin with professional facials and advanced skincare treatments designed for every skin type.',    img: '/airo-assets/images/services/face-skin-care',    num: '01', href: '/best-facial-amman' },
  { title: 'Laser Hair Removal',         desc: 'Enjoy long-lasting smoothness with precision laser treatments for all body areas, for women and men.',          img: '/airo-assets/images/services/laser-hair-removal', num: '02', href: '/laser-hair-removal-amman' },
  { title: 'Nails & Foot Care',          desc: 'From clean nails to luxury nail art — keeping your hands and feet elegant, healthy, and polished.',            img: '/airo-assets/images/services/nails-foot-care',    num: '03', href: '/services' },
  { title: 'Body Slimming & Contouring', desc: 'Non-surgical body shaping, skin tightening, and fat reduction customized to your goals.',                      img: '/airo-assets/images/services/body-slimming',      num: '04', href: '/body-slimming-amman' },
  { title: "Men's Grooming",             desc: 'Private, professional treatments for clean skin, sharp grooming, smooth laser results, and body confidence.',  img: '/airo-assets/images/services/mens-grooming',      num: '05', href: '/mens-grooming-amman' },
];

export default function ServicesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 1 },
    },
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4" style={{ touchAction: 'pan-y' }}>
          {SERVICES.map((svc) => (
            <div
              key={svc.title}
              className="flex-none w-[80vw] sm:w-[44vw] lg:w-[calc(25%-12px)] group relative overflow-hidden flex flex-col"
              style={{ background: IVORY, minWidth: 0 }}
            >
              {/* Number badge (no image) */}
              <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0e2a3a 0%, #1a2e20 100%)' }}>
                <span className="text-[56px] font-bold opacity-20 select-none"
                  style={{ fontFamily: 'var(--font-heading)', color: MINT }}>
                  {svc.num}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <div className="w-6 h-px mb-4" style={{ background: FOREST }} />
                <h3 className="font-medium leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: BARK, fontSize: 'clamp(1.05rem,1.6vw,1.25rem)' }}>
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1 mb-5"
                  style={{ color: 'rgba(44,26,14,0.72)', fontFamily: 'var(--font-sans)' }}>
                  {svc.desc}
                </p>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(196,168,130,0.20)' }}>
                  <Link to={svc.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:gap-2.5"
                    style={{ color: FOREST, fontFamily: 'var(--font-sans)' }}>
                    Explore <ArrowRight size={11} />
                  </Link>
                  <Link to="/booking"
                    className="inline-flex items-center px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-80"
                    style={{ background: FOREST, color: IVORY, border: '1px solid rgba(196,168,130,0.30)', fontFamily: 'var(--font-sans)' }}>
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between mt-6">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === selectedIndex ? 20 : 6,
                height: 6,
                background: i === selectedIndex ? FOREST : 'rgba(196,168,130,0.30)',
              }}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-30"
            style={{ border: '1px solid rgba(196,168,130,0.28)', color: FOREST, background: 'rgba(196,168,130,0.10)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canNext}
            aria-label="Next"
            className="w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-30"
            style={{ border: '1px solid rgba(196,168,130,0.28)', color: FOREST, background: 'rgba(196,168,130,0.10)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
