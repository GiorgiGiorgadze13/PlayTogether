import { Router } from 'express';
import {
  createGame,
  getAllGames,
  getGameById,
  joinGame,
  leaveGame,
} from '../controllers/gameController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/', authenticate, createGame);
router.post('/:id/join', authenticate, joinGame);
router.delete('/:id/leave', authenticate, leaveGame);

export default router;
