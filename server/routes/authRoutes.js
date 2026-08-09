const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    validateRegister,
    validateLogin
} = require("../validators/authValidator");

// Public Routes
router.post(
    "/register",
    validateRegister,
    registerUser
);

router.post(
    "/login",
    validateLogin,
    loginUser
);

// Protected Route
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;