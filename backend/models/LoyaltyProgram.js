import mongoose from 'mongoose';

const loyaltyPointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  lifetimePoints: {
    type: Number,
    default: 0
  },
  history: [{
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired', 'adjusted'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    reason: String,
    reference: {
      type: String, // Order ID, Review ID, etc.
    },
    referenceModel: {
      type: String,
      enum: ['Order', 'Review', 'Referral', 'Manual']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  rewards: [{
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    redeemedAt: Date,
    usedAt: Date,
    code: String,
    status: {
      type: String,
      enum: ['active', 'used', 'expired'],
      default: 'active'
    }
  }]
}, {
  timestamps: true
});

// Method to add points
loyaltyPointSchema.methods.addPoints = function(points, reason, reference, referenceModel) {
  this.points += points;
  this.lifetimePoints += points;
  
  this.history.push({
    type: 'earned',
    points,
    reason,
    reference,
    referenceModel,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  });
  
  // Update tier based on lifetime points
  if (this.lifetimePoints >= 10000) {
    this.tier = 'platinum';
  } else if (this.lifetimePoints >= 5000) {
    this.tier = 'gold';
  } else if (this.lifetimePoints >= 2000) {
    this.tier = 'silver';
  }
  
  return this.save();
};

// Method to redeem points
loyaltyPointSchema.methods.redeemPoints = function(points, reason, reference) {
  if (this.points < points) {
    throw new Error('Insufficient points');
  }
  
  this.points -= points;
  
  this.history.push({
    type: 'redeemed',
    points: -points,
    reason,
    reference
  });
  
  return this.save();
};

// Static method to calculate points for order
loyaltyPointSchema.statics.calculateOrderPoints = function(orderTotal) {
  // 1 point per dollar spent
  return Math.floor(orderTotal);
};

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['discount', 'free-shipping', 'free-product', 'cashback'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  valueType: {
    type: String,
    enum: ['percentage', 'fixed', 'points'],
    default: 'fixed'
  },
  pointsCost: {
    type: Number,
    required: true,
    min: 0
  },
  minTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  stock: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  validFrom: Date,
  validUntil: Date,
  terms: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const LoyaltyPoint = mongoose.model('LoyaltyPoint', loyaltyPointSchema);
export const Reward = mongoose.model('Reward', rewardSchema);
