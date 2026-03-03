import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
    let token;
    // Check if token is exist
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check if token is exist
    if (!token) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }

    // Verify token
    try {
        token = token.split(" ")[1]; // Remove "Bearer" from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Not authorized to access this route" });
    }
}

export default protect;