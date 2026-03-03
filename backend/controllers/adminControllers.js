import { User, Post } from "../models/index.js";


// @desc    Get all stats
// @route   GET /api/admin/stats
// @access  Private
const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalPremiumUsers = await User.countDocuments({ role: 'premium' });
        const totalFreeUsers = await User.countDocuments({ role: 'free' });
        const activePosts = await Post.countDocuments({ isDeleted: false });
        const deletedPosts = await Post.countDocuments({ isDeleted: true });

        const totalPostsThisMonth = await Post.countDocuments({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        });

        const totalPostsLastMonth = await Post.countDocuments({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        });

        res.status(200).json({
            totalUsers,
            totalPosts,
            totalPremiumUsers,
            totalFreeUsers,
            activePosts,
            deletedPosts,
            totalPostsThisMonth,
            totalPostsLastMonth
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


// @desc    Force delete post
// @route   DELETE /api/admin/post/:id
// @access  Private
const forceDeletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Force delete user
// @route   DELETE /api/admin/user/:id
// @access  Private
const forceDeleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Upgrade user
// @route   PUT /api/admin/user/:id/upgrade
// @access  Private
const upgradeUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = 'premium';
        await user.save();
        res.status(200).json({ message: "User upgraded successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Downgrade user
// @route   PUT /api/admin/user/:id/downgrade
// @access  Private
const downgradeUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = 'free';
        await user.save();
        res.status(200).json({ message: "User downgraded successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


export {
    getStats,
    forceDeletePost,
    forceDeleteUser,
    upgradeUser,
    downgradeUser
};