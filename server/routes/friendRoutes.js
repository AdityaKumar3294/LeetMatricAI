const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addFriend,
    getFriends,
    compareFriend,
    removeFriend,
    aiCompareFriend
} = require("../controllers/friendController");

// Add Friend
router.post(
    "/add",
    authMiddleware,
    addFriend
);

// Get Friends List
router.get(
    "/",
    authMiddleware,
    getFriends
);

router.get(
    "/compare/:friendId",
    authMiddleware,
    compareFriend
);

// Remove Friend
router.delete(
    "/remove/:friendId",
    authMiddleware,
    removeFriend
);

router.get(
    "/compare-ai/:friendId",
    authMiddleware,
    aiCompareFriend
);

module.exports = router;