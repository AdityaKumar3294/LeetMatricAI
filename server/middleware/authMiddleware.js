const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        console.log(`🟡 BACKEND STEP 4: authMiddleware hit for route -> ${req.originalUrl}`);
        
        const token = req.header("Authorization");
        if (!token) {
            console.log("🔴 BACKEND ERROR: No token provided");
            return res.status(401).json({ 
                success: false, 
                message: "Access denied." 
            });
        }

        const jwtToken = token.replace("Bearer ", "");
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded;
        
        console.log(`🟡 BACKEND STEP 4.5: Token verified for user ID: ${decoded.id}, passing to controller...`);
        next();
    } catch (error) {
        console.log("🔴 BACKEND ERROR: Invalid token");
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = authMiddleware;