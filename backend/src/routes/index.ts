import { Router } from 'express';
import authRoutes from './authRoutes.js';
import stadiumRoutes from './stadiumRoutes.js';
import gameRoutes from './gameRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stadiums', stadiumRoutes);
router.use('/games', gameRoutes);

export default router;
