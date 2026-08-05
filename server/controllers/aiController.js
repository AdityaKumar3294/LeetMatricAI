const User = require("../models/User");

const {
    generateAIAnalysis,
    generateStudyPlan
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

module.exports = {
    getAIAnalysis,
    getStudyPlan
};