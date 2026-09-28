const express = require("express");

const {
    getActivityHeatmap,
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/heatmap",
    authMiddleware,
    getActivityHeatmap
);

module.exports = router;