const validator = require("validator");

const validateFriend = (req, res, next) => {

    const { leetcodeUsername } = req.body;

    if (
        !leetcodeUsername ||
        validator.isEmpty(leetcodeUsername.trim())
    ) {

        return res.status(400).json({

            success: false,

            message: "LeetCode username is required."

        });

    }

    next();

};

module.exports = {
    validateFriend
};