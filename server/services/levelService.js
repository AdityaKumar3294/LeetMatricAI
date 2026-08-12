const calculateLevel = (xp) => {

    const level = Math.floor(xp / 100) + 1;

    const currentLevelXP = (level - 1) * 100;

    const nextLevelXP = level * 100;

    const remainingXP = nextLevelXP - xp;

    const progress = Math.floor(
        ((xp - currentLevelXP) / 100) * 100
    );

    return {
        level,
        currentLevelXP,
        nextLevelXP,
        remainingXP,
        progress
    };
};

module.exports = {
    calculateLevel
};