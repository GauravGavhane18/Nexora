import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // For products without variants
  },
  name: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingInfo: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    stripePaymentIntentId: String,
    stripeCustomerId: String,
    stripeChargeId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    currency: {
      type: String,
      default: 'usd'
    }
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    internal: String
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  returnRequested: {
    type: Boolean,
    default: false
  },
  returnReason: String,
  returnStatus: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'processing', 'completed'],
    default: null
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order weight
orderSchema.virtual('totalWeight').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.product?.shipping?.weight || 0) * item.quantity;
  }, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `NEX-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status updated to ${newStatus}`,
    updatedBy
  });

  // Update specific timestamps
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }

  return this.save();
};

// Method to calculate commission for sellers
orderSchema.methods.calculateCommissions = async function() {
  for (let item of this.items) {
    const seller = await mongoose.model('User').findById(item.seller);
    if (seller && seller.sellerProfile) {
      const commissionRate = seller.sellerProfile.commission || 10;
      item.commission = (item.price * item.quantity * commissionRate) / 100;
    }
  }
  return this.save();
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ orderStatus: status })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .populate('items.seller', 'firstName lastName sellerProfile.businessName')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('items.product', 'name images slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get seller orders
orderSchema.statics.getSellerOrders = function(sellerId, limit = 50) {
  return this.find({ 'items.seller': sellerId })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Indexes for better performance
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'items.seller': 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);