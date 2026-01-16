import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productViews: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewCount: {
      type: Number,
      default: 1
    },
    lastViewed: {
      type: Date,
      default: Date.now
    },
    timeSpent: Number // seconds
  }],
  searches: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    resultsClicked: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      position: Number
    }]
  }],
  purchases: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    amount: Number
  }],
  cartAdditions: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlistAdditions: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    favoriteCategories: [{
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },
      score: {
        type: Number,
        default: 0
      }
    }],
    priceRange: {
      min: Number,
      max: Number
    },
    brands: [String]
  }
}, {
  timestamps: true
});

userActivitySchema.methods.trackView = function (productId, timeSpent = 0) {
  const existing = this.productViews.find(v => v.product.toString() === productId.toString());
  if (existing) {
    existing.viewCount += 1;
    existing.lastViewed = new Date();
    existing.timeSpent = (existing.timeSpent || 0) + timeSpent;
  } else {
    this.productViews.push({ product: productId, timeSpent });
  }
  return this.save();
};

userActivitySchema.methods.trackSearch = function (query, clickedProducts = []) {
  this.searches.push({
    query,
    resultsClicked: clickedProducts
  });
  if (this.searches.length > 100) {
    this.searches = this.searches.slice(-100);
  }
  return this.save();
};

userActivitySchema.methods.getPersonalizedScore = function (product) {
  let score = 0;

  // View history
  const view = this.productViews.find(v => v.product.toString() === product._id.toString());
  if (view) {
    score += view.viewCount * 2;
    score += (view.timeSpent || 0) / 10;
  }

  // Purchase history
  const purchased = this.purchases.some(p => p.product.toString() === product._id.toString());
  if (purchased) score += 50;

  // Category preference
  const categoryPref = this.preferences.favoriteCategories.find(
    c => c.category.toString() === product.category.toString()
  );
  if (categoryPref) score += categoryPref.score;

  return score;
};


userActivitySchema.index({ 'productViews.product': 1 });
userActivitySchema.index({ 'purchases.product': 1 });

export default mongoose.model('UserActivity', userActivitySchema);
