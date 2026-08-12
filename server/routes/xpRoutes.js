const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    getUserXPHistory
} = require(
    "../controllers/xpController"
);

router.get(
    "/history",
    authMiddleware,
    getUserXPHistory
);

module.exports = router;