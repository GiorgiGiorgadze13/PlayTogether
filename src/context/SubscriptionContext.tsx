import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserSubscription, WeeklyUsage } from '../types/subscription';
import type { SubscriptionTier, SubscriptionDuration } from '../constants/subscriptionConfig';
import { PLAYPASS_PRICES } from '../constants/subscriptionConfig';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const LOCAL_SUB_KEY = 'playTogether_subscription';
const LOCAL_USAGE_KEY = 'playTogether_weekly_usage';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  weeklyUsage: WeeklyUsage | null;
  isLoading: boolean;
  subscribe: (tier: SubscriptionTier, duration: SubscriptionDuration) => Promise<void>;
  cancel: () => Promise<void>;
  refresh: () => Promise<void>;
  hasActiveSubscription: boolean;
  canUseCredit: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function addMonths(date: Date, months: number): Date {
  const r = new Date(date);
  r.setMonth(r.getMonth() + months);
  return r;
}

const WEEKLY_LIMITS: Record<SubscriptionTier, number | null> = {
  SILVER: 2,
  GOLD: 3,
  UNLIMITED: null,
};

function loadLocalSub(): UserSubscription | null {
  try {
    const raw = localStorage.getItem(LOCAL_SUB_KEY);
    if (!raw) return null;
    const sub: UserSubscription = JSON.parse(raw);
    if (new Date(sub.endDate) < new Date()) {
      sub.status = 'EXPIRED';
      localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(sub));
    }
    return sub;
  } catch { return null; }
}

function loadLocalUsage(sub: UserSubscription | null): WeeklyUsage | null {
  if (!sub || sub.status !== 'ACTIVE') return null;
  try {
    const weekKey = getWeekKey(new Date());
    const raw = localStorage.getItem(`${LOCAL_USAGE_KEY}_${weekKey}`);
    const creditsUsed = raw ? parseInt(raw, 10) : 0;
    const limit = WEEKLY_LIMITS[sub.tier];
    return {
      weekKey,
      creditsUsed,
      creditsRemaining: limit === null ? null : Math.max(0, limit - creditsUsed),
      weeklyLimit: limit,
    };
  } catch { return null; }
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(() => loadLocalSub());
  const [weeklyUsage, setWeeklyUsage] = useState<WeeklyUsage | null>(() => loadLocalUsage(loadLocalSub()));
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      setWeeklyUsage(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await (api as any).getMySubscription();
      const sub: UserSubscription | null = res.subscription;
      const usage: WeeklyUsage | null = res.weeklyUsage;
      setSubscription(sub);
      setWeeklyUsage(usage);
      if (sub) localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(sub));
      else localStorage.removeItem(LOCAL_SUB_KEY);
    } catch {
      const localSub = loadLocalSub();
      setSubscription(localSub);
      setWeeklyUsage(loadLocalUsage(localSub));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refresh();
    } else {
      setSubscription(null);
      setWeeklyUsage(null);
    }
  }, [isAuthenticated, user, refresh]);

  const subscribeToplan = useCallback(async (tier: SubscriptionTier, duration: SubscriptionDuration) => {
    if (!isAuthenticated || !user) throw new Error('Please sign in to subscribe');

    const pricePaid = PLAYPASS_PRICES[tier][duration];
    setIsLoading(true);

    try {
      await (api as any).subscribe({ tier, durationMonths: duration, pricePaid });
      await refresh();
    } catch {
      const now = new Date();
      const endDate = addMonths(now, duration);
      const newSub: UserSubscription = {
        id: `local-sub-${Date.now()}`,
        tier,
        status: 'ACTIVE',
        durationMonths: duration,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        pricePaid,
      };
      localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(newSub));
      setSubscription(newSub);
      const usage = loadLocalUsage(newSub);
      setWeeklyUsage(usage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, refresh]);

  const cancel = useCallback(async () => {
    setIsLoading(true);
    try {
      await (api as any).cancelSubscription();
      await refresh();
    } catch {
      const localSub = loadLocalSub();
      if (localSub) {
        localSub.status = 'CANCELLED';
        localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(localSub));
        setSubscription(localSub);
        setWeeklyUsage(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const hasActiveSubscription = !!subscription && subscription.status === 'ACTIVE' && new Date(subscription.endDate) > new Date();
  const canUseCredit = hasActiveSubscription && (
    subscription!.tier === 'UNLIMITED' ||
    (weeklyUsage?.creditsRemaining !== undefined && (weeklyUsage?.creditsRemaining ?? 0) > 0)
  );

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        weeklyUsage,
        isLoading,
        subscribe: subscribeToplan,
        cancel,
        refresh,
        hasActiveSubscription,
        canUseCredit,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
