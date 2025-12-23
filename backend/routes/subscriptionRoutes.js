import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/plans', (req, res) => {
  res.json({ success: true, message: 'Subscription routes working', plans: [] });
});

export default router;