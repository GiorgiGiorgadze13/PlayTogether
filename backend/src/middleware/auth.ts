import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/express.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-playtogether-2026';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. Please provide a valid Bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'USER',
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
    return;
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required.' });
    return;
  }
  next();
};
