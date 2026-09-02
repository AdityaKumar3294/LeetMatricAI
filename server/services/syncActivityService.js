const { addActivity } = require("./activityService");

const syncActivities = async ({
    user,
    oldStats,
    newStats
}) => {

    // ===================================================
    // Solved Problems
    // ===================================================

    const solvedDifference =
        newStats.totalSolved -
        oldStats.totalSolved;


    if (solvedDifference > 0) {

        const easyDifference =
            newStats.easySolved -
            oldStats.easySolved;

        const mediumDifference =
            newStats.mediumSolved -
            oldStats.mediumSolved;

        const hardDifference =
            newStats.hardSolved -
            oldStats.hardSolved;


        await addActivity({

            user: user._id,

            title:
                `Solved ${solvedDifference} New Problem${solvedDifference > 1 ? "s" : ""}`,

            description:
                `Easy +${easyDifference}, ` +
                `Medium +${mediumDifference}, ` +
                `Hard +${hardDifference}`,

            type: "leetcode",

            solvedCount: solvedDifference

        });

    }


    // ===================================================
    // Streak Increased
    // ===================================================

    if (user.streak > oldStats.streak) {

        await addActivity({

            user: user._id,

            title: "Daily Streak Increased",

            description:
                `Current streak is ${user.streak} day${user.streak > 1 ? "s" : ""}.`,

            type: "streak",

            solvedCount: 0

        });

    }

};


module.exports = {
    syncActivities
};