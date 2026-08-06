const extractTextFromPDF = require("../utils/pdfExtractor");
const { analyzeResume } = require("../services/resumeAIService");

const {
    compareResumeAnalysis,
} = require("../services/resumeComparisonService");

const User = require("../models/User");

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume."
            });
        }

        // Extract text
        const resumeText = await extractTextFromPDF(req.file.path);

        // Analyze using Gemini
        const analysis = await analyzeResume(resumeText);

        // Save to user's resume history
        const user = await User.findById(req.user.id);

        user.resumeHistory.push({
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            extractedText: resumeText,
            analysis
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "Resume analyzed successfully.",
            analysis,
            totalResumes: user.resumeHistory.length,
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
                size: req.file.size
            }
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
// Get Resume History
// ==============================
const getResumeHistory = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            totalResumes: user.resumeHistory.length,
            resumes: user.resumeHistory
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
// Get Single Resume
// ==============================
const getResumeById = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resume = user.resumeHistory.id(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.status(200).json({
            success: true,
            resume
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Compare Two Resumes
const compareResumes = async (req, res) => {
    try {

        const { oldResumeId, newResumeId } = req.body;

        if (!oldResumeId || !newResumeId) {
            return res.status(400).json({
                success: false,
                message: "Both Resume IDs are required."
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const oldResume = user.resumeHistory.id(oldResumeId);
        const newResume = user.resumeHistory.id(newResumeId);

        if (!oldResume || !newResume) {
            return res.status(404).json({
                success: false,
                message: "One or both resumes not found."
            });
        }

        const comparison = await compareResumeAnalysis(
            oldResume.analysis,
            newResume.analysis
        );

        res.status(200).json({
            success: true,
            comparison,
            oldResume,
            newResume
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
    uploadResume,
    getResumeHistory,
    getResumeById,
    compareResumes
};