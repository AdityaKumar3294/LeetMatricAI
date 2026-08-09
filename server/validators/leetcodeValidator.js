const validator = require("validator");

const validateLeetCodeUsername = (req, res, next) => {

    const { username } = req.params;

    if (!username || validator.isEmpty(username.trim())) {

        return res.status(400).json({

            success: false,

            message: "LeetCode username is required."

        });

    }

    next();

};

module.exports = {
    validateLeetCodeUsername
};