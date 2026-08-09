const calculateXP = (user, unlockedBadges = []) => {

    const stats = user.leetcodeStats || {};

    let xp = 0;

    // Problems XP
    xp += (stats.easySolved || 0) * 1;
    xp += (stats.mediumSolved || 0) * 2;
    xp += (stats.hardSolved || 0) * 5;

    // Daily streak bonus
    xp += (user.streak || 0) * 10;

    // Badge bonus
    xp += unlockedBadges.length * 50;

    user.xp = xp;

    return xp;
};

module.exports = {
    calculateXP
};