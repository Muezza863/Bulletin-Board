import { User, Transaction } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Upgrade to premium
// @route   POST /api/membership/upgrade
// @access  Private
const upgradeToPremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = "premium";
        user.premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();
        res.status(200).json({ message: "User upgraded to premium successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Downgrade from premium
// @route   POST /api/membership/downgrade
// @access  Private
const downgradeFromPremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = "free";
        user.premiumUntil = null;
        await user.save();
        res.status(200).json({ message: "User downgraded from premium successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Get user membership status
// @route   GET /api/membership/status
// @access  Private
const getMembershipStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            role: user.role,
            premiumUntil: user.premiumUntil
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

export { upgradeToPremium, downgradeFromPremium, getMembershipStatus };
