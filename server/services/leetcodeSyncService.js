const { fetchLeetCodeStats } = require("./leetcodeService");
const { awardBadges } = require("./badgeService");
const { updateStreak } = require("./streakService");
const { calculateXP } = require("./xpService");
const { syncActivities } = require("./syncActivityService");

const syncUserLeetCode = async (user) => {

    if (!user) {
        throw new Error("User not found.");
    }

    if (!user.leetcodeUsername) {
        throw new Error("Please add your LeetCode username first.");
    }

    // Store previous stats
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

    // Fetch latest LeetCode data
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

    // Update LeetCode stats
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

    // Update streak
    updateStreak(user);

    await user.save();

    // Generate activities
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

    // Award badges
    const unlockedBadges =
        await awardBadges(user);

    // Calculate XP
    const xpData =
        await calculateXP(
            user,
            unlockedBadges
        );

    await user.save();

    return {

        stats: user.leetcodeStats,

        streak: user.streak,

        xp: user.xp,

        xpBreakdown: xpData.breakdown,

        earnedXP: xpData.earnedXP,

        unlockedBadges
    };
};

module.exports = {
    syncUserLeetCode
};