import { User } from "../models/index.js";

const adminOnly = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
        return res.status(403).json({ message: "You are not authorized to access this route" });
    }
    next();
}

export default adminOnly;