const express = require("express");

const {
    getAIAnalysis,
    getStudyPlan,
    getCompanyRoadmap,
    getInterviewQuestions
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/analysis", authMiddleware, getAIAnalysis);

router.get("/study-plan", authMiddleware, getStudyPlan);

router.get("/company-roadmap/:company", authMiddleware, getCompanyRoadmap);

// NEW ROUTE
router.get(
    "/interview-questions/:company",
    authMiddleware,
    getInterviewQuestions
);

module.exports = router;