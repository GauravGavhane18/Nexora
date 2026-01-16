import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';
import { createNotification } from './notificationController.js';

// @desc    Create new order (after payment)
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentIntentId,
      promoCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.basePrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || { url: '', alt: product.name },
        price: product.basePrice,
        quantity: item.quantity,
        seller: product.seller
      });
    }

    // Calculate shipping (free for orders over $100)
    const shippingCost = subtotal >= 100 ? 0 : 10;
    
    // Calculate tax (10%)
    const tax = subtotal * 0.1;
    
    // Apply promo code discount if any
    let discount = 0;
    if (promoCode) {
      if (promoCode === 'SAVE10') discount = subtotal * 0.1;
      if (promoCode === 'SAVE20') discount = subtotal * 0.2;
    }

    const total = subtotal + shippingCost + tax - discount;

    // Create order with payment pending
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: 'stripe',
        status: 'processing',
        stripePaymentIntentId: paymentIntentId
      },
      pricing: {
        subtotal,
        shipping: shippingCost,
        tax,
        discount,
        total
      },
      orderStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Confirm order after successful payment
// @route   PUT /api/v1/orders/:id/confirm-payment
// @access  Private
export const confirmOrderPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.stripePaymentIntentId !== paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent mismatch'
      });
    }

    // Update order payment status
    order.payment.status = 'succeeded';
    order.payment.paidAt = new Date();
    order.orderStatus = 'confirmed';

    // Reduce inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory.quantity -= item.quantity;
        product.salesCount += item.quantity;
        await product.save();
      }
    }

    await order.save();

    // Send order confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Order Confirmation - NEXORA',
        template: 'orderConfirmation',
        data: {
          customerName: req.user.fullName,
          orderNumber: order.orderNumber,
          items: order.items,
          total: order.pricing.total,
          orderUrl: `${process.env.CLIENT_URL}/orders/${order._id}`
        }
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    // Create notification
    try {
      await createNotification(req.user._id, {
        type: 'order',
        title: 'Order Confirmed',
        message: `Your order ${order.orderNumber} has been confirmed`,
        link: `/orders/${order._id}`,
        priority: 'high'
      });
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }

    res.json({
      success: true,
      message: 'Payment confirmed and order updated',
      data: { order }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
};

// @desc    Get all orders for user
// @route   GET /api/v1/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt');

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.seller', 'firstName lastName businessName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status using the model method
    await order.updateStatus(status, note, req.user._id);

    // Update tracking info if provided
    if (trackingNumber) {
      order.items.forEach(item => {
        item.trackingInfo = {
          carrier: carrier || 'Standard',
          trackingNumber,
          trackingUrl: req.body.trackingUrl || ''
        };
      });
      await order.save();
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'confirmed', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory.quantity += item.quantity;
        product.salesCount -= item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Cancelled by customer'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders/admin/all
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.orderStatus = req.query.status;
    if (req.query.paymentStatus) query['payment.status'] = req.query.paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};
