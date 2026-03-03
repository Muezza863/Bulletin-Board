import { User, Post } from "../models/index.js";

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

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

        const usedQuota = await Post.countDocuments({
            userId: req.user.id,
            isDeleted: false,
            createdAt: {
                $gte: startOfMonth
            }
        });

        const maxQuota = user.role === "premium" ? Infinity : 5;
        const remainingQuota = user.role === "premium" ? Infinity : Math.max(0, maxQuota - usedQuota);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            data: {
                username: user.username,
                email: user.email,
                role: user.role,
                quotaStats: {
                    used: usedQuota,
                    limit: maxQuota,
                    remaining: remainingQuota,
                    resetDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1)
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export { getProfile };