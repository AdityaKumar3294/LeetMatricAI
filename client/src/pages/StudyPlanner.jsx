import React, { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import {
    getStudyPlan,
    generateStudyPlan,
    completeStudyPlanDay,
    uncompleteStudyPlanDay,
    exportStudyPlanPDF
} from "../services/aiService";

import ReactMarkdown from "react-markdown";

import {
    CalendarDays,
    Loader2,
    RefreshCw,
    AlertTriangle,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Circle,
    Trophy,
    Download
} from "lucide-react";


// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_PROGRESS = {
    completed: 0,
    total: 30,
    percentage: 0
};


// ============================================================
// PARSE AI STUDY PLAN
// ============================================================

const parseStudyDays = (markdown) => {

    if (!markdown || typeof markdown !== "string") {
        return [];
    }

    const days = [];

    const dayRegex =
        /###\s*Day\s+(\d+)([\s\S]*?)(?=###\s*Day\s+\d+|##\s+Week\s+\d+|##\s+🔄|##\s+⏱️|##\s+💼|##\s+🎯|##\s+🔥|$)/gi;

    let match;

    while ((match = dayRegex.exec(markdown)) !== null) {

        const dayNumber = Number(match[1]);

        const content = match[2]?.trim();

        if (
            Number.isInteger(dayNumber) &&
            dayNumber >= 1 &&
            dayNumber <= 30 &&
            content
        ) {
            days.push({
                day: dayNumber,
                content
            });
        }
    }

    return days;
};


// ============================================================
// NORMALIZE COMPLETED DAYS
// ============================================================

const normalizeCompletedDays = (completedDays) => {

    if (!Array.isArray(completedDays)) {
        return [];
    }

    return completedDays
        .map((item) => {

            if (typeof item === "number") {
                return {
                    day: item,
                    completedAt: null
                };
            }

            return {
                day: Number(item?.day),
                completedAt: item?.completedAt || null
            };
        })
        .filter(
            (item) =>
                Number.isInteger(item.day) &&
                item.day >= 1 &&
                item.day <= 30
        );
};


// ============================================================
// NORMALIZE PROGRESS
// ============================================================

const normalizeProgress = (progress) => {

    if (!progress || typeof progress !== "object") {
        return DEFAULT_PROGRESS;
    }

    const completed = Number(progress.completed) || 0;
    const total = Number(progress.total) || 30;

    let percentage = Number(progress.percentage);

    if (Number.isNaN(percentage)) {
        percentage =
            total > 0
                ? Math.round((completed / total) * 100)
                : 0;
    }

    return {
        completed,
        total,
        percentage: Math.min(Math.max(percentage, 0), 100)
    };
};


// ============================================================
// COMPONENT
// ============================================================

function StudyPlanner() {

    const { theme } = useTheme();


    // ============================================================
    // STATE
    // ============================================================

    const [studyPlan, setStudyPlan] = useState("");

    const [generatedAt, setGeneratedAt] = useState(null);

    const [loading, setLoading] = useState(true);

    const [generating, setGenerating] = useState(false);

    const [exportingPDF, setExportingPDF] = useState(false);

    const [error, setError] = useState(null);

    const [completedDays, setCompletedDays] = useState([]);

    const [updatingDay, setUpdatingDay] = useState(null);

    const [celebration, setCelebration] = useState(null);

    const [progress, setProgress] = useState(
        DEFAULT_PROGRESS
    );

    // Prevent duplicate API calls during React StrictMode
    const [initialized, setInitialized] = useState(false);


    // ============================================================
    // PARSED STUDY DAYS
    // ============================================================

    const studyDays = parseStudyDays(studyPlan);


    // ============================================================
    // CHECK COMPLETION
    // ============================================================

    const isDayCompleted = (day) => {

        return completedDays.some(
            (item) =>
                Number(item.day) === Number(day)
        );
    };


    // ============================================================
    // CURRENT STUDY DAY
    // ============================================================

    const getCurrentStudyDay = () => {

        if (!generatedAt) {
            return 1;
        }

        const startDate = new Date(generatedAt);
        const today = new Date();

        if (Number.isNaN(startDate.getTime())) {
            return 1;
        }

        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const difference =
            today.getTime() -
            startDate.getTime();

        const daysPassed = Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

        return Math.min(
            Math.max(daysPassed + 1, 1),
            30
        );
    };


    const currentStudyDay =
        getCurrentStudyDay();


    // ============================================================
    // TODAY'S STUDY
    // ============================================================

    const todayStudy =
        studyDays.find(
            (item) =>
                Number(item.day) ===
                Number(currentStudyDay)
        );


    // ============================================================
    // APPLY STUDY PLAN RESPONSE
    // ============================================================

    const applyStudyPlanResponse = (result) => {

        if (!result?.success) {
            return false;
        }

        if (
            !result?.hasStudyPlan &&
            !result?.studyPlan
        ) {
            return false;
        }

        if (result.studyPlan) {

            setStudyPlan(
                result.studyPlan
            );
        }

        setGeneratedAt(
            result.generatedAt || null
        );

        setCompletedDays(
            normalizeCompletedDays(
                result.completedDays
            )
        );

        setProgress(
            normalizeProgress(
                result.progress
            )
        );

        return true;
    };


    // ============================================================
    // FETCH SAVED STUDY PLAN
    // ============================================================

    const fetchStudyPlan = async () => {

        try {

            setLoading(true);
            setError(null);

            console.log(
                "🔵 Loading saved study plan..."
            );

            const result =
                await getStudyPlan();

            console.log(
                "🟢 Study Plan Response:",
                result
            );


            // ----------------------------------------------------
            // SAVED PLAN EXISTS
            // ----------------------------------------------------

            if (
                result?.success &&
                result?.hasStudyPlan &&
                result?.studyPlan
            ) {

                applyStudyPlanResponse(result);

                console.log(
                    "🟢 Saved study plan loaded successfully."
                );

                return true;
            }


            // ----------------------------------------------------
            // NO SAVED PLAN
            // ----------------------------------------------------

            console.log(
                "🟡 No saved study plan found."
            );

            setStudyPlan("");

            setGeneratedAt(null);

            setCompletedDays([]);

            setProgress(
                DEFAULT_PROGRESS
            );

            return false;

        } catch (error) {

            console.error(
                "🔴 Study Plan Loading Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load your study plan."
            );

            return false;

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // GENERATE NEW STUDY PLAN
    // ============================================================

    const handleGenerateStudyPlan = async () => {

        try {

            setGenerating(true);
            setError(null);

            console.log(
                "🔵 Generating new personalized study plan..."
            );

            const result =
                await generateStudyPlan();

            console.log(
                "🟢 Generated Study Plan:",
                result
            );


            if (
                !result?.success ||
                !result?.studyPlan
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to generate study plan."
                );
            }


            // ----------------------------------------------------
            // UPDATE PLAN
            // ----------------------------------------------------

            setStudyPlan(
                result.studyPlan
            );


            setGeneratedAt(
                result.generatedAt ||
                new Date().toISOString()
            );


            // New plan = fresh progress
            setCompletedDays([]);


            setProgress(
                normalizeProgress(
                    result.progress ||
                    DEFAULT_PROGRESS
                )
            );


            // Close any previous celebration
            setCelebration(null);


            console.log(
                "🟢 New study plan displayed successfully."
            );

            return true;

        } catch (error) {

            console.error(
                "🔴 Study Plan Generation Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to generate your study plan."
            );

            return false;

        } finally {

            setGenerating(false);
        }
    };


    // ============================================================
    // COMPLETE DAY
    // ============================================================

    const handleCompleteDay = async (day) => {

        try {

            setUpdatingDay(day);
            setError(null);

            console.log(
                `🔵 Completing Day ${day}...`
            );

            const result =
                await completeStudyPlanDay(day);

            console.log(
                `🟢 Complete Day ${day} Response:`,
                result
            );


            if (!result?.success) {

                throw new Error(
                    result?.message ||
                    `Failed to complete Day ${day}.`
                );
            }


            // ----------------------------------------------------
            // UPDATE COMPLETED DAYS
            // ----------------------------------------------------

            setCompletedDays(
                normalizeCompletedDays(
                    result.completedDays
                )
            );


            // ----------------------------------------------------
            // UPDATE PROGRESS
            // ----------------------------------------------------

            const updatedProgress =
                normalizeProgress(
                    result.progress
                );

            setProgress(
                updatedProgress
            );


            // ----------------------------------------------------
            // CELEBRATION
            // ----------------------------------------------------

            if (!result.alreadyCompleted) {

                setCelebration({

                    day,

                    xpEarned:
                        Number(result.xpEarned) || 0,

                    totalXP:
                        Number(result.xp) || 0,

                    streak:
                        Number(result.streak) || 0,

                    streakBonus:
                        Number(result.streakBonus) || 0,

                    progress:
                        updatedProgress,

                    milestone:
                        result.milestone || null

                });
            }


            console.log(
                `🎉 Day ${day} completed successfully!`
            );

        } catch (error) {

            console.error(
                `🔴 Complete Day ${day} Error:`,
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                `Unable to complete Day ${day}.`
            );

        } finally {

            setUpdatingDay(null);
        }
    };


    // ============================================================
    // UNCOMPLETE DAY
    // ============================================================

    const handleUncompleteDay = async (day) => {

        try {

            setUpdatingDay(day);
            setError(null);

            console.log(
                `🔵 Marking Day ${day} incomplete...`
            );

            const result =
                await uncompleteStudyPlanDay(day);

            console.log(
                `🟢 Uncomplete Day ${day} Response:`,
                result
            );


            if (!result?.success) {

                throw new Error(
                    result?.message ||
                    `Failed to mark Day ${day} incomplete.`
                );
            }


            // ----------------------------------------------------
            // UPDATE COMPLETED DAYS
            // ----------------------------------------------------

            setCompletedDays(
                normalizeCompletedDays(
                    result.completedDays
                )
            );


            // ----------------------------------------------------
            // UPDATE PROGRESS
            // ----------------------------------------------------

            setProgress(
                normalizeProgress(
                    result.progress
                )
            );


            // ----------------------------------------------------
            // CLOSE CELEBRATION
            // ----------------------------------------------------

            setCelebration(null);

        } catch (error) {

            console.error(
                `🔴 Uncomplete Day ${day} Error:`,
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                `Unable to update Day ${day}.`
            );

        } finally {

            setUpdatingDay(null);
        }
    };

    // ============================================================
    // EXPORT STUDY PLAN PDF
    // ============================================================

    const handleExportPDF = async () => {

        try {

            setExportingPDF(true);
            setError(null);

            console.log(
                "🔵 Exporting Study Plan PDF..."
            );

            await exportStudyPlanPDF();

            console.log(
                "🟢 Study Plan PDF downloaded successfully."
            );

        } catch (error) {

            console.error(
                "🔴 Study Plan PDF Export Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to export your study plan as PDF."
            );

        } finally {

            setExportingPDF(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        if (initialized) {
            return;
        }

        setInitialized(true);

        const initializeStudyPlan = async () => {

            const hasSavedPlan =
                await fetchStudyPlan();


            // ----------------------------------------------------
            // GENERATE ONLY IF NO PLAN EXISTS
            // ----------------------------------------------------

            if (!hasSavedPlan) {

                console.log(
                    "🔵 No saved plan. Generating first study plan..."
                );

                await handleGenerateStudyPlan();
            }
        };

        initializeStudyPlan();

    }, [initialized]);


    // ============================================================
    // LOADING SCREEN
    // ============================================================

    if (loading) {

        return (

            <div
                className={`flex min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="flex-1 ml-64">

                    <Navbar />

                    <main
                        className="
                            flex
                            justify-center
                            items-center
                            min-h-[80vh]
                        "
                    >

                        <div className="text-center">

                            <Loader2
                                size={50}
                                className="
                                    animate-spin
                                    mx-auto
                                    mb-5
                                    text-indigo-500
                                "
                            />

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    mb-2
                                "
                            >
                                Loading your study plan...
                            </h2>

                            <p className="text-slate-500">
                                Checking your saved AI study plan...
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // ============================================================
    // GENERATING SCREEN
    // ============================================================

    if (generating) {

        return (

            <div
                className={`flex min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="flex-1 ml-64">

                    <Navbar />

                    <main
                        className="
                            flex
                            justify-center
                            items-center
                            min-h-[80vh]
                        "
                    >

                        <div className="text-center">

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-2xl
                                    bg-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                    mx-auto
                                    mb-6
                                    shadow-lg
                                "
                            >

                                <Sparkles
                                    size={38}
                                    className="text-white"
                                />

                            </div>

                            <Loader2
                                size={32}
                                className="
                                    animate-spin
                                    mx-auto
                                    mb-5
                                    text-indigo-500
                                "
                            />

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    mb-3
                                "
                            >
                                AI is creating your study plan
                            </h2>

                            <p className="text-slate-500">
                                Analyzing your LeetCode performance
                                and creating a personalized DSA roadmap...
                            </p>

                            <p className="text-sm text-slate-500 mt-3">
                                This may take up to a minute.
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // ============================================================
    // ERROR SCREEN
    // ============================================================

    if (error && !studyPlan) {

        return (

            <div
                className={`flex min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="flex-1 ml-64">

                    <Navbar />

                    <main className="p-6">

                        <div
                            className="
                                max-w-2xl
                                mx-auto
                                mt-20
                            "
                        >

                            <div
                                className={`rounded-2xl p-8 text-center border ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-800"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <AlertTriangle
                                    size={50}
                                    className="
                                        mx-auto
                                        mb-5
                                        text-red-500
                                    "
                                />

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        mb-3
                                    "
                                >
                                    Study Plan Unavailable
                                </h2>

                                <p
                                    className="
                                        mb-6
                                        text-slate-500
                                    "
                                >
                                    {error}
                                </p>

                                <button
                                    onClick={fetchStudyPlan}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        text-white
                                        font-semibold
                                    "
                                >

                                    <RefreshCw size={18} />

                                    Try Again

                                </button>

                            </div>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // ============================================================
    // MAIN PAGE
    // ============================================================

    return (

        <div
            className={`flex min-h-screen transition-colors duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            <Sidebar />

            <div className="flex-1 ml-64">

                <Navbar />

                <main
                    className="
                        p-6
                        max-w-7xl
                        mx-auto
                    "
                >

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-5
                            mb-8
                        "
                    >

                        {/* ==================================================
                            TITLE
                        ================================================== */}

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-2
                                "
                            >

                                <div
                                    className="
                                        p-3
                                        rounded-xl
                                        bg-indigo-600
                                        text-white
                                        shadow-lg
                                        shadow-indigo-500/20
                                    "
                                >

                                    <CalendarDays size={28} />

                                </div>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                    "
                                >
                                    Personalized Study Planner
                                </h1>

                            </div>

                            <p
                                className={
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }
                            >
                                Your AI-powered 30-day DSA roadmap based on
                                your LeetCode performance.
                            </p>

                            {/* GENERATED DATE */}

                            {generatedAt && (

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-2
                                    "
                                >
                                    Last generated:{" "}
                                    {new Date(generatedAt).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )}
                                </p>

                            )}

                        </div>


                        {/* ==================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                items-stretch
                                sm:items-center
                                gap-3
                            "
                        >

                            {/* ==================================================
                                EXPORT PDF
                            ================================================== */}

                            <button
                                onClick={handleExportPDF}
                                disabled={
                                    generating ||
                                    loading ||
                                    !studyPlan
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-indigo-500
                                    text-indigo-500
                                    hover:bg-indigo-500
                                    hover:text-white
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    font-semibold
                                    transition
                                "
                                title="Export your study plan as PDF"
                            >

                                <Download size={18} />

                                Export PDF

                            </button>


                            {/* ==================================================
                                REGENERATE PLAN
                            ================================================== */}

                            <button
                                onClick={handleGenerateStudyPlan}
                                disabled={generating}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-5
                                    py-3
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    text-white
                                    font-semibold
                                    shadow-md
                                    shadow-indigo-500/20
                                    transition
                                "
                            >

                                {generating ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Generating...
                                    </>

                                ) : (

                                    <>
                                        <RefreshCw size={18} />

                                        Regenerate Plan
                                    </>

                                )}

                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        TODAY'S FOCUS
                    ================================================== */}

                    {todayStudy && (

                        <div
                            className={`rounded-2xl border p-5 mb-8 ${
                                theme === "dark"
                                    ? "bg-indigo-950/30 border-indigo-800"
                                    : "bg-indigo-50 border-indigo-200"
                            }`}
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-1
                                        "
                                    >

                                        <Sparkles
                                            size={18}
                                            className="text-indigo-500"
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-indigo-500
                                            "
                                        >
                                            TODAY'S FOCUS
                                        </span>

                                    </div>

                                    <h2 className="text-xl font-bold">
                                        Day {currentStudyDay}
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Stay consistent and complete today's DSA goals.
                                    </p>

                                </div>


                                <div>

                                    {isDayCompleted(currentStudyDay) ? (

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-emerald-500
                                                font-semibold
                                            "
                                        >

                                            <CheckCircle2 size={20} />

                                            Today's Goal Completed

                                        </div>

                                    ) : (

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-amber-500
                                                font-semibold
                                            "
                                        >

                                            <Circle size={20} />

                                            Today's Goal Pending

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        PROGRESS CARD
                    ================================================== */}

                    <div
                        className={`rounded-2xl border p-6 mb-8 shadow-sm ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div
                            className="
                                flex
                                flex-col
                                md:flex-row
                                md:items-center
                                md:justify-between
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        p-3
                                        rounded-xl
                                        bg-emerald-500/10
                                    "
                                >

                                    <Trophy
                                        size={28}
                                        className="text-emerald-500"
                                    />

                                </div>

                                <div>

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                        "
                                    >
                                        Your Progress
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Keep completing your daily DSA goals.
                                    </p>

                                </div>

                            </div>


                            <div className="text-right">

                                <div
                                    className="
                                        text-3xl
                                        font-bold
                                    "
                                >

                                    {progress.completed}

                                    <span
                                        className="
                                            text-lg
                                            text-slate-500
                                        "
                                    >
                                        {" "}/ {progress.total}
                                    </span>

                                </div>

                                <div className="text-sm text-slate-500">
                                    Days Completed
                                </div>

                            </div>

                        </div>


                        {/* PROGRESS BAR */}

                        <div className="mt-5">

                            <div
                                className="
                                    h-3
                                    w-full
                                    rounded-full
                                    bg-slate-200
                                    dark:bg-slate-800
                                    overflow-hidden
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-indigo-600
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${progress.percentage}%`
                                    }}
                                />

                            </div>


                            <div
                                className="
                                    flex
                                    justify-between
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <span>
                                    {progress.percentage}% complete
                                </span>

                                <span>

                                    {Math.max(
                                        progress.total -
                                        progress.completed,
                                        0
                                    )}{" "}
                                    days remaining

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ERROR BANNER
                    ================================================== */}

                    {error && studyPlan && (

                        <div
                            className="
                                mb-6
                                rounded-xl
                                border
                                border-red-300
                                bg-red-50
                                text-red-700
                                px-5
                                py-4
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <AlertTriangle size={20} />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* ==================================================
                        STUDY DAYS
                    ================================================== */}

                    <div className="space-y-6">

                        {studyDays.length > 0 ? (

                            studyDays.map(
                                ({ day, content }) => {

                                    const completed =
                                        isDayCompleted(day);

                                    const updating =
                                        updatingDay === day;


                                    return (

                                        <div
                                            key={day}
                                            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                                                completed
                                                    ? theme === "dark"
                                                        ? "bg-emerald-950/20 border-emerald-800"
                                                        : "bg-emerald-50 border-emerald-200"
                                                    : theme === "dark"
                                                        ? "bg-slate-900 border-slate-800"
                                                        : "bg-white border-slate-200"
                                            }`}
                                        >

                                            {/* DAY HEADER */}

                                            <div
                                                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b ${
                                                    theme === "dark"
                                                        ? "border-slate-800"
                                                        : "border-slate-200"
                                                }`}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-4
                                                    "
                                                >

                                                    <div
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                                                            completed
                                                                ? "bg-emerald-500 text-white"
                                                                : "bg-indigo-600 text-white"
                                                        }`}
                                                    >

                                                        {completed ? (

                                                            <CheckCircle2
                                                                size={25}
                                                            />

                                                        ) : (

                                                            day

                                                        )}

                                                    </div>


                                                    <div>

                                                        <h2
                                                            className="
                                                                text-xl
                                                                font-bold
                                                            "
                                                        >
                                                            Day {day}
                                                        </h2>

                                                        <p
                                                            className={`text-sm ${
                                                                completed
                                                                    ? "text-emerald-500"
                                                                    : "text-slate-500"
                                                            }`}
                                                        >

                                                            {completed
                                                                ? "Completed ✓"
                                                                : "Pending"}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* COMPLETE BUTTON */}

                                                <button
                                                    onClick={() => {

                                                        if (completed) {

                                                            handleUncompleteDay(
                                                                day
                                                            );

                                                        } else {

                                                            handleCompleteDay(
                                                                day
                                                            );

                                                        }

                                                    }}
                                                    disabled={updating}
                                                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                                                        updating
                                                            ? "opacity-60 cursor-not-allowed"
                                                            : ""
                                                    } ${
                                                        completed
                                                            ? "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                                                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    }`}
                                                >

                                                    {updating ? (

                                                        <>
                                                            <Loader2
                                                                size={18}
                                                                className="animate-spin"
                                                            />

                                                            Updating...
                                                        </>

                                                    ) : completed ? (

                                                        <>
                                                            <CheckCircle2
                                                                size={18}
                                                            />

                                                            Completed
                                                        </>

                                                    ) : (

                                                        <>
                                                            <Circle
                                                                size={18}
                                                            />

                                                            Complete Day
                                                        </>

                                                    )}

                                                </button>

                                            </div>


                                            {/* DAY CONTENT */}

                                            <div
                                                className={`px-6 py-6 leading-7 ${
                                                    theme === "dark"
                                                        ? "text-slate-300"
                                                        : "text-slate-700"
                                                }`}
                                            >

                                                <ReactMarkdown
                                                    components={{

                                                        h1: ({ children }) => (

                                                            <h3
                                                                className="
                                                                    text-xl
                                                                    font-bold
                                                                    mt-5
                                                                    mb-3
                                                                    text-indigo-500
                                                                "
                                                            >
                                                                {children}
                                                            </h3>

                                                        ),

                                                        h2: ({ children }) => (

                                                            <h3
                                                                className="
                                                                    text-lg
                                                                    font-bold
                                                                    mt-5
                                                                    mb-3
                                                                    text-indigo-500
                                                                "
                                                            >
                                                                {children}
                                                            </h3>

                                                        ),

                                                        h3: ({ children }) => (

                                                            <h3
                                                                className="
                                                                    text-lg
                                                                    font-bold
                                                                    mt-5
                                                                    mb-3
                                                                    text-indigo-500
                                                                "
                                                            >
                                                                {children}
                                                            </h3>

                                                        ),

                                                        h4: ({ children }) => (

                                                            <h4
                                                                className="
                                                                    text-base
                                                                    font-bold
                                                                    mt-4
                                                                    mb-2
                                                                    text-indigo-500
                                                                "
                                                            >
                                                                {children}
                                                            </h4>

                                                        ),

                                                        p: ({ children }) => (

                                                            <p className="mb-4">
                                                                {children}
                                                            </p>

                                                        ),

                                                        ul: ({ children }) => (

                                                            <ul
                                                                className="
                                                                    list-disc
                                                                    pl-6
                                                                    mb-4
                                                                    space-y-2
                                                                "
                                                            >
                                                                {children}
                                                            </ul>

                                                        ),

                                                        ol: ({ children }) => (

                                                            <ol
                                                                className="
                                                                    list-decimal
                                                                    pl-6
                                                                    mb-4
                                                                    space-y-2
                                                                "
                                                            >
                                                                {children}
                                                            </ol>

                                                        ),

                                                        li: ({ children }) => (

                                                            <li>
                                                                {children}
                                                            </li>

                                                        ),

                                                        strong: ({ children }) => (

                                                            <strong
                                                                className="
                                                                    font-semibold
                                                                    text-indigo-500
                                                                "
                                                            >
                                                                {children}
                                                            </strong>

                                                        ),

                                                        code: ({ children }) => (

                                                            <code
                                                                className="
                                                                    px-1.5
                                                                    py-0.5
                                                                    rounded
                                                                    bg-slate-800
                                                                    text-sm
                                                                "
                                                            >
                                                                {children}
                                                            </code>

                                                        )

                                                    }}
                                                >
                                                    {content}
                                                </ReactMarkdown>

                                            </div>

                                        </div>
                                    );
                                }
                            )

                        ) : (

                            // =================================================
                            // FALLBACK
                            // =================================================

                            <div
                                className={`rounded-2xl border p-8 ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-800"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-5
                                    "
                                >

                                    <BookOpen
                                        size={24}
                                        className="text-indigo-500"
                                    />

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                        "
                                    >
                                        Your AI Study Plan
                                    </h2>

                                </div>

                                <ReactMarkdown>
                                    {studyPlan}
                                </ReactMarkdown>

                            </div>
                        )}

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    {generatedAt && (

                        <div
                            className="
                                text-center
                                mt-10
                                pb-6
                                text-sm
                                text-slate-500
                            "
                        >

                            Plan generated on{" "}

                            {new Date(
                                generatedAt
                            ).toLocaleString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )}

                        </div>
                    )}


                    {/* ==================================================
                        GAMIFICATION CELEBRATION MODAL
                    ================================================== */}

                    {celebration && (

                        <div
                            className="
                                fixed
                                inset-0
                                z-50
                                flex
                                items-center
                                justify-center
                                bg-black/60
                                backdrop-blur-sm
                                p-4
                            "
                        >

                            <div
                                className={`relative w-full max-w-md rounded-3xl p-8 text-center shadow-2xl border ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                {/* CLOSE */}

                                <button
                                    onClick={() =>
                                        setCelebration(null)
                                    }
                                    className="
                                        absolute
                                        top-4
                                        right-4
                                        w-9
                                        h-9
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-500
                                        hover:bg-slate-100
                                        dark:hover:bg-slate-800
                                        transition
                                    "
                                >
                                    ✕
                                </button>


                                {/* ICON */}

                                <div
                                    className="
                                        mx-auto
                                        mb-5
                                        w-20
                                        h-20
                                        rounded-2xl
                                        bg-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                        shadow-lg
                                        shadow-indigo-500/30
                                    "
                                >

                                    <Trophy
                                        size={40}
                                        className="text-white"
                                    />

                                </div>


                                {/* TITLE */}

                                <h2
                                    className="
                                        text-3xl
                                        font-extrabold
                                        mb-2
                                    "
                                >
                                    🎉 Day {celebration.day} Completed!
                                </h2>


                                <p
                                    className="
                                        text-slate-500
                                        mb-7
                                    "
                                >
                                    Great work! Keep the momentum going.
                                </p>


                                {/* XP */}

                                <div
                                    className="
                                        rounded-2xl
                                        bg-indigo-500/10
                                        border
                                        border-indigo-500/20
                                        p-5
                                        mb-4
                                    "
                                >

                                    <div
                                        className="
                                            text-sm
                                            text-slate-500
                                            mb-1
                                        "
                                    >
                                        XP Earned
                                    </div>

                                    <div
                                        className="
                                            text-4xl
                                            font-extrabold
                                            text-indigo-500
                                        "
                                    >
                                        +{celebration.xpEarned} XP
                                    </div>

                                    <div
                                        className="
                                            text-sm
                                            text-slate-500
                                            mt-1
                                        "
                                    >
                                        Total XP: {celebration.totalXP}
                                    </div>

                                </div>


                                {/* STREAK + PROGRESS */}

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                        mb-5
                                    "
                                >

                                    {/* STREAK */}

                                    <div
                                        className={`rounded-2xl p-4 ${
                                            theme === "dark"
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }`}
                                    >

                                        <div className="text-2xl mb-1">
                                            🔥
                                        </div>

                                        <div
                                            className="
                                                text-2xl
                                                font-bold
                                            "
                                        >
                                            {celebration.streak}
                                        </div>

                                        <div
                                            className="
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            Day Streak
                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div
                                        className={`rounded-2xl p-4 ${
                                            theme === "dark"
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }`}
                                    >

                                        <div className="text-2xl mb-1">
                                            📈
                                        </div>

                                        <div
                                            className="
                                                text-2xl
                                                font-bold
                                            "
                                        >

                                            {
                                                celebration.progress
                                                    .completed
                                            }

                                            <span
                                                className="
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >
                                                /
                                                {
                                                    celebration.progress
                                                        .total
                                                }
                                            </span>

                                        </div>

                                        <div
                                            className="
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            Days Completed
                                        </div>

                                    </div>

                                </div>


                                {/* STREAK BONUS */}

                                {celebration.streakBonus > 0 && (

                                    <div
                                        className="
                                            mb-5
                                            rounded-xl
                                            bg-orange-500/10
                                            border
                                            border-orange-500/20
                                            px-4
                                            py-3
                                            text-orange-500
                                            font-semibold
                                        "
                                    >
                                        🔥 +{celebration.streakBonus} Streak XP!
                                    </div>
                                )}


                                {/* MILESTONE */}

                                {celebration.milestone && (

                                    <div
                                        className="
                                            mb-6
                                            rounded-2xl
                                            bg-yellow-500/10
                                            border
                                            border-yellow-500/30
                                            p-5
                                        "
                                    >

                                        <div
                                            className="
                                                text-3xl
                                                mb-2
                                            "
                                        >
                                            🏆
                                        </div>

                                        <h3
                                            className="
                                                text-lg
                                                font-bold
                                                text-yellow-500
                                            "
                                        >
                                            {
                                                celebration.milestone
                                                    .title
                                            }
                                        </h3>

                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                mt-1
                                            "
                                        >
                                            {
                                                celebration.milestone
                                                    .message
                                            }
                                        </p>

                                        <div
                                            className="
                                                mt-3
                                                font-bold
                                                text-yellow-500
                                            "
                                        >
                                            +
                                            {
                                                celebration.milestone
                                                    .bonusXP
                                            }
                                            {" "}Bonus XP
                                        </div>

                                    </div>
                                )}


                                {/* CONTINUE */}

                                <button
                                    onClick={() =>
                                        setCelebration(null)
                                    }
                                    className="
                                        w-full
                                        py-3.5
                                        rounded-xl
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        text-white
                                        font-bold
                                        transition
                                        shadow-lg
                                    "
                                >
                                    Continue Learning →
                                </button>

                            </div>

                        </div>
                    )}

                </main>

            </div>

        </div>
    );
}


export default StudyPlanner;