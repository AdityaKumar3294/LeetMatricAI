const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getLeetCodeProfile
} = require("../controllers/leetcodeController");

// Protected Route
router.get("/:username", authMiddleware, getLeetCodeProfile);

module.exports = router;