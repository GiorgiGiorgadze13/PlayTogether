
export type SubscriptionTier = 'SILVER' | 'GOLD' | 'UNLIMITED';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface UserSubscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  durationMonths: number;
  startDate: string;
  endDate: string;
  pricePaid: number;
}

export interface WeeklyUsage {
  weekKey: string;
  creditsUsed: number;
  creditsRemaining: number | null;
  weeklyLimit: number | null;
}

export interface SubscriptionState {
  subscription: UserSubscription | null;
  weeklyUsage: WeeklyUsage | null;
  isLoading: boolean;
  error: string | null;
}
