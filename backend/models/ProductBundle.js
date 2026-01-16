import mongoose from 'mongoose';

const productBundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bundle name is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    isOptional: {
      type: Boolean,
      default: false
    }
  }],
  pricing: {
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    bundlePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'expired'],
    default: 'draft'
  },
  validFrom: Date,
  validUntil: Date,
  stock: {
    quantity: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    sold: {
      type: Number,
      default: 0
    }
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for savings amount
productBundleSchema.virtual('savingsAmount').get(function () {
  return this.pricing.originalPrice - this.pricing.bundlePrice;
});

// Virtual for availability
productBundleSchema.virtual('isAvailable').get(function () {
  const now = new Date();
  const validFrom = !this.validFrom || this.validFrom <= now;
  const validUntil = !this.validUntil || this.validUntil >= now;
  const inStock = this.stock.quantity === -1 || this.stock.quantity > this.stock.sold;

  return this.isActive && this.status === 'active' && validFrom && validUntil && inStock;
});

// Pre-save middleware to generate slug and calculate discount
productBundleSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }

  if (this.isModified('pricing')) {
    this.pricing.discountPercentage = Math.round(
      ((this.pricing.originalPrice - this.pricing.bundlePrice) / this.pricing.originalPrice) * 100
    );
  }

  next();
});

// Indexes
productBundleSchema.index({ slug: 1 });
productBundleSchema.index({ seller: 1 });
productBundleSchema.index({ status: 1, isActive: 1 });
productBundleSchema.index({ validFrom: 1, validUntil: 1 });

export default mongoose.model('ProductBundle', productBundleSchema);
