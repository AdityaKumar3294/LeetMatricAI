const express = require("express");

const { explainUserCode,
        findCodeBugs
 } = require("../controllers/codeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/explain", authMiddleware, explainUserCode);
router.post("/bugs", authMiddleware, findCodeBugs);

module.exports = router;