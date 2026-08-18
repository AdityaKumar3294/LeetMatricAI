const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    validateNote
} = require("../validators/noteValidator");

const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePinNote,
    searchNotes
} = require("../controllers/noteController");


// ==========================================
// Create Note
// ==========================================

router.post(
    "/create",
    authMiddleware,
    validateNote,
    createNote
);


// ==========================================
// Get All Notes
// ==========================================

router.get(
    "/all",
    authMiddleware,
    getAllNotes
);


// ==========================================
// Search Notes
// IMPORTANT: Keep this BEFORE /:id
// ==========================================

router.get(
    "/search",
    authMiddleware,
    searchNotes
);


// ==========================================
// Get Single Note
// IMPORTANT: Keep this AFTER specific routes
// ==========================================

router.get(
    "/:id",
    authMiddleware,
    getNoteById
);


// ==========================================
// Update Note
// ==========================================

router.put(
    "/update/:id",
    authMiddleware,
    updateNote
);


// ==========================================
// Delete Note
// ==========================================

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteNote
);


// ==========================================
// Pin / Unpin Note
// ==========================================

router.patch(
    "/pin/:id",
    authMiddleware,
    togglePinNote
);


module.exports = router;