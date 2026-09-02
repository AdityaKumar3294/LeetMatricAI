const RecentActivity = require("../models/RecentActivity");

const addActivity = async ({
    user,
    title,
    description,
    type,
    solvedCount = 0
}) => {

    try {

        console.log("🔥 ADD ACTIVITY CALLED");

        console.log("🔥 Activity Data:", {
            user,
            title,
            description,
            type,
            solvedCount
        });

        console.log(
            "🔥 Model Schema Paths:",
            Object.keys(RecentActivity.schema.paths)
        );

        const activity = await RecentActivity.create({

            user,
            title,
            description,
            type,
            solvedCount

        });

        console.log(
            "🔥 SAVED ACTIVITY:",
            activity.toObject()
        );

    } catch (error) {

        console.log(
            "❌ Activity Error:",
            error.message
        );

    }

};

module.exports = {
    addActivity
};