const User = require("../models/User");
const { generateFriendComparison } = require("../services/aiService");

// ==============================
// Add Friend
// ==============================
const addFriend = async (req, res) => {
    try {

        const { leetcodeUsername } = req.body;

        if (!leetcodeUsername) {
            return res.status(400).json({
                success: false,
                message: "LeetCode username is required."
            });
        }

        // Logged in user
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Find friend by LeetCode username
        const friend = await User.findOne({
            leetcodeUsername
        });

        if (!friend) {
            return res.status(404).json({
                success: false,
                message: "Friend not found."
            });
        }

        // Prevent adding yourself
        if (friend._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot add yourself."
            });
        }

        // Already added?
        const alreadyAdded = currentUser.friends.some(
            (id) => id.toString() === friend._id.toString()
        );

        if (alreadyAdded) {
            return res.status(400).json({
                success: false,
                message: "Friend already added."
            });
        }

        // Add friend
        currentUser.friends.push(friend._id);

        await currentUser.save();

        res.status(200).json({
            success: true,
            message: "Friend added successfully.",
            friend: {
                name: friend.name,
                email: friend.email,
                leetcodeUsername: friend.leetcodeUsername
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Search User

const searchUsers = async (req, res) => {

    try {

        const { q } = req.query;

        if (!q) {

            return res.status(400).json({
                success: false,
                message: "Search query is required."
            });

        }

        const users = await User.find({

            _id: { $ne: req.user.id },

            $or: [

                {
                    name: {
                        $regex: q,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: q,
                        $options: "i"
                    }
                },

                {
                    leetcodeUsername: {
                        $regex: q,
                        $options: "i"
                    }
                }

            ]

        }).select(

            "name email leetcodeUsername leetcodeStats.avatar leetcodeStats.totalSolved xp"

        );

        res.status(200).json({

            success: true,

            totalResults: users.length,

            users

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
    searchUsers
};

// ==============================
// Get Friends List
// ==============================
const getFriends = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .populate(
                "friends",
                "name email leetcodeUsername leetcodeStats"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            totalFriends: user.friends.length,
            friends: user.friends
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Compare Friend
// ==============================
const compareFriend = async (req, res) => {
    try {

        const { friendId } = req.params;

        // Logged-in user
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if friend exists in user's friend list
        if (!currentUser.friends.includes(friendId)) {
            return res.status(404).json({
                success: false,
                message: "Friend not found in your friend list."
            });
        }

        // Fetch friend details
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({
                success: false,
                message: "Friend does not exist."
            });
        }

        const myStats = currentUser.leetcodeStats || {};
        const friendStats = friend.leetcodeStats || {};

        const mySolved = myStats.totalSolved || 0;
        const friendSolved = friendStats.totalSolved || 0;

        let winner = "Tie";

        if (mySolved > friendSolved)
            winner = currentUser.username;

        if (friendSolved > mySolved)
            winner = friend.username;

        res.status(200).json({
            success: true,

            comparison: {

                you: {
                    username: currentUser.username,
                    leetcodeUsername: currentUser.leetcodeUsername,
                    totalSolved: mySolved,
                    easySolved: myStats.easySolved || 0,
                    mediumSolved: myStats.mediumSolved || 0,
                    hardSolved: myStats.hardSolved || 0,
                    ranking: myStats.ranking || "N/A"
                },

                friend: {
                    username: friend.username,
                    leetcodeUsername: friend.leetcodeUsername,
                    totalSolved: friendSolved,
                    easySolved: friendStats.easySolved || 0,
                    mediumSolved: friendStats.mediumSolved || 0,
                    hardSolved: friendStats.hardSolved || 0,
                    ranking: friendStats.ranking || "N/A"
                },

                winner,

                difference: Math.abs(mySolved - friendSolved),

                message:
                    winner === "Tie"
                        ? "Both are performing equally well!"
                        : `${winner} is currently ahead.`
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// Remove Friend
// ==============================
const removeFriend = async (req, res) => {
    try {

        const { friendId } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if friend exists
        if (!user.friends.includes(friendId)) {
            return res.status(404).json({
                success: false,
                message: "Friend not found in your list."
            });
        }

        // Remove friend
        user.friends = user.friends.filter(
            id => id.toString() !== friendId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Friend removed successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// AI Friend Comparison
// ==============================

const aiCompareFriend = async (req, res) => {

    try {

        const { friendId } = req.params;

        const currentUser = await User.findById(req.user.id);

        const friend = await User.findById(friendId);

        if (!currentUser || !friend) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const aiReport = await generateFriendComparison(

            {
                leetcodeUsername: currentUser.leetcodeUsername,
                ...currentUser.leetcodeStats
            },

            {
                leetcodeUsername: friend.leetcodeUsername,
                ...friend.leetcodeStats
            }

        );

        res.status(200).json({
            success: true,
            report: aiReport
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
    addFriend,
    getFriends,
    removeFriend,
    compareFriend,
    aiCompareFriend
};