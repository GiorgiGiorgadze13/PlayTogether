import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const createGameSchema = z.object({
  stadiumId: z.string().uuid('Invalid stadium ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'startTime must be HH:mm format (e.g. 20:00)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'endTime must be HH:mm format (e.g. 22:00)'),
  title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
});

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { stadiumId, date, startTime, endTime, title } = createGameSchema.parse(req.body);

    if (startTime >= endTime) {
      throw new AppError('startTime must be earlier than endTime', 400);
    }

    // Verify stadium exists
    const stadium = await prisma.stadium.findUnique({
      where: { id: stadiumId },
    });

    if (!stadium) {
      throw new AppError('Stadium not found', 404);
    }

    const bookingDate = new Date(date);
    const startOfDay = new Date(new Date(bookingDate).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(bookingDate).setHours(23, 59, 59, 999));

    // Check for overlapping games at the same stadium on the same date
    const existingGames = await prisma.game.findMany({
      where: {
        stadiumId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'UPCOMING',
      },
    });

    const hasConflict = existingGames.some(
      (game) => startTime < game.endTime && endTime > game.startTime
    );

    if (hasConflict) {
      throw new AppError(
        'Stadium is already booked for the requested date and time slot.',
        409
      );
    }

    // Create game and add creator as first player inside transaction
    const game = await prisma.$transaction(async (tx) => {
      const newGame = await tx.game.create({
        data: {
          stadiumId,
          creatorId: req.user!.userId,
          date: startOfDay,
          startTime,
          endTime,
          title: title || `${stadium.sport} Match at ${stadium.name}`,
        },
      });

      await tx.gamePlayer.create({
        data: {
          gameId: newGame.id,
          userId: req.user!.userId,
        },
      });

      return newGame;
    });

    const fullGameDetails = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        stadium: true,
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
    });

    res.status(201).json({
      message: 'Game created and booked successfully',
      game: fullGameDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stadiumId, sport, date } = req.query;

    const where: any = {
      status: 'UPCOMING',
    };

    if (stadiumId) {
      where.stadiumId = String(stadiumId);
    }

    if (sport) {
      where.stadium = {
        sport: { equals: String(sport), mode: 'insensitive' },
      };
    }

    if (date) {
      const targetDate = new Date(String(date));
      if (!isNaN(targetDate.getTime())) {
        where.date = {
          gte: new Date(new Date(targetDate).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(targetDate).setHours(23, 59, 59, 999)),
        };
      }
    }

    const games = await prisma.game.findMany({
      where,
      include: {
        stadium: true,
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
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    res.status(200).json({ games });
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        stadium: true,
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
    });

    if (!game) {
      throw new AppError('Game not found', 404);
    }

    res.status(200).json({ game });
  } catch (error) {
    next(error);
  }
};

export const joinGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = req.params.id as string;
    const userId = req.user.userId;

    const game = await prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new AppError('Game not found', 404);
    }

    if (game.status !== 'UPCOMING') {
      throw new AppError('Cannot join a game that is not upcoming', 400);
    }

    const existingPlayer = await prisma.gamePlayer.findUnique({
      where: {
        gameId_userId: {
          gameId: id,
          userId,
        },
      },
    });

    if (existingPlayer) {
      throw new AppError('You have already joined this game', 409);
    }

    await prisma.gamePlayer.create({
      data: {
        gameId: id,
        userId,
      },
    });

    const updatedGame = await prisma.game.findUnique({
      where: { id },
      include: {
        stadium: true,
        creator: { select: { id: true, name: true, email: true } },
        players: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.status(200).json({
      message: 'Joined game successfully',
      game: updatedGame,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = req.params.id as string;
    const userId = req.user.userId;

    const gamePlayer = await prisma.gamePlayer.findUnique({
      where: {
        gameId_userId: {
          gameId: id,
          userId,
        },
      },
    });

    if (!gamePlayer) {
      throw new AppError('You are not a member of this game', 404);
    }

    await prisma.gamePlayer.delete({
      where: {
        id: gamePlayer.id,
      },
    });

    res.status(200).json({ message: 'Left game successfully' });
  } catch (error) {
    next(error);
  }
};
