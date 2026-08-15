const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    validateFriend
} = require("../validators/friendValidator");

const {
    addFriend,
    getFriends,
    compareFriend,
    removeFriend,
    aiCompareFriend,
    searchUsers,
    getPublicProfile
} = require("../controllers/friendController");


// ==============================
// Add Friend
// ==============================

router.post(
    "/add",
    authMiddleware,
    validateFriend,
    addFriend
);


// ==============================
// Get Friends List
// ==============================

router.get(
    "/",
    authMiddleware,
    getFriends
);


// ==============================
// Compare Friend
// ==============================

router.get(
    "/compare/:friendId",
    authMiddleware,
    compareFriend
);


// ==============================
// Remove Friend
// ==============================

router.delete(
    "/remove/:friendId",
    authMiddleware,
    removeFriend
);


// ==============================
// AI Friend Comparison
// ==============================

router.get(
    "/compare-ai/:friendId",
    authMiddleware,
    aiCompareFriend
);


// ==============================
// Search Users
// ==============================

router.get(
    "/search",
    authMiddleware,
    searchUsers
);

// Public User Profile
router.get(
    "/profile/:userId",
    authMiddleware,
    getPublicProfile
);

module.exports = router;