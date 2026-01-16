import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin/Seller)
router.post('/', protect, authorize('admin', 'seller'), createProduct);
router.put('/:id', protect, authorize('admin', 'seller'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'seller'), deleteProduct);

export default router;
