import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    public_id: String,
    url: String
  },
  icon: {
    type: String, // Font Awesome icon class or SVG
    default: 'fas fa-folder'
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0 // 0 for main categories, 1 for subcategories, etc.
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to get category hierarchy
categorySchema.statics.getHierarchy = async function() {
  const categories = await this.find({ isActive: true, isDeleted: false })
    .sort({ level: 1, sortOrder: 1 })
    .populate('subcategories');
  
  const buildTree = (categories, parentId = null) => {
    return categories
      .filter(cat => String(cat.parentCategory) === String(parentId))
      .map(cat => ({
        ...cat.toObject(),
        children: buildTree(categories, cat._id)
      }));
  };
  
  return buildTree(categories);
};

// Static method to get breadcrumb
categorySchema.statics.getBreadcrumb = async function(categoryId) {
  const breadcrumb = [];
  let currentCategory = await this.findById(categoryId);
  
  while (currentCategory) {
    breadcrumb.unshift({
      _id: currentCategory._id,
      name: currentCategory.name,
      slug: currentCategory.slug
    });
    
    if (currentCategory.parentCategory) {
      currentCategory = await this.findById(currentCategory.parentCategory);
    } else {
      break;
    }
  }
  
  return breadcrumb;
};

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ level: 1, sortOrder: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });

export default mongoose.model('Category', categorySchema);