import { LoyaltyPoint, Reward } from '../models/LoyaltyProgram.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user's loyalty points
// @route   GET /api/v1/loyalty/points
// @access  Private
export const getMyPoints = asyncHandler(async (req, res) => {
  let loyaltyPoints = await LoyaltyPoint.findOne({ user: req.user._id });
  
  if (!loyaltyPoints) {
    loyaltyPoints = await LoyaltyPoint.create({ user: req.user._id });
  }
  
  res.json({
    success: true,
    data: loyaltyPoints
  });
});

// @desc    Get points history
// @route   GET /api/v1/loyalty/history
// @access  Private
export const getPointsHistory = asyncHandler(async (req, res) => {
  const loyaltyPoints = await LoyaltyPoint.findOne({ user: req.user._id });
  
  if (!loyaltyPoints) {
    return res.json({
      success: true,
      data: []
    });
  }
  
  res.json({
    success: true,
    data: loyaltyPoints.history.sort((a, b) => b.createdAt - a.createdAt)
  });
});

// @desc    Get available rewards
// @route   GET /api/v1/loyalty/rewards
// @access  Private
export const getRewards = asyncHandler(async (req, res) => {
  const loyaltyPoints = await LoyaltyPoint.findOne({ user: req.user._id });
  const userTier = loyaltyPoints?.tier || 'bronze';
  
  const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
  
  const rewards = await Reward.find({
    isActive: true,
    $or: [
      { validUntil: { $gte: new Date() } },
      { validUntil: null }
    ]
  }).sort({ pointsCost: 1 });
  
  const availableRewards = rewards.filter(reward => 
    tierOrder[userTier] >= tierOrder[reward.minTier]
  );
  
  res.json({
    success: true,
    data: availableRewards
  });
});

// @desc    Redeem reward
// @route   POST /api/v1/loyalty/redeem/:rewardId
// @access  Private
export const redeemReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.rewardId);
  
  if (!reward || !reward.isActive) {
    res.status(404);
    throw new Error('Reward not found or inactive');
  }
  
  const loyaltyPoints = await LoyaltyPoint.findOne({ user: req.user._id });
  
  if (!loyaltyPoints || loyaltyPoints.points < reward.pointsCost) {
    res.status(400);
    throw new Error('Insufficient points');
  }
  
  // Check tier eligibility
  const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
  if (tierOrder[loyaltyPoints.tier] < tierOrder[reward.minTier]) {
    res.status(403);
    throw new Error('Your tier is not eligible for this reward');
  }
  
  // Redeem points
  await loyaltyPoints.redeemPoints(
    reward.pointsCost,
    `Redeemed: ${reward.name}`,
    reward._id
  );
  
  // Generate reward code
  const code = `RWD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  loyaltyPoints.rewards.push({
    reward: reward._id,
    redeemedAt: new Date(),
    code,
    status: 'active'
  });
  
  await loyaltyPoints.save();
  
  res.json({
    success: true,
    message: 'Reward redeemed successfully',
    data: { code, reward }
  });
});

// @desc    Create reward (Admin)
// @route   POST /api/v1/loyalty/rewards
// @access  Private/Admin
export const createReward = asyncHandler(async (req, res) => {
  const reward = await Reward.create(req.body);
  
  res.status(201).json({
    success: true,
    data: reward
  });
});

// @desc    Update reward (Admin)
// @route   PUT /api/v1/loyalty/rewards/:id
// @access  Private/Admin
export const updateReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  
  res.json({
    success: true,
    data: reward
  });
});

// @desc    Delete reward (Admin)
// @route   DELETE /api/v1/loyalty/rewards/:id
// @access  Private/Admin
export const deleteReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  
  await reward.deleteOne();
  
  res.json({
    success: true,
    message: 'Reward deleted'
  });
});
