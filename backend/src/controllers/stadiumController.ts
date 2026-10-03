import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllStadiums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sport } = req.query;

    const whereCondition = sport
      ? { sport: { equals: String(sport), mode: 'insensitive' as const } }
      : {};

    const stadiums = await prisma.stadium.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ stadiums });
  } catch (error) {
    next(error);
  }
};

export const getStadiumById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const stadium = await prisma.stadium.findUnique({
      where: { id },
      include: {
        games: {
          where: {
            status: 'UPCOMING',
          },
          include: {
            creator: {
              select: { id: true, name: true, email: true },
            },
            players: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!stadium) {
      throw new AppError('Stadium not found', 404);
    }

    res.status(200).json({ stadium });
  } catch (error) {
    next(error);
  }
};

export const checkAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { date, startTime, endTime } = req.query;

    if (!date) {
      throw new AppError('Date query parameter is required (YYYY-MM-DD)', 400);
    }

    const stadium = await prisma.stadium.findUnique({
      where: { id },
    });

    if (!stadium) {
      throw new AppError('Stadium not found', 404);
    }

    // Parse date safely
    const bookingDate = new Date(String(date));
    if (isNaN(bookingDate.getTime())) {
      throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
    }

    // Reset time component for accurate date comparison
    const startOfDay = new Date(new Date(bookingDate).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(bookingDate).setHours(23, 59, 59, 999));

    // Get all upcoming/active games for this stadium on this date
    const existingGames = await prisma.game.findMany({
      where: {
        stadiumId: id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'UPCOMING',
      },
      select: {
        id: true,
        title: true,
        date: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!startTime || !endTime) {
      // Return general availability list for the day
      res.status(200).json({
        stadiumId: id,
        date: String(date),
        bookedSlots: existingGames,
      });
      return;
    }

    const reqStart = String(startTime);
    const reqEnd = String(endTime);

    // Overlap condition: (reqStart < existingEnd) AND (reqEnd > existingStart)
    const conflictingGame = existingGames.find((game) => {
      return reqStart < game.endTime && reqEnd > game.startTime;
    });

    if (conflictingGame) {
      res.status(200).json({
        available: false,
        message: 'Time slot is already occupied.',
        conflictingGame,
      });
      return;
    }

    res.status(200).json({
      available: true,
      message: 'Time slot is available for booking.',
      stadiumId: id,
      date: String(date),
      startTime: reqStart,
      endTime: reqEnd,
    });
  } catch (error) {
    next(error);
  }
};
