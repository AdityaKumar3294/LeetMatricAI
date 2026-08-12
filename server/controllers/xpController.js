const {
    getXPHistory
} = require("../services/xpHistoryService");

const getUserXPHistory = async (req, res) => {

    try {

        const history = await getXPHistory(
            req.user.id,
            10
        );

        return res.status(200).json({

            success: true,

            history

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    getUserXPHistory
};