import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// @desc    Register
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { username, fullname, email, password } = req.body;

        // Check if user already exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Create token
        const token = createToken(newUser._id, newUser.role);
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid || !user) {
            return res.status(401).json({ message: "Invalid password or username not found" });
        }
        
        // Create token
        const token = createToken(user._id, user.role);

        res.status(200).json({ 
            message: "User logged in successfully",
            token,
            user: {
                fullname: user.fullname,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

export { register, login };