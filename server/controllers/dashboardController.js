const User = require("../models/User");
const Badge = require("../models/Badge");
const Note = require("../models/Note");

const { generateAIInsights } = require("../services/aiInsightService");
const { generateAICoach } = require("../services/aiCoachService");
const { calculateLevel } = require("../services/levelService");

const {
    calculatePlacementScore
} = require("../services/placementService");


// ===================================================
// Get Dashboard
// ===================================================

const getDashboard = async (req, res) => {

    try {

        // ===================================================
        // Find User
        // ===================================================

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }


        // ===================================================
        // AI Insights
        // ===================================================

        const aiInsights =
            generateAIInsights(user);


        // ===================================================
        // AI Coach
        // ===================================================

        const aiCoach =
            generateAICoach(user);


        // ===================================================
        // Get Badges
        // ===================================================

        const badges = await Badge.find({

            user: req.user.id

        }).sort({

            unlockedAt: -1

        });


        // ===================================================
        // Notes Count
        // ===================================================

        const notesCount =
            await Note.countDocuments({

                user: req.user.id

            });


        // ===================================================
        // Friends Count
        // ===================================================

        const friendsCount =
            user.friends
                ? user.friends.length
                : 0;


        // ===================================================
        // Placement Score
        // ===================================================

        const placement =
            calculatePlacementScore(user);


        // ===================================================
        // XP Breakdown
        // ===================================================

        const xpBreakdown =
            user.xpBreakdown || {

                easy: 0,

                medium: 0,

                hard: 0,

                streak: 0,

                badges: 0

            };


        // ===================================================
        // Level Information
        // ===================================================

        const levelData =
            calculateLevel(user.xp || 0);


        // ===================================================
        // Dashboard Response
        // ===================================================

        return res.status(200).json({

            success: true,

            dashboard: {

                // ==========================================
                // User
                // ==========================================

                user: {

                    name: user.name,

                    email: user.email,

                    leetcodeUsername:
                        user.leetcodeUsername

                },


                // ==========================================
                // LeetCode Stats
                // ==========================================

                leetcodeStats:
                    user.leetcodeStats,


                // ==========================================
                // AI
                // ==========================================

                aiInsights,

                aiCoach,


                // ==========================================
                // XP
                // ==========================================

                xp:
                    user.xp || 0,

                xpBreakdown,


                // ==========================================
                // Level
                // ==========================================

                level:
                    levelData.level,

                currentLevelXP:
                    levelData.currentLevelXP,

                nextLevelXP:
                    levelData.nextLevelXP,

                remainingXP:
                    levelData.remainingXP,

                progress:
                    levelData.progress,


                // ==========================================
                // Streak
                // ==========================================

                streak:
                    user.streak || 0,


                // ==========================================
                // Placement
                // ==========================================

                placementScore:
                    placement.score,

                placementLevel:
                    placement.level,


                // ==========================================
                // Badges
                // ==========================================

                badges,

                totalBadges:
                    badges.length,


                // ==========================================
                // Notes
                // ==========================================

                notesCount,


                // ==========================================
                // Friends
                // ==========================================

                friendsCount,


                // ==========================================
                // Study Plan
                // ==========================================

                studyPlan:
                    user.studyPlan || [],


                // ==========================================
                // Company Roadmaps
                // ==========================================

                companyRoadmaps:
                    user.companyRoadmaps || [],


                // ==========================================
                // Weekly Activity
                // ==========================================

                weeklyActivity: [

                    {
                        day: "Mon",
                        solved: 3
                    },

                    {
                        day: "Tue",
                        solved: 6
                    },

                    {
                        day: "Wed",
                        solved: 2
                    },

                    {
                        day: "Thu",
                        solved: 8
                    },

                    {
                        day: "Fri",
                        solved: 5
                    },

                    {
                        day: "Sat",
                        solved: 10
                    },

                    {
                        day: "Sun",
                        solved: 4
                    }

                ]

            }

        });

    }

    catch (error) {

        console.log("Dashboard Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    getDashboard

};