const XPHistory = require("../models/XPHistory");

const addXPHistory = async ({
    user,
    amount,
    reason,
    type = "other"
}) => {

    if (!user || !amount || amount <= 0) {
        return null;
    }

    return await XPHistory.create({

        user:
            typeof user === "object"
                ? user._id
                : user,

        amount,

        reason,

        type

    });
};

const getXPHistory = async (userId, limit = 10) => {

    return await XPHistory.find({
        user: userId
    })
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = {
    addXPHistory,
    getXPHistory
};