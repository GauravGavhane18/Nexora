import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { logInteraction, getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/interaction', protect, logInteraction);
router.get('/', protect, authorize('admin', 'seller'), getAnalytics);

export default router;