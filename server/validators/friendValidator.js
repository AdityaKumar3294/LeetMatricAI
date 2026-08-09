const validator = require("validator");

const validateFriend = (req, res, next) => {

    const { username } = req.body;

    if (!username || validator.isEmpty(username.trim())) {

        return res.status(400).json({

            success: false,

            message: "Friend username is required."

        });

    }

    next();

};

module.exports = {
    validateFriend
};