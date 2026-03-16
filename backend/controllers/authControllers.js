import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// @desc    Register
// @route   POST /api/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        // Validasi input
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already taken" });
            }
            return res.status(400).json({ message: "Email already registered" });
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
        return res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error("[register]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Login
// @route   POST /api/login
// @access  Public
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Cek user ada dulu sebelum bcrypt.compare
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid password or username not found" });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password or username not found" });
        }
        
        // Create token
        const token = createToken(user._id, user.role);

        return res.status(200).json({ 
            message: "User logged in successfully",
            token,
            user: {
                fullname: user.fullname,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error("[login]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { register, login };