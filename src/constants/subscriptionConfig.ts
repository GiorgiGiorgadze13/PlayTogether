// ═══════════════════════════════════════════════════════════════════
// PlayPass Subscription Configuration
// ═══════════════════════════════════════════════════════════════════
// All prices are in GEL (Georgian Lari).
// To update prices, change the values in PLAYPASS_PRICES below.
// The UI will automatically reflect your changes everywhere.
// ═══════════════════════════════════════════════════════════════════

export type SubscriptionTier = 'SILVER' | 'GOLD' | 'UNLIMITED';
export type SubscriptionDuration = 1 | 2 | 3 | 5;

export const SUBSCRIPTION_DURATIONS: SubscriptionDuration[] = [1, 2, 3, 5];

// ─── Configurable Prices (GEL) ──────────────────────────────────────────────
// Format: PLAYPASS_PRICES[tier][durationMonths] = totalPrice
export const PLAYPASS_PRICES: Record<SubscriptionTier, Record<SubscriptionDuration, number>> = {
  SILVER:    { 1: 29,  2: 54,  3: 79,  5: 124 },
  GOLD:      { 1: 44,  2: 82,  3: 119, 5: 189 },
  UNLIMITED: { 1: 69,  2: 129, 3: 189, 5: 299 },
};

// ─── Weekly credit limits ─────────────────────────────────────────────────
export const WEEKLY_CREDITS: Record<SubscriptionTier, number | null> = {
  SILVER:    2,
  GOLD:      3,
  UNLIMITED: null, // null = unlimited
};

// ─── Plan metadata ───────────────────────────────────────────────────────────
export interface PlanMeta {
  tier: SubscriptionTier;
  name: string;
  tagline: string;
  weeklyCredits: number | null;
  recommended: boolean;
  color: string;          // accent color
  gradient: string;       // card gradient
  icon: string;
  perks: string[];
}

export const PLAN_META: PlanMeta[] = [
  {
    tier: 'SILVER',
    name: 'Silver Pass',
    tagline: 'Perfect for occasional players',
    weeklyCredits: 2,
    recommended: false,
    color: '#b0c4d8',
    gradient: 'linear-gradient(135deg, #1a1e24 0%, #0f1318 100%)',
    icon: '🥈',
    perks: [
      '2 activities per week',
      'All eligible sports',
      'Flexible cancellation',
      'Priority booking access',
    ],
  },
  {
    tier: 'GOLD',
    name: 'Gold Pass',
    tagline: 'For the regular athlete',
    weeklyCredits: 3,
    recommended: true,
    color: '#f0b429',
    gradient: 'linear-gradient(135deg, #1d1a0f 0%, #100d05 100%)',
    icon: '🥇',
    perks: [
      '3 activities per week',
      'All eligible sports',
      'Flexible cancellation',
      'Priority booking access',
      'Exclusive Gold badge on profile',
    ],
  },
  {
    tier: 'UNLIMITED',
    name: 'Unlimited Pass',
    tagline: 'Maximum flexibility, zero limits',
    weeklyCredits: null,
    recommended: false,
    color: '#c9ff35',
    gradient: 'linear-gradient(135deg, #0f1a04 0%, #070809 100%)',
    icon: '⚡',
    perks: [
      'Unlimited activities',
      'All eligible sports',
      'Flexible cancellation',
      'Priority booking access',
      'Exclusive Unlimited badge on profile',
      'New sport early access',
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Price per month for the given tier and duration */
export function pricePerMonth(tier: SubscriptionTier, duration: SubscriptionDuration): number {
  return +(PLAYPASS_PRICES[tier][duration] / duration).toFixed(1);
}

/** Savings versus buying the same number of 1-month plans */
export function monthlySavings(tier: SubscriptionTier, duration: SubscriptionDuration): number {
  if (duration === 1) return 0;
  const fullPrice = PLAYPASS_PRICES[tier][duration];
  const monthlyPrice = PLAYPASS_PRICES[tier][1];
  return Math.max(0, monthlyPrice * duration - fullPrice);
}

/** Eligible sports that count as one activity credit */
export const ELIGIBLE_SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Padel', 'Boxing', 'Rugby',
  'Volleyball', 'Badminton', 'Swimming', 'Cycling',
];
