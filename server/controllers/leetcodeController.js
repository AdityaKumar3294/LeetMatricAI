const User = require("../models/User");
const { fetchLeetCodeStats } = require("../services/leetcodeService");

const { awardBadges } = require("../services/badgeService");

const { updateStreak } = require("../services/streakService");

const { calculateXP } = require("../services/xpService");

// Get LeetCode Profile
const getLeetCodeProfile = async (req, res) => {
    try {

        // Get username from URL
        const { username } = req.params;

        // Check username
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "LeetCode username is required"
            });
        }

        // Fetch data from service
        const profileData = await fetchLeetCodeStats(username);

        const {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            reputation,
            avatar
        } = profileData;

        

        // Return response
        res.status(200).json({
            success: true,
            data: profileData
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
// Sync Logged-in User's LeetCode
// ==============================

const syncLeetCodeProfile = async (req, res) => {
    try {

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

        const profileData = await fetchLeetCodeStats(user.leetcodeUsername);

        const {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            reputation,
            avatar
        } = profileData;

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

        // Update daily streak
        updateStreak(user);

        // Save updated user
        await user.save();

        // Award badges
        const unlockedBadges = await awardBadges(user);
        
        calculateXP(user, unlockedBadges);

        await user.save();

        res.status(200).json({
            success: true,
            message: "LeetCode synced successfully.",
            data: user.leetcodeStats,
            streak: user.streak,
            xp: user.xp,
            unlockedBadges
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
    getLeetCodeProfile,
    syncLeetCodeProfile
};