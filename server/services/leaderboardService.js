const { calculateLevel } = require("./levelService");

// ======================================
// Calculate Leaderboard
// ======================================

const calculateLeaderboardData = (users) => {

    return users

        .map((user) => {

            const stats = user.leetcodeStats || {};

            const totalSolved =
                stats.totalSolved ||
                (
                    (stats.easySolved || 0) +
                    (stats.mediumSolved || 0) +
                    (stats.hardSolved || 0)
                );

            const levelData =
                calculateLevel(user.xp || 0);

            return {

                id: user._id,

                name: user.name,

                avatar: stats.avatar || null,

                leetcodeUsername:
                    user.leetcodeUsername || null,

                xp: user.xp || 0,

                level: levelData.level,

                totalSolved,

                streak: user.streak || 0

            };

        })

        // ======================================
        // Ranking Priority
        // ======================================

        .sort((a, b) => {

            // 1. Higher XP wins
            if (b.xp !== a.xp) {

                return b.xp - a.xp;

            }

            // 2. If XP is same → more problems wins
            if (b.totalSolved !== a.totalSolved) {

                return b.totalSolved - a.totalSolved;

            }

            // 3. If still same → higher streak wins
            return b.streak - a.streak;

        })

        // ======================================
        // Assign Rank
        // ======================================

        .map((user, index) => {

            return {

                ...user,

                rank: index + 1

            };

        });

};

module.exports = {
    calculateLeaderboardData
};