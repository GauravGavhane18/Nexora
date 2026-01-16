import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        url: String,
        publicId: String
    }],
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Prevent user from reviewing the same product twice
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Calculate average rating after save
reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

// Calculate average rating after remove
reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

// Static method to get avg rating and save
reviewSchema.statics.calculateAverageRating = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId, isDeleted: false, status: 'approved' }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                ratingCount: { $sum: 1 }
            }
        }
    ]);

    try {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            'ratings.average': stats[0]?.averageRating || 0,
            'ratings.count': stats[0]?.ratingCount || 0
        });
    } catch (err) {
        console.error(err);
    }
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
