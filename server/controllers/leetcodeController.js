const User = require("../models/User");

const { fetchLeetCodeStats } = require("../services/leetcodeService");
const { awardBadges } = require("../services/badgeService");
const { updateStreak } = require("../services/streakService");
const { calculateXP } = require("../services/xpService");
const { syncActivities } = require("../services/syncActivityService");

// ===================================================
// Get Any LeetCode Profile
// ===================================================

const getLeetCodeProfile = async (req, res) => {

    try {

        const { username } = req.params;

        if (!username) {

            return res.status(400).json({
                success: false,
                message: "LeetCode username is required"
            });

        }

        const profileData = await fetchLeetCodeStats(username);

        return res.status(200).json({

            success: true,
            data: profileData

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================================
// Sync Logged-in User's LeetCode
// ===================================================

const syncLeetCodeProfile = async (req, res) => {

    try {

        //----------------------------------------------------
        // Find User
        //----------------------------------------------------

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        if (!user.leetcodeUsername) {

            return res.status(400).json({

                success: false,
                message: "Please add your LeetCode username first."

            });

        }

        //----------------------------------------------------
        // Store Previous Stats
        //----------------------------------------------------

        const oldStats = {

            totalSolved:
                user.leetcodeStats?.totalSolved || 0,

            easySolved:
                user.leetcodeStats?.easySolved || 0,

            mediumSolved:
                user.leetcodeStats?.mediumSolved || 0,

            hardSolved:
                user.leetcodeStats?.hardSolved || 0,

            streak:
                user.streak || 0

        };

        //----------------------------------------------------
        // Fetch Latest Stats
        //----------------------------------------------------

        const profileData =
            await fetchLeetCodeStats(user.leetcodeUsername);

        const {

            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            reputation,
            avatar

        } = profileData;

        //----------------------------------------------------
        // Update User Stats
        //----------------------------------------------------

        user.leetcodeStats = {

            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            reputation,
            avatar,
            lastSynced: new Date()

        };

        //----------------------------------------------------
        // Update Daily Streak
        //----------------------------------------------------

        updateStreak(user);

        await user.save();

        //----------------------------------------------------
        // Generate Activities
        //----------------------------------------------------

        await syncActivities({

            user,

            oldStats,

            newStats: {

                totalSolved,
                easySolved,
                mediumSolved,
                hardSolved

            }

        });

        //----------------------------------------------------
        // Award Badges
        //----------------------------------------------------

        const unlockedBadges =
            await awardBadges(user);

        //----------------------------------------------------
        // Calculate XP
        //----------------------------------------------------

        const xpData =
            await calculateXP(
                user,
                unlockedBadges
            );

        await user.save();

        //----------------------------------------------------
        // Response
        //----------------------------------------------------

        return res.status(200).json({

            success: true,

            message: "LeetCode synced successfully.",

            data: user.leetcodeStats,

            streak: user.streak,

            xp: user.xp,
            xpBreakdown: xpData.breakdown,
            earnedXP: xpData.earnedXP,

            unlockedBadges

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getLeetCodeProfile,

    syncLeetCodeProfile

};