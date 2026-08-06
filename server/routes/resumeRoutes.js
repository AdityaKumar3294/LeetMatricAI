const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { uploadResume,
        getResumeHistory,
        getResumeById,
        compareResumes
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

// Upload Resume
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);


router.get(
    "/history",
    authMiddleware,
    getResumeHistory
);

router.get(
    "/:id",
    authMiddleware,
    getResumeById
);

router.post(
    "/compare",
    authMiddleware,
    compareResumes
);

module.exports = router;