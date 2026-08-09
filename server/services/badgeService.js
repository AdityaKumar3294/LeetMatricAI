const Badge = require("../models/Badge");
const badgeDefinitions = require("../data/badges");

const awardBadges = async (user) => {

    const unlockedBadges = [];

    const stats = user.leetcodeStats || {};

    for (const badge of badgeDefinitions) {

        const value = stats[badge.field] || 0;

        if (value < badge.requirement) {
            continue;
        }

        const alreadyUnlocked = await Badge.findOne({
            user: user._id,
            badgeName: badge.badgeName
        });

        if (alreadyUnlocked) {
            continue;
        }

        const newBadge = await Badge.create({
            user: user._id,
            badgeName: badge.badgeName,
            badgeType: badge.badgeType,
            icon: badge.icon,
            description: badge.description
        });

        unlockedBadges.push(newBadge);
    }

    return unlockedBadges;
};

module.exports = {
    awardBadges
};