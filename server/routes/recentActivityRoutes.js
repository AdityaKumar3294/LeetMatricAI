const express = require("express");

const router = express.Router();

const {
    addRecentActivity,
    getRecentActivities
} = require("../controllers/recentActivityController");

const protect = require("../middleware/authMiddleware");

// Add Activity
router.post("/", protect, addRecentActivity);

// Get Activities
router.get("/", protect, getRecentActivities);

module.exports = router;