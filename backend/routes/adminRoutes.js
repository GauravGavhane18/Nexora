import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboard,
  getUsers,
  updateUserStatus,
  updateSellerApproval,
  getProducts,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  updateProductStatus,
  getOrders,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users management
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/sellers/:id/approval', updateSellerApproval);

// Products management
router.get('/products', getProducts);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);
router.put('/products/:id/status', updateProductStatus);

// Orders management
router.get('/orders', getOrders);

// Categories management
router.route('/categories')
  .get(getCategories)
  .post(createCategory);

router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// Analytics
router.get('/analytics', getAnalytics);

export default router;