import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryService.js';

// @desc    Get seller dashboard data
// @route   GET /api/v1/seller/dashboard
// @access  Private (Seller)
export const getDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get seller's products count
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ 
      seller: sellerId, 
      status: 'published',
      isActive: true 
    });

    // Get seller's orders
    const totalOrders = await Order.countDocuments({ 'items.seller': sellerId });
    const pendingOrders = await Order.countDocuments({ 
      'items.seller': sellerId,
      'items.status': 'pending'
    });

    // Calculate revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $in: ['delivered', 'completed'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': sellerId
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { 
            $sum: { 
              $multiply: ['$items.price', '$items.quantity'] 
            } 
          },
          totalCommission: { $sum: '$items.commission' }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalCommission: 0 };
    const netRevenue = revenue.totalRevenue - revenue.totalCommission;

    // Get recent orders
    const recentOrders = await Order.find({ 'items.seller': sellerId })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber user items pricing orderStatus createdAt');

    // Get low stock products
    const lowStockProducts = await Product.find({
      seller: sellerId,
      'variants.inventory.quantity': { $lte: 10 },
      'variants.inventory.trackQuantity': true,
      isActive: true
    }).limit(5).select('name variants.inventory.quantity variants.name');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts,
          activeProducts,
          totalOrders,
          pendingOrders,
          revenue: netRevenue,
          commission: revenue.totalCommission
        },
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Seller dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

// @desc    Get seller's products
// @route   GET /api/v1/seller/products
// @access  Private (Seller)
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, search, category } = req.query;
    
    // Build query
    const query = { seller: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/v1/seller/products/:id
// @access  Private (Seller)
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    }).populate('category subCategory');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};

// @desc    Create new product
// @route   POST /api/v1/seller/products
// @access  Private (Seller)
export const createProduct = async (req, res) => {
  try {
    // Check if seller is approved
    if (!req.user.sellerProfile?.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your seller account must be approved before you can create products'
      });
    }

    const productData = {
      ...req.body,
      seller: req.user._id,
      status: 'draft' // All new products start as draft
    };

    // Generate slug from name
    if (productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/v1/seller/products/:id
// @access  Private (Seller)
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update slug if name changed
    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category subCategory');

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/seller/products/:id
// @access  Private (Seller)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product has pending orders
    const pendingOrders = await Order.countDocuments({
      'items.product': product._id,
      'items.status': { $in: ['pending', 'confirmed', 'processing'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with pending orders'
      });
    }

    // Delete product images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          await deleteFromCloudinary(image.public_id);
        }
      }
    }

    // Delete variant images
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          for (const image of variant.images) {
            if (image.public_id) {
              await deleteFromCloudinary(image.public_id);
            }
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// @desc    Upload product images
// @route   POST /api/v1/seller/products/:id/images
// @access  Private (Seller)
export const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, {
        folder: `nexora/products/${product._id}`,
        transformation: [
          { width: 800, height: 800, crop: 'fill', quality: 'auto' }
        ]
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
        alt: req.body.alt || product.name
      });
    }

    product.images = [...(product.images || []), ...uploadedImages];
    await product.save();

    res.status(200).json({
      success: true,
      data: uploadedImages,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images'
    });
  }
};

// @desc    Get seller's orders
// @route   GET /api/v1/seller/orders
// @access  Private (Seller)
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, search } = req.query;
    
    // Build query
    const query = { 'items.seller': req.user._id };
    
    if (status) {
      query['items.status'] = status;
    }
    
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter items to only show seller's items
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => 
        item.seller.toString() === req.user._id.toString()
      )
    }));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders: filteredOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// @desc    Update order item status
// @route   PUT /api/v1/seller/orders/:orderId/items/:itemId
// @access  Private (Seller)
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status, trackingInfo } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    // Check if seller owns this item
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order item'
      });
    }

    // Update item status
    item.status = status;
    if (trackingInfo) {
      item.trackingInfo = trackingInfo;
    }

    // Add status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: `Item ${item.name} status updated by seller`
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order item status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// @desc    Get seller analytics
// @route   GET /api/v1/seller/analytics
// @access  Private (Seller)
export const getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { period = '30' } = req.query; // days
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Sales analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': sellerId
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
          quantity: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': sellerId
        }
      },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        topProducts,
        period: parseInt(period)
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};

// @desc    Update seller profile
// @route   PUT /api/v1/seller/profile
// @access  Private (Seller)
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'avatar',
      'sellerProfile.businessName', 'sellerProfile.businessType',
      'sellerProfile.businessDescription', 'sellerProfile.website',
      'sellerProfile.socialMedia', 'sellerProfile.bankAccount'
    ];

    const updateData = {};
    
    // Filter allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};