import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });

        // Optional: Add product counts
        const categoriesWithCounts = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat._id, isActive: true, status: 'published' });
            return { ...cat.toObject(), count };
        }));

        res.json({
            success: true,
            data: { categories: categoriesWithCounts }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single category by slug
// @route   GET /api/v1/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Get products for this category
        const products = await Product.find({ category: category._id, isActive: true, status: 'published' })
            .populate('seller', 'firstName lastName businessName')
            .limit(100); // Reasonably high limit

        res.json({
            success: true,
            data: {
                category,
                products
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
