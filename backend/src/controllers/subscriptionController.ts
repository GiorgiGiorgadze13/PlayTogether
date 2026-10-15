/**
 * Subscription Controller
 * Handles PlayPass subscription management:
 * - Get active subscription with weekly usage
 * - Subscribe to a plan (simulated payment - no real provider)
 * - Cancel subscription
 * - Credit tracking (called by gameController on booking/cancellation)
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the ISO week key string for a given date, e.g. "2026-W42" */
function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Monday = 1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/** Weekly credit limits per tier */
const WEEKLY_LIMITS: Record<string, number> = {
  SILVER: 2,
  GOLD: 3,
  UNLIMITED: Infinity,
};

/** Add months to a date */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// ── Validation ────────────────────────────────────────────────────────────────

const subscribeSchema = z.object({
  tier: z.enum(['SILVER', 'GOLD', 'UNLIMITED']),
  durationMonths: z.number().int().min(1).max(12),
  pricePaid: z.number().positive(),
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /api/subscriptions/my
 * Returns the user's most recent ACTIVE subscription + current week usage
 */
export const getMySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const now = new Date();

    // Auto-expire subscriptions whose endDate has passed
    await prisma.userSubscription.updateMany({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
        endDate: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        weeklyUsages: {
          where: { weekKey: getWeekKey(now) },
        },
      },
    });

    if (!subscription) {
      res.status(200).json({ subscription: null, weeklyUsage: null });
      return;
    }

    const currentWeekUsage = subscription.weeklyUsages[0] || null;
    const weeklyLimit = WEEKLY_LIMITS[subscription.tier];
    const creditsUsed = currentWeekUsage?.creditsUsed || 0;
    const creditsRemaining = subscription.tier === 'UNLIMITED' ? null : Math.max(0, weeklyLimit - creditsUsed);

    res.status(200).json({
      subscription: {
        id: subscription.id,
        tier: subscription.tier,
        status: subscription.status,
        durationMonths: subscription.durationMonths,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        pricePaid: subscription.pricePaid,
      },
      weeklyUsage: {
        weekKey: getWeekKey(now),
        creditsUsed,
        creditsRemaining,
        weeklyLimit: subscription.tier === 'UNLIMITED' ? null : weeklyLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscriptions/subscribe
 * Activates a new subscription (simulated payment — no real provider)
 * Cancels any previously active subscription.
 */
export const subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const { tier, durationMonths, pricePaid } = subscribeSchema.parse(req.body);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // Cancel any currently active subscriptions
      await tx.userSubscription.updateMany({
        where: {
          userId: req.user!.userId,
          status: 'ACTIVE',
        },
        data: { status: 'CANCELLED' },
      });

      // Create new subscription
      const endDate = addMonths(now, durationMonths);
      const newSub = await tx.userSubscription.create({
        data: {
          userId: req.user!.userId,
          tier: tier as any,
          status: 'ACTIVE',
          durationMonths,
          startDate: now,
          endDate,
          pricePaid,
        },
      });

      return newSub;
    });

    // Re-fetch with usage
    const subscription = await prisma.userSubscription.findFirst({
      where: { userId: req.user.userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    res.status(201).json({
      message: `PlayPass ${tier} activated successfully!`,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/subscriptions/cancel
 * Cancels the user's active subscription.
 */
export const cancelSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const result = await prisma.userSubscription.updateMany({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
      data: { status: 'CANCELLED' },
    });

    if (result.count === 0) {
      throw new AppError('No active subscription found', 404);
    }

    res.status(200).json({ message: 'Subscription cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscriptions/use-credit
 * Internal: Deducts a credit from the active subscription for a game booking.
 * Called transactionally by gameController.
 * Returns the subscriptionId that was used, or null if no subscription / unlimited.
 */
export async function tryUseSubscriptionCredit(userId: string, tx: typeof prisma): Promise<string | null> {
  const now = new Date();

  // Auto-expire if needed
  await (tx as any).userSubscription.updateMany({
    where: { userId, status: 'ACTIVE', endDate: { lt: now } },
    data: { status: 'EXPIRED' },
  });

  const subscription = await (tx as any).userSubscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) return null;

  const weekKey = getWeekKey(now);

  if (subscription.tier === 'UNLIMITED') {
    // Track uses for analytics but don't limit
    await (tx as any).weeklyUsage.upsert({
      where: { subscriptionId_weekKey: { subscriptionId: subscription.id, weekKey } },
      update: { creditsUsed: { increment: 1 } },
      create: { subscriptionId: subscription.id, weekKey, creditsUsed: 1 },
    });
    return subscription.id;
  }

  const limit = WEEKLY_LIMITS[subscription.tier];
  const usage = await (tx as any).weeklyUsage.findUnique({
    where: { subscriptionId_weekKey: { subscriptionId: subscription.id, weekKey } },
  });

  const used = usage?.creditsUsed || 0;
  if (used >= limit) {
    // Credit limit exceeded — booking proceeds but not linked to subscription
    return null;
  }

  // Deduct credit
  await (tx as any).weeklyUsage.upsert({
    where: { subscriptionId_weekKey: { subscriptionId: subscription.id, weekKey } },
    update: { creditsUsed: { increment: 1 } },
    create: { subscriptionId: subscription.id, weekKey, creditsUsed: 1 },
  });

  return subscription.id;
}

/**
 * POST /api/subscriptions/restore-credit
 * Internal: Restores a credit when a subscription-linked booking is cancelled.
 */
export async function restoreSubscriptionCredit(subscriptionId: string, tx: typeof prisma): Promise<void> {
  const now = new Date();
  const weekKey = getWeekKey(now);

  const usage = await (tx as any).weeklyUsage.findUnique({
    where: { subscriptionId_weekKey: { subscriptionId, weekKey } },
  });

  if (usage && usage.creditsUsed > 0) {
    await (tx as any).weeklyUsage.update({
      where: { subscriptionId_weekKey: { subscriptionId, weekKey } },
      data: { creditsUsed: { decrement: 1 } },
    });
  }
}
