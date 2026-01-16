import express from 'express';
import {
  getBundles,
  getBundle,
  createBundle,
  updateBundle,
  deleteBundle,
  getSellerBundles
} from '../controllers/bundleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBundles);

// Protected routes - must come before /:id to avoid route conflicts
router.get('/seller/my-bundles', protect, authorize('seller', 'admin'), getSellerBundles);

// Dynamic ID route must come last
router.get('/:id', getBundle);

// Protected modification routes
router.use(protect);
router.use(authorize('seller', 'admin'));

router.post('/', createBundle);
router.put('/:id', updateBundle);
router.delete('/:id', deleteBundle);

export default router;
