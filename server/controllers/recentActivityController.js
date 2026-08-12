const RecentActivity = require("../models/RecentActivity");

// ======================================
// Add Activity
// ======================================

const addRecentActivity = async (req, res) => {

    try {

        const { type, title, description } = req.body;

        const activity = await RecentActivity.create({

            user: req.user.id,

            type,

            title,

            description

        });

        res.status(201).json({

            success: true,

            message: "Activity Added Successfully",

            activity

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Get Logged-in User Activities
// ======================================

const getRecentActivities = async (req, res) => {

    try {

        const activities = await RecentActivity.find({

            user: req.user.id

        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({

            success: true,

            activities

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    addRecentActivity,
    getRecentActivities

};