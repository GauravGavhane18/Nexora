import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', protect, authorize('admin', 'seller'), (req, res) => {
  res.json({ success: true, message: 'Analytics routes working' });
});

export default router;