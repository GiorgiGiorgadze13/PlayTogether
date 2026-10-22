import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createInstructorBooking,
  getMyInstructorBookings,
} from '../controllers/instructorBookingController.js';

const router = Router();

// All instructor booking routes require authentication
router.post('/', authenticate, createInstructorBooking);
router.get('/my', authenticate, getMyInstructorBookings);

export default router;
