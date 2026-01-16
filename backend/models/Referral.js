import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  referrals: [{
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired'],
      default: 'pending'
    },
    signupDate: {
      type: Date,
      default: Date.now
    },
    firstPurchaseDate: Date,
    rewardEarned: {
      type: Number,
      default: 0
    },
    rewardType: {
      type: String,
      enum: ['points', 'discount', 'cashback']
    }
  }],
  totalReferrals: {
    type: Number,
    default: 0
  },
  successfulReferrals: {
    type: Number,
    default: 0
  },
  totalRewardsEarned: {
    type: Number,
    default: 0
  },
  settings: {
    referrerReward: {
      type: Number,
      default: 500 // points
    },
    refereeReward: {
      type: Number,
      default: 200 // points
    },
    expiryDays: {
      type: Number,
      default: 30
    }
  }
}, {
  timestamps: true
});

// Method to add referral
referralSchema.methods.addReferral = function (refereeId) {
  this.referrals.push({
    referee: refereeId,
    status: 'pending'
  });
  this.totalReferrals += 1;
  return this.save();
};

// Method to complete referral
referralSchema.methods.completeReferral = async function (refereeId, rewardAmount, rewardType) {
  const referral = this.referrals.find(r => r.referee.toString() === refereeId.toString());

  if (referral) {
    referral.status = 'completed';
    referral.firstPurchaseDate = new Date();
    referral.rewardEarned = rewardAmount;
    referral.rewardType = rewardType;

    this.successfulReferrals += 1;
    this.totalRewardsEarned += rewardAmount;

    return this.save();
  }

  throw new Error('Referral not found');
};

// Static method to generate unique code
referralSchema.statics.generateCode = async function (userId) {
  const code = `REF${userId.toString().slice(-6).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Check if code exists
  const existing = await this.findOne({ referralCode: code });
  if (existing) {
    return this.generateCode(userId); // Recursive call if collision
  }

  return code;
};

// Indexes
referralSchema.index({ referrer: 1 });

referralSchema.index({ 'referrals.referee': 1 });

export default mongoose.model('Referral', referralSchema);
