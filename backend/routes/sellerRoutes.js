import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/dashboard', protect, authorize('seller'), (req, res) => {
  res.json({ success: true, message: 'Seller routes working' });
});

export default router;