const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {

        // Get token from request headers
        const token = req.header("Authorization");

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Remove "Bearer " from token
        const jwtToken = token.replace("Bearer ", "");

        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

        // Save user id in request object
        req.user = decoded;

        // Move to next middleware/controller
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
};

module.exports = authMiddleware;