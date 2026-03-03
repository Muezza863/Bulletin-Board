import { User } from "../models/index.js";

const checkStatus = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.status !== 'active') {
        return res.status(403).json({ message: "Your account is not active. Please contact the admin to activate your account." });
    }
    next();
}

export default checkStatus;