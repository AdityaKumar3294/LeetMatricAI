const Badge = require("../models/Badge");
const badgeDefinitions = require("../data/badges");

const { addActivity } = require("./activityService");


const awardBadges = async (user) => {

    const unlockedBadges = [];

    const stats = user.leetcodeStats || {};


    // ===================================================
    // Check All Badge Definitions
    // ===================================================

    for (const badge of badgeDefinitions) {

        const value =
            stats[badge.field] || 0;


        if (value < badge.requirement) {
            continue;
        }


        // ===============================================
        // Check Already Unlocked
        // ===============================================

        const alreadyUnlocked =
            await Badge.findOne({

                user: user._id,

                badgeName:
                    badge.badgeName

            });


        if (alreadyUnlocked) {
            continue;
        }


        // ===============================================
        // Create Badge
        // ===============================================

        const newBadge =
            await Badge.create({

                user: user._id,

                badgeName:
                    badge.badgeName,

                badgeType:
                    badge.badgeType,

                icon:
                    badge.icon,

                description:
                    badge.description

            });


        unlockedBadges.push(newBadge);


        // ===============================================
        // Recent Activity
        // ===============================================

        await addActivity({

            user: user._id,

            title:
                "Badge Unlocked",

            description:
                `${badge.badgeName} — ${badge.description}`,

            type:
                "badge",

            solvedCount:
                0

        });

    }


    return unlockedBadges;

};


module.exports = {
    awardBadges
};