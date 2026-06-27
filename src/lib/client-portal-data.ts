/**
 * Demo data for the ArtiZone client portal.
 * Replace with real API calls when backend is connected.
 */

export const DEMO_CUSTOMER = {
  id: 1,
  firstName: 'Sara',
  lastName: 'Al Ahmad',
  name: 'Sara Al Ahmad',
  mobile: '+962 79 123 4567',
  email: 'sara@example.com',
  dob: '1994-06-16',
  area: 'Abdoun, Amman',
  preferredTherapist: 'Lina',
  skinType: 'Combination',
  skinConcerns: 'Dullness, pores, light pigmentation.',
  bodyGoals: 'Firming and contouring',
  allergies: 'No known allergies.',
  favoriteServices: 'HydraFacial, Laser, Nails',
  whatsappConsent: true,
  emailConsent: true,
  photoConsent: false,
  referralCode: 'SARA100',
};

// ── Loyalty ───────────────────────────────────────────────────────────────────
export const DEMO_LOYALTY = {
  tier: 'gold' as TierKey,
  points: 420,
  lifetimePoints: 1350,
  redeemedPoints: 930,
  expiringPoints: 120,
  totalSpend: 600,
  totalSessions: 12,
};

export type TierKey = 'glow' | 'silver' | 'gold' | 'platinum';

export const TIERS: Record<TierKey, {
  label: string; multiplier: string; color: string; bg: string;
  minSpend: number; minSessions: number;
  nextTier: TierKey | null; nextSpend: number | null; nextSessions: number | null;
}> = {
  glow:     { label: 'Glow',     multiplier: '1×',    color: '#C4A882', bg: 'rgba(196,168,130,0.12)', minSpend: 0,    minSessions: 0,  nextTier: 'silver',   nextSpend: 250,  nextSessions: 5 },
  silver:   { label: 'Silver',   multiplier: '1.25×', color: '#A8B8C8', bg: 'rgba(168,184,200,0.12)', minSpend: 250,  minSessions: 5,  nextTier: 'gold',     nextSpend: 600,  nextSessions: 12 },
  gold:     { label: 'Gold',     multiplier: '1.5×',  color: '#E8B86D', bg: 'rgba(232,184,109,0.12)', minSpend: 600,  minSessions: 12, nextTier: 'platinum', nextSpend: 1200, nextSessions: 24 },
  platinum: { label: 'Platinum', multiplier: '2×',    color: '#B0C4DE', bg: 'rgba(176,196,222,0.12)', minSpend: 1200, minSessions: 24, nextTier: null,       nextSpend: null, nextSessions: null },
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export interface Booking {
  id: number;
  service: string;
  therapist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  paid: number;
  pointsEarned: number;
  category: string;
}

export const DEMO_BOOKINGS: Booking[] = [
  { id: 1, service: 'HydraFacial Glow Treatment',  therapist: 'Lina',  date: '2026-06-16', time: '5:30 PM', status: 'confirmed',  paid: 65,  pointsEarned: 65,  category: 'Facial' },
  { id: 2, service: 'HydraFacial Glow Treatment',  therapist: 'Lina',  date: '2026-06-12', time: '4:00 PM', status: 'completed',  paid: 65,  pointsEarned: 65,  category: 'Facial' },
  { id: 3, service: 'Gel Polish Manicure',          therapist: 'Rania', date: '2026-05-25', time: '2:00 PM', status: 'completed',  paid: 28,  pointsEarned: 28,  category: 'Nails' },
  { id: 4, service: 'Full Body Laser',              therapist: 'Maya',  date: '2026-05-10', time: '11:00 AM',status: 'completed',  paid: 180, pointsEarned: 180, category: 'Laser' },
  { id: 5, service: 'Brow Threading',               therapist: 'Lina',  date: '2026-04-20', time: '3:00 PM', status: 'completed',  paid: 15,  pointsEarned: 15,  category: 'Brows' },
  { id: 6, service: 'RF Microneedling',             therapist: 'Maya',  date: '2026-03-15', time: '1:00 PM', status: 'cancelled',  paid: 0,   pointsEarned: 0,   category: 'Facial' },
];

export const BOOK_AGAIN_SERVICES = [
  { service: 'HydraFacial Glow Treatment', lastVisit: '32 days ago', price: '65 JOD' },
  { service: 'Gel Polish Manicure',        lastVisit: '21 days ago', price: '28 JOD' },
  { service: 'Brow Threading',             lastVisit: '14 days ago', price: '15 JOD' },
];

export const RECOMMENDED_ADDONS = [
  { name: 'LED Light Therapy',       price: '35 JOD', duration: '30 min', note: 'Add to facial' },
  { name: 'Paraffin Hand Treatment', price: '20 JOD', duration: '30 min', note: 'Pairs with manicure' },
];

// ── Rewards ───────────────────────────────────────────────────────────────────
export interface RewardItem {
  pts: number;
  label: string;
  status: 'available' | 'locked';
  ptsNeeded?: number;
}

export const REWARDS_TABLE: RewardItem[] = [
  { pts: 100,  label: '5 JOD discount',          status: 'available' },
  { pts: 300,  label: 'Free add-on treatment',    status: 'available' },
  { pts: 500,  label: '25 JOD discount',          status: 'locked', ptsNeeded: 80 },
  { pts: 800,  label: 'Free selected treatment',  status: 'locked', ptsNeeded: 380 },
  { pts: 1500, label: 'VIP upgrade',              status: 'locked', ptsNeeded: 1080 },
];

export interface PointsTransaction {
  date: string;
  activity: string;
  points: number;
  type: 'earned' | 'redeemed' | 'bonus' | 'expiring';
}

export const POINTS_HISTORY: PointsTransaction[] = [
  { date: '12 Jun 2026', activity: 'HydraFacial Glow Treatment', points: +65,   type: 'earned' },
  { date: '25 May 2026', activity: 'Gel Polish Manicure',         points: +28,   type: 'earned' },
  { date: '15 May 2026', activity: 'Redeemed free add-on',        points: -300,  type: 'redeemed' },
  { date: '1 May 2026',  activity: 'Referral bonus — Dana',       points: +100,  type: 'bonus' },
  { date: '10 May 2026', activity: 'Full Body Laser',             points: +180,  type: 'earned' },
  { date: '20 Apr 2026', activity: 'Brow Threading',              points: +15,   type: 'earned' },
];

// ── Packages ──────────────────────────────────────────────────────────────────
export interface ClientPackage {
  id: number;
  name: string;
  totalSessions: number;
  usedSessions: number;
  expiry: string;
  status: 'active' | 'expiring' | 'completed' | 'expired';
  purchasedDate: string;
  includedServices: string[];
  price: number;
}

export const DEMO_PACKAGES: ClientPackage[] = [
  {
    id: 1,
    name: 'Full Body Laser Package',
    totalSessions: 6,
    usedSessions: 2,
    expiry: '30 Sep 2026',
    status: 'active',
    purchasedDate: '1 May 2026',
    includedServices: ['Full Body Laser', 'Laser Touch-Up (after completion)'],
    price: 245,
  },
  {
    id: 2,
    name: 'Glow Starter Package',
    totalSessions: 4,
    usedSessions: 3,
    expiry: '30 Jun 2026',
    status: 'expiring',
    purchasedDate: '10 Apr 2026',
    includedServices: ['LED Light Therapy'],
    price: 120,
  },
  {
    id: 3,
    name: 'Bridal Beauty Package',
    totalSessions: 8,
    usedSessions: 8,
    expiry: '28 Feb 2026',
    status: 'completed',
    purchasedDate: '12 Jan 2026',
    includedServices: ['Full Body Laser', 'Bridal Facial Series', 'Nails & Makeup', 'Body Scrub'],
    price: 375,
  },
];

// ── Referrals ─────────────────────────────────────────────────────────────────
export interface Referral {
  name: string;
  status: 'completed' | 'booked' | 'registered';
  points: number | null;
}

export const DEMO_REFERRALS: Referral[] = [
  { name: 'Dana',  status: 'completed',  points: 100 },
  { name: 'Noor',  status: 'registered', points: null },
  { name: 'Lina',  status: 'booked',     points: null },
];
