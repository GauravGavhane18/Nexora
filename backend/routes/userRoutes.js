import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/profile', protect, (req, res) => {
  res.json({ success: true, message: 'User routes working', user: req.user });
});

export default router;