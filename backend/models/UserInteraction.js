import mongoose from 'mongoose';

const userInteractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    action: {
        type: String,
        enum: ['view', 'add_to_cart', 'purchase', 'like'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true // adds createdAt, updatedAt automatically
});

// Compound index for efficient querying of user history
userInteractionSchema.index({ userId: 1, action: 1, timestamp: -1 });

export default mongoose.model('UserInteraction', userInteractionSchema);
