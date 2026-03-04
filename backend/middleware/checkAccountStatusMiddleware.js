import { User } from "../models/index.js";
import mongoose from "mongoose";

const checkAccountStatus = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.isDeleted) {
        return res.status(403).json({ message: "Your account has been deleted" });
    }
    next();
}

export default checkAccountStatus;
