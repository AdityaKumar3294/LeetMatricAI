const { addActivity } = require("./activityService");

const syncActivities = async ({
    user,
    oldStats,
    newStats
}) => {

    // -------------------------
    // Profile Synced
    // -------------------------

    await addActivity({

        user: user._id,

        title: "LeetCode Profile Synced",

        description:
            "Successfully synced your latest LeetCode profile.",

        type: "leetcode"

    });

    // -------------------------
    // Solved Problems
    // -------------------------

    const solvedDifference =
        newStats.totalSolved -
        oldStats.totalSolved;

    if (solvedDifference > 0) {

        await addActivity({

            user: user._id,

            title:
                `Solved ${solvedDifference} New Problem${solvedDifference > 1 ? "s" : ""}`,

            description:

                `Easy +${newStats.easySolved - oldStats.easySolved}, ` +

                `Medium +${newStats.mediumSolved - oldStats.mediumSolved}, ` +

                `Hard +${newStats.hardSolved - oldStats.hardSolved}`,

            type: "leetcode"

        });

    }

    // -------------------------
    // Streak
    // -------------------------

    if (user.streak > oldStats.streak) {

        await addActivity({

            user: user._id,

            title: "Daily Streak Increased",

            description:
                `Current streak is ${user.streak} day${user.streak > 1 ? "s" : ""}.`,

            type: "streak"

        });

    }

};

module.exports = {
    syncActivities
};