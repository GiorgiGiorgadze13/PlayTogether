import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const [userCount, bookingCount, gameCount, activeSubscriptionCount] = await Promise.all([
      prisma.user.count(),
      prisma.instructorBooking.count(),
      prisma.game.count(),
      prisma.userSubscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    res.status(200).json({
      stats: {
        totalUsers: userCount,
        totalInstructorBookings: bookingCount,
        totalGames: gameCount,
        activeSubscriptions: activeSubscriptionCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const bookings = await prisma.instructorBooking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            instructorBookings: true,
            createdGames: true,
          },
        },
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
