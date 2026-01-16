import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Confirm Payment (for verification)
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      }
    });
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get Stripe Publishable Key
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_demo',
    }
  });
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Find and update order
        const order = await Order.findOne({ 
          'payment.stripePaymentIntentId': paymentIntent.id 
        });
        
        if (order) {
          order.payment.status = 'succeeded';
          order.payment.paidAt = new Date();
          order.payment.transactionId = paymentIntent.id;
          order.orderStatus = 'confirmed';
          
          await order.save();
          console.log('Order updated:', order.orderNumber);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Find and update order
        const failedOrder = await Order.findOne({ 
          'payment.stripePaymentIntentId': failedPayment.id 
        });
        
        if (failedOrder) {
          failedOrder.payment.status = 'failed';
          failedOrder.orderStatus = 'cancelled';
          await failedOrder.save();
        }
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('Payment canceled:', canceledPayment.id);
        
        const canceledOrder = await Order.findOne({ 
          'payment.stripePaymentIntentId': canceledPayment.id 
        });
        
        if (canceledOrder) {
          canceledOrder.payment.status = 'cancelled';
          canceledOrder.orderStatus = 'cancelled';
          await canceledOrder.save();
        }
        break;

      case 'charge.refunded':
        const refund = event.data.object;
        console.log('Charge refunded:', refund.id);
        
        const refundedOrder = await Order.findOne({ 
          'payment.stripeChargeId': refund.id 
        });
        
        if (refundedOrder) {
          refundedOrder.payment.status = 'refunded';
          refundedOrder.payment.refundedAt = new Date();
          refundedOrder.payment.refundAmount = refund.amount_refunded / 100;
          await refundedOrder.save();
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Refund payment (Admin only)
router.post('/refund', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can process refunds'
      });
    }

    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer'
    });

    res.json({
      success: true,
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;
