const User = require("../models/User");
const {
    calculatePlacementScore
} = require("../services/placementService");

const getPlacementScore = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const result = calculatePlacementScore(user);

        const suggestions = [];

        const stats = user.leetcodeStats || {};

        if ((stats.totalSolved || 0) < 500) {
            suggestions.push("Solve more problems to improve your DSA foundation.");
        }

        if ((stats.hardSolved || 0) < 50) {
            suggestions.push("Practice more Hard problems for top product companies.");
        }

        if ((user.streak || 0) < 7) {
            suggestions.push("Maintain at least a 7-day streak.");
        }

        if ((user.xp || 0) < 1000) {
            suggestions.push("Earn more XP by solving problems consistently.");
        }

        res.status(200).json({
            success: true,
            score: result.score,
            level: result.level,
            suggestions
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
    getPlacementScore
};