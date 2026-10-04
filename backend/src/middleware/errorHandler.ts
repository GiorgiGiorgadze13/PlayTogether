import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err?.code === 'P2002') {
    res.status(409).json({ message: 'This stadium is already booked for this time slot.' });
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const detailedMsg = formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', ');
    res.status(400).json({ message: detailedMsg || 'Validation error', errors: formattedErrors });
    return;
  }

  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: err?.message || 'Internal server error.' });
};
