const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    downloadReport
} = require("../controllers/pdfController");

// Download LeetMetricAI Report
router.get(
    "/report",
    authMiddleware,
    downloadReport
);

module.exports = router;