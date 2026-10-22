import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const createBookingSchema = z.object({
  instructorId: z.string().min(1, 'Instructor ID is required'),
  instructorName: z.string().min(1, 'Instructor name is required'),
  sport: z.string().min(1, 'Sport is required'),
  lessonType: z.enum(['1-on-1', 'Group Coaching']),
  slot: z.string().min(1, 'Time slot is required'),
  amount: z.number().positive('Amount must be a positive number'),
  notes: z.string().optional(),
});

export const createInstructorBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const data = createBookingSchema.parse(req.body);

    // Check for duplicate booking: same user, same instructor, same slot
    const existing = await prisma.instructorBooking.findFirst({
      where: {
        userId: req.user.userId,
        instructorId: data.instructorId,
        slot: data.slot,
        status: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      throw new AppError('You already have a booking for this slot with this instructor', 409);
    }

    // Check if the slot is taken by any user with this instructor (slot conflict)
    const slotConflict = await prisma.instructorBooking.findFirst({
      where: {
        instructorId: data.instructorId,
        slot: data.slot,
        lessonType: '1-on-1',
        status: { not: 'CANCELLED' },
      },
    });

    if (slotConflict && data.lessonType === '1-on-1') {
      throw new AppError(
        'This 1-on-1 slot is already booked with this instructor. Please choose another slot.',
        409
      );
    }

    const booking = await prisma.instructorBooking.create({
      data: {
        userId: req.user.userId,
        instructorId: data.instructorId,
        instructorName: data.instructorName,
        sport: data.sport,
        lessonType: data.lessonType,
        slot: data.slot,
        amount: data.amount,
        notes: data.notes,
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyInstructorBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const bookings = await prisma.instructorBooking.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};
