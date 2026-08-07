const User = require("../models/User");

const {
    generateAIAnalysis,
    generateStudyPlan,
    generateCompanyRoadmap,
    generateInterviewQuestions,
    explainCode,
    findBugs,
    optimizeCode,
    analyzeComplexity,
    convertCode,
    generateCodeFromProblem,
    codingAssistantChat
} = require("../services/aiService");

// ==============================
// Generate AI Analysis
// ==============================
const getAIAnalysis = async (req, res) => {
    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if LeetCode profile is synced
        if (
            !user.leetcodeStats ||
            user.leetcodeStats.totalSolved === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please sync your LeetCode profile first."
            });
        }

        // Create profile object
        const profileData = {
            username: user.leetcodeUsername,
            totalSolved: user.leetcodeStats.totalSolved,
            easySolved: user.leetcodeStats.easySolved,
            mediumSolved: user.leetcodeStats.mediumSolved,
            hardSolved: user.leetcodeStats.hardSolved,
            ranking: user.leetcodeStats.ranking
        };

        // Generate AI Analysis
        const analysis = await generateAIAnalysis(profileData);

        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// Generate AI Study Plan
// ==============================
const getStudyPlan = async (req, res) => {
    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if LeetCode profile is synced
        if (
            !user.leetcodeStats ||
            user.leetcodeStats.totalSolved === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please sync your LeetCode profile first."
            });
        }

        // Return cached Study Plan if generated within last 7 days
        if (
            user.studyPlan &&
            user.studyPlan.content &&
            user.studyPlan.generatedAt
        ) {

            const daysPassed =
                (Date.now() - new Date(user.studyPlan.generatedAt).getTime()) /
                (1000 * 60 * 60 * 24);

            if (daysPassed < 7) {
                return res.status(200).json({
                    success: true,
                    cached: true,
                    studyPlan: user.studyPlan.content
                });
            }
        }

        // Create profile object
        const profileData = {
            username: user.leetcodeUsername,
            totalSolved: user.leetcodeStats.totalSolved,
            easySolved: user.leetcodeStats.easySolved,
            mediumSolved: user.leetcodeStats.mediumSolved,
            hardSolved: user.leetcodeStats.hardSolved,
            ranking: user.leetcodeStats.ranking
        };

        // Generate new Study Plan
        const studyPlan = await generateStudyPlan(profileData);

        // Save Study Plan in MongoDB
        user.studyPlan = {
            content: studyPlan,
            generatedAt: new Date()
        };

        await user.save();

        // Return Response
        res.status(200).json({
            success: true,
            cached: false,
            studyPlan
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Generate Company Roadmap
const getCompanyRoadmap = async (req, res) => {
    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if LeetCode profile is synced
        if (
            !user.leetcodeStats ||
            user.leetcodeStats.totalSolved === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please sync your LeetCode profile first."
            });
        }

        // Get company name from URL
        const { company } = req.params;

        // Validate company
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        // Check if roadmap already exists
        const existingRoadmap = (user.companyRoadmaps || []).find(
            (item) =>
                item.company.toLowerCase() === company.toLowerCase()
        );

        // Return cached roadmap if generated within last 7 days
        if (existingRoadmap) {

            const daysPassed =
                (Date.now() - new Date(existingRoadmap.generatedAt).getTime()) /
                (1000 * 60 * 60 * 24);

            if (daysPassed < 7) {
                return res.status(200).json({
                    success: true,
                    cached: true,
                    company,
                    roadmap: existingRoadmap.content
                });
            }
        }

        // Create profile object
        const profileData = {
            username: user.leetcodeUsername,
            totalSolved: user.leetcodeStats.totalSolved,
            easySolved: user.leetcodeStats.easySolved,
            mediumSolved: user.leetcodeStats.mediumSolved,
            hardSolved: user.leetcodeStats.hardSolved,
            ranking: user.leetcodeStats.ranking
        };

        // Generate AI Company Roadmap
        const roadmap = await generateCompanyRoadmap(
            profileData,
            company
        );

        // Remove old roadmap for same company (if exists)
        user.companyRoadmaps = (user.companyRoadmaps || []).filter(
            (item) =>
                item.company.toLowerCase() !== company.toLowerCase()
        );

        // Save new roadmap
        user.companyRoadmaps.push({
            company,
            content: roadmap,
            generatedAt: new Date()
        });

        await user.save();

        // Return response
        res.status(200).json({
            success: true,
            cached: false,
            company,
            roadmap
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// Generate Interview Questions
// ==============================
const getInterviewQuestions = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (
            !user.leetcodeStats ||
            user.leetcodeStats.totalSolved === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please sync your LeetCode profile first."
            });
        }

        const { company } = req.params;

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        const profileData = {
            username: user.leetcodeUsername,
            totalSolved: user.leetcodeStats.totalSolved,
            easySolved: user.leetcodeStats.easySolved,
            mediumSolved: user.leetcodeStats.mediumSolved,
            hardSolved: user.leetcodeStats.hardSolved,
            ranking: user.leetcodeStats.ranking
        };

        const questions = await generateInterviewQuestions(
            profileData,
            company
        );

        res.status(200).json({
            success: true,
            company,
            questions
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Explain Code
// ==============================
const getExplainCode = async (req, res) => {

    try {

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required."
            });
        }

        const explanation = await explainCode(code, language);

        res.status(200).json({
            success: true,
            explanation
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Find Bugs
// ==============================
const getBugAnalysis = async (req, res) => {

    try {

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required."
            });
        }

        const analysis = await findBugs(code, language);

        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Optimize Code
// ==============================
const getOptimizedCode = async (req, res) => {

    try {

        const { code, language } = req.body;

        // Validate request
        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required."
            });
        }

        // Generate optimized code using AI
        const optimization = await optimizeCode(code, language);

        res.status(200).json({
            success: true,
            optimization
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Analyze Time & Space Complexity
// ==============================
const getComplexityAnalysis = async (req, res) => {

    try {

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required."
            });
        }

        const analysis = await analyzeComplexity(code, language);

        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Convert Code Between Languages
// ==============================
const getConvertedCode = async (req, res) => {

    try {

        const { code, sourceLanguage, targetLanguage } = req.body;

        // Validate input
        if (!code || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({
                success: false,
                message: "Code, sourceLanguage and targetLanguage are required."
            });
        }

        // Prevent converting to same language
        if (sourceLanguage === targetLanguage) {
            return res.status(400).json({
                success: false,
                message: "Source and target languages cannot be the same."
            });
        }

        // Generate converted code
        const convertedCode = await convertCode(
            code,
            sourceLanguage,
            targetLanguage
        );

        res.status(200).json({
            success: true,
            sourceLanguage,
            targetLanguage,
            convertedCode
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Generate Code from Problem
// ==============================
const getGeneratedCodeFromProblem = async (req, res) => {

    try {

        const { problem, language } = req.body;

        if (!problem || !language) {
            return res.status(400).json({
                success: false,
                message: "Problem statement and language are required."
            });
        }

        const result = await generateCodeFromProblem(
            problem,
            language
        );

        res.status(200).json({
            success: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// AI Coding Assistant Chat
// ==============================
const getCodingAssistantReply = async (req, res) => {
    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const reply = await codingAssistantChat(message);

        res.status(200).json({
            success: true,
            reply
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getAIAnalysis,
    getStudyPlan,
    getCompanyRoadmap,
    getInterviewQuestions,
    getBugAnalysis,
    getExplainCode,
    getOptimizedCode,
    getComplexityAnalysis,
    getConvertedCode,
    getGeneratedCodeFromProblem,
    getCodingAssistantReply
};
