import Auction from '../models/Auction.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all auctions
// @route   GET /api/v1/auctions
// @access  Public
export const getAuctions = asyncHandler(async (req, res) => {
  const { status = 'active', sort } = req.query;
  
  const query = { status };
  
  let auctions = Auction.find(query)
    .populate('product', 'name images')
    .populate('seller', 'firstName lastName sellerProfile.businessName');
  
  if (sort === 'ending-soon') {
    auctions = auctions.sort({ endTime: 1 });
  } else if (sort === 'newest') {
    auctions = auctions.sort({ createdAt: -1 });
  } else if (sort === 'popular') {
    auctions = auctions.sort({ viewsCount: -1 });
  }
  
  const results = await auctions;
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get single auction
// @route   GET /api/v1/auctions/:id
// @access  Public
export const getAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id)
    .populate('product')
    .populate('seller', 'firstName lastName sellerProfile.businessName')
    .populate('bids.bidder', 'firstName lastName')
    .populate('winner', 'firstName lastName');
  
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  
  // Increment views
  auction.viewsCount += 1;
  await auction.save();
  
  res.json({
    success: true,
    data: auction
  });
});

// @desc    Create auction
// @route   POST /api/v1/auctions
// @access  Private/Seller
export const createAuction = asyncHandler(async (req, res) => {
  const auctionData = {
    ...req.body,
    seller: req.user._id
  };
  
  const auction = await Auction.create(auctionData);
  
  res.status(201).json({
    success: true,
    data: auction
  });
});

// @desc    Place bid
// @route   POST /api/v1/auctions/:id/bid
// @access  Private
export const placeBid = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  const auction = await Auction.findById(req.params.id);
  
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  
  if (auction.seller.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot bid on your own auction');
  }
  
  try {
    await auction.placeBid(req.user._id, amount);
    
    // Emit socket event
    if (req.io) {
      req.io.to(`auction_${auction._id}`).emit('new_bid', {
        auctionId: auction._id,
        amount,
        bidder: req.user.firstName
      });
    }
    
    res.json({
      success: true,
      message: 'Bid placed successfully',
      data: auction
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Watch auction
// @route   POST /api/v1/auctions/:id/watch
// @access  Private
export const watchAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  
  const index = auction.watchers.indexOf(req.user._id);
  
  if (index > -1) {
    auction.watchers.splice(index, 1);
  } else {
    auction.watchers.push(req.user._id);
  }
  
  await auction.save();
  
  res.json({
    success: true,
    watching: index === -1
  });
});

// @desc    Get user's bids
// @route   GET /api/v1/auctions/my/bids
// @access  Private
export const getMyBids = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({
    'bids.bidder': req.user._id
  })
  .populate('product', 'name images')
  .sort({ 'bids.timestamp': -1 });
  
  res.json({
    success: true,
    count: auctions.length,
    data: auctions
  });
});

// @desc    Get seller's auctions
// @route   GET /api/v1/auctions/my/auctions
// @access  Private/Seller
export const getMyAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ seller: req.user._id })
    .populate('product', 'name images')
    .populate('winner', 'firstName lastName email')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: auctions.length,
    data: auctions
  });
});
