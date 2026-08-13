const User = require("../models/User");

const {
    calculateLeaderboardData
} = require("../services/leaderboardService");

// ======================================
// Get Leaderboard
// ======================================

const getLeaderboard = async (req, res) => {

    try {

        // ======================================
        // Get Users
        // ======================================

        const users = await User.find({})
            .select(
                "name leetcodeUsername leetcodeStats xp streak"
            )
            .lean();


        // ======================================
        // Calculate Leaderboard
        // ======================================

        const leaderboard =
            calculateLeaderboardData(users);


        // ======================================
        // Find Current User
        // ======================================

        const currentUser =
            leaderboard.find(

                (user) =>
                    user.id.toString() ===
                    req.user.id.toString()

            );


        // ======================================
        // Response
        // ======================================

        return res.status(200).json({

            success: true,

            totalUsers:
                leaderboard.length,

            leaderboard,

            currentUser:
                currentUser || null

        });

    }

    catch (error) {

        console.log(
            "Leaderboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {
    getLeaderboard
};