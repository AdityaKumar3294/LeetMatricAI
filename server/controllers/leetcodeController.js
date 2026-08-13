const User = require("../models/User");

const { fetchLeetCodeStats } = require("../services/leetcodeService");
const { syncUserLeetCode } = require("../services/leetcodeSyncService");

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

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const result =
            await syncUserLeetCode(user);

        return res.status(200).json({

            success: true,

            message: "LeetCode synced successfully.",

            data: result.stats,

            streak: result.streak,

            xp: result.xp,

            xpBreakdown: result.xpBreakdown,

            earnedXP: result.earnedXP,

            unlockedBadges: result.unlockedBadges
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