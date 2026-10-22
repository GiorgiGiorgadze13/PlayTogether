import { Router } from 'express';
import authRoutes from './authRoutes.js';
import stadiumRoutes from './stadiumRoutes.js';
import gameRoutes from './gameRoutes.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import instructorBookingRoutes from './instructorBookingRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stadiums', stadiumRoutes);
router.use('/games', gameRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/instructor-bookings', instructorBookingRoutes);
router.use('/admin', adminRoutes);

export default router;

