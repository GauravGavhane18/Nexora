import express from 'express';
import { protect, authorize, requireApprovedSeller } from '../middleware/authMiddleware.js';
import {
  getDashboard,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getOrders,
  updateOrderItemStatus,
  getAnalytics,
  updateProfile
} from '../controllers/sellerController.js';

const router = express.Router();

// All routes require seller authentication
router.use(protect);
router.use(authorize('seller'));

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.route('/products')
  .get(getProducts)
  .post(requireApprovedSeller, createProduct);

router.route('/products/:id')
  .get(getProduct)
  .put(requireApprovedSeller, updateProduct)
  .delete(requireApprovedSeller, deleteProduct);

router.post('/products/:id/images', requireApprovedSeller, uploadProductImages);

// Orders
router.get('/orders', getOrders);
router.put('/orders/:orderId/items/:itemId', updateOrderItemStatus);

// Analytics
router.get('/analytics', getAnalytics);

// Profile
router.put('/profile', updateProfile);

export default router;