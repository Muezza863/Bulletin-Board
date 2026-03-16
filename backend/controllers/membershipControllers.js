import { User, Transaction } from "../models/index.js";

// @desc    Upgrade to premium
// @route   POST /api/membership/upgrade
// @access  Private
const upgradeToPremium = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === 'premium') {
            return res.status(400).json({ message: "User is already a premium member" });
        }
        user.role = "premium";
        user.premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();
        return res.status(200).json({ message: "User upgraded to premium successfully" });
    } catch (error) {
        console.error("[upgradeToPremium]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Downgrade from premium
// @route   POST /api/membership/downgrade
// @access  Private
const downgradeFromPremium = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== 'premium') {
            return res.status(400).json({ message: "User is not a premium member" });
        }
        user.role = "free";
        user.premiumUntil = null;
        await user.save();
        return res.status(200).json({ message: "User downgraded from premium successfully" });
    } catch (error) {
        console.error("[downgradeFromPremium]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Get user membership status
// @route   GET /api/membership/status
// @access  Private
const getMembershipStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            role: user.role,
            premiumUntil: user.premiumUntil
        });
    } catch (error) {
        console.error("[getMembershipStatus]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { upgradeToPremium, downgradeFromPremium, getMembershipStatus };
