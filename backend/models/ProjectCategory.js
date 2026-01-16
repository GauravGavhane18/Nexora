import mongoose from 'mongoose';

const projectCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  icon: {
    type: String,
    default: 'fas fa-project-diagram'
  },
  color: {
    type: String,
    default: '#3B82F6' // Tailwind blue-500
  },
  image: {
    public_id: String,
    url: String
  },
  useCases: [{
    title: String,
    description: String,
    example: String
  }],
  targetAudience: [{
    type: String,
    enum: ['developers', 'designers', 'marketers', 'students', 'businesses', 'agencies', 'freelancers']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  estimatedTime: {
    min: Number, // in hours
    max: Number
  },
  requiredSkills: [String],
  relatedCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  sortOrder: {
    type: Number,
    default: 0
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

// Virtual for products count
projectCategorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'projectCategory',
  count: true
});

// Pre-save middleware to generate slug
projectCategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to get active project categories
projectCategorySchema.statics.getActive = function() {
  return this.find({ isActive: true, isDeleted: false })
    .sort({ sortOrder: 1, name: 1 })
    .populate('relatedCategories', 'name slug');
};

// Static method to get categories by target audience
projectCategorySchema.statics.getByAudience = function(audience) {
  return this.find({
    targetAudience: audience,
    isActive: true,
    isDeleted: false
  })
  .sort({ sortOrder: 1, name: 1 });
};

// Static method to get categories by difficulty
projectCategorySchema.statics.getByDifficulty = function(difficulty) {
  return this.find({
    difficulty: difficulty,
    isActive: true,
    isDeleted: false
  })
  .sort({ sortOrder: 1, name: 1 });
};

// Method to get related products
projectCategorySchema.methods.getRelatedProducts = function(limit = 10) {
  return mongoose.model('Product').find({
    projectCategory: this._id,
    status: 'published',
    isActive: true,
    isDeleted: false
  })
  .populate('category subCategory seller', 'name firstName lastName')
  .sort({ 'ratings.average': -1, salesCount: -1 })
  .limit(limit);
};

// Index for better performance
projectCategorySchema.index({ slug: 1 }, { unique: true });
projectCategorySchema.index({ targetAudience: 1 });
projectCategorySchema.index({ difficulty: 1 });
projectCategorySchema.index({ isActive: 1, isDeleted: 1 });
projectCategorySchema.index({ sortOrder: 1, name: 1 });

export default mongoose.model('ProjectCategory', projectCategorySchema);