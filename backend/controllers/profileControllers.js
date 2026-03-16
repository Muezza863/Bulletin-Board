import { User, Post } from "../models/index.js";

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        // Cek user dulu sebelum menggunakan user.role
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const startOfMonth = new Date();
        startOfMonth.setHours(0, 0, 0, 0);
        startOfMonth.setDate(1);

        // Hanya satu query (postCount dan usedQuota adalah hal yang sama, hapus duplikat)
        const usedQuota = await Post.countDocuments({
            userId: req.user.id,
            isDeleted: false,
            createdAt: {
                $gte: startOfMonth
            }
        });

        const maxQuota = user.role === "premium" ? null : 5; // null akan ditampilkan sebagai ∞ di frontend
        const remainingQuota = user.role === "premium" ? null : Math.max(0, maxQuota - usedQuota);

        return res.status(200).json({
            data: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
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
        console.error("[getProfile]", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export { getProfile };