// TypeScript types for the PlayPass subscription system

export type SubscriptionTier = 'SILVER' | 'GOLD' | 'UNLIMITED';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface UserSubscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  durationMonths: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  pricePaid: number;
}

export interface WeeklyUsage {
  weekKey: string;
  creditsUsed: number;
  creditsRemaining: number | null; // null for UNLIMITED
  weeklyLimit: number | null;      // null for UNLIMITED
}

export interface SubscriptionState {
  subscription: UserSubscription | null;
  weeklyUsage: WeeklyUsage | null;
  isLoading: boolean;
  error: string | null;
}
