const User = require("../models/User");

const PDFDocument = require("pdfkit");

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
// STUDY PLAN GAMIFICATION
// ============================================================

const STUDY_DAY_XP = 50;

const STREAK_BONUS_XP = 10;

const MILESTONES = {
    1: {
        title: "First Step",
        message: "You completed your first study day!",
        bonusXP: 25
    },

    5: {
        title: "Getting Serious",
        message: "5 study days completed!",
        bonusXP: 50
    },

    10: {
        title: "DSA Warrior",
        message: "10 study days completed!",
        bonusXP: 100
    },

    15: {
        title: "Halfway Hero",
        message: "You're halfway through your roadmap!",
        bonusXP: 150
    },

    20: {
        title: "Consistency Master",
        message: "20 study days completed!",
        bonusXP: 200
    },

    30: {
        title: "DSA Champion",
        message: "You completed the entire 30-day roadmap!",
        bonusXP: 500
    }
};

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
// AI ANALYSIS CACHE HELPERS
// ============================================================

const createAnalysisSnapshot = (profileData) => {
    return {
        totalSolved: profileData.totalSolved || 0,
        easySolved: profileData.easySolved || 0,
        mediumSolved: profileData.mediumSolved || 0,
        hardSolved: profileData.hardSolved || 0,
        ranking: profileData.ranking || 0,
        reputation: profileData.reputation || 0,
        xp: profileData.xp || 0,
        streak: profileData.streak || 0
    };
};

const isSameAnalysisSnapshot = (savedSnapshot, currentSnapshot) => {
    if (!savedSnapshot) {
        return false;
    }

    return (
        savedSnapshot.totalSolved === currentSnapshot.totalSolved &&
        savedSnapshot.easySolved === currentSnapshot.easySolved &&
        savedSnapshot.mediumSolved === currentSnapshot.mediumSolved &&
        savedSnapshot.hardSolved === currentSnapshot.hardSolved &&
        savedSnapshot.ranking === currentSnapshot.ranking &&
        savedSnapshot.reputation === currentSnapshot.reputation &&
        savedSnapshot.xp === currentSnapshot.xp &&
        savedSnapshot.streak === currentSnapshot.streak
    );
};


// ============================================================
// GET AI PERFORMANCE ANALYSIS
// ============================================================

// ============================================================
// GET AI PERFORMANCE ANALYSIS
// GET /api/ai/analysis
//
// CACHE-FIRST
// ============================================================

const getAIAnalysis = async (req, res) => {

    try {

        console.log(
            "=> [AI Controller] 1. Received request for AI Analysis..."
        );


        // ------------------------------------------------------
        // GET USER
        // ------------------------------------------------------

        const user = await getCurrentUser(req);

        console.log(
            "=> [AI Controller] 2. User authenticated successfully."
        );


        // ------------------------------------------------------
        // BUILD PROFILE DATA
        // ------------------------------------------------------

        const profileData = buildProfileData(user);

        console.log(
            "=> [AI Controller] 3. Profile data built."
        );


        // ------------------------------------------------------
        // CURRENT PROFILE SNAPSHOT
        // ------------------------------------------------------

        const currentSnapshot =
            createAnalysisSnapshot(profileData);


        // ------------------------------------------------------
        // CHECK SAVED ANALYSIS
        // ------------------------------------------------------

        const savedAnalysis =
            user.aiAnalysis;


        const hasCachedAnalysis =
            savedAnalysis &&
            savedAnalysis.content &&
            savedAnalysis.generatedAt &&
            isSameAnalysisSnapshot(
                savedAnalysis.statsSnapshot,
                currentSnapshot
            );


        // ======================================================
        // CACHE HIT
        // ======================================================

        if (hasCachedAnalysis) {

            console.log(
                "🟢 [AI Controller] CACHE HIT"
            );

            console.log(
                "🟢 Returning saved AI analysis."
            );

            return res.status(200).json({

                success: true,

                data: savedAnalysis.content,

                cached: true,

                generatedAt:
                    savedAnalysis.generatedAt

            });
        }


        // ======================================================
        // CACHE MISS
        // ======================================================

        console.log(
            "🟡 [AI Controller] CACHE MISS"
        );

        console.log(
            "🟡 No valid cached analysis found."
        );

        console.log(
            "🟡 Calling Gemini API..."
        );


        // ------------------------------------------------------
        // GENERATE NEW ANALYSIS
        // ------------------------------------------------------

        const analysis =
            await generateAIAnalysis(
                profileData
            );


        console.log(
            "🟢 Gemini analysis generated successfully."
        );


        // ------------------------------------------------------
        // SAVE TO DATABASE
        // ------------------------------------------------------

        const generatedAt =
            new Date();


        user.aiAnalysis = {

            content: analysis,

            generatedAt,

            statsSnapshot:
                currentSnapshot

        };


        await user.save();


        console.log(
            "🟢 AI analysis saved to MongoDB."
        );


        // ------------------------------------------------------
        // RETURN NEW ANALYSIS
        // ------------------------------------------------------

        return res.status(200).json({

            success: true,

            data: analysis,

            cached: false,

            generatedAt

        });


    } catch (error) {

        console.error(
            "🔴 [AI Controller Error]:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "AI Analysis Failed"

        });
    }
};


// ============================================================
// FORCE REGENERATE AI PERFORMANCE ANALYSIS
// POST /api/ai/analysis/regenerate
// ============================================================

const regenerateAIAnalysis = async (req, res) => {
    try {
        console.log(
            "=> [AI Controller] 1. Force regeneration requested..."
        );

        const user = await getCurrentUser(req);

        console.log(
            "=> [AI Controller] 2. User authenticated successfully."
        );

        const profileData = buildProfileData(user);

        // ============================================================
        // CURRENT PROFILE SNAPSHOT
        // ============================================================

        const currentSnapshot = {
            totalSolved: profileData.totalSolved,
            easySolved: profileData.easySolved,
            mediumSolved: profileData.mediumSolved,
            hardSolved: profileData.hardSolved,
            ranking: profileData.ranking,
            reputation: profileData.reputation,
            xp: profileData.xp,
            streak: profileData.streak
        };

        // ============================================================
        // FORCE GEMINI GENERATION
        // ============================================================

        console.log(
            "=> [AI Controller] 3. Calling Gemini API for NEW analysis..."
        );

        const analysis =
            await generateAIAnalysis(profileData);

        console.log(
            "=> [AI Controller] 4. New Gemini analysis generated successfully!"
        );

        // ============================================================
        // SAVE NEW ANALYSIS
        // ============================================================

        user.aiAnalysis = {
            content: analysis,
            generatedAt: new Date(),
            statsSnapshot: currentSnapshot
        };

        await user.save();

        console.log(
            "=> [AI Controller] 5. New AI analysis saved to database."
        );

        return res.status(200).json({
            success: true,
            data: analysis,
            cached: false,
            regenerated: true,
            generatedAt: user.aiAnalysis.generatedAt
        });

    } catch (error) {

        console.error(
            "=> [AI Controller] Force Regeneration Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to regenerate AI analysis"
        });
    }
};

// ============================================================
// GENERATE NEW STUDY PLAN
// POST /api/ai/study-plan/generate
// ============================================================

const generateNewStudyPlan = async (req, res) => {

    try {

        const user =
            await getCurrentUser(req);

        const profileData =
            buildProfileData(user);

        console.log(
            "=> [AI Controller] Generating new Study Plan..."
        );

        const studyPlan =
            await generateStudyPlan(profileData);

        // ========================================================
        // Save NEW study plan
        // ========================================================
        //
        // When a completely new plan is generated, previous
        // completed days should be cleared.
        //
        // Otherwise Day 1 from an old plan could remain completed
        // in the new plan.
        // ========================================================

        user.studyPlan = {

        content: studyPlan,

        generatedAt: new Date(),

        completedDays: [],

        milestones: []

    };

        await user.save();

        console.log(
            "=> [AI Controller] Study Plan generated and saved."
        );

        res.status(200).json({

            success: true,

            studyPlan,

            generatedAt:
                user.studyPlan.generatedAt,

            completedDays:
                user.studyPlan.completedDays

        });

    } catch (error) {

        console.error(
            "Generate Study Plan Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Study Plan Generation Failed"

        });

    }

};


// ============================================================
// GET SAVED STUDY PLAN
// GET /api/ai/study-plan
// ============================================================

const getStudyPlan = async (req, res) => {

    try {

        const user =
            await getCurrentUser(req);


        // ========================================================
        // No study plan generated yet
        // ========================================================

        if (
            !user.studyPlan ||
            !user.studyPlan.content
        ) {

            return res.status(200).json({

                success: true,

                hasStudyPlan: false,

                studyPlan: null,

                generatedAt: null,

                completedDays: [],

                progress: {

                    completed: 0,

                    total: 30,

                    percentage: 0

                }

            });

        }


        // ========================================================
        // Get completed days
        // ========================================================

        const completedDays =
            user.studyPlan.completedDays || [];


        const completedCount =
            completedDays.length;


        const totalDays =
            30;


        const percentage =
            Math.round(
                (completedCount / totalDays) * 100
            );


        // ========================================================
        // Return saved study plan + progress
        // ========================================================

        res.status(200).json({

            success: true,

            hasStudyPlan: true,

            studyPlan:
                user.studyPlan.content,

            generatedAt:
                user.studyPlan.generatedAt,

            completedDays,

            progress: {

                completed:
                    completedCount,

                total:
                    totalDays,

                percentage

            }

        });

    } catch (error) {

        console.error(
            "Get Study Plan Controller Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch Study Plan"

        });

    }

};


// ============================================================
// COMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/complete
// ============================================================

const completeStudyPlanDay = async (req, res) => {

    try {

        const user = await getCurrentUser(req);

        // ========================================================
        // Validate Day
        // ========================================================

        const day = Number(req.params.day);

        if (
            !Number.isInteger(day) ||
            day < 1 ||
            day > 30
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Day must be an integer between 1 and 30"

            });

        }

        // ========================================================
        // Check Study Plan
        // ========================================================

        if (
            !user.studyPlan ||
            !user.studyPlan.content
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No study plan found. Generate a study plan first."

            });

        }

        // ========================================================
        // Make sure completedDays exists
        // ========================================================

        if (!user.studyPlan.completedDays) {

            user.studyPlan.completedDays = [];

        }

        // ========================================================
        // Already Completed?
        // ========================================================

        const alreadyCompleted =
            user.studyPlan.completedDays.some(
                item =>
                    Number(item.day) === day
            );

        if (alreadyCompleted) {

            const completedCount =
                user.studyPlan.completedDays.length;

            const percentage =
                Math.round(
                    (completedCount / 30) * 100
                );

            return res.status(200).json({

                success: true,

                alreadyCompleted: true,

                message:
                    `Day ${day} is already completed.`,

                day,

                completedDays:
                    user.studyPlan.completedDays,

                progress: {

                    completed:
                        completedCount,

                    total:
                        30,

                    percentage

                },

                xp:
                    user.xp || 0,

                xpEarned:
                    0,

                streak:
                    user.streak || 0,

                milestone:
                    null,

                celebration:
                    false

            });

        }

        // ========================================================
        // COMPLETE DAY
        // ========================================================

        user.studyPlan.completedDays.push({

            day,

            completedAt:
                new Date()

        });

        // ========================================================
        // BASE XP
        // ========================================================

        let xpEarned =
            STUDY_DAY_XP;

        // ========================================================
        // INITIALIZE XP BREAKDOWN
        // ========================================================

        if (!user.xpBreakdown) {

            user.xpBreakdown = {

                easy: 0,

                medium: 0,

                hard: 0,

                streak: 0,

                badges: 0

            };

        }

        // ========================================================
        // STREAK CALCULATION
        // ========================================================

        const now =
            new Date();

        const lastActive =
            user.lastActive
                ? new Date(user.lastActive)
                : null;

        const getDateOnly = (date) => {

            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

        };

        const today =
            getDateOnly(now);

        let streakBonus = 0;

        // ========================================================
        // FIRST ACTIVITY
        // ========================================================

        if (!lastActive) {

            user.streak = 1;

        }

        else {

            const lastDate =
                getDateOnly(lastActive);

            const difference =
                Math.floor(
                    (
                        today.getTime() -
                        lastDate.getTime()
                    ) /
                    (1000 * 60 * 60 * 24)
                );

            // Same day
            if (difference === 0) {

                user.streak =
                    user.streak || 1;

            }

            // Consecutive day
            else if (difference === 1) {

                user.streak =
                    (user.streak || 0) + 1;

                // Streak bonus
                streakBonus =
                    STREAK_BONUS_XP;

                xpEarned +=
                    streakBonus;

            }

            // Streak broken
            else {

                user.streak = 1;

            }

        }

        // ========================================================
        // UPDATE XP
        // ========================================================

        user.xp =
            (user.xp || 0) +
            xpEarned;

        // Base study XP
        user.xpBreakdown.streak =
            (user.xpBreakdown.streak || 0) +
            STUDY_DAY_XP;

        // Consecutive-day bonus
        if (streakBonus > 0) {

            user.xpBreakdown.streak +=
                streakBonus;

        }

        // ========================================================
        // PROGRESS
        // ========================================================

        const completedDays =
            user.studyPlan.completedDays;

        const completedCount =
            completedDays.length;

        const percentage =
            Math.round(
                (completedCount / 30) * 100
            );

        // ========================================================
        // MILESTONE
        // ========================================================

        let milestone = null;

        const milestoneData =
            MILESTONES[completedCount];

        if (milestoneData) {

            // ========================================================
            // CHECK WHETHER MILESTONE WAS ALREADY AWARDED
            // ========================================================

            if (!user.studyPlan.milestones) {

                user.studyPlan.milestones = [];

            }

            const milestoneAlreadyAwarded =
                user.studyPlan.milestones.some(
                    milestone =>
                        Number(milestone.day) ===
                        Number(completedCount)
                );

            // ========================================================
            // AWARD MILESTONE ONLY ONCE
            // ========================================================

            if (!milestoneAlreadyAwarded) {

                milestone = {

                    day:
                        completedCount,

                    title:
                        milestoneData.title,

                    message:
                        milestoneData.message,

                    bonusXP:
                        milestoneData.bonusXP

                };

                // ----------------------------------------------------
                // Add milestone XP
                // ----------------------------------------------------

                user.xp +=
                    milestoneData.bonusXP;

                user.xpBreakdown.badges =
                    (user.xpBreakdown.badges || 0) +
                    milestoneData.bonusXP;

                xpEarned +=
                    milestoneData.bonusXP;

                // ----------------------------------------------------
                // Persist milestone
                // ----------------------------------------------------

                user.studyPlan.milestones.push({

                    day:
                        completedCount,

                    title:
                        milestoneData.title,

                    bonusXP:
                        milestoneData.bonusXP,

                    achievedAt:
                        new Date()

                });

            }

        }

        // ========================================================
        // UPDATE LAST ACTIVE
        // ========================================================

        user.lastActive =
            now;

        // ========================================================
        // SAVE USER
        // ========================================================

        await user.save();

        // ========================================================
        // LOGGING
        // ========================================================

        console.log(
            `=> [Study Plan] Day ${day} completed by ${user.email}`
        );

        console.log(
            `=> [Study Plan] Base XP: +${STUDY_DAY_XP}`
        );

        console.log(
            `=> [Study Plan] Streak Bonus: +${streakBonus}`
        );

        if (milestone) {

            console.log(
                `=> [Study Plan] Milestone: ${milestone.title}`
            );

            console.log(
                `=> [Study Plan] Milestone Bonus: +${milestone.bonusXP}`
            );

        }

        console.log(
            `=> [Study Plan] Total XP Earned: +${xpEarned}`
        );

        console.log(
            `=> [Study Plan] Current XP: ${user.xp}`
        );

        console.log(
            `=> [Study Plan] Current Streak: ${user.streak}`
        );

        // ========================================================
        // RESPONSE
        // ========================================================

        res.status(200).json({

            success: true,

            alreadyCompleted: false,

            message:
                `Day ${day} marked as completed.`,

            day,

            completedDays,

            // ====================================================
            // XP
            // ====================================================

            xp:
                user.xp,

            xpEarned,

            baseXP:
                STUDY_DAY_XP,

            streakBonus,

            // ====================================================
            // STREAK
            // ====================================================

            streak:
                user.streak,

            // ====================================================
            // PROGRESS
            // ====================================================

            progress: {

                completed:
                    completedCount,

                total:
                    30,

                percentage

            },

            // ====================================================
            // MILESTONE
            // ====================================================

            milestone,

            celebration:
                true,

            // ====================================================
            // XP BREAKDOWN
            // ====================================================

            xpBreakdown:
                user.xpBreakdown,

            lastActive:
                user.lastActive

        });

    } catch (error) {

        console.error(
            "Complete Study Plan Day Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to complete study plan day"

        });

    }

};


// ============================================================
// UNCOMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/uncomplete
// ============================================================

const uncompleteStudyPlanDay = async (req, res) => {

    try {

        const user =
            await getCurrentUser(req);

        const day =
            Number(req.params.day);

        // ========================================================
        // Validate Day
        // ========================================================

        if (
            !Number.isInteger(day) ||
            day < 1 ||
            day > 30
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Day must be an integer between 1 and 30"

            });

        }

        // ========================================================
        // Check Study Plan
        // ========================================================

        if (
            !user.studyPlan ||
            !user.studyPlan.content
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No study plan found."

            });

        }

        // ========================================================
        // Find Completed Day
        // ========================================================

        const completedDays =
            user.studyPlan.completedDays || [];

        const completedDay =
            completedDays.find(
                item =>
                    Number(item.day) === day
            );

        // ========================================================
        // Day Not Completed
        // ========================================================

        if (!completedDay) {

            return res.status(200).json({

                success: true,

                message:
                    `Day ${day} was not marked as completed.`,

                completedDays,

                progress: {

                    completed:
                        completedDays.length,

                    total:
                        30,

                    percentage:
                        Math.round(
                            (completedDays.length / 30) * 100
                        )

                },

                xp:
                    user.xp || 0,

                streak:
                    user.streak || 0

            });

        }

        // ========================================================
        // Remove Completed Day
        // ========================================================

        user.studyPlan.completedDays =
            completedDays.filter(
                item =>
                    Number(item.day) !== day
            );

        // ========================================================
        // REMOVE BASE XP
        // ========================================================

        const xpToRemove =
            STUDY_DAY_XP;

        user.xp =
            Math.max(
                (user.xp || 0) - xpToRemove,
                0
            );

        // ========================================================
        // REMOVE XP BREAKDOWN
        // ========================================================

        if (user.xpBreakdown) {

            user.xpBreakdown.streak =
                Math.max(
                    (user.xpBreakdown.streak || 0) -
                    xpToRemove,
                    0
                );

        }

        // ========================================================
        // IMPORTANT
        // ========================================================
        //
        // We do NOT automatically reset the streak here.
        //
        // Streak is based on activity dates, not simply the
        // number of completed study days.
        //
        // This prevents weird streak behavior when a user
        // accidentally unchecks a day.
        // ========================================================

        await user.save();

        // ========================================================
        // PROGRESS
        // ========================================================

        const newCompletedCount =
            user.studyPlan.completedDays.length;

        const percentage =
            Math.round(
                (newCompletedCount / 30) * 100
            );

        // ========================================================
        // RESPONSE
        // ========================================================

        res.status(200).json({

            success: true,

            message:
                `Day ${day} marked as incomplete.`,

            day,

            completedDays:
                user.studyPlan.completedDays,

            xp:
                user.xp,

            xpRemoved:
                xpToRemove,

            streak:
                user.streak,

            progress: {

                completed:
                    newCompletedCount,

                total:
                    30,

                percentage

            }

        });

    } catch (error) {

        console.error(
            "Uncomplete Study Plan Day Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to uncomplete study plan day"

        });

    }

};

// ============================================================
// EXPORT STUDY PLAN AS PDF
// GET /api/ai/study-plan/pdf
// ============================================================

const exportStudyPlanPDF = async (req, res) => {
    try {

        console.log(
            "=> [AI Controller] Study Plan PDF export requested..."
        );

        // =====================================================
        // GET AUTHENTICATED USER
        // =====================================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        // =====================================================
        // CHECK STUDY PLAN
        // =====================================================

        const studyPlan =
            user.studyPlan?.content || "";

        if (!studyPlan.trim()) {

            return res.status(404).json({
                success: false,
                message:
                    "No study plan found. Please generate a study plan first."
            });

        }

        // =====================================================
        // CREATE PDF
        // =====================================================

        const doc = new PDFDocument({
            size: "A4",
            margins: {
                top: 50,
                bottom: 50,
                left: 55,
                right: 55
            },
            bufferPages: true
        });

        // =====================================================
        // RESPONSE HEADERS
        // =====================================================

        const safeName =
            (user.name || "Student")
                .replace(/[^a-zA-Z0-9]/g, "_");

        const filename =
            `LeetMatricAI_Study_Plan_${safeName}.pdf`;

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        // Pipe PDF directly to browser
        doc.pipe(res);

        // =====================================================
        // COLORS
        // =====================================================

        const primaryColor = "#4F46E5";
        const darkColor = "#0F172A";
        const grayColor = "#64748B";
        const lightColor = "#E2E8F0";
        const greenColor = "#059669";

        // =====================================================
        // HEADER
        // =====================================================

        doc
            .fillColor(primaryColor)
            .fontSize(26)
            .font("Helvetica-Bold")
            .text(
                "LeetMatricAI",
                {
                    align: "center"
                }
            );

        doc
            .moveDown(0.3)
            .fillColor(darkColor)
            .fontSize(19)
            .font("Helvetica-Bold")
            .text(
                "Personalized DSA Study Plan",
                {
                    align: "center"
                }
            );

        doc
            .moveDown(0.5)
            .fillColor(grayColor)
            .fontSize(10)
            .font("Helvetica")
            .text(
                "AI-powered 30-Day LeetCode Preparation Roadmap",
                {
                    align: "center"
                }
            );

        // =====================================================
        // DIVIDER
        // =====================================================

        doc
            .moveDown(1)
            .strokeColor(lightColor)
            .lineWidth(1)
            .moveTo(55, doc.y)
            .lineTo(540, doc.y)
            .stroke();

        doc.moveDown(1);

        // =====================================================
        // STUDENT INFORMATION
        // =====================================================

        doc
            .fillColor(darkColor)
            .fontSize(13)
            .font("Helvetica-Bold")
            .text("Student Information");

        doc.moveDown(0.4);

        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(grayColor);

        doc.text(
            `Name: ${user.name || "Student"}`
        );

        doc.text(
            `LeetCode Username: ${
                user.leetcodeUsername || "Not available"
            }`
        );

        doc.text(
            `Total Problems Solved: ${
                user.leetcodeStats?.totalSolved || 0
            }`
        );

        doc.text(
            `Easy: ${
                user.leetcodeStats?.easySolved || 0
            }    Medium: ${
                user.leetcodeStats?.mediumSolved || 0
            }    Hard: ${
                user.leetcodeStats?.hardSolved || 0
            }`
        );

        doc.text(
            `Current XP: ${
                user.xp || 0
            }    Current Streak: ${
                user.streak || 0
            } days`
        );

        doc.text(
            `Plan Generated: ${
                user.studyPlan?.generatedAt
                    ? new Date(
                        user.studyPlan.generatedAt
                    ).toLocaleString("en-IN")
                    : "Unknown"
            }`
        );

        doc.moveDown(1);

        // =====================================================
        // PROGRESS
        // =====================================================

        const completedDays =
            Array.isArray(
                user.studyPlan?.completedDays
            )
                ? user.studyPlan.completedDays.length
                : 0;

        const progressPercentage =
            Math.min(
                Math.round(
                    (completedDays / 30) * 100
                ),
                100
            );

        doc
            .fillColor(darkColor)
            .fontSize(13)
            .font("Helvetica-Bold")
            .text("Study Plan Progress");

        doc.moveDown(0.5);

        doc
            .fontSize(11)
            .fillColor(greenColor)
            .font("Helvetica-Bold")
            .text(
                `${completedDays} / 30 Days Completed`
            );

        doc
            .fontSize(10)
            .fillColor(grayColor)
            .font("Helvetica")
            .text(
                `${progressPercentage}% Complete`
            );

        doc.moveDown(1);

        // =====================================================
        // STUDY PLAN CONTENT
        // =====================================================

        doc
            .fillColor(primaryColor)
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("30-Day Study Plan");

        doc.moveDown(0.7);

        // =====================================================
        // MARKDOWN → PDF BASIC FORMATTER
        // =====================================================

        const lines =
            studyPlan
                .replace(/\r\n/g, "\n")
                .split("\n");

        for (let rawLine of lines) {

            let line =
                rawLine
                    .replace(/\t/g, "    ")
                    .trim();

            if (!line) {

                doc.moveDown(0.35);

                continue;
            }

            // ---------------------------------------------
            // H1
            // ---------------------------------------------

            if (
                line.startsWith("# ") &&
                !line.startsWith("## ")
            ) {

                doc
                    .moveDown(0.5)
                    .fillColor(primaryColor)
                    .fontSize(18)
                    .font("Helvetica-Bold")
                    .text(
                        cleanMarkdown(
                            line.substring(2)
                        ),
                        {
                            continued: false
                        }
                    );

                doc.moveDown(0.3);

                continue;
            }

            // ---------------------------------------------
            // H2
            // ---------------------------------------------

            if (
                line.startsWith("## ") &&
                !line.startsWith("### ")
            ) {

                doc
                    .moveDown(0.5)
                    .fillColor(primaryColor)
                    .fontSize(15)
                    .font("Helvetica-Bold")
                    .text(
                        cleanMarkdown(
                            line.substring(3)
                        )
                    );

                doc.moveDown(0.2);

                continue;
            }

            // ---------------------------------------------
            // H3 / DAY
            // ---------------------------------------------

            if (line.startsWith("### ")) {

                doc
                    .moveDown(0.5)
                    .fillColor(darkColor)
                    .fontSize(13)
                    .font("Helvetica-Bold")
                    .text(
                        cleanMarkdown(
                            line.substring(4)
                        )
                    );

                doc.moveDown(0.2);

                continue;
            }

            // ---------------------------------------------
            // BULLET
            // ---------------------------------------------

            if (
                line.startsWith("- ") ||
                line.startsWith("* ")
            ) {

                const bulletText =
                    cleanMarkdown(
                        line.substring(2)
                    );

                doc
                    .fillColor(darkColor)
                    .fontSize(10)
                    .font("Helvetica")
                    .text(
                        `• ${bulletText}`,
                        {
                            indent: 12,
                            paragraphGap: 3
                        }
                    );

                continue;
            }

            // ---------------------------------------------
            // NUMBERED LIST
            // ---------------------------------------------

            const numberedMatch =
                line.match(/^(\d+)\.\s+(.*)$/);

            if (numberedMatch) {

                const number =
                    numberedMatch[1];

                const text =
                    cleanMarkdown(
                        numberedMatch[2]
                    );

                doc
                    .fillColor(darkColor)
                    .fontSize(10)
                    .font("Helvetica")
                    .text(
                        `${number}. ${text}`,
                        {
                            indent: 12,
                            paragraphGap: 3
                        }
                    );

                continue;
            }

            // ---------------------------------------------
            // NORMAL PARAGRAPH
            // ---------------------------------------------

            doc
                .fillColor(darkColor)
                .fontSize(10)
                .font("Helvetica")
                .text(
                    cleanMarkdown(line),
                    {
                        align: "left",
                        lineGap: 3
                    }
                );
        }

        // =====================================================
        // FOOTER ON EVERY PAGE
        // =====================================================

        const range =
            doc.bufferedPageRange();

        for (
            let i = range.start;
            i < range.start + range.count;
            i++
        ) {

            doc.switchToPage(i);

            const footerY =
                doc.page.height - 35;

            doc
                .fontSize(8)
                .fillColor(grayColor)
                .font("Helvetica")
                .text(
                    `LeetMatricAI • Personalized Study Plan • Page ${
                        i + 1
                    }`,
                    55,
                    footerY,
                    {
                        align: "center",
                        width: 485
                    }
                );
        }

        // =====================================================
        // FINALIZE PDF
        // =====================================================

        doc.end();

        console.log(
            "=> [AI Controller] Study Plan PDF generated successfully."
        );

    } catch (error) {

        console.error(
            "=> [AI Controller] Study Plan PDF Error:",
            error
        );

        // If headers have not been sent yet
        if (!res.headersSent) {

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to generate Study Plan PDF."
            });
        }

        res.end();
    }
};


// ============================================================
// PDF MARKDOWN CLEANER
// ============================================================

const cleanMarkdown = (text) => {

    if (!text) {
        return "";
    }

    return text

        // Bold
        .replace(/\*\*(.*?)\*\*/g, "$1")

        // Italic
        .replace(/\*(.*?)\*/g, "$1")

        // Inline code
        .replace(/`([^`]+)`/g, "$1")

        // Markdown links
        .replace(
            /\[([^\]]+)\]\([^)]+\)/g,
            "$1"
        )

        // Horizontal rule
        .replace(/^---+$/, "")

        .trim();
};


// ============================================================
// COMPANY ROADMAP
// GET /api/ai/company-roadmap/:company
// ============================================================

const getCompanyRoadmap = async (req, res) => {

    try {

        const user =
            await getCurrentUser(req);

        const company =
            req.params.company;


        if (
            !company ||
            !company.trim()
        ) {

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

                content:
                    roadmap,

                generatedAt:
                    new Date()

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


        if (
            !company ||
            !company.trim()
        ) {

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

            explanation:
                result

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

            analysis:
                result

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

            analysis:
                result

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

            convertedCode:
                result

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
    regenerateAIAnalysis,
    getStudyPlan,

    generateNewStudyPlan,

    completeStudyPlanDay,

    uncompleteStudyPlanDay,

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

    getFriendComparison,
    exportStudyPlanPDF,

};