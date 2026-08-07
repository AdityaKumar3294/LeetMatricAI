const express = require("express");

const {
    getAIAnalysis,
    getStudyPlan,
    getCompanyRoadmap,
    getInterviewQuestions,
    getExplainCode,
    getBugAnalysis,
    getOptimizedCode,
    getComplexityAnalysis,
    getConvertedCode,
    getGeneratedCodeFromProblem,
    getCodingAssistantReply
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/analysis", authMiddleware, getAIAnalysis);

router.get("/study-plan", authMiddleware, getStudyPlan);

router.get("/company-roadmap/:company", authMiddleware, getCompanyRoadmap);

router.get("/interview-questions/:company", authMiddleware, getInterviewQuestions);

router.post("/explain", authMiddleware, getExplainCode);

router.post("/find-bugs", authMiddleware, getBugAnalysis);

router.post("/optimize", authMiddleware, getOptimizedCode);

// Time & Space Complexity Analyzer
router.post(
    "/complexity",
    authMiddleware,
    getComplexityAnalysis
);

// Convert Code Between Languages
router.post(
    "/convert",
    authMiddleware,
    getConvertedCode
);

// Generate Code from Problem Statement
router.post(
    "/generate-code",
    authMiddleware,
    getGeneratedCodeFromProblem
);

// AI Coding Assistant Chat
router.post(
    "/chat",
    authMiddleware,
    getCodingAssistantReply
);

module.exports = router;