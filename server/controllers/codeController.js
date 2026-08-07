const {
    explainCode,
    findBugs
} = require("../services/codeAIService");

const explainUserCode = async (req, res) => {
    try {

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required.",
            });
        }

        const explanation = await explainCode(code, language);

        res.status(200).json({
            success: true,
            explanation,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const findCodeBugs = async (req, res) => {
    try {

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required."
            });
        }

        const analysis = await findBugs(code, language);

        res.status(200).json({
            success: true,
            analysis
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
    explainUserCode,
    findCodeBugs
};