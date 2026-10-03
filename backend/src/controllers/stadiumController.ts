import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { searchGooglePlacesVenues } from '../services/googlePlaces.js';

export const getAllStadiums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sport } = req.query;

    const whereCondition = sport
      ? { sport: { equals: String(sport) } }
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

export const searchVenues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sport = String(req.query.sport || '');
    const query = String(req.query.query || '');

    // Search external Google Places or real venue dataset
    const places = await searchGooglePlacesVenues(query, sport);

    // Also include database stadiums matching sport
    const dbStadiums = await prisma.stadium.findMany({
      where: sport ? { sport: { equals: sport } } : {},
    });

    // Merge database stadiums into response if not already present
    const formattedDbStadiums = dbStadiums.map((st: any) => ({
      id: st.id,
      name: st.name,
      address: st.address || st.location,
      location: st.location,
      latitude: st.latitude || 41.7151,
      longitude: st.longitude || 44.8271,
      imageUrl: st.imageUrl,
      selectedPhotoUrl: st.selectedPhotoUrl || st.imageUrl,
      selectedPhotoAttribution: st.selectedPhotoAttribution || undefined,
      rating: st.rating || 4.7,
      placeId: st.placeId || st.id,
      sport: st.sport,
      price: st.price,
    }));

    // Combine unique by name/id
    const combined = [...places];
    for (const dbS of formattedDbStadiums) {
      if (!combined.some((p) => p.name.toLowerCase() === dbS.name.toLowerCase())) {
        combined.push(dbS);
      }
    }

    res.status(200).json({ venues: combined });
  } catch (error) {
    next(error);
  }
};

export const getVenuePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const photoRef = String(req.query.ref || '');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!photoRef || !apiKey) {
      res.redirect('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80');
      return;
    }

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${encodeURIComponent(
      photoRef
    )}&key=${apiKey}`;

    res.redirect(photoUrl);
  } catch (error) {
    res.redirect('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80');
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
        available: true,
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
        bookedSlots: existingGames,
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
      bookedSlots: existingGames,
    });
  } catch (error) {
    next(error);
  }
};
