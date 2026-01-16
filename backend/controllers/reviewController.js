import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Add product review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      status: 'delivered'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.fullName,
      rating: Number(rating),
      comment,
      title,
      verified: true
    };

    product.reviews.push(review);

    // Update ratings
    product.ratings.count = product.reviews.length;
    product.ratings.average = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/v1/products/:id/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        reviews: product.reviews,
        ratings: product.ratings
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// @desc    Update review
// @route   PUT /api/v1/products/:id/reviews/:reviewId
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const { id: productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.title = title || review.title;

    // Recalculate ratings
    product.ratings.average = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/products/:id/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    review.remove();

    // Recalculate ratings
    product.ratings.count = product.reviews.length;
    product.ratings.average = product.reviews.length > 0
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
      : 0;

    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/v1/products/:id/reviews/:reviewId/helpful
// @access  Private
export const markReviewHelpful = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpful.includes(req.user._id);

    if (alreadyMarked) {
      // Remove from helpful
      review.helpful = review.helpful.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Add to helpful
      review.helpful.push(req.user._id);
    }

    await product.save();

    res.json({
      success: true,
      message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
      data: { helpfulCount: review.helpful.length }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};
