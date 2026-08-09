const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getPlacementScore
} = require("../controllers/placementController");

router.get(
    "/score",
    authMiddleware,
    getPlacementScore
);

module.exports = router;