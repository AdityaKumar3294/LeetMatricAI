const { addXPHistory } = require("./xpHistoryService");

const calculateXP = async (user, unlockedBadges = []) => {

    const stats = user.leetcodeStats || {};

    const previousXP = user.xp || 0;

    // ==========================================
    // Calculate XP
    // ==========================================

    const easyXP =
        (stats.easySolved || 0) * 1;

    const mediumXP =
        (stats.mediumSolved || 0) * 2;

    const hardXP =
        (stats.hardSolved || 0) * 5;

    const streakXP =
        (user.streak || 0) * 10;


    // ==========================================
    // Badge XP
    // ==========================================

    const previousBadgeXP =
        user.xpBreakdown?.badges || 0;

    const newlyUnlockedBadgeXP =
        unlockedBadges.length * 50;

    const badgeXP =
        previousBadgeXP + newlyUnlockedBadgeXP;


    // ==========================================
    // Total XP
    // ==========================================

    const totalXP =
        easyXP +
        mediumXP +
        hardXP +
        streakXP +
        badgeXP;


    // ==========================================
    // Store Breakdown
    // ==========================================

    user.xpBreakdown = {

        easy: easyXP,

        medium: mediumXP,

        hard: hardXP,

        streak: streakXP,

        badges: badgeXP

    };


    // ==========================================
    // Update XP
    // ==========================================

    user.xp = totalXP;


    // ==========================================
    // Newly Earned XP
    // ==========================================

    const earnedXP =
        totalXP - previousXP;


    // ==========================================
    // XP History
    // ==========================================

    if (earnedXP > 0) {

        await addXPHistory({

            user: user._id,

            amount: earnedXP,

            reason:
                "XP earned from coding progress",

            type: "other"

        });

    }


    return {

        totalXP,

        earnedXP,

        breakdown:
            user.xpBreakdown

    };

};


module.exports = {
    calculateXP
};