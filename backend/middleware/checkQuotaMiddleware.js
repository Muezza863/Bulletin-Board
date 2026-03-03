import { User, Post } from "../models/index.js";

const checkQuota = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    // Check if user is admin or premium
    const isPremiumActive = user.role === 'premium' && (user.premiumUntil > new Date());

    if (user.role === 'admin' || isPremiumActive) {
        return next();
    }

    // Check if user is free and has reached the maximum number of posts allowed per month
    const startOfMonth = new Date();
    startOfMonth.setHours(0, 0, 0, 0);
    startOfMonth.setDate(1);
    const postCount = await Post.countDocuments({
        userId: req.user.id,
        isDeleted: false,
        createdAt: {
            $gte: startOfMonth
        }
    });
    if (postCount >= 5) {
        return res.status(400).json({ message: "You have reached the maximum number of posts allowed per month." });
    }
    next();
}

export default checkQuota;
