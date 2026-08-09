const User = require("../models/User");

const getStatistics = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const stats = user.leetcodeStats || {};

        const totalSolved = stats.totalSolved || 0;
        const easySolved = stats.easySolved || 0;
        const mediumSolved = stats.mediumSolved || 0;
        const hardSolved = stats.hardSolved || 0;

        const difficultyChart = [
            {
                name: "Easy",
                value: easySolved
            },
            {
                name: "Medium",
                value: mediumSolved
            },
            {
                name: "Hard",
                value: hardSolved
            }
        ];

        const progressCards = {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking: stats.ranking || "N/A",
            reputation: stats.reputation || 0,
            xp: user.xp || 0,
            streak: user.streak || 0
        };

        const percentages = {
            easy:
                totalSolved > 0
                    ? ((easySolved / totalSolved) * 100).toFixed(1)
                    : 0,

            medium:
                totalSolved > 0
                    ? ((mediumSolved / totalSolved) * 100).toFixed(1)
                    : 0,

            hard:
                totalSolved > 0
                    ? ((hardSolved / totalSolved) * 100).toFixed(1)
                    : 0
        };

        res.status(200).json({
            success: true,
            difficultyChart,
            progressCards,
            percentages
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
    getStatistics
};