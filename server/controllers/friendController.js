const User = require("../models/User");
const { generateFriendComparison } = require("../services/aiService");

// ==============================
// Add Friend
const addFriend = async (req, res) => {

    try {

        const { leetcodeUsername } = req.body;

        if (!leetcodeUsername) {

            return res.status(400).json({

                success: false,

                message: "LeetCode username is required."

            });

        }


        // ==========================================
        // Current User
        // ==========================================

        const currentUser =
            await User.findById(req.user.id);

        if (!currentUser) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        // ==========================================
        // Find Friend
        // ==========================================

        const friend =
            await User.findOne({
                leetcodeUsername
            });

        if (!friend) {

            return res.status(404).json({

                success: false,

                message: "Friend not found."

            });

        }


        // ==========================================
        // Prevent Self
        // ==========================================

        if (
            friend._id.toString() ===
            currentUser._id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message: "You cannot add yourself."

            });

        }


        // ==========================================
        // Check Existing Friendship
        // ==========================================

        const alreadyFriend =
            currentUser.friends.some(

                (id) =>
                    id.toString() ===
                    friend._id.toString()

            );


        if (alreadyFriend) {

            return res.status(400).json({

                success: false,

                message: "You are already friends."

            });

        }


        // ==========================================
        // Add Mutual Friendship
        // ==========================================

        currentUser.friends.push(
            friend._id
        );

        friend.friends.push(
            currentUser._id
        );


        // ==========================================
        // Save Both Users
        // ==========================================

        await currentUser.save();

        await friend.save();


        // ==========================================
        // Response
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Friend added successfully.",

            friend: {

                id: friend._id,

                name: friend.name,

                email: friend.email,

                leetcodeUsername:
                    friend.leetcodeUsername

            }

        });

    }

    catch (error) {

        console.log(
            "Add Friend Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==============================
// Search Users
// ==============================

const searchUsers = async (req, res) => {

    try {

        const { query } = req.query;

        if (!query || query.trim() === "") {

            return res.status(400).json({

                success: false,
                message: "Search query is required."

            });

        }

        const searchRegex =
            new RegExp(query.trim(), "i");

        const currentUser =
            await User.findById(req.user.id)
                .select("friends");

        if (!currentUser) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        const users = await User.find({

            _id: {
                $ne: req.user.id
            },

            $or: [

                {
                    name: searchRegex
                },

                {
                    leetcodeUsername: searchRegex
                },

                {
                    email: searchRegex
                }

            ]

        })
            .select(
                "name email leetcodeUsername leetcodeStats xp"
            )
            .limit(20);


        const usersWithStatus =
            users.map((user) => {

                const isFriend =
                    currentUser.friends.some(

                        (friendId) =>
                            friendId.toString() ===
                            user._id.toString()

                    );

                return {

                    ...user.toObject(),

                    isFriend

                };

            });


        return res.status(200).json({

            success: true,

            totalUsers:
                usersWithStatus.length,

            users:
                usersWithStatus

        });

    }

    catch (error) {

        console.log(
            "Search Users Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

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
// Get Public User Profile
// ==============================
const getPublicProfile = async (req, res) => {

    try {

        const { userId } = req.params;

        const currentUser =
            await User.findById(req.user.id)
                .select("friends");

        if (!currentUser) {

            return res.status(404).json({

                success: false,
                message: "Current user not found."

            });

        }


        const user =
            await User.findById(userId)
                .select(
                    "name leetcodeUsername leetcodeStats xp streak friends"
                );

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }


        const stats =
            user.leetcodeStats || {};


        const isFriend =
            currentUser.friends.some(

                (friendId) =>
                    friendId.toString() ===
                    user._id.toString()

            );


        return res.status(200).json({

            success: true,

            profile: {

                id: user._id,

                name: user.name,

                leetcodeUsername:
                    user.leetcodeUsername,

                avatar:
                    stats.avatar || null,

                totalSolved:
                    stats.totalSolved || 0,

                easySolved:
                    stats.easySolved || 0,

                mediumSolved:
                    stats.mediumSolved || 0,

                hardSolved:
                    stats.hardSolved || 0,

                ranking:
                    stats.ranking || "N/A",

                reputation:
                    stats.reputation || 0,

                xp:
                    user.xp || 0,

                streak:
                    user.streak || 0,

                friendsCount:
                    user.friends?.length || 0,

                isFriend

            }

        });

    }

    catch (error) {

        console.log(
            "Public Profile Error:",
            error
        );

        return res.status(500).json({

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
    aiCompareFriend,
    searchUsers,
    getPublicProfile
};