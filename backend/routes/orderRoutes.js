import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createOrder,
  confirmOrderPayment,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/confirm-payment', protect, confirmOrderPayment);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
