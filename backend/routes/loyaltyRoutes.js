import express from 'express';
import {
  getMyPoints,
  getPointsHistory,
  getRewards,
  redeemReward,
  createReward,
  updateReward,
  deleteReward
} from '../controllers/loyaltyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/points', getMyPoints);
router.get('/history', getPointsHistory);
router.get('/rewards', getRewards);
router.post('/redeem/:rewardId', redeemReward);

// Admin routes
router.use(authorize('admin'));
router.post('/rewards', createReward);
router.put('/rewards/:id', updateReward);
router.delete('/rewards/:id', deleteReward);

export default router;
