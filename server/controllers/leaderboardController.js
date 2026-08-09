const User = require("../models/User");

const getLeaderboard = async (req, res) => {

    try {

        const users = await User.find({})
            .select(
                "name leetcodeUsername xp streak leetcodeStats.totalSolved"
            )
            .sort({
                xp: -1,
                "leetcodeStats.totalSolved": -1
            });

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            leetcodeUsername: user.leetcodeUsername,
            xp: user.xp || 0,
            streak: user.streak || 0,
            totalSolved: user.leetcodeStats?.totalSolved || 0
        }));

        res.status(200).json({
            success: true,
            totalUsers: leaderboard.length,
            leaderboard
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
    getLeaderboard
};