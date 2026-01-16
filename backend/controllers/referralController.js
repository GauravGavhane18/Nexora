import Referral from '../models/Referral.js';
import { LoyaltyPoint } from '../models/LoyaltyProgram.js';
import asyncHandler from 'express-async-handler';

// @desc    Get referral stats
// @route   GET /api/v1/referrals/stats
// @access  Private
export const getReferralStats = asyncHandler(async (req, res) => {
  let referral = await Referral.findOne({ referrer: req.user._id })
    .populate('referrals.referee', 'firstName lastName email');
  
  if (!referral) {
    return res.json({
      success: true,
      data: {
        referralCode: null,
        totalReferrals: 0,
        successfulReferrals: 0,
        totalRewardsEarned: 0,
        referrals: []
      }
    });
  }
  
  res.json({
    success: true,
    data: referral
  });
});

// @desc    Generate referral code
// @route   POST /api/v1/referrals/generate
// @access  Private
export const generateReferralCode = asyncHandler(async (req, res) => {
  let referral = await Referral.findOne({ referrer: req.user._id });
  
  if (referral) {
    return res.json({
      success: true,
      message: 'Referral code already exists',
      data: referral
    });
  }
  
  const code = await Referral.generateCode(req.user._id);
  
  referral = await Referral.create({
    referrer: req.user._id,
    referralCode: code
  });
  
  res.status(201).json({
    success: true,
    data: referral
  });
});

// @desc    Apply referral code
// @route   POST /api/v1/referrals/apply
// @access  Private
export const applyReferralCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  const referral = await Referral.findOne({ referralCode: code });
  
  if (!referral) {
    res.status(404);
    throw new Error('Invalid referral code');
  }
  
  // Check if user already used a referral
  const existingReferral = await Referral.findOne({
    'referrals.referee': req.user._id
  });
  
  if (existingReferral) {
    res.status(400);
    throw new Error('You have already used a referral code');
  }
  
  // Add referral
  await referral.addReferral(req.user._id);
  
  // Give welcome points to referee
  let loyaltyPoints = await LoyaltyPoint.findOne({ user: req.user._id });
  if (!loyaltyPoints) {
    loyaltyPoints = await LoyaltyPoint.create({ user: req.user._id });
  }
  
  await loyaltyPoints.addPoints(
    referral.settings.refereeReward,
    'Referral welcome bonus',
    referral._id,
    'Referral'
  );
  
  res.json({
    success: true,
    message: `Referral applied! You earned ${referral.settings.refereeReward} points`,
    data: { pointsEarned: referral.settings.refereeReward }
  });
});

// @desc    Get referral history
// @route   GET /api/v1/referrals/history
// @access  Private
export const getReferralHistory = asyncHandler(async (req, res) => {
  const referral = await Referral.findOne({ referrer: req.user._id })
    .populate('referrals.referee', 'firstName lastName email createdAt');
  
  if (!referral) {
    return res.json({
      success: true,
      data: []
    });
  }
  
  res.json({
    success: true,
    data: referral.referrals.sort((a, b) => b.signupDate - a.signupDate)
  });
});
