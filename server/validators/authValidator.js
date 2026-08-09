const validator = require("validator");

const validateRegister = (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || validator.isEmpty(name.trim())) {
        return res.status(400).json({
            success: false,
            message: "Name is required."
        });
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email."
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters."
        });
    }

    next();
};

const validateLogin = (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email."
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required."
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin
};