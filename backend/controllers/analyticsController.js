import UserInteraction from '../models/UserInteraction.js';
import UserActivity from '../models/UserActivity.js';
import asyncHandler from 'express-async-handler';

export const logInteraction = asyncHandler(async (req, res) => {
    const { productId, action, metadata } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
        // For now, we only track logged in users for recommendations
        return res.status(200).json({ success: true, message: 'Anonymous interaction ignored' });
    }

    // Create interaction log
    await UserInteraction.create({
        userId,
        productId,
        action,
        metadata
    });

    // Update legacy UserActivity if needed (for views)
    if (action === 'view') {
        try {
            let activity = await UserActivity.findOne({ user: userId });
            if (!activity) {
                activity = await UserActivity.create({
                    user: userId,
                    productViews: [],
                    searches: [],
                    purchases: [],
                    cartAdditions: [],
                    wishlistAdditions: [],
                    preferences: { brands: [] }
                });
            }
            await activity.trackView(productId);
        } catch (err) {
            console.error("Error updating UserActivity:", err);
            // Don't fail the request just because legacy update failed
        }
    }

    res.status(201).json({ success: true });
});

export const getAnalytics = asyncHandler(async (req, res) => {
    res.json({ success: true, message: "Analytics Placeholder" });
});
