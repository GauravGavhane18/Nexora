import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig,
  refundPayment,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/config', getStripeConfig);
router.post('/refund', protect, refundPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
