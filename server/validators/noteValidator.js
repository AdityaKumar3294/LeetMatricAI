const validator = require("validator");

const validateNote = (req, res, next) => {

    const { title, content } = req.body;

    if (!title || validator.isEmpty(title.trim())) {
        return res.status(400).json({
            success: false,
            message: "Title is required."
        });
    }

    if (!content || validator.isEmpty(content.trim())) {
        return res.status(400).json({
            success: false,
            message: "Content is required."
        });
    }

    next();
};

module.exports = {
    validateNote
};