const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAIAnalysis,
        getStudyPlan
 } = require("../controllers/aiController");

// Protected Route
router.get("/analyze", authMiddleware, getAIAnalysis);
router.get("/study-plan", authMiddleware, getStudyPlan);

module.exports = router;