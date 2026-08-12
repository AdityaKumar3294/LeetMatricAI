const generateAIInsights = (user) => {

    const stats = user.leetcodeStats || {};

    const totalSolved = stats.totalSolved || 0;
    const easySolved = stats.easySolved || 0;
    const mediumSolved = stats.mediumSolved || 0;
    const hardSolved = stats.hardSolved || 0;

    const streak = user.streak || 0;
    const xp = user.xp || 0;

    //----------------------------------------------------
    // Percentages
    //----------------------------------------------------

    const easyPercent =
        totalSolved > 0
            ? ((easySolved / totalSolved) * 100).toFixed(1)
            : 0;

    const mediumPercent =
        totalSolved > 0
            ? ((mediumSolved / totalSolved) * 100).toFixed(1)
            : 0;

    const hardPercent =
        totalSolved > 0
            ? ((hardSolved / totalSolved) * 100).toFixed(1)
            : 0;

    //----------------------------------------------------
    // Strength
    //----------------------------------------------------

    let strength = {
        title: "Strength",
        message: ""
    };

    if (easySolved >= mediumSolved && easySolved >= hardSolved) {

        strength.message =
            `Excellent consistency in Easy problems (${easySolved} solved).`;

    }

    else if (mediumSolved >= easySolved && mediumSolved >= hardSolved) {

        strength.message =
            `Great performance in Medium problems (${mediumSolved} solved).`;

    }

    else {

        strength.message =
            `Impressive work on Hard problems (${hardSolved} solved).`;

    }

    //----------------------------------------------------
    // Improve
    //----------------------------------------------------

    let improve = {
        title: "Improve",
        message: ""
    };

    if (hardPercent < 10) {

        improve.message =
            "Focus on Hard problems to improve interview readiness.";

    }

    else if (mediumPercent < 30) {

        improve.message =
            "Increase Medium problem practice to build stronger fundamentals.";

    }

    else {

        improve.message =
            "Maintain a balanced mix of Easy, Medium and Hard problems.";

    }

    //----------------------------------------------------
    // Progress
    //----------------------------------------------------

    let progress = {
        title: "Progress",
        message: ""
    };

    if (streak >= 30) {

        progress.message =
            `Amazing! You're on a ${streak}-day coding streak.`;

    }

    else if (streak >= 7) {

        progress.message =
            `Great consistency with a ${streak}-day streak.`;

    }

    else {

        progress.message =
            `Current streak is ${streak} day${streak === 1 ? "" : "s"}. Keep coding daily!`;

    }

    //----------------------------------------------------
    // Goal
    //----------------------------------------------------

    let goal = {
        title: "Today's Goal",
        message: ""
    };

    if (hardSolved < 20) {

        goal.message =
            "Solve 1 Hard problem today.";

    }

    else if (mediumSolved < 150) {

        goal.message =
            "Solve 3 Medium problems today.";

    }

    else {

        goal.message =
            "Solve 5 problems today to maintain momentum.";

    }

    //----------------------------------------------------

    return {
        strength,
        improve,
        progress,
        goal,

        summary: {
            totalSolved,
            easyPercent,
            mediumPercent,
            hardPercent,
            streak,
            xp
        }
    };

};

module.exports = {
    generateAIInsights
};