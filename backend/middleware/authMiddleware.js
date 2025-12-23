import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated or deleted.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`
      });
    }

    next();
  };
};

// Check if user is seller and approved
export const requireApprovedSeller = async (req, res, next) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Seller role required.'
      });
    }

    if (!req.user.sellerProfile || !req.user.sellerProfile.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Seller account is not approved yet.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during seller verification.'
    });
  }
};

// Check subscription access
export const checkSubscriptionAccess = (requiredTier = 'free') => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      // Free tier is always accessible
      if (requiredTier === 'free') {
        return next();
      }

      // Check if user has active subscription
      if (!user.subscription || user.subscription.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required to access this resource.',
          requiredTier
        });
      }

      // Get subscription plan details
      const SubscriptionPlan = (await import('../models/SubscriptionPlan.js')).default;
      const plan = await SubscriptionPlan.findById(user.subscription.plan);
      
      if (!plan) {
        return res.status(403).json({
          success: false,
          message: 'Invalid subscription plan.',
          requiredTier
        });
      }

      // Check tier hierarchy: free < pro < enterprise
      const tierHierarchy = { free: 0, pro: 1, enterprise: 2 };
      const userTierLevel = tierHierarchy[plan.tier];
      const requiredTierLevel = tierHierarchy[requiredTier];

      if (userTierLevel < requiredTierLevel) {
        return res.status(403).json({
          success: false,
          message: `${requiredTier} subscription or higher required.`,
          currentTier: plan.tier,
          requiredTier
        });
      }

      req.subscriptionPlan = plan;
      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during subscription verification.'
      });
    }
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive && !user.isDeleted && !user.isLocked) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};