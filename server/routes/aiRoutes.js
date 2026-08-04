const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAIAnalysis } = require("../controllers/aiController");

// Protected Route
router.get("/analyze", authMiddleware, getAIAnalysis);

module.exports = router;