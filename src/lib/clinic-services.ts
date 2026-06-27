/**
 * Canonical list of ArtiZone services, treatments, and packages.
 * Used by booking forms (admin + public) so dropdowns stay in sync.
 */

export interface ServiceCategory {
  id: string;
  title: string;
  treatments: string[];
}

export interface ClinicPackage {
  name: string;
  category: string;
  bundlePrice: string;
  treatments: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthlyJod: number;
  sessionsPerMonth: number;
  annualSavings: string;
  features: string[];
}

// ── Membership plans ──────────────────────────────────────────────────────────
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'glow-member',
    name: 'Glow Member',
    monthlyJod: 85,
    sessionsPerMonth: 1,
    annualSavings: '~340 JOD',
    features: [
      'Complimentary consultation + pre/post photos',
      'Flexible payment: upfront (extra 5% off), 50/50 split, 3–4 installments, Tabby',
      'Satisfaction guarantee — protocol adjusted if no visible improvement after 3 sessions',
      '20% deposit to secure booking',
      'Sessions transferable to other services',
    ],
  },
  {
    id: 'elite-member',
    name: 'Elite Member',
    monthlyJod: 150,
    sessionsPerMonth: 2,
    annualSavings: '~780 JOD',
    features: [
      'Complimentary consultation + pre/post photos',
      'Flexible payment: upfront (extra 5% off), 50/50 split, 3–4 installments, Tabby',
      'Satisfaction guarantee — protocol adjusted if no visible improvement after 3 sessions',
      '20% deposit to secure booking',
      'Sessions transferable to other services',
    ],
  },
  {
    id: 'vip-member',
    name: 'VIP Member',
    monthlyJod: 220,
    sessionsPerMonth: 3,
    annualSavings: '~1,200 JOD',
    features: [
      'Complimentary consultation + pre/post photos',
      'Flexible payment: upfront (extra 5% off), 50/50 split, 3–4 installments, Tabby',
      'Satisfaction guarantee — protocol adjusted if no visible improvement after 3 sessions',
      '20% deposit to secure booking',
      'Sessions transferable to other services',
    ],
  },
];

// ── Service categories & individual treatments ────────────────────────────────
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'face-skin-care',
    title: 'Face & Skin Care',
    treatments: [
      'Signature ArtiZone Facial',
      'HydraFacial',
      '24K Gold Facial',
      'Carbon Laser Facial',
      'Chemical Peels',
      'RF Microneedling',
      'LED Light Therapy',
      'Acne & Scar Care',
      'Skin Boosters',
      'Anti-Aging Collagen Lift',
      // Waxing & threading (non-laser hair removal)
      'Eyebrow Threading & Shaping',
      'Full Face Threading',
      'Full Body Wax',
      'Bikini & Brazilian Wax',
      'Underarm & Leg Wax',
      'Natural Sugaring',
      'Brow Tinting',
    ],
  },
  {
    id: 'body-treatments',
    title: 'Body Treatments',
    treatments: [
      'Cryolipolysis (Fat Freezing)',
      'Ultrasound Cavitation',
      'RF Skin Tightening',
      'EMS Body Sculpting',
      'Lymphatic Drainage Massage',
      'Cellulite Therapy',
      'Detox Body Wraps',
      'Custom Slimming Programs',
    ],
  },
  {
    id: 'laser-advanced',
    title: 'Laser & Advanced',
    treatments: [
      'Full Body Laser',
      'Face & Neck Laser',
      'Underarms & Bikini Laser',
      'Full Legs & Arms Laser',
      'Back & Shoulders Laser',
      'Beard Line Laser Shaping',
      'Small Zone Laser Session',
      'Laser Touch-Up Plan',
    ],
  },
  {
    id: 'nails-extensions',
    title: 'Nails & Extensions',
    treatments: [
      'Classic Mani & Pedi',
      'Gel Polish',
      'Acrylic & Gel Extensions',
      'Custom Nail Art',
      'Luxury Spa Pedicure',
      'Paraffin Hand Treatment',
      'Medical Pedicure',
      'French Forever',
    ],
  },
  {
    id: 'mens-treatments',
    title: "Men's Treatments",
    treatments: [
      "Gentleman's Deep-Clean Facial",
      'Beard Trim & Design',
      'Hot Towel Ritual',
      "Men's Laser (Beard Line, Back, Chest)",
      "Men's Mani & Pedi",
      'Scalp & Hair Therapy',
      "Men's Body Contouring",
    ],
  },
  {
    id: 'membership-plans',
    title: 'Membership Plans',
    treatments: [
      'Glow Member — 85 JOD/month · 1 session/month · Save ~340 JOD/year',
      'Elite Member — 150 JOD/month · 2 sessions/month · Save ~780 JOD/year',
      'VIP Member — 220 JOD/month · 3 sessions/month · Save ~1,200 JOD/year',
    ],
  },
];

// ── Packages ──────────────────────────────────────────────────────────────────
export const CLINIC_PACKAGES: ClinicPackage[] = [
  // Skin Care
  { name: 'Glow Starter Package',       category: 'Skin Care',            bundlePrice: 'Ask in clinic', treatments: ['Signature ArtiZone Facial', 'HydraFacial', 'LED Light Therapy'] },
  // Laser
  { name: 'Laser Essentials Bundle',    category: 'Laser Hair Removal',   bundlePrice: 'Ask in clinic', treatments: ['Multi-session laser hair removal', 'Underarms & Bikini', 'Face & Neck'] },
  // Body Slimming
  { name: 'Full Body Slimming Plan',    category: 'Body Slimming',        bundlePrice: 'Ask in clinic', treatments: ['Cryolipolysis (Fat Freezing)', 'RF Skin Tightening', 'EMS Body Sculpting', 'Lymphatic Drainage Massage'] },
  // Men's
  { name: "Men's Grooming Package",     category: "Men's Grooming",       bundlePrice: 'Ask in clinic', treatments: ["Gentleman's Deep-Clean Facial", "Men's Laser (Beard Line, Back, Chest)", 'Beard Trim & Design', "Men's Mani & Pedi"] },
  // Bridal
  { name: 'Bridal Beauty Package',      category: 'Special Packages',     bundlePrice: 'Ask in clinic', treatments: ['Signature ArtiZone Facial', 'Full Body Laser', 'Custom Nail Art', 'Eyebrow Threading & Shaping', 'Detox Body Wraps'] },
];

// ── Time slots ────────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];
