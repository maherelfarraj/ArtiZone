import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, CheckCircle, ArrowRight,
  MessageCircle, Sparkles, Star, Loader2, Instagram, Bell, Mail,
  ChevronLeft, ChevronRight, Gift, Zap, Plus, Minus,
} from 'lucide-react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { buildBeautySalonSchema, SITE_URL } from '@/lib/gbp-schema';
import CompleteYourLook from '@/components/upsell/CompleteYourLook';
import { useClientAuth } from '@/hooks/useClientAuth';
import { supabase } from '@/lib/supabase';

// ─── Palette ─────────────────────────────────────────────────────────────────
const GOLD       = '#C4A882';
const NAVY       = '#0E2A3A';
const CREAM      = '#FDFAF6';
const CREAM_DARK = '#F7F3EE';
const SAGE       = '#6B7260';

const BOOKING_TITLE = 'Book a Beauty Appointment in Amman — ArtiZone Clinic';
const BOOKING_DESC  = 'Book your beauty or aesthetic treatment at ArtiZone Amman. Choose from 50+ services — facials, laser, nails, body slimming, and more. We\'ll confirm your appointment promptly.';
const BOOKING_IMG   = `${SITE_URL}/airo-assets/images/pages/home/hero`;

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const } }),
};

const slideIn = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48, transition: { duration: 0.25, ease: 'easeIn' as const } }),
};

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICE_GROUPS = [
  {
    group: 'Face & Skin Care', emoji: '✨',
    items: [
      'Signature ArtiZone Facial', 'HydraFacial', '24K Gold Facial', 'Carbon Laser Facial',
      'Chemical Peels', 'RF Microneedling', 'LED Light Therapy', 'Acne & Scar Care',
      'Skin Boosters', 'Anti-Aging Collagen Lift',
      'Eyebrow Threading & Shaping', 'Full Face Threading',
      'Full Body Wax', 'Bikini & Brazilian Wax', 'Underarm & Leg Wax', 'Natural Sugaring', 'Brow Tinting',
    ],
  },
  {
    group: 'Body Treatments', emoji: '💆',
    items: [
      'Cryolipolysis (Fat Freezing)', 'Ultrasound Cavitation', 'RF Skin Tightening',
      'EMS Body Sculpting', 'Lymphatic Drainage Massage', 'Cellulite Therapy',
      'Detox Body Wraps', 'Custom Slimming Programs',
    ],
  },
  {
    group: 'Laser & Advanced', emoji: '⚡',
    items: [
      'Full Body Laser', 'Face & Neck Laser', 'Underarms & Bikini Laser',
      'Full Legs & Arms Laser', 'Back & Shoulders Laser', 'Beard Line Laser Shaping',
      'Small Zone Laser Session', 'Laser Touch-Up Plan',
    ],
  },
  {
    group: 'Nails & Extensions', emoji: '💅',
    items: [
      'Classic Mani & Pedi', 'Gel Polish', 'Acrylic & Gel Extensions',
      'Custom Nail Art', 'Luxury Spa Pedicure', 'Paraffin Hand Treatment',
      'Medical Pedicure', 'French Forever',
    ],
  },
  {
    group: "Men's Treatments", emoji: '🧔',
    items: [
      "Gentleman's Deep-Clean Facial", 'Beard Trim & Design', 'Hot Towel Ritual',
      "Men's Laser (Beard Line, Back, Chest)", "Men's Mani & Pedi",
      'Scalp & Hair Therapy', "Men's Body Contouring",
    ],
  },
  {
    group: 'Packages', emoji: '🎁',
    items: [
      'Glow Starter Package', 'Laser Essentials Bundle', 'Full Body Slimming Plan',
      "Men's Grooming Package", 'Bridal Beauty Package',
    ],
  },
];

// ─── Points preview ───────────────────────────────────────────────────────────
const SERVICE_PRICES: Record<string, number> = {
  // Face & Skin Care
  'Signature ArtiZone Facial': 45, 'HydraFacial': 65, '24K Gold Facial': 75,
  'Carbon Laser Facial': 70, 'Chemical Peels': 50, 'RF Microneedling': 90,
  'LED Light Therapy': 35, 'Acne & Scar Care': 55, 'Skin Boosters': 80,
  'Anti-Aging Collagen Lift': 95,
  'Eyebrow Threading & Shaping': 12, 'Full Face Threading': 18,
  'Full Body Wax': 55, 'Bikini & Brazilian Wax': 35, 'Underarm & Leg Wax': 25,
  'Natural Sugaring': 40, 'Brow Tinting': 15,
  // Body Treatments
  'Cryolipolysis (Fat Freezing)': 120, 'Ultrasound Cavitation': 75,
  'RF Skin Tightening': 70, 'EMS Body Sculpting': 65,
  'Lymphatic Drainage Massage': 55, 'Cellulite Therapy': 60,
  'Detox Body Wraps': 50, 'Custom Slimming Programs': 90,
  // Laser & Advanced
  'Full Body Laser': 180, 'Face & Neck Laser': 45, 'Underarms & Bikini Laser': 40,
  'Full Legs & Arms Laser': 80, 'Back & Shoulders Laser': 70,
  'Beard Line Laser Shaping': 35, 'Small Zone Laser Session': 25, 'Laser Touch-Up Plan': 30,
  // Nails & Extensions
  'Classic Mani & Pedi': 22, 'Gel Polish': 28, 'Acrylic & Gel Extensions': 45,
  'Custom Nail Art': 35, 'Luxury Spa Pedicure': 38, 'Paraffin Hand Treatment': 20,
  'Medical Pedicure': 30, 'French Forever': 32,
  // Men's Treatments
  "Gentleman's Deep-Clean Facial": 45, 'Beard Trim & Design': 18, 'Hot Towel Ritual': 15,
  "Men's Laser (Beard Line, Back, Chest)": 60, "Men's Mani & Pedi": 25,
  'Scalp & Hair Therapy': 35, "Men's Body Contouring": 75,
  // Packages
  'Glow Starter Package': 99, 'Laser Essentials Bundle': 120,
  'Full Body Slimming Plan': 180, "Men's Grooming Package": 129, 'Bridal Beauty Package': 299,
};

const TIER_MULT: Record<string, number> = { glow: 1, silver: 1.25, gold: 1.5, platinum: 2 };

// ─── Service metadata (preview + add-ons) ─────────────────────────────────────
interface ServiceAddon { name: string; desc: string; price: number; }
interface ServiceMeta {
  duration: string; rating: string; bestFor: string; desc: string;
  addons: ServiceAddon[];
}
const SERVICE_META: Record<string, ServiceMeta> = {
  'Signature ArtiZone Facial': {
    duration: '60 min', rating: '4.9 (218 reviews)', bestFor: 'Deep cleansing & hydration',
    desc: 'Our signature facial — a thorough deep-cleansing treatment including exfoliation, steam, extraction, mask, and moisturizing. Tailored to your skin type.',
    addons: [{ name: 'LED Light Therapy', desc: 'Boost collagen & reduce inflammation', price: 15 }, { name: 'Eye Treatment', desc: 'Targeted eye contour care', price: 12 }, { name: 'Neck & Décolleté', desc: 'Extend treatment to neck area', price: 18 }],
  },
  'HydraFacial': {
    duration: '75 min', rating: '4.9 (178 reviews)', bestFor: 'Hydration & glow',
    desc: 'Multi-step treatment that cleanses, exfoliates, and infuses skin with intensive serums. Instantly visible results with no downtime.',
    addons: [{ name: 'Booster Serum', desc: 'Targeted vitamin C or peptide boost', price: 20 }, { name: 'LED Therapy', desc: 'Post-treatment light therapy', price: 15 }, { name: 'Lymphatic Drainage', desc: 'Reduce puffiness add-on', price: 18 }],
  },
  'Chemical Peels': {
    duration: '45 min', rating: '4.7 (134 reviews)', bestFor: 'Skin renewal & texture',
    desc: 'Professional-grade chemical exfoliation to resurface skin, reduce pigmentation, and improve overall texture and tone.',
    addons: [{ name: 'Calming Mask', desc: 'Post-peel soothing treatment', price: 12 }, { name: 'SPF Treatment', desc: 'Medical-grade sun protection', price: 10 }],
  },
  'RF Microneedling': {
    duration: '60 min', rating: '4.9 (89 reviews)', bestFor: 'Collagen induction & scars',
    desc: 'Radiofrequency energy combined with microneedling stimulates deep collagen production — improving scars, fine lines, and skin texture.',
    addons: [{ name: 'PRP Add-on', desc: 'Platelet-rich plasma boost', price: 40 }, { name: 'Vitamin C Serum', desc: 'Brightening serum infusion', price: 20 }],
  },
  'Anti-Aging Collagen Lift': {
    duration: '90 min', rating: '4.9 (112 reviews)', bestFor: 'Fine lines & rejuvenation',
    desc: 'Premium anti-aging treatment using peptide serums, microcurrent technology, and collagen-boosting masks for visible rejuvenation.',
    addons: [{ name: 'Microcurrent Lift', desc: 'Non-surgical face lift enhancement', price: 30 }, { name: 'Gold Mask', desc: '24K gold collagen mask', price: 25 }, { name: 'Neck Treatment', desc: 'Anti-aging for neck area', price: 20 }],
  },
  'Full Body Laser': {
    duration: '120 min', rating: '4.9 (98 reviews)', bestFor: 'Complete hair-free body',
    desc: 'Comprehensive full-body laser hair removal session covering all major areas for smooth, hair-free skin.',
    addons: [{ name: 'Numbing Cream', desc: 'Topical anesthetic for comfort', price: 15 }, { name: 'Soothing Gel', desc: 'Post-treatment aloe cooling gel', price: 8 }],
  },
  'Full Legs & Arms Laser': {
    duration: '60 min', rating: '4.8 (245 reviews)', bestFor: 'Permanent hair reduction',
    desc: 'Safe and effective laser hair removal for full legs and arms. Suitable for all skin types with cooling technology for comfort.',
    addons: [{ name: 'Bikini Line', desc: 'Add bikini line to session', price: 25 }, { name: 'Soothing Gel', desc: 'Post-treatment aloe cooling gel', price: 8 }],
  },
  'Cryolipolysis (Fat Freezing)': {
    duration: '60 min', rating: '4.8 (156 reviews)', bestFor: 'Fat reduction & contouring',
    desc: 'Cryolipolysis freezes and destroys stubborn fat cells non-invasively. Visible inch loss with progressive results over 4–8 weeks.',
    addons: [{ name: 'RF Tightening', desc: 'Skin tightening after cryo', price: 30 }, { name: 'Lymphatic Drainage', desc: 'Enhance fat elimination', price: 25 }],
  },
  'RF Skin Tightening': {
    duration: '60 min', rating: '4.9 (134 reviews)', bestFor: 'Skin tightening & lifting',
    desc: 'Advanced radio frequency energy heats deep skin layers to stimulate collagen and elastin production for firmer, tighter skin.',
    addons: [{ name: 'Extra Focus Area', desc: 'Add one additional body zone', price: 25 }, { name: 'Post-Treatment Wrap', desc: 'Detoxifying body wrap after session', price: 20 }],
  },
  'Gel Polish': {
    duration: '45 min', rating: '4.9 (312 reviews)', bestFor: 'Long-lasting nail care',
    desc: 'Professional gel polish application for hands. Chip-resistant, glossy finish that lasts up to 3 weeks.',
    addons: [{ name: 'Nail Art', desc: 'Design on 2 accent nails', price: 10 }, { name: 'Paraffin Wax', desc: 'Hydrating paraffin treatment', price: 12 }],
  },
  'Luxury Spa Pedicure': {
    duration: '60 min', rating: '4.9 (287 reviews)', bestFor: 'Foot care & polish',
    desc: 'Indulgent spa pedicure with full foot care, exfoliation, massage, mask, and long-lasting gel polish.',
    addons: [{ name: 'Callus Removal', desc: 'Intensive foot callus care', price: 8 }, { name: 'Paraffin Wax', desc: 'Hydrating paraffin treatment', price: 12 }],
  },
  "Gentleman's Deep-Clean Facial": {
    duration: '60 min', rating: '4.8 (87 reviews)', bestFor: "Men's skin care",
    desc: "Deep cleansing facial designed specifically for men's skin — tackles enlarged pores, oiliness, and ingrown hairs.",
    addons: [{ name: 'Beard Treatment', desc: 'Conditioning beard care add-on', price: 12 }, { name: 'LED Therapy', desc: 'Anti-bacterial light treatment', price: 15 }],
  },
};

// ─── Staff / therapists ───────────────────────────────────────────────────────
const THERAPISTS = [
  { id: 'any', name: 'No Preference', role: 'Best Available', initial: '?' },
  { id: 'maya', name: 'Maya', role: 'Senior Therapist', initial: 'M' },
  { id: 'lara', name: 'Lara', role: 'Skin Specialist', initial: 'L' },
  { id: 'dr-nour', name: 'Dr. Nour', role: 'Aesthetic Doctor', initial: 'N' },
  { id: 'sara', name: 'Sara', role: 'Laser Specialist', initial: 'S' },
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Mini calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayStr = today.toISOString().split('T')[0];

  function pad(n: number) { return String(n).padStart(2, '0'); }
  function toDateStr(d: number) { return `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`; }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.2)` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: NAVY }}>
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-full transition-all hover:opacity-70" style={{ color: GOLD }}>
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-bold" style={{ color: CREAM, fontFamily: 'var(--font-heading)' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-full transition-all hover:opacity-70" style={{ color: GOLD }}>
          <ChevronRight size={15} />
        </button>
      </div>
      {/* Day names */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider pb-2" style={{ color: SAGE }}>{d}</div>
        ))}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toDateStr(day);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === value;
          const isToday = dateStr === todayStr;
          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onChange(dateStr)}
              className="w-full aspect-square flex items-center justify-center rounded-full text-xs font-semibold transition-all"
              style={{
                background: isSelected ? GOLD : isToday ? `${GOLD}22` : 'transparent',
                color: isSelected ? NAVY : isPast ? 'rgba(14,42,58,0.2)' : isToday ? GOLD : NAVY,
                fontWeight: isSelected || isToday ? 700 : 500,
                cursor: isPast ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function WaitlistOptIn() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', serviceName: '', preferredDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!form.customerName || !form.customerPhone) return;
    setSubmitting(true); setErr('');
    try {
      const res = await fetch('/api/scheduling/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'web_form' }),
      });
      const data = await res.json();
      if (data.ok) setDone(true); else setErr(data.error ?? 'Something went wrong.');
    } catch { setErr('Could not submit. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(196,168,130,0.25)', background: '#fff' }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all hover:opacity-80"
        style={{ background: 'rgba(196,168,130,0.08)' }}>
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: GOLD }} />
          <span className="text-sm font-semibold" style={{ color: NAVY }}>Can't find a suitable slot?</span>
        </div>
        <span className="text-xs font-semibold" style={{ color: GOLD }}>{open ? 'Close' : 'Join Waitlist'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 space-y-3">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={28} className="mx-auto mb-2" style={{ color: '#1a6e2e' }} />
              <p className="text-sm font-semibold" style={{ color: NAVY }}>You're on the waitlist!</p>
              <p className="text-xs mt-1" style={{ color: SAGE }}>We'll contact you as soon as a slot opens up.</p>
            </div>
          ) : (
            <>
              <p className="text-xs" style={{ color: SAGE }}>Leave your details and we'll reach out the moment a slot becomes available.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                  placeholder="Your name *" className="text-sm outline-none px-3 py-2.5 w-full rounded-lg"
                  style={{ border: '1.5px solid rgba(61,46,38,0.15)', color: NAVY, background: CREAM_DARK }} />
                <input value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                  placeholder="Phone number *" className="text-sm outline-none px-3 py-2.5 w-full rounded-lg"
                  style={{ border: '1.5px solid rgba(61,46,38,0.15)', color: NAVY, background: CREAM_DARK }} />
                <input value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))}
                  placeholder="Service you want" className="text-sm outline-none px-3 py-2.5 w-full rounded-lg"
                  style={{ border: '1.5px solid rgba(61,46,38,0.15)', color: NAVY, background: CREAM_DARK }} />
                <input type="date" value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                  className="text-sm outline-none px-3 py-2.5 w-full rounded-lg"
                  style={{ border: '1.5px solid rgba(61,46,38,0.15)', color: NAVY, background: CREAM_DARK }} />
              </div>
              {err && <p className="text-xs" style={{ color: '#e05252' }}>{err}</p>}
              <button onClick={submit} disabled={submitting || !form.customerName || !form.customerPhone}
                className="w-full py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 rounded-xl"
                style={{ background: NAVY, color: '#fff' }}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
                Notify Me When Available
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['Service', 'Date & Time', 'Your Details'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? GOLD : active ? NAVY : 'rgba(14,42,58,0.08)',
                  color: done ? NAVY : active ? CREAM : 'rgba(14,42,58,0.35)',
                  border: active ? `2px solid ${GOLD}` : done ? 'none' : '2px solid rgba(14,42,58,0.12)',
                }}
              >
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block"
                style={{ color: active ? NAVY : done ? GOLD : 'rgba(14,42,58,0.35)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 sm:w-20 h-0.5 mx-1 mb-5 sm:mb-0 transition-all"
                style={{ background: i < current ? GOLD : 'rgba(14,42,58,0.10)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Points preview badge ─────────────────────────────────────────────────────
function PointsPreview({ service, tier }: { service: string; tier?: string }) {
  if (!service) return null;
  const price = SERVICE_PRICES[service];
  if (!price) return null;
  const mult = TIER_MULT[tier ?? 'glow'] ?? 1;
  const pts = Math.floor(price * mult);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl mt-3"
      style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}33` }}
    >
      <Zap size={13} style={{ color: GOLD }} />
      <span className="text-xs font-semibold" style={{ color: NAVY }}>
        You'll earn <strong style={{ color: GOLD }}>{pts.toLocaleString()} Glow Points</strong> on this booking
        {tier && tier !== 'glow' && <span style={{ color: SAGE }}> ({tier} {mult}× rate)</span>}
      </span>
      <Link to="/loyalty" className="ml-auto text-[10px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
        style={{ color: GOLD }}>
        Learn more
      </Link>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
interface FormState {
  name: string; phone: string; email: string;
  service: string; date: string; time: string; notes: string;
  therapist: string;
}

export default function BookingPage() {
  const { user } = useClientAuth();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '', therapist: 'any' });
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loyaltyTier, setLoyaltyTier] = useState<string | undefined>(undefined);

  // ── Live availability state ────────────────────────────────────────────────
  // liveSlots: the ordered slot list returned by the API (source of truth when loaded)
  // slotAvailability: map of time display → available boolean (for quick lookup)
  const [liveSlots, setLiveSlots] = useState<{ time: string; time24: string; available: boolean }[]>([]);
  const [_slotAvailability, setSlotAvailability] = useState<Record<string, boolean>>({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);

  // Pre-fill from session
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: f.name || user.fullName || '',
        phone: f.phone || user.phone || '',
        email: f.email || user.email || '',
      }));
    }
  }, [user]);

  // Fetch loyalty tier for points preview
  useEffect(() => {
    if (!user) return;
    fetch('/api/client/loyalty', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.enrolled) setLoyaltyTier(d.tier); })
      .catch(() => {});
  }, [user]);

  // ── Fetch live slot availability when service + date are both set ──────────
  useEffect(() => {
    if (!form.service || !form.date) {
      setLiveSlots([]);
      setSlotAvailability({});
      setSlotsError(false);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(false);
    fetch(`/api/scheduling/slots?service_name=${encodeURIComponent(form.service)}&date=${form.date}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (cancelled || !data?.slots) return;

        // Filter out past slots when the selected date is today (Amman UTC+3)
        const nowAmman = new Date(Date.now() + 3 * 60 * 60 * 1000);
        const todayAmman = nowAmman.toISOString().slice(0, 10);
        const nowH24 = nowAmman.toISOString().slice(11, 16); // "HH:MM"

        const filtered: typeof data.slots = form.date === todayAmman
          ? data.slots.filter((s: { time24: string }) => s.time24 > nowH24)
          : data.slots;

        setLiveSlots(filtered);
        const map: Record<string, boolean> = {};
        for (const s of filtered) map[s.time] = s.available;
        setSlotAvailability(map);

        // If previously selected time is now unavailable or filtered out, clear it
        if (form.time && map[form.time] === false) {
          setForm(f => ({ ...f, time: '' }));
        }
        if (form.time && !(form.time in map)) {
          setForm(f => ({ ...f, time: '' }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlotsError(true);
          setLiveSlots([]);
          setSlotAvailability({});
        }
      })
      .finally(() => { if (!cancelled) setSlotsLoading(false); });
    return () => { cancelled = true; };
  }, [form.service, form.date]);

  function go(nextStep: number) {
    setDir(nextStep > step ? 1 : -1);
    setStep(nextStep);
    setErrors({});
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validateStep(s: number): Partial<FormState> {
    const e: Partial<FormState> = {};
    if (s === 0 && !form.service) e.service = 'Please select a service.';
    if (s === 1) {
      if (!form.date) e.date = 'Please choose a date.';
      if (!form.time) e.time = 'Please choose a time.';
    }
    if (s === 2) {
      if (!form.name.trim()) e.name = 'Please enter your name.';
      if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    }
    return e;
  }

  function nextStep() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    go(step + 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep(2);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true); setSubmitError('');
    try {
      // Build enriched notes with add-ons and therapist preference
      const addonNote = selectedAddons.length > 0
        ? `Add-ons requested: ${selectedAddons.map(a => `${a.name} (+JOD ${a.price})`).join(', ')}. `
        : '';
      const therapistNote = form.therapist && form.therapist !== 'any'
        ? `Preferred therapist: ${THERAPISTS.find(t => t.id === form.therapist)?.name}. `
        : '';
      const enrichedNotes = `${therapistNote}${addonNote}${form.notes}`.trim();

      const { error } = await supabase.from('bookings').insert({
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || null,
        service_name: form.service,
        booking_date: form.date,
        booking_time: form.time,
        notes: enrichedNotes || null,
        status: 'pending',
      });

      if (error) {
        setSubmitError('We couldn\'t save your booking right now. Please try again or call us at 079 041 2758.');
        return;
      }

      const msg = encodeURIComponent(
        `📅 *New Booking Request*\n\n` +
        `👤 Name: ${form.name.trim()}\n` +
        `📞 Phone: ${form.phone.trim()}\n` +
        `💆 Service: ${form.service}\n` +
        `📆 Date: ${form.date}\n` +
        `🕐 Time: ${form.time}\n` +
        (enrichedNotes ? `📝 Notes: ${enrichedNotes}\n` : '') +
        `\nPlease confirm this appointment.`
      );
      setWhatsappUrl(`https://wa.me/962790412758?text=${msg}`);
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please call us directly at 079 041 2758.');
    } finally { setSubmitting(false); }
  };

  // ─── Success ────────────────────────────────────────────────────────────────
  if (submitted) {
    const price = SERVICE_PRICES[form.service];
    const mult = TIER_MULT[loyaltyTier ?? 'glow'] ?? 1;
    const earnedPts = price ? Math.floor(price * mult) : null;

    return (
      <>
        <Helmet><title>Booking Confirmed — ArtiZone</title></Helmet>
        <div className="flex items-center justify-center py-16 sm:py-24 px-4" style={{ minHeight: 'max(320px, 55svh)', background: CREAM_DARK }}>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center rounded-3xl p-10"
            style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.25)`, boxShadow: '0 12px 50px rgba(61,46,38,0.12)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${GOLD}22` }}>
              <CheckCircle size={32} style={{ color: GOLD }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>Request Received!</h2>
            <p className="text-sm leading-relaxed mb-1" style={{ color: SAGE }}>
              Thank you, <strong style={{ color: NAVY }}>{form.name}</strong>. Your appointment request has been saved.
            </p>
            <p className="text-xs mb-1" style={{ color: SAGE }}>
              <strong style={{ color: NAVY }}>{form.service}</strong> · {new Date(form.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })} · {form.time}
            </p>

            {earnedPts && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl my-4 mx-auto max-w-xs"
                style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}33` }}>
                <Zap size={13} style={{ color: GOLD }} />
                <span className="text-xs font-semibold" style={{ color: NAVY }}>
                  You'll earn <strong style={{ color: GOLD }}>{earnedPts.toLocaleString()} Glow Points</strong> on this visit
                </span>
              </div>
            )}

            <p className="text-sm leading-relaxed mb-7" style={{ color: SAGE }}>
              Tap below to send us a WhatsApp message and we'll confirm your booking right away.
            </p>
            <div className="flex flex-col gap-3">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: '#25D366', color: '#fff' }}>
                  <MessageCircle size={15} /> Confirm via WhatsApp
                </a>
              )}
              <a href="tel:+962790412758"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: GOLD, color: '#fff' }}>
                Or Call to Confirm
              </a>
              <Link to="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ border: `1.5px solid rgba(61,46,38,0.18)`, color: NAVY }}>
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // ─── Info sidebar cards ──────────────────────────────────────────────────────
  const infoCards = [
    { icon: <Clock size={18} style={{ color: GOLD }} />, title: 'Working Hours', lines: ['Sat – Thu: 10:00 AM – 9:00 PM', 'Friday: 2:00 PM – 9:00 PM'] },
    { icon: <Phone size={18} style={{ color: GOLD }} />, title: 'Call Us', lines: ['079 041 2758', 'Available during working hours'] },
    { icon: <Calendar size={18} style={{ color: GOLD }} />, title: 'Booking Policy', lines: ['Please arrive 5 min early', 'Cancel 24 hrs in advance'] },
  ];

  return (
    <>
      <Helmet>
        <title>{BOOKING_TITLE}</title>
        <meta name="description" content={BOOKING_DESC} />
        <link rel="canonical" href={`${SITE_URL}/booking`} />
        <meta property="og:title" content={BOOKING_TITLE} />
        <meta property="og:description" content="Book your beauty or aesthetic treatment at ArtiZone Amman. Choose from 50+ services — facials, laser, nails, body slimming, and more." />
        <meta property="og:image" content={BOOKING_IMG} />
        <meta property="og:url" content={`${SITE_URL}/booking`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={BOOKING_TITLE} />
        <meta name="twitter:image" content={BOOKING_IMG} />
        <meta name="twitter:site" content="@artizone_clinic" />
        <link rel="alternate" hrefLang="en" href="https://artizonespa.com/booking" />

        <link rel="alternate" hrefLang="x-default" href="https://artizonespa.com/booking" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Service',
          name: 'ArtiZone Appointment Booking', url: `${SITE_URL}/booking`,
          provider: (() => {
            const { '@context': _ctx, ...entity } = buildBeautySalonSchema({ description: 'Book beauty and aesthetic treatments at ArtiZone in Amman.' });
            return entity;
          })(),
        })}</script>
      </Helmet>

      <div style={{ background: CREAM, fontFamily: 'var(--font-sans)' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-20 overflow-hidden" style={{ background: NAVY }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a24 0%, #0e2a3a 60%, #1a2e20 100%)', opacity: 0.5 }} />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`, top: '-120px', right: '-80px' }}
            animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }} />

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
              Reserve Your Visit
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: CREAM, fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
              Book an Appointment
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6" style={{ color: 'rgba(249,245,240,0.65)' }}>
              Three quick steps — choose your service, pick a time, and we'll confirm.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="tel:+962790412758"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:opacity-90 w-full sm:w-auto justify-center rounded-full"
                style={{ background: GOLD, color: NAVY }}>
                <Phone size={13} /> Call to Book Instantly
              </a>
              <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:opacity-90 w-full sm:w-auto justify-center rounded-full"
                style={{ background: '#25D366', color: '#fff' }}>
                <MessageCircle size={13} /> WhatsApp Us
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.75 }}
              className="flex items-center justify-center gap-4 mt-5 flex-wrap">
              {['4.9★ Google Rating', 'Certified Equipment', 'Same-Day Confirmation'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(196,168,130,0.70)' }}>
                  <Star size={9} style={{ color: GOLD }} fill={GOLD} /> {badge}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill={CREAM} />
            </svg>
          </div>
        </section>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-16 pb-28 sm:pb-20" style={{ background: CREAM }}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Mobile quick-contact */}
            <div className="lg:hidden mb-6 grid grid-cols-2 gap-3">
              <a href="tel:+962790412758"
                className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.14em] transition-all active:opacity-80 rounded-xl"
                style={{ background: NAVY, color: CREAM }}>
                <Phone size={14} /> Call Now
              </a>
              <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.14em] transition-all active:opacity-80 rounded-xl"
                style={{ background: '#25D366', color: '#fff' }}>
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

              {/* ── WIZARD ───────────────────────────────────────────────── */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex-1 w-full">
                <div className="p-6 sm:p-8 md:p-10 rounded-3xl"
                  style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.22)`, boxShadow: '0 8px 40px rgba(61,46,38,0.08)' }}>

                  <StepIndicator current={step} />

                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <AnimatePresence mode="wait" custom={dir}>
                      {/* ── STEP 0: Service ── */}
                      {step === 0 && (
                        <motion.div key="step0" custom={dir} variants={slideIn} initial="enter" animate="center" exit="exit">
                          <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
                            Choose Your Service
                          </h2>
                          <p className="text-sm mb-6" style={{ color: SAGE }}>Select the treatment you'd like to book.</p>

                          <div className="space-y-3">
                            {SERVICE_GROUPS.map(group => (
                              <div key={group.group}>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                                  style={{ color: SAGE }}>
                                  <span>{group.emoji}</span> {group.group}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {group.items.map(item => {
                                    const selected = form.service === item;
                                    return (
                                      <button key={item} onClick={() => { handleChange('service', item); setSelectedAddons([]); }}
                                        className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                                        style={{
                                          background: selected ? NAVY : CREAM_DARK,
                                          color: selected ? CREAM : NAVY,
                                          border: selected ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
                                          boxShadow: selected ? `0 2px 12px rgba(14,42,58,0.15)` : 'none',
                                        }}>
                                        {item}
                                        {SERVICE_PRICES[item] && (
                                          <span className="ml-2 text-xs" style={{ color: selected ? GOLD : SAGE }}>
                                            ~{SERVICE_PRICES[item]} JOD
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {errors.service && <p className="text-xs mt-3" style={{ color: '#e05252' }}>{errors.service}</p>}

                          {/* ── Service Preview Panel ── */}
                          {form.service && (() => {
                            const meta = SERVICE_META[form.service];
                            const price = SERVICE_PRICES[form.service];
                            if (!meta && !price) return null;
                            return (
                              <motion.div
                                key={form.service}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                className="mt-5 rounded-2xl overflow-hidden"
                                style={{ border: `1.5px solid rgba(196,168,130,0.3)` }}
                              >
                                {/* Preview header */}
                                <div className="px-5 py-4" style={{ background: NAVY }}>
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>{form.service}</h3>
                                    {price && (
                                      <div className="text-right shrink-0">
                                        <span className="text-xl font-bold" style={{ color: GOLD }}>JOD {price}</span>
                                        <span className="text-xs block" style={{ color: 'rgba(253,250,246,0.55)' }}>/ session</span>
                                      </div>
                                    )}
                                  </div>
                                  {meta && (
                                    <>
                                      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(253,250,246,0.70)' }}>{meta.desc}</p>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(196,168,130,0.85)' }}>
                                          <Clock size={11} /> {meta.duration}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(196,168,130,0.85)' }}>
                                          <Star size={11} fill="currentColor" /> {meta.rating}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(196,168,130,0.85)' }}>
                                          <Sparkles size={11} /> {meta.bestFor}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Add-ons */}
                                {meta && meta.addons.length > 0 && (
                                  <div className="px-5 py-4" style={{ background: '#fff' }}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: SAGE }}>Enhance Your Experience</p>
                                    <div className="space-y-2">
                                      {meta.addons.map((addon) => {
                                        const isSelected = selectedAddons.some(a => a.name === addon.name);
                                        return (
                                          <button
                                            key={addon.name}
                                            onClick={() => setSelectedAddons(prev =>
                                              isSelected ? prev.filter(a => a.name !== addon.name) : [...prev, addon]
                                            )}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                                            style={{
                                              background: isSelected ? `${GOLD}12` : CREAM_DARK,
                                              border: `1.5px solid ${isSelected ? GOLD : 'transparent'}`,
                                            }}
                                          >
                                            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                                              style={{ background: isSelected ? GOLD : 'rgba(14,42,58,0.1)', color: isSelected ? NAVY : 'rgba(14,42,58,0.35)' }}>
                                              {isSelected ? <Minus size={10} /> : <Plus size={10} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-semibold" style={{ color: NAVY }}>{addon.name}</p>
                                              <p className="text-[10px]" style={{ color: SAGE }}>{addon.desc}</p>
                                            </div>
                                            <span className="text-xs font-bold shrink-0" style={{ color: isSelected ? GOLD : SAGE }}>+JOD {addon.price}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {selectedAddons.length > 0 && (
                                      <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}25` }}>
                                        <span className="text-xs font-semibold" style={{ color: NAVY }}>
                                          {selectedAddons.length} add-on{selectedAddons.length > 1 ? 's' : ''} selected
                                        </span>
                                        <span className="text-xs font-bold" style={{ color: GOLD }}>
                                          +JOD {selectedAddons.reduce((s, a) => s + a.price, 0)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })()}

                          {form.service && (
                            <>
                              <PointsPreview service={form.service} tier={loyaltyTier} />
                              <CompleteYourLook selectedService={form.service} />
                            </>
                          )}

                          <button onClick={nextStep}
                            className="w-full mt-6 py-4 rounded-full text-sm font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all hover:opacity-90"
                            style={{ background: form.service ? GOLD : 'rgba(14,42,58,0.1)', color: form.service ? NAVY : 'rgba(14,42,58,0.35)' }}>
                            Continue <ArrowRight size={15} />
                          </button>
                        </motion.div>
                      )}

                      {/* ── STEP 1: Date & Time ── */}
                      {step === 1 && (
                        <motion.div key="step1" custom={dir} variants={slideIn} initial="enter" animate="center" exit="exit">
                          <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
                            Pick a Date & Time
                          </h2>
                          <p className="text-sm mb-6" style={{ color: SAGE }}>Choose your preferred appointment slot.</p>

                          {/* Slot-taken error (race condition) */}
                          {submitError && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
                              style={{ background: 'rgba(224,82,82,0.08)', border: '1.5px solid rgba(224,82,82,0.25)' }}>
                              <Clock size={15} className="shrink-0 mt-0.5" style={{ color: '#e05252' }} />
                              <div>
                                <p className="text-xs font-bold mb-0.5" style={{ color: '#c0392b' }}>Time slot no longer available</p>
                                <p className="text-xs" style={{ color: '#c0392b' }}>{submitError}</p>
                              </div>
                            </motion.div>
                          )}

                          {/* Selected service summary */}
                          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
                            style={{ background: CREAM_DARK, border: `1px solid rgba(196,168,130,0.2)` }}>
                            <Sparkles size={14} style={{ color: GOLD }} />
                            <span className="text-sm font-semibold" style={{ color: NAVY }}>{form.service}</span>
                            <button onClick={() => go(0)} className="ml-auto text-xs font-semibold hover:opacity-70 transition-opacity"
                              style={{ color: GOLD }}>Change</button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Calendar */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SAGE }}>Select Date</p>
                              <MiniCalendar value={form.date} onChange={d => handleChange('date', d)} />
                              {errors.date && <p className="text-xs mt-2" style={{ color: '#e05252' }}>{errors.date}</p>}
                            </div>
                            {/* Time slots */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SAGE }}>
                                  Select Time
                                  {form.date && (
                                    <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: GOLD }}>
                                      — {new Date(form.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                                    </span>
                                  )}
                                </p>
                                {slotsLoading && (
                                  <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: SAGE }}>
                                    <Loader2 size={10} className="animate-spin" /> Checking…
                                  </span>
                                )}
                                {!slotsLoading && liveSlots.length > 0 && (
                                  <span className="text-[10px] font-semibold" style={{ color: SAGE }}>
                                    {liveSlots.filter(s => s.available).length} available
                                  </span>
                                )}
                              </div>
                              {!form.date ? (
                                <div className="flex items-center justify-center h-40 rounded-2xl" style={{ background: CREAM_DARK, border: `1.5px dashed rgba(196,168,130,0.3)` }}>
                                  <p className="text-xs" style={{ color: SAGE }}>Select a date first</p>
                                </div>
                              ) : slotsLoading ? (
                                /* Skeleton grid while loading */
                                <div className="grid grid-cols-3 gap-2">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="py-2.5 rounded-xl animate-pulse"
                                      style={{ background: 'rgba(14,42,58,0.06)', height: 38 }} />
                                  ))}
                                </div>
                              ) : slotsError ? (
                                <div className="flex flex-col items-center justify-center h-40 rounded-2xl gap-2"
                                  style={{ background: CREAM_DARK, border: `1.5px dashed rgba(196,168,130,0.3)` }}>
                                  <p className="text-xs font-semibold" style={{ color: '#c0392b' }}>Couldn't load availability</p>
                                  <p className="text-xs" style={{ color: SAGE }}>Please try a different date or call us directly.</p>
                                </div>
                              ) : liveSlots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 rounded-2xl gap-2"
                                  style={{ background: CREAM_DARK, border: `1.5px dashed rgba(196,168,130,0.3)` }}>
                                  <p className="text-xs font-semibold" style={{ color: NAVY }}>No slots available on this date</p>
                                  <p className="text-xs" style={{ color: SAGE }}>Please try a different date.</p>
                                </div>
                              ) : liveSlots.every(s => !s.available) ? (
                                <div className="flex flex-col items-center justify-center h-40 rounded-2xl gap-2"
                                  style={{ background: CREAM_DARK, border: `1.5px dashed rgba(196,168,130,0.3)` }}>
                                  <p className="text-xs font-semibold" style={{ color: NAVY }}>Fully booked on this date</p>
                                  <p className="text-xs" style={{ color: SAGE }}>Please choose a different date.</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-3 gap-2">
                                  {liveSlots.map(slot => {
                                    const selected  = form.time === slot.time;
                                    const booked    = !slot.available;
                                    return (
                                      <button key={slot.time}
                                        disabled={booked}
                                        onClick={() => !booked && handleChange('time', slot.time)}
                                        title={booked ? 'This slot is fully booked' : undefined}
                                        className="py-2.5 rounded-xl text-xs font-semibold transition-all relative"
                                        style={{
                                          background: selected
                                            ? NAVY
                                            : booked
                                              ? 'rgba(14,42,58,0.04)'
                                              : CREAM_DARK,
                                          color: selected
                                            ? CREAM
                                            : booked
                                              ? 'rgba(14,42,58,0.25)'
                                              : NAVY,
                                          border: selected
                                            ? `1.5px solid ${GOLD}`
                                            : booked
                                              ? '1.5px solid rgba(14,42,58,0.06)'
                                              : '1.5px solid transparent',
                                          cursor: booked ? 'not-allowed' : 'pointer',
                                          textDecoration: booked ? 'line-through' : 'none',
                                        }}>
                                        {slot.time}
                                        {booked && (
                                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                                            style={{ background: '#e05252', color: '#fff' }}>✕</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {errors.time && <p className="text-xs mt-2" style={{ color: '#e05252' }}>{errors.time}</p>}
                              {/* Legend */}
                              {!slotsLoading && liveSlots.length > 0 && liveSlots.some(s => !s.available) && (
                                <div className="flex items-center gap-4 mt-3">
                                  <span className="flex items-center gap-1.5 text-[10px]" style={{ color: SAGE }}>
                                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: CREAM_DARK, border: '1px solid rgba(14,42,58,0.1)' }} />
                                    Available
                                  </span>
                                  <span className="flex items-center gap-1.5 text-[10px]" style={{ color: SAGE }}>
                                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'rgba(14,42,58,0.04)', border: '1px solid rgba(14,42,58,0.06)' }} />
                                    Fully booked
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ── Therapist Selection ── */}
                          <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SAGE }}>Choose Your Therapist</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                              {THERAPISTS.map(t => {
                                const isSelected = form.therapist === t.id;
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => handleChange('therapist', t.id)}
                                    className="flex flex-col items-center gap-2 px-2 py-3 rounded-xl transition-all"
                                    style={{
                                      background: isSelected ? `${GOLD}12` : CREAM_DARK,
                                      border: `1.5px solid ${isSelected ? GOLD : 'transparent'}`,
                                    }}
                                  >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                      style={{ background: isSelected ? GOLD : `${NAVY}18`, color: isSelected ? NAVY : NAVY }}>
                                      {t.initial}
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[11px] font-semibold leading-tight" style={{ color: NAVY }}>{t.name}</p>
                                      <p className="text-[9px] leading-tight mt-0.5" style={{ color: SAGE }}>{t.role}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button onClick={() => go(0)}
                              className="flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                              style={{ border: `1.5px solid rgba(14,42,58,0.15)`, color: NAVY }}>
                              <ChevronLeft size={15} /> Back
                            </button>
                            <button onClick={nextStep}
                              className="flex-1 py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all hover:opacity-90"
                              style={{ background: (form.date && form.time) ? GOLD : 'rgba(14,42,58,0.1)', color: (form.date && form.time) ? NAVY : 'rgba(14,42,58,0.35)' }}>
                              Continue <ArrowRight size={15} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ── STEP 2: Details ── */}
                      {step === 2 && (
                        <motion.div key="step2" custom={dir} variants={slideIn} initial="enter" animate="center" exit="exit">
                          <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
                            Your Details
                          </h2>
                          <p className="text-sm mb-6" style={{ color: SAGE }}>Almost done — just a few details to confirm your booking.</p>

                          {/* Booking summary */}
                          <div className="rounded-2xl p-4 mb-6" style={{ background: CREAM_DARK, border: `1px solid rgba(196,168,130,0.2)` }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: SAGE }}>Your Booking</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                              <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: NAVY }}>
                                <Sparkles size={12} style={{ color: GOLD }} /> {form.service}
                              </span>
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: SAGE }}>
                                <Calendar size={12} style={{ color: GOLD }} />
                                {new Date(form.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
                              </span>
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: SAGE }}>
                                <Clock size={12} style={{ color: GOLD }} /> {form.time}
                              </span>
                              {form.therapist && form.therapist !== 'any' && (
                                <span className="flex items-center gap-1.5 text-sm" style={{ color: SAGE }}>
                                  <User size={12} style={{ color: GOLD }} /> {THERAPISTS.find(t => t.id === form.therapist)?.name}
                                </span>
                              )}
                            </div>
                            {selectedAddons.length > 0 && (
                              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(196,168,130,0.2)' }}>
                                <p className="text-[10px] font-semibold mb-1" style={{ color: SAGE }}>Add-ons:</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedAddons.map(a => (
                                    <span key={a.name} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                      style={{ background: `${GOLD}18`, color: NAVY }}>
                                      {a.name} +JOD {a.price}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Price total */}
                            {SERVICE_PRICES[form.service] && (
                              <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(196,168,130,0.2)' }}>
                                <span className="text-xs font-semibold" style={{ color: SAGE }}>Estimated Total</span>
                                <span className="text-sm font-bold" style={{ color: NAVY }}>
                                  JOD {SERVICE_PRICES[form.service] + selectedAddons.reduce((s, a) => s + a.price, 0)}
                                </span>
                              </div>
                            )}
                            <div className="flex gap-3 mt-2">
                              <button onClick={() => go(0)} className="text-[10px] font-semibold hover:opacity-70 transition-opacity" style={{ color: GOLD }}>Change service</button>
                              <button onClick={() => go(1)} className="text-[10px] font-semibold hover:opacity-70 transition-opacity" style={{ color: GOLD }}>Change time</button>
                            </div>
                          </div>

                          <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Name */}
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Full Name *</label>
                                <div className="relative">
                                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                                  <input type="text" placeholder="Your full name" value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="w-full pl-10 pr-4 outline-none transition-all text-sm rounded-xl"
                                    style={{ background: CREAM_DARK, border: `1.5px solid ${errors.name ? '#e05252' : 'rgba(61,46,38,0.15)'}`, color: NAVY, padding: '13px 13px 13px 38px', minHeight: 50 }}
                                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                                    onBlur={e => (e.currentTarget.style.borderColor = errors.name ? '#e05252' : 'rgba(61,46,38,0.15)')} />
                                </div>
                                {errors.name && <p className="text-xs mt-1.5" style={{ color: '#e05252' }}>{errors.name}</p>}
                              </div>
                              {/* Phone */}
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>Phone Number *</label>
                                <div className="relative">
                                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                                  <input type="tel" placeholder="079 041 2758" value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    className="w-full outline-none transition-all text-sm rounded-xl"
                                    style={{ background: CREAM_DARK, border: `1.5px solid ${errors.phone ? '#e05252' : 'rgba(61,46,38,0.15)'}`, color: NAVY, padding: '13px 13px 13px 38px', minHeight: 50 }}
                                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                                    onBlur={e => (e.currentTarget.style.borderColor = errors.phone ? '#e05252' : 'rgba(61,46,38,0.15)')} />
                                </div>
                                {errors.phone && <p className="text-xs mt-1.5" style={{ color: '#e05252' }}>{errors.phone}</p>}
                              </div>
                            </div>

                            {/* Email */}
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                                Email <span style={{ color: SAGE, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — for booking confirmation)</span>
                              </label>
                              <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                                <input type="email" placeholder="your@email.com" value={form.email}
                                  onChange={e => handleChange('email', e.target.value)}
                                  className="w-full outline-none transition-all text-sm rounded-xl"
                                  style={{ background: CREAM_DARK, border: `1.5px solid rgba(61,46,38,0.15)`, color: NAVY, padding: '13px 13px 13px 38px', minHeight: 50 }}
                                  onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(61,46,38,0.15)')} />
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                                Additional Notes <span style={{ color: SAGE, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                              </label>
                              <textarea rows={3} placeholder="Any skin concerns, allergies, or special requests..." value={form.notes}
                                onChange={e => handleChange('notes', e.target.value)}
                                className="w-full text-sm outline-none transition-all resize-none rounded-xl"
                                style={{ background: CREAM_DARK, border: `1.5px solid rgba(61,46,38,0.15)`, color: NAVY, padding: '13px 16px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(61,46,38,0.15)')} />
                            </div>

                            {/* Loyalty points preview */}
                            <PointsPreview service={form.service} tier={loyaltyTier} />

                            {submitError && (
                              <p className="text-xs px-3 py-2 rounded-xl" style={{ background: 'rgba(220,60,60,0.08)', color: '#e05252', border: '1px solid rgba(220,60,60,0.18)' }}>
                                {submitError}
                              </p>
                            )}

                            <div className="flex gap-3 pt-1">
                              <button type="button" onClick={() => go(1)}
                                className="flex items-center gap-2 px-5 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                                style={{ border: `1.5px solid rgba(14,42,58,0.15)`, color: NAVY }}>
                                <ChevronLeft size={15} /> Back
                              </button>
                              <button type="submit" disabled={submitting}
                                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.18em] transition-all hover:opacity-90 disabled:opacity-60 rounded-full"
                                style={{ background: GOLD, color: NAVY, padding: '16px 24px', minHeight: 56 }}>
                                {submitting
                                  ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                                  : <><Sparkles size={15} /> Confirm Booking</>}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <a href="tel:+962790412758"
                                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:opacity-80 rounded-xl"
                                style={{ border: `1.5px solid ${NAVY}`, color: NAVY, padding: '13px 12px', minHeight: 48 }}>
                                <Phone size={13} /> Call Us
                              </a>
                              <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:opacity-80 rounded-xl"
                                style={{ border: `1.5px solid #25D366`, color: '#1a9e4e', padding: '13px 12px', minHeight: 48 }}>
                                <MessageCircle size={13} /> WhatsApp
                              </a>
                            </div>

                            <p className="text-xs text-center" style={{ color: SAGE }}>
                              We'll confirm your appointment within a few hours during working hours.
                            </p>
                          </form>

                          <WaitlistOptIn />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* ── SIDEBAR ──────────────────────────────────────────────── */}
              <div className="w-full lg:w-80 shrink-0 space-y-4">

                {/* Loyalty teaser */}
                {!user && (
                  <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="p-5 rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d52 100%)`, border: `1px solid rgba(196,168,130,0.2)` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Gift size={15} style={{ color: GOLD }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Glow Points</span>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: CREAM }}>Earn points on every visit</p>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(253,250,246,0.55)' }}>
                      Join ArtiZone Rewards — free to join, earn from your very first treatment.
                    </p>
                    <Link to="/loyalty"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                      style={{ color: GOLD }}>
                      Learn about rewards <ArrowRight size={12} />
                    </Link>
                  </motion.div>
                )}

                {/* Info cards */}
                {infoCards.map((card, i) => (
                  <motion.div key={card.title} custom={i + 1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="p-5 rounded-2xl"
                    style={{ background: '#fff', border: `1.5px solid rgba(201,169,110,0.2)`, boxShadow: '0 4px 20px rgba(61,46,38,0.06)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-xl" style={{ background: `${GOLD}18` }}>
                        {card.icon}
                      </div>
                      <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>{card.title}</h3>
                    </div>
                    {card.lines.map(line => (
                      <p key={line} className="text-xs leading-relaxed pl-12" style={{ color: SAGE }}>{line}</p>
                    ))}
                  </motion.div>
                ))}

                {/* Call CTA */}
                <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 text-center rounded-2xl"
                  style={{ background: NAVY, border: `1.5px solid rgba(201,169,110,0.25)` }}>
                  <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3 rounded-xl" style={{ background: `${GOLD}22` }}>
                    <Phone size={18} style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: CREAM }}>Prefer to call?</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(249,245,240,0.6)' }}>
                    Call us directly for instant booking confirmation.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a href="tel:+962790412758"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:opacity-90 rounded-xl"
                      style={{ background: GOLD, color: NAVY }}>
                      <Phone size={12} /> +962 79 041 2758
                    </a>
                    <a href="tel:+962792828024"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:opacity-90 rounded-xl"
                      style={{ background: 'rgba(196,168,130,0.15)', color: GOLD, border: `1px solid rgba(196,168,130,0.30)` }}>
                      <Phone size={12} /> +962 79 282 8024
                    </a>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-6 text-center rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
                  <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Instagram size={18} color="#fff" />
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>DM us on Instagram</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Send us a message on Instagram and we'll book you in.
                  </p>
                  <a href="https://instagram.com/artizone_clinic" target="_blank" rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:opacity-90 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
                    <Instagram size={13} /> @artizone_clinic
                  </a>
                </motion.div>

                {/* Browse services */}
                <motion.div custom={6} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="p-5 text-center rounded-2xl"
                  style={{ background: CREAM_DARK, border: `1.5px solid rgba(201,169,110,0.15)` }}>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: SAGE }}>Not sure which treatment is right for you?</p>
                  <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:opacity-80" style={{ color: GOLD }}>
                    Browse All Services <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STICKY MOBILE CTA ─────────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          style={{ background: 'rgba(14,42,58,0.97)', backdropFilter: 'blur(16px)', borderTop: `1px solid rgba(196,168,130,0.20)`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-stretch">
            <a href="https://wa.me/962790412758?text=Hi%20ArtiZone%2C%20I%27d%20like%20to%20book%20an%20appointment"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all active:opacity-80"
              style={{ background: '#25D366', color: '#fff' }}>
              <MessageCircle size={13} /> WhatsApp
            </a>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
            <a href="https://instagram.com/artizone_clinic" target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all active:opacity-80"
              style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%)', color: '#fff' }}>
              <Instagram size={13} /> Instagram
            </a>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
            <a href="tel:+962790412758"
              className="flex-1 flex items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all active:opacity-80"
              style={{ background: GOLD, color: NAVY }}>
              <Phone size={13} /> Call Now
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
