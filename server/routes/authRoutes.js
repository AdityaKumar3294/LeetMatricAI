const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    validateRegister,
    validateLogin
} = require("../validators/authValidator");


// ============================================================
// PUBLIC ROUTES
// ============================================================

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


// ============================================================
// PROTECTED ROUTES
// ============================================================

// Get current logged-in user
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

// Update profile
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


module.exports = router;