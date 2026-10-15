import { Router } from 'express';
import { getMySubscription, subscribe, cancelSubscription } from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();

// All subscription routes require authentication
router.use(authenticate);

// GET  /api/subscriptions/my    — get current subscription + week usage
router.get('/my', getMySubscription);

// POST /api/subscriptions/subscribe — activate a plan
router.post('/subscribe', subscribe);

// DELETE /api/subscriptions/cancel  — cancel active subscription
router.delete('/cancel', cancelSubscription);

export default router;
