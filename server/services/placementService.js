const calculatePlacementScore = (user) => {

    const stats = user.leetcodeStats || {};

    let score = 0;

    // Total Solved (30)
    score += Math.min(stats.totalSolved / 500, 1) * 30;

    // Hard Problems (20)
    score += Math.min(stats.hardSolved / 100, 1) * 20;

    // Ranking (20)
    if (stats.ranking) {

        if (stats.ranking <= 100000)
            score += 20;

        else if (stats.ranking <= 300000)
            score += 15;

        else if (stats.ranking <= 500000)
            score += 10;

        else
            score += 5;
    }

    // XP (15)
    score += Math.min((user.xp || 0) / 5000, 1) * 15;

    // Streak (15)
    score += Math.min((user.streak || 0) / 30, 1) * 15;

    score = Math.round(score);

    let level = "Beginner";

    if (score >= 85)
        level = "Placement Ready";

    else if (score >= 70)
        level = "Interview Ready";

    else if (score >= 50)
        level = "Good Progress";

    return {
        score,
        level
    };
};

module.exports = {
    calculatePlacementScore
};