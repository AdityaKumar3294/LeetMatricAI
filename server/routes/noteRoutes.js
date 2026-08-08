const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote,
    togglePinNote,
    searchNotes
} = require("../controllers/noteController");

router.post(
    "/create",
    authMiddleware,
    createNote
);

router.get(
    "/all",
    authMiddleware,
    getAllNotes
);


router.put(
    "/update/:id",
    authMiddleware,
    updateNote
);

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteNote
);

router.patch(
    "/pin/:id",
    authMiddleware,
    togglePinNote
);

router.get(
    "/search",
    authMiddleware,
    searchNotes
);

module.exports = router;