const Badge = require("../models/Badge");

const getMyBadges = async (req, res) => {

    try {

        const badges = await Badge.find({
            user: req.user.id
        }).sort({
            unlockedAt: -1
        });

        res.status(200).json({
            success: true,
            total: badges.length,
            badges
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
    getMyBadges
};