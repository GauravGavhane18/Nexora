import ProductBundle from '../models/ProductBundle.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all bundles
// @route   GET /api/v1/bundles
// @access  Public
export const getBundles = asyncHandler(async (req, res) => {
  const { category, status, sort } = req.query;
  
  const query = { isActive: true };
  
  if (category) query.category = category;
  if (status) query.status = status;
  
  let bundles = ProductBundle.find(query)
    .populate('products.product', 'name images basePrice')
    .populate('seller', 'firstName lastName sellerProfile.businessName')
    .populate('category', 'name');
  
  if (sort === 'popular') {
    bundles = bundles.sort({ salesCount: -1 });
  } else if (sort === 'newest') {
    bundles = bundles.sort({ createdAt: -1 });
  } else if (sort === 'discount') {
    bundles = bundles.sort({ 'pricing.discountPercentage': -1 });
  }
  
  const results = await bundles;
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get single bundle
// @route   GET /api/v1/bundles/:id
// @access  Public
export const getBundle = asyncHandler(async (req, res) => {
  const bundle = await ProductBundle.findById(req.params.id)
    .populate('products.product')
    .populate('seller', 'firstName lastName sellerProfile.businessName')
    .populate('category', 'name');
  
  if (!bundle) {
    res.status(404);
    throw new Error('Bundle not found');
  }
  
  // Increment views
  bundle.viewsCount += 1;
  await bundle.save();
  
  res.json({
    success: true,
    data: bundle
  });
});

// @desc    Create bundle
// @route   POST /api/v1/bundles
// @access  Private/Seller
export const createBundle = asyncHandler(async (req, res) => {
  const bundleData = {
    ...req.body,
    seller: req.user._id
  };
  
  const bundle = await ProductBundle.create(bundleData);
  
  res.status(201).json({
    success: true,
    data: bundle
  });
});

// @desc    Update bundle
// @route   PUT /api/v1/bundles/:id
// @access  Private/Seller
export const updateBundle = asyncHandler(async (req, res) => {
  let bundle = await ProductBundle.findById(req.params.id);
  
  if (!bundle) {
    res.status(404);
    throw new Error('Bundle not found');
  }
  
  // Check ownership
  if (bundle.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this bundle');
  }
  
  bundle = await ProductBundle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.json({
    success: true,
    data: bundle
  });
});

// @desc    Delete bundle
// @route   DELETE /api/v1/bundles/:id
// @access  Private/Seller
export const deleteBundle = asyncHandler(async (req, res) => {
  const bundle = await ProductBundle.findById(req.params.id);
  
  if (!bundle) {
    res.status(404);
    throw new Error('Bundle not found');
  }
  
  // Check ownership
  if (bundle.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this bundle');
  }
  
  await bundle.deleteOne();
  
  res.json({
    success: true,
    message: 'Bundle deleted'
  });
});

// @desc    Get seller bundles
// @route   GET /api/v1/bundles/seller/my-bundles
// @access  Private/Seller
export const getSellerBundles = asyncHandler(async (req, res) => {
  const bundles = await ProductBundle.find({ seller: req.user._id })
    .populate('products.product', 'name images')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: bundles.length,
    data: bundles
  });
});
