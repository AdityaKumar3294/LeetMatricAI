const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    validateLeetCodeUsername
} = require("../validators/leetcodeValidator");

const {
    getLeetCodeProfile,
    syncLeetCodeProfile
} = require("../controllers/leetcodeController");

// Sync logged-in user's profile
router.post(
    "/sync",
    authMiddleware,
    syncLeetCodeProfile
);

// View any profile
router.get(
    "/:username",
    authMiddleware,
    validateLeetCodeUsername,
    getLeetCodeProfile
);

module.exports = router;