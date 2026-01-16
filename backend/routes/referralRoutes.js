import express from 'express';
import {
  getReferralStats,
  generateReferralCode,
  applyReferralCode,
  getReferralHistory
} from '../controllers/referralController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getReferralStats);
router.post('/generate', generateReferralCode);
router.post('/apply', applyReferralCode);
router.get('/history', getReferralHistory);

export default router;
