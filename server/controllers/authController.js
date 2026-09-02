const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================================================
// REGISTER USER
// ============================================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            leetcodeUsername
        } = req.body;

        // ----------------------------------------------------
        // Validate required fields
        // ----------------------------------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // ----------------------------------------------------
        // Normalize input
        // ----------------------------------------------------

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedLeetcodeUsername =
            leetcodeUsername?.trim() || "";

        // ----------------------------------------------------
        // Validate name
        // ----------------------------------------------------

        if (normalizedName.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 3 characters"
            });
        }

        // ----------------------------------------------------
        // Validate password
        // ----------------------------------------------------

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        // ----------------------------------------------------
        // Check existing user
        // ----------------------------------------------------

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        // ----------------------------------------------------
        // Hash password
        // ----------------------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        // ----------------------------------------------------
        // Create user
        // ----------------------------------------------------

        const user = new User({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            leetcodeUsername: normalizedLeetcodeUsername
        });

        // ----------------------------------------------------
        // Save user
        // ----------------------------------------------------

        await user.save();

        // ----------------------------------------------------
        // Success response
        // ----------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                leetcodeUsername: user.leetcodeUsername
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        // MongoDB duplicate key
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while creating account"
        });
    }
};


// ============================================================
// LOGIN USER
// ============================================================

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // ----------------------------------------------------
        // Find user
        // ----------------------------------------------------

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ----------------------------------------------------
        // Compare password
        // ----------------------------------------------------

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ----------------------------------------------------
        // Generate JWT
        // ----------------------------------------------------

        const payload = {
            id: user._id
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // ----------------------------------------------------
        // Update activity
        // ----------------------------------------------------

        user.lastActive = new Date();

        await user.save();

        // ----------------------------------------------------
        // Login success
        // ----------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                leetcodeUsername: user.leetcodeUsername
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while logging in"
        });
    }
};


// ============================================================
// GET CURRENT USER
// ============================================================

const getCurrentUser = async (req, res) => {
    try {

        const user = await User
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("GET CURRENT USER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching user"
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};