import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getAdminStats, getAdminBookings, getAdminUsers } from '../controllers/adminController.js';

const router = Router();

// All admin routes require both valid JWT AND admin role
router.get('/stats', authenticate, requireAdmin, getAdminStats);
router.get('/bookings', authenticate, requireAdmin, getAdminBookings);
router.get('/users', authenticate, requireAdmin, getAdminUsers);

export default router;
