const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getStatistics
} = require("../controllers/statisticsController");

router.get(
    "/",
    authMiddleware,
    getStatistics
);

module.exports = router;