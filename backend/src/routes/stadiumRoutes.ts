import { Router } from 'express';
import {
  getAllStadiums,
  getStadiumById,
  checkAvailability,
} from '../controllers/stadiumController.js';

const router = Router();

router.get('/', getAllStadiums);
router.get('/:id', getStadiumById);
router.get('/:id/availability', checkAvailability);

export default router;
