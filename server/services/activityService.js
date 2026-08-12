const RecentActivity = require("../models/RecentActivity");

const addActivity = async ({
    user,
    title,
    description,
    type
}) => {

    try {

        await RecentActivity.create({
            user,
            title,
            description,
            type
        });

    } catch (error) {

        console.log("Activity Error:", error.message);

    }

};

module.exports = {
    addActivity
};