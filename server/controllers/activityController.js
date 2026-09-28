const RecentActivity = require("../models/RecentActivity");

const getActivityHeatmap = async (req, res) => {
    try {
        const userId = req.user.id;

        // Last 12 months
        const endDate = new Date();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 365);

        const activities = await RecentActivity.find({
            user: userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
            solvedCount: {
                $gt: 0,
            },
        }).sort({
            createdAt: 1,
        });

        // Aggregate solved problems by date
        const activityMap = {};

        activities.forEach((activity) => {
            const date = new Date(activity.createdAt)
                .toISOString()
                .split("T")[0];

            if (!activityMap[date]) {
                activityMap[date] = 0;
            }

            activityMap[date] += activity.solvedCount || 0;
        });

        const heatmap = Object.entries(activityMap).map(
            ([date, solved]) => ({
                date,
                solved,
            })
        );

        res.status(200).json({
            success: true,
            heatmap,
        });

    } catch (error) {

        console.error(
            "ACTIVITY HEATMAP ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch activity heatmap",
        });
    }
};

module.exports = {
    getActivityHeatmap,
};