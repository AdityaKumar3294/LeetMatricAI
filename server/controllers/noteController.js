const Note = require("../models/Note");
const mongoose = require("mongoose");

// ==============================
// Create Note
// ==============================
const createNote = async (req, res) => {

    try {

        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const note = await Note.create({

            user: req.user.id,

            title,

            content,

            tags: tags || []

        });

        res.status(201).json({

            success: true,

            message: "Note created successfully.",

            note

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==============================
// Get All Notes
// ==============================
const getAllNotes = async (req, res) => {

    try {

        const notes = await Note.find({

            user: req.user.id

        })
        .sort({
            pinned: -1,
            createdAt: -1
        });

        res.status(200).json({

            success: true,

            total: notes.length,

            notes

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==============================
// Get Single Note
// ==============================

const getNoteById = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // Validate MongoDB ObjectId
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid note ID."

            });

        }


        // ==========================================
        // Find User's Note
        // ==========================================

        const note =
            await Note.findOne({

                _id: id,

                user: req.user.id

            });


        // ==========================================
        // Not Found
        // ==========================================

        if (!note) {

            return res.status(404).json({

                success: false,

                message: "Note not found."

            });

        }


        // ==========================================
        // Response
        // ==========================================

        return res.status(200).json({

            success: true,

            note

        });

    } catch (error) {

        console.log(
            "Get Note By ID Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==============================
// Update Note
// ==============================
const updateNote = async (req, res) => {

    try {

        const { id } = req.params;

        const { title, content, tags } = req.body;

        const note = await Note.findOne({
            _id: id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        if (title !== undefined) {
            note.title = title;
        }

        if (content !== undefined) {
            note.content = content;
        }

        if (tags !== undefined) {
            note.tags = tags;
        }

        await note.save();

        res.status(200).json({
            success: true,
            message: "Note updated successfully.",
            note
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Delete Note
// ==============================
const deleteNote = async (req, res) => {

    try {

        const { id } = req.params;

        const note = await Note.findOne({
            _id: id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        await Note.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Pin / Unpin Note
// ==============================
const togglePinNote = async (req, res) => {

    try {

        const { id } = req.params;

        const note = await Note.findOne({
            _id: id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        note.pinned = !note.pinned;

        await note.save();

        res.status(200).json({
            success: true,
            message: note.pinned
                ? "Note pinned successfully."
                : "Note unpinned successfully.",
            note
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Search Notes
// ==============================
const searchNotes = async (req, res) => {

    try {

        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required."
            });
        }

        const notes = await Note.find({
            user: req.user.id,
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { content: { $regex: keyword, $options: "i" } },
                { tags: { $regex: keyword, $options: "i" } }
            ]
        }).sort({
            pinned: -1,
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            total: notes.length,
            notes
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePinNote,
    searchNotes
};