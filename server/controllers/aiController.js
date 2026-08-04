const User = require("../models/User");
const { generateAIAnalysis } = require("../services/aiService");

// Generate AI Analysis
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

        // Check if LeetCode stats exist
        if (!user.leetcodeStats) {
            return res.status(400).json({
                success: false,
                message: "Please sync your LeetCode profile first."
            });
        }

        // Generate AI response
        const analysis = await generateAIAnalysis({
            username: user.leetcodeUsername,
            totalSolved: user.leetcodeStats.totalSolved,
            easySolved: user.leetcodeStats.easySolved,
            mediumSolved: user.leetcodeStats.mediumSolved,
            hardSolved: user.leetcodeStats.hardSolved,
            ranking: user.leetcodeStats.ranking
        });

        // Send response
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

module.exports = {
    getAIAnalysis
};