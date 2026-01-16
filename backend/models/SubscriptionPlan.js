import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  isIncluded: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: null // null means unlimited
  }
});

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Plan description is required']
  },
  tier: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true
  },
  pricing: {
    monthly: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      },
      stripePriceId: String
    },
    yearly: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      },
      stripePriceId: String,
      discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0 // percentage discount
      }
    }
  },
  features: [featureSchema],
  limits: {
    productsAccess: {
      type: String,
      enum: ['basic', 'premium', 'all'],
      default: 'basic'
    },
    downloadLimit: {
      type: Number,
      default: null // null means unlimited
    },
    supportLevel: {
      type: String,
      enum: ['community', 'email', 'priority', 'dedicated'],
      default: 'community'
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    customBranding: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    }
  },
  trialPeriod: {
    days: {
      type: Number,
      default: 0
    },
    isEnabled: {
      type: Boolean,
      default: false
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  stripeProductId: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for yearly savings
subscriptionPlanSchema.virtual('yearlySavings').get(function() {
  if (this.pricing.yearly.discount > 0) {
    const monthlyTotal = this.pricing.monthly.amount * 12;
    const yearlyAmount = this.pricing.yearly.amount;
    return monthlyTotal - yearlyAmount;
  }
  return 0;
});

// Virtual for subscribers count
subscriptionPlanSchema.virtual('subscribersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'subscription.plan',
  count: true
});

// Pre-save middleware to generate slug
subscriptionPlanSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to get active plans
subscriptionPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, 'pricing.monthly.amount': 1 });
};

// Method to check if user has access to feature
subscriptionPlanSchema.methods.hasFeature = function(featureName) {
  const feature = this.features.find(f => f.name === featureName);
  return feature ? feature.isIncluded : false;
};

// Method to get feature limit
subscriptionPlanSchema.methods.getFeatureLimit = function(featureName) {
  const feature = this.features.find(f => f.name === featureName);
  return feature ? feature.limit : null;
};

// Index for better performance
subscriptionPlanSchema.index({ slug: 1 }, { unique: true });
subscriptionPlanSchema.index({ tier: 1 });
subscriptionPlanSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);