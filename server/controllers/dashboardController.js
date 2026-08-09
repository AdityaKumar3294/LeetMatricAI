const User = require("../models/User");
const Badge = require("../models/Badge");
const Note = require("../models/Note");

const {
    calculatePlacementScore
} = require("../services/placementService");

const getDashboard = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const badges = await Badge.find({
            user: req.user.id
        }).sort({
            unlockedAt: -1
        });

        const notesCount = await Note.countDocuments({
            user: req.user.id
        });

        const friendsCount = user.friends
            ? user.friends.length
            : 0;

        const placement = calculatePlacementScore(user);

        res.status(200).json({

            success: true,

            dashboard: {

                user: {
                    name: user.name,
                    email: user.email,
                    leetcodeUsername: user.leetcodeUsername
                },

                leetcodeStats: user.leetcodeStats,

                xp: user.xp,

                streak: user.streak,

                placementScore: placement.score,

                placementLevel: placement.level,

                badges,

                totalBadges: badges.length,

                notesCount,

                friendsCount,

                studyPlan: user.studyPlan || [],

                companyRoadmaps: user.companyRoadmaps || []

            }

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
    getDashboard
};