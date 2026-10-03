import { Router } from 'express';
import {
  getAllStadiums,
  getStadiumById,
  checkAvailability,
  searchVenues,
  getVenuePhoto,
} from '../controllers/stadiumController.js';

const router = Router();

router.get('/', getAllStadiums);
router.get('/search', searchVenues);
router.get('/photo', getVenuePhoto);
router.get('/:id', getStadiumById);
router.get('/:id/availability', checkAvailability);

export default router;
