import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const createGameSchema = z.object({
  stadiumId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'startTime must be HH:mm format (e.g. 20:00)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'endTime must be HH:mm format (e.g. 22:00)'),
  title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
  maxPlayers: z.number().int().min(1).max(100).optional(),
  selectedPhotoUrl: z.string().optional(),
  selectedPhotoAttribution: z.string().optional(),
  venueName: z.string().optional(),
  venueLocation: z.string().optional(),
  venueAddress: z.string().optional(),
  sport: z.string().optional(),
});

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const {
      stadiumId,
      date,
      startTime,
      endTime,
      title,
      maxPlayers,
      selectedPhotoUrl,
      selectedPhotoAttribution,
      venueName,
      venueLocation,
      venueAddress,
      sport,
    } = createGameSchema.parse(req.body);

    if (startTime >= endTime) {
      throw new AppError('startTime must be earlier than endTime', 400);
    }

    // Verify or auto-create stadium if external Google Place
    let stadium = await prisma.stadium.findUnique({
      where: { id: stadiumId },
    });

    if (!stadium) {
      stadium = await (prisma.stadium.create as any)({
        data: {
          id: stadiumId,
          name: venueName || 'Sports Stadium',
          description: 'Booked via PlayTogether',
          location: venueLocation || 'Tbilisi',
          address: venueAddress || venueLocation || 'Tbilisi',
          sport: sport || 'Football',
          imageUrl: selectedPhotoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
          selectedPhotoUrl: selectedPhotoUrl || null,
          selectedPhotoAttribution: selectedPhotoAttribution || null,
          price: 15.0,
        },
      });
    }

    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const startOfDay =
      !isNaN(year) && !isNaN(month) && !isNaN(day)
        ? new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
        : new Date(new Date(date).setHours(0, 0, 0, 0));

    const endOfDay =
      !isNaN(year) && !isNaN(month) && !isNaN(day)
        ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
        : new Date(new Date(date).setHours(23, 59, 59, 999));

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
          title: title || `${stadium?.sport || sport || 'Sports'} Match at ${stadium?.name || venueName || 'Stadium'}`,
          maxPlayers: (maxPlayers || 10) as any,
          selectedPhotoUrl: selectedPhotoUrl || null,
          selectedPhotoAttribution: selectedPhotoAttribution || null,
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
        sport: { equals: String(sport) },
      };
    }

    if (date) {
      const dateStr = String(date);
      const [yearStr, monthStr, dayStr] = dateStr.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        where.date = {
          gte: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
          lte: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)),
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

    const updatedGame = await prisma.$transaction(async (tx) => {
      const game = await tx.game.findUnique({
        where: { id },
        include: { players: true },
      });

      if (!game) {
        throw new AppError('Game not found', 404);
      }

      if (game.status !== 'UPCOMING') {
        throw new AppError('Cannot join a game that is not upcoming', 400);
      }

      const maxLimit = (game as any).maxPlayers || 10;
      if (game.players.length >= maxLimit) {
        throw new AppError('Game is full. Cannot join this match.', 400);
      }

      const existingPlayer = await tx.gamePlayer.findUnique({
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

      await tx.gamePlayer.create({
        data: {
          gameId: id,
          userId,
        },
      });

      return tx.game.findUnique({
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
