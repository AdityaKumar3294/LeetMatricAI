const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyBadges
} = require("../controllers/badgeController");

router.get(
    "/my",
    authMiddleware,
    getMyBadges
);

module.exports = router;