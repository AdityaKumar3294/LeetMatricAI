const express = require("express");

const {
    getAIAnalysis,
    regenerateAIAnalysis,

    // Study Plan
    getStudyPlan,
    generateNewStudyPlan,
    completeStudyPlanDay,
    uncompleteStudyPlanDay,

    // Company / Interview
    getCompanyRoadmap,
    getInterviewQuestions,

    // Resume
    getResumeAnalysis,

    // Coding AI
    getExplainCode,
    getBugAnalysis,
    getOptimizedCode,
    getComplexityAnalysis,
    getConvertedCode,
    getGeneratedCodeFromProblem,
    getCodingAssistantReply,

    // AI History
    getAIHistory,
    deleteAIHistoryItem,
    clearAIHistory,

    // Friend Comparison
    getFriendComparison,
    exportStudyPlanPDF

} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// AI PERFORMANCE ANALYSIS
// GET /api/ai/analysis
// ============================================================

router.get(
    "/analysis",
    authMiddleware,
    getAIAnalysis
);

router.post(
    "/analysis/regenerate",
    authMiddleware,
    regenerateAIAnalysis
);

router.get(
    "/study-plan/pdf",
    authMiddleware,
    exportStudyPlanPDF
);

// ============================================================
// PERSONALIZED STUDY PLAN
// ============================================================

// GET /api/ai/study-plan
// Get saved Study Plan

router.get(
    "/study-plan",
    authMiddleware,
    getStudyPlan
);


// POST /api/ai/study-plan/generate
// Generate NEW Study Plan using Gemini

router.post(
    "/study-plan/generate",
    authMiddleware,
    generateNewStudyPlan
);


// ============================================================
// COMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/complete
// ============================================================

router.post(
    "/study-plan/day/:day/complete",
    authMiddleware,
    completeStudyPlanDay
);


// ============================================================
// UNCOMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/uncomplete
// ============================================================

router.post(
    "/study-plan/day/:day/uncomplete",
    authMiddleware,
    uncompleteStudyPlanDay
);


// ============================================================
// COMPANY ROADMAP
// GET /api/ai/company-roadmap/:company
// ============================================================

router.get(
    "/company-roadmap/:company",
    authMiddleware,
    getCompanyRoadmap
);


// ============================================================
// INTERVIEW QUESTIONS
// GET /api/ai/interview-questions/:company
// ============================================================

router.get(
    "/interview-questions/:company",
    authMiddleware,
    getInterviewQuestions
);


// ============================================================
// RESUME ANALYSIS
// POST /api/ai/resume-analysis
// ============================================================

router.post(
    "/resume-analysis",
    authMiddleware,
    getResumeAnalysis
);


// ============================================================
// CODE EXPLANATION
// POST /api/ai/explain
// ============================================================

router.post(
    "/explain",
    authMiddleware,
    getExplainCode
);


// ============================================================
// BUG FINDER
// POST /api/ai/find-bugs
// ============================================================

router.post(
    "/find-bugs",
    authMiddleware,
    getBugAnalysis
);


// ============================================================
// CODE OPTIMIZATION
// POST /api/ai/optimize
// ============================================================

router.post(
    "/optimize",
    authMiddleware,
    getOptimizedCode
);


// ============================================================
// TIME & SPACE COMPLEXITY
// POST /api/ai/complexity
// ============================================================

router.post(
    "/complexity",
    authMiddleware,
    getComplexityAnalysis
);


// ============================================================
// CODE CONVERSION
// POST /api/ai/convert
// ============================================================

router.post(
    "/convert",
    authMiddleware,
    getConvertedCode
);


// ============================================================
// GENERATE CODE FROM PROBLEM
// POST /api/ai/generate-code
// ============================================================

router.post(
    "/generate-code",
    authMiddleware,
    getGeneratedCodeFromProblem
);


// ============================================================
// AI CODING ASSISTANT
// POST /api/ai/chat
// ============================================================

router.post(
    "/chat",
    authMiddleware,
    getCodingAssistantReply
);


// ============================================================
// AI HISTORY
// ============================================================

// GET /api/ai/history

router.get(
    "/history",
    authMiddleware,
    getAIHistory
);


// DELETE /api/ai/history/:id

router.delete(
    "/history/:id",
    authMiddleware,
    deleteAIHistoryItem
);


// DELETE /api/ai/history

router.delete(
    "/history",
    authMiddleware,
    clearAIHistory
);


// ============================================================
// AI FRIEND COMPARISON
// GET /api/ai/friend-comparison/:friendId
// ============================================================

router.get(
    "/friend-comparison/:friendId",
    authMiddleware,
    getFriendComparison
);


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;