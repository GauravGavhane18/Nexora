import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';


export const getDashboard = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalSellers = await User.countDocuments({ role: 'seller', isDeleted: false });
    const pendingSellers = await User.countDocuments({
      role: 'seller',
      'sellerProfile.isApproved': false,
      isDeleted: false
    });

    // Get product statistics
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const publishedProducts = await Product.countDocuments({ status: 'published' });

    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    // Calculate revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $in: ['delivered', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalCommission: {
            $sum: {
              $reduce: {
                input: '$items',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.commission'] }
              }
            }
          }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalCommission: 0 };

    // Get recent activities
    const recentUsers = await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');

    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber user pricing.total orderStatus createdAt');

    const recentProducts = await Product.find()
      .populate('seller', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name seller status createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: {
            total: totalUsers,
            sellers: totalSellers,
            pendingSellers
          },
          products: {
            total: totalProducts,
            pending: pendingProducts,
            published: publishedProducts
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            completed: completedOrders
          },
          revenue: {
            total: revenue.totalRevenue,
            commission: revenue.totalCommission
          }
        },
        recentActivities: {
          users: recentUsers,
          orders: recentOrders,
          products: recentProducts
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { role, status, search } = req.query;

    // Build query
    const query = { isDeleted: false };

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
};

// @desc    Approve/reject seller
// @route   PUT /api/v1/admin/sellers/:id/approval
// @access  Private (Admin)
export const updateSellerApproval = async (req, res) => {
  try {
    const { isApproved, rejectionReason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'seller') {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    user.sellerProfile.isApproved = isApproved;
    user.sellerProfile.approvedAt = isApproved ? new Date() : null;

    if (!isApproved && rejectionReason) {
      user.sellerProfile.rejectionReason = rejectionReason;
    }

    await user.save();

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      data: user,
      message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Update seller approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating seller approval'
    });
  }
};

// @desc    Get all products
// @route   GET /api/v1/admin/products
// @access  Private (Admin)
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, category, seller, search } = req.query;

    // Build query
    const query = { isDeleted: false };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (seller) {
      query.seller = seller;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'firstName lastName email')
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

// @desc    Create product (Admin)
// @route   POST /api/v1/admin/products
// @access  Private (Admin)
export const createProductAdmin = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.body.seller || req.user._id,
      createdBy: req.user._id,
      status: 'published',
      approvedBy: req.user._id,
      approvedAt: new Date(),
      publishedAt: new Date()
    };

    const product = await Product.create(productData);

    // Emit socket event
    req.io.emit('product_created', {
      product: {
        _id: product._id,
        name: product.name,
        seller: req.user._id,
        status: product.status,
        createdAt: product.createdAt
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/v1/admin/products/:id
// @access  Private (Admin)
export const updateProductAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/v1/admin/products/:id
// @access  Private (Admin)
export const deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

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

// @desc    Update product status
// @route   PUT /api/v1/admin/products/:id/status
// @access  Private (Admin)
export const updateProductStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'rejected' && rejectionReason && { rejectionReason })
      },
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName email');

    if (product) {
      req.io.emit('product_status_updated', {
        productId: product._id,
        status: status
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      data: product,
      message: `Product ${status} successfully`
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product status'
    });
  }
};

// @desc    Get all orders
// @route   GET /api/v1/admin/orders
// @access  Private (Admin)
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search, dateFrom, dateTo } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.seller', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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

// @desc    Get all categories
// @route   GET /api/v1/admin/categories
// @access  Private (Admin)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name')
      .sort({ level: 1, sortOrder: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// @desc    Create category
// @route   POST /api/v1/admin/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/v1/admin/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parentCategory: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing subcategories'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Sales analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // User growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          users: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top categories
    const topCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          name: '$category.name',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Top sellers
    const topSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.seller',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $unwind: '$seller'
      },
      {
        $project: {
          name: { $concat: ['$seller.firstName', ' ', '$seller.lastName'] },
          email: '$seller.email',
          totalSales: 1,
          totalOrders: 1
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
        userGrowth,
        topCategories,
        topSellers,
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