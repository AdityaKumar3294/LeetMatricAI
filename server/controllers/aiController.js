const User = require("../models/User");

const {
    generateAIAnalysis,
    generateStudyPlan,
    generateCompanyRoadmap,
    generateInterviewQuestions,
    analyzeResume,
    explainCode,
    findBugs,
    optimizeCode,
    analyzeComplexity,
    convertCode,
    generateCodeFromProblem,
    codingAssistantChat,
    generateFriendComparison
} = require("../services/aiService");


// ============================================================
// Helper: Get Current User
// ============================================================

const getCurrentUser = async (req) => {

    if (!req.user || !req.user.id) {
        throw new Error("User authentication information not found");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


// ============================================================
// Build Profile Data
// ============================================================

const buildProfileData = (user) => {

    return {

        username:
            user.leetcodeUsername || user.name || "",

        totalSolved:
            user.leetcodeStats?.totalSolved || 0,

        easySolved:
            user.leetcodeStats?.easySolved || 0,

        mediumSolved:
            user.leetcodeStats?.mediumSolved || 0,

        hardSolved:
            user.leetcodeStats?.hardSolved || 0,

        ranking:
            user.leetcodeStats?.ranking || 0,

        reputation:
            user.leetcodeStats?.reputation || 0,

        xp:
            user.xp || 0,

        streak:
            user.streak || 0,

        xpBreakdown: {

            easy:
                user.xpBreakdown?.easy || 0,

            medium:
                user.xpBreakdown?.medium || 0,

            hard:
                user.xpBreakdown?.hard || 0,

            streak:
                user.xpBreakdown?.streak || 0,

            badges:
                user.xpBreakdown?.badges || 0
        },

        lastActive:
            user.lastActive || null,

        lastSynced:
            user.leetcodeStats?.lastSynced || null
    };
};


// ============================================================
// AI PERFORMANCE ANALYSIS
// GET /api/ai/analysis
// ============================================================

const getAIAnalysis = async (req, res) => {
    try {
        console.log("=> [AI Controller] 1. Received request for AI Analysis...");
        
        const user = await getCurrentUser(req);
        console.log("=> [AI Controller] 2. User authenticated successfully.");
        
        const profileData = buildProfileData(user);
        console.log("=> [AI Controller] 3. Profile data built. Calling Gemini API...");

        // If the server hangs, it will be on this exact line
        const analysis = await generateAIAnalysis(profileData);
        
        console.log("=> [AI Controller] 4. Gemini analysis generated successfully!");

        res.status(200).json({
            success: true,
            data: analysis 
        });

    } catch (error) {
        console.error("=> [AI Controller Error]:", error);
        res.status(500).json({
            success: false,
            message: error.message || "AI Analysis Failed"
        });
    }
};


// ============================================================
// AI STUDY PLAN
// GET /api/ai/study-plan
// ============================================================

const getStudyPlan = async (req, res) => {

    try {

        const user = await getCurrentUser(req);

        const profileData =
            buildProfileData(user);

        const studyPlan =
            await generateStudyPlan(profileData);


        // Save latest study plan
        user.studyPlan = {

            content: studyPlan,

            generatedAt: new Date()

        };

        await user.save();


        res.status(200).json({

            success: true,

            studyPlan

        });

    } catch (error) {

        console.error(
            "Study Plan Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Study Plan Failed"

        });

    }

};


// ============================================================
// COMPANY ROADMAP
// GET /api/ai/company-roadmap/:company
// ============================================================

const getCompanyRoadmap = async (req, res) => {

    try {

        const user = await getCurrentUser(req);

        const company =
            req.params.company;


        if (!company || !company.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Company name is required"

            });

        }


        const profileData =
            buildProfileData(user);


        const roadmap =
            await generateCompanyRoadmap(
                profileData,
                company
            );


        // Save roadmap
        const existingIndex =
            user.companyRoadmaps.findIndex(
                item =>
                    item.company.toLowerCase() ===
                    company.toLowerCase()
            );


        if (existingIndex !== -1) {

            user.companyRoadmaps[
                existingIndex
            ].content = roadmap;

            user.companyRoadmaps[
                existingIndex
            ].generatedAt = new Date();

        } else {

            user.companyRoadmaps.push({

                company,

                content: roadmap,

                generatedAt: new Date()

            });

        }


        await user.save();


        res.status(200).json({

            success: true,

            company,

            roadmap

        });

    } catch (error) {

        console.error(
            "Company Roadmap Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Company Roadmap Failed"

        });

    }

};


// ============================================================
// INTERVIEW QUESTIONS
// GET /api/ai/interview-questions/:company
// ============================================================

const getInterviewQuestions = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(req);

        const company =
            req.params.company;


        if (!company || !company.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Company name is required"

            });

        }


        const profileData =
            buildProfileData(user);


        const questions =
            await generateInterviewQuestions(
                profileData,
                company
            );


        res.status(200).json({

            success: true,

            company,

            questions

        });

    } catch (error) {

        console.error(
            "Interview Questions Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Interview Questions Failed"

        });

    }

};


// ============================================================
// RESUME ANALYSIS
// ============================================================

const getResumeAnalysis = async (
    req,
    res
) => {

    try {

        const resumeText =
            req.body?.resumeText;


        if (
            !resumeText ||
            !resumeText.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Resume text is required"

            });

        }


        const analysis =
            await analyzeResume(
                resumeText
            );


        res.status(200).json({

            success: true,

            analysis

        });

    } catch (error) {

        console.error(
            "Resume Analysis Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Resume Analysis Failed"

        });

    }

};


// ============================================================
// EXPLAIN CODE
// POST /api/ai/explain
// ============================================================

const getExplainCode = async (
    req,
    res
) => {

    try {

        const {
            code,
            language
        } = req.body;


        if (
            !code ||
            !code.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Code is required"

            });

        }


        const result =
            await explainCode(
                code,
                language || "javascript"
            );


        res.status(200).json({

            success: true,

            explanation: result

        });

    } catch (error) {

        console.error(
            "Explain Code Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Code Explanation Failed"

        });

    }

};


// ============================================================
// FIND BUGS
// POST /api/ai/find-bugs
// ============================================================

const getBugAnalysis = async (
    req,
    res
) => {

    try {

        const {
            code,
            language
        } = req.body;


        if (
            !code ||
            !code.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Code is required"

            });

        }


        const result =
            await findBugs(
                code,
                language || "javascript"
            );


        res.status(200).json({

            success: true,

            analysis: result

        });

    } catch (error) {

        console.error(
            "Bug Analysis Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Bug Analysis Failed"

        });

    }

};


// ============================================================
// OPTIMIZE CODE
// POST /api/ai/optimize
// ============================================================

const getOptimizedCode = async (
    req,
    res
) => {

    try {

        const {
            code,
            language
        } = req.body;


        if (
            !code ||
            !code.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Code is required"

            });

        }


        const result =
            await optimizeCode(
                code,
                language || "javascript"
            );


        res.status(200).json({

            success: true,

            result

        });

    } catch (error) {

        console.error(
            "Optimize Code Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Code Optimization Failed"

        });

    }

};


// ============================================================
// COMPLEXITY ANALYSIS
// POST /api/ai/complexity
// ============================================================

const getComplexityAnalysis = async (
    req,
    res
) => {

    try {

        const {
            code,
            language
        } = req.body;


        if (
            !code ||
            !code.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Code is required"

            });

        }


        const result =
            await analyzeComplexity(
                code,
                language || "javascript"
            );


        res.status(200).json({

            success: true,

            analysis: result

        });

    } catch (error) {

        console.error(
            "Complexity Analysis Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Complexity Analysis Failed"

        });

    }

};


// ============================================================
// CODE CONVERSION
// POST /api/ai/convert
// ============================================================

const getConvertedCode = async (
    req,
    res
) => {

    try {

        const {
            code,
            sourceLanguage,
            targetLanguage
        } = req.body;


        if (
            !code ||
            !code.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Code is required"

            });

        }


        if (
            !sourceLanguage ||
            !targetLanguage
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Source and target languages are required"

            });

        }


        const result =
            await convertCode(
                code,
                sourceLanguage,
                targetLanguage
            );


        res.status(200).json({

            success: true,

            convertedCode: result

        });

    } catch (error) {

        console.error(
            "Code Conversion Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Code Conversion Failed"

        });

    }

};


// ============================================================
// GENERATE CODE FROM PROBLEM
// POST /api/ai/generate-code
// ============================================================

const getGeneratedCodeFromProblem = async (
    req,
    res
) => {

    try {

        const {
            problem,
            language
        } = req.body;


        if (
            !problem ||
            !problem.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Problem statement is required"

            });

        }


        const result =
            await generateCodeFromProblem(
                problem,
                language || "javascript"
            );


        res.status(200).json({

            success: true,

            result

        });

    } catch (error) {

        console.error(
            "Code Generation Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Code Generation Failed"

        });

    }

};


// ============================================================
// AI CODING ASSISTANT
// POST /api/ai/chat
// ============================================================

const getCodingAssistantReply = async (
    req,
    res
) => {

    try {

        const {
            message
        } = req.body;


        if (
            !message ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Message is required"

            });

        }


        const reply =
            await codingAssistantChat(
                message
            );


        res.status(200).json({

            success: true,

            reply

        });

    } catch (error) {

        console.error(
            "AI Chat Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "AI Chat Failed"

        });

    }

};


// ============================================================
// AI HISTORY
// ============================================================

// GET /api/ai/history

const getAIHistory = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(req);


        const history =
            [...(user.aiHistory || [])]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );


        res.status(200).json({

            success: true,

            history

        });

    } catch (error) {

        console.error(
            "Get AI History Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch AI history"

        });

    }

};


// ============================================================
// DELETE ONE AI HISTORY ITEM
// DELETE /api/ai/history/:id
// ============================================================

const deleteAIHistoryItem = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(req);

        const historyId =
            req.params.id;


        const historyItem =
            user.aiHistory.id(
                historyId
            );


        if (!historyItem) {

            return res.status(404).json({

                success: false,

                message:
                    "AI history item not found"

            });

        }


        historyItem.deleteOne();

        await user.save();


        res.status(200).json({

            success: true,

            message:
                "AI history item deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete AI History Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete AI history item"

        });

    }

};


// ============================================================
// CLEAR AI HISTORY
// DELETE /api/ai/history
// ============================================================

const clearAIHistory = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(req);


        user.aiHistory = [];

        await user.save();


        res.status(200).json({

            success: true,

            message:
                "AI history cleared successfully"

        });

    } catch (error) {

        console.error(
            "Clear AI History Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to clear AI history"

        });

    }

};


// ============================================================
// AI FRIEND COMPARISON
// ============================================================

const getFriendComparison = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(req);


        const friendId =
            req.params.friendId ||
            req.params.userId;


        if (!friendId) {

            return res.status(400).json({

                success: false,

                message:
                    "Friend ID is required"

            });

        }


        const friend =
            await User.findById(friendId);


        if (!friend) {

            return res.status(404).json({

                success: false,

                message:
                    "Friend not found"

            });

        }


        const yourProfile = {

            leetcodeUsername:
                user.leetcodeUsername,

            totalSolved:
                user.leetcodeStats?.totalSolved || 0,

            easySolved:
                user.leetcodeStats?.easySolved || 0,

            mediumSolved:
                user.leetcodeStats?.mediumSolved || 0,

            hardSolved:
                user.leetcodeStats?.hardSolved || 0,

            ranking:
                user.leetcodeStats?.ranking || 0

        };


        const friendProfile = {

            leetcodeUsername:
                friend.leetcodeUsername,

            totalSolved:
                friend.leetcodeStats?.totalSolved || 0,

            easySolved:
                friend.leetcodeStats?.easySolved || 0,

            mediumSolved:
                friend.leetcodeStats?.mediumSolved || 0,

            hardSolved:
                friend.leetcodeStats?.hardSolved || 0,

            ranking:
                friend.leetcodeStats?.ranking || 0

        };


        const comparison =
            await generateFriendComparison(
                yourProfile,
                friendProfile
            );


        res.status(200).json({

            success: true,

            comparison

        });

    } catch (error) {

        console.error(
            "AI Friend Comparison Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "AI Friend Comparison Failed"

        });

    }

};


// ============================================================
// EXPORT CONTROLLERS
// ============================================================

module.exports = {

    getAIAnalysis,

    getStudyPlan,

    getCompanyRoadmap,

    getInterviewQuestions,

    getResumeAnalysis,

    getExplainCode,

    getBugAnalysis,

    getOptimizedCode,

    getComplexityAnalysis,

    getConvertedCode,

    getGeneratedCodeFromProblem,

    getCodingAssistantReply,

    getAIHistory,

    deleteAIHistoryItem,

    clearAIHistory,

    getFriendComparison

};