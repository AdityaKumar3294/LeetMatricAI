import React, { useEffect, useMemo, useState } from "react";

import {
    CalendarDays,
    CheckCircle2,
    Circle,
    Flame,
    ArrowRight,
    Loader2,
    Sparkles,
    RefreshCw,
    Trophy,
    Target,
    BarChart3,
    Clock3,
    Lock,
    BookOpen,
    Timer,
    ChevronRight,
    X
} from "lucide-react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { getStudyPlan } from "../../services/aiService";


// ============================================================
// CONSTANTS
// ============================================================

const TOTAL_DAYS = 30;

const DEFAULT_PROGRESS = {
    completed: 0,
    total: TOTAL_DAYS,
    percentage: 0
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
                    day: Number(item),
                    completedAt: null
                };
            }

            return {
                day: Number(item?.day),
                completedAt:
                    item?.completedAt || null
            };
        })
        .filter(
            (item) =>
                Number.isInteger(item.day) &&
                item.day >= 1 &&
                item.day <= TOTAL_DAYS
        );
};


// ============================================================
// GET CURRENT STUDY DAY
// ============================================================

const getCurrentStudyDayFromDate = (generatedAt) => {

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
        TOTAL_DAYS
    );
};


// ============================================================
// CURRENT STREAK
// ============================================================

const calculateDayStreak = (completedDays) => {

    if (
        !Array.isArray(completedDays) ||
        completedDays.length === 0
    ) {
        return 0;
    }

    const days = [
        ...new Set(
            completedDays
                .map((item) => Number(item.day))
                .filter(
                    (day) =>
                        Number.isInteger(day) &&
                        day >= 1 &&
                        day <= TOTAL_DAYS
                )
        )
    ].sort((a, b) => b - a);

    if (days.length === 0) {
        return 0;
    }

    let streak = 1;

    for (
        let i = 0;
        i < days.length - 1;
        i++
    ) {

        if (
            days[i] -
            days[i + 1] === 1
        ) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};


// ============================================================
// BEST STREAK
// ============================================================

const calculateBestStreak = (completedDays) => {

    if (
        !Array.isArray(completedDays) ||
        completedDays.length === 0
    ) {
        return 0;
    }

    const days = [
        ...new Set(
            completedDays
                .map((item) => Number(item.day))
                .filter(
                    (day) =>
                        Number.isInteger(day) &&
                        day >= 1 &&
                        day <= TOTAL_DAYS
                )
        )
    ].sort((a, b) => a - b);

    if (days.length === 0) {
        return 0;
    }

    let best = 1;
    let current = 1;

    for (
        let i = 1;
        i < days.length;
        i++
    ) {

        if (
            days[i] ===
            days[i - 1] + 1
        ) {

            current++;

            best = Math.max(
                best,
                current
            );

        } else {

            current = 1;

        }
    }

    return best;
};


// ============================================================
// DAY COMPLETION HELPER
// ============================================================

const isDayCompleted = (
    completedDaySet,
    day
) => {

    return completedDaySet.has(
        Number(day)
    );
};


// ============================================================
// PARSE AI GENERATED STUDY PLAN
// ============================================================

const parseStudyPlanDays = (studyPlan) => {

    if (!studyPlan) {
        return [];
    }

    let markdown = "";

    if (typeof studyPlan === "string") {

        markdown = studyPlan;

    } else if (
        typeof studyPlan?.content === "string"
    ) {

        markdown = studyPlan.content;

    } else if (
        typeof studyPlan?.plan === "string"
    ) {

        markdown = studyPlan.plan;

    } else {

        return [];

    }


    const days = [];

    const dayRegex =
        /###\s*Day\s+(\d+)([\s\S]*?)(?=###\s*Day\s+\d+|$)/gi;

    let match;

    while (
        (match = dayRegex.exec(markdown)) !== null
    ) {

        const dayNumber =
            Number(match[1]);

        const content =
            match[2].trim();


        if (
            !Number.isInteger(dayNumber) ||
            dayNumber < 1 ||
            dayNumber > TOTAL_DAYS
        ) {
            continue;
        }


        const extract = (label) => {

            const regex = new RegExp(
                `\\*\\*${label}:?\\*\\*\\s*([^\\n]+)`,
                "i"
            );

            const result =
                content.match(regex);

            return (
                result?.[1]?.trim() || ""
            );
        };


        days.push({

            day: dayNumber,

            topic:
                extract("Topic") ||
                `Day ${dayNumber} Study`,

            objective:
                extract("Objective"),

            problems:
                extract("Problems"),

            difficulty:
                extract("Difficulty"),

            practice:
                extract("Practice"),

            dailyGoal:
                extract("Daily Goal"),

            rawContent: content

        });
    }


    return days.sort(
        (a, b) =>
            a.day - b.day
    );
};


// ============================================================
// ESTIMATED TIME
// ============================================================

const getEstimatedTime = (dayData) => {

    if (!dayData) {
        return "1.5–2 hrs";
    }

    const text = [
        dayData.objective,
        dayData.practice,
        dayData.dailyGoal
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


    if (
        text.includes("60 minutes") ||
        text.includes("60-minute")
    ) {
        return "1 hr";
    }

    if (
        text.includes("50 minutes") ||
        text.includes("50-minute")
    ) {
        return "50 min";
    }

    if (
        text.includes("45 minutes") ||
        text.includes("45-minute")
    ) {
        return "45 min";
    }

    if (
        text.includes("30 minutes") ||
        text.includes("30-minute")
    ) {
        return "30 min";
    }

    if (
        text.includes("timed")
    ) {
        return "1 hr";
    }

    return "1.5–2 hrs";
};


// ============================================================
// COMPONENT
// ============================================================

function StudyPlanWidget() {

    const { theme } = useTheme();

    const navigate = useNavigate();

    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();


    // ========================================================
    // SELECTED DAY FROM URL
    // ========================================================

    const selectedDayFromURL =
        Number(
            searchParams.get("day")
        );

    const selectedDay =
        Number.isInteger(
            selectedDayFromURL
        ) &&
        selectedDayFromURL >= 1 &&
        selectedDayFromURL <= TOTAL_DAYS
            ? selectedDayFromURL
            : null;


    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [hasStudyPlan, setHasStudyPlan] =
        useState(false);

    const [studyPlanDays, setStudyPlanDays] =
        useState([]);

    const [generatedAt, setGeneratedAt] =
        useState(null);

    const [completedDays, setCompletedDays] =
        useState([]);

    const [progress, setProgress] =
        useState(DEFAULT_PROGRESS);

    const [backendStreak, setBackendStreak] =
        useState(null);

    const [backendBestStreak, setBackendBestStreak] =
        useState(null);


    // ========================================================
    // FETCH STUDY PLAN
    // ========================================================

    const fetchStudyPlan = async () => {

        try {

            setLoading(true);
            setError(null);

            console.log(
                "🔵 DASHBOARD: Fetching study plan..."
            );


            const result =
                await getStudyPlan();


            console.log(
                "🟢 DASHBOARD: Study plan response:",
                result
            );


            // ==================================================
            // NO STUDY PLAN
            // ==================================================

            if (
                !result?.success ||
                !result?.hasStudyPlan ||
                !result?.studyPlan
            ) {

                setHasStudyPlan(false);

                setStudyPlanDays([]);

                setGeneratedAt(null);

                setCompletedDays([]);

                setProgress(
                    DEFAULT_PROGRESS
                );

                setBackendStreak(null);

                setBackendBestStreak(null);

                return;
            }


            // ==================================================
            // STUDY PLAN EXISTS
            // ==================================================

            setHasStudyPlan(true);


            setStudyPlanDays(
                parseStudyPlanDays(
                    result.studyPlan
                )
            );


            setGeneratedAt(
                result.generatedAt ||
                null
            );


            setCompletedDays(
                normalizeCompletedDays(
                    result.completedDays
                )
            );


            setProgress(
                result.progress ||
                DEFAULT_PROGRESS
            );


            // ==================================================
            // BACKEND STREAK
            // ==================================================

            setBackendStreak(
                Number.isFinite(
                    Number(result.streak)
                )
                    ? Number(result.streak)
                    : null
            );


            setBackendBestStreak(
                Number.isFinite(
                    Number(result.bestStreak)
                )
                    ? Number(result.bestStreak)
                    : null
            );

        } catch (error) {

            console.error(
                "🔴 DASHBOARD STUDY PLAN ERROR:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load study plan."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchStudyPlan();

    }, []);


    // ========================================================
    // CURRENT STUDY DAY
    // ========================================================

    const currentStudyDay =
        useMemo(
            () =>
                getCurrentStudyDayFromDate(
                    generatedAt
                ),
            [generatedAt]
        );


    // ========================================================
    // COMPLETED DAY SET
    // ========================================================

    const completedDaySet =
        useMemo(
            () =>
                new Set(
                    completedDays.map(
                        (item) =>
                            Number(item.day)
                    )
                ),
            [completedDays]
        );


    // ========================================================
    // CURRENT STREAK
    // ========================================================

    const currentStreak =
        backendStreak !== null
            ? backendStreak
            : calculateDayStreak(
                completedDays
            );


    const bestStreak =
        backendBestStreak !== null
            ? backendBestStreak
            : calculateBestStreak(
                completedDays
            );


    // ========================================================
    // TODAY COMPLETION
    // ========================================================

    const isTodayCompleted =
        isDayCompleted(
            completedDaySet,
            currentStudyDay
        );


    // ========================================================
    // TODAY'S DATA
    // ========================================================

    const todayStudyData =
        useMemo(
            () =>
                studyPlanDays.find(
                    (item) =>
                        item.day ===
                        currentStudyDay
                ) || null,
            [
                studyPlanDays,
                currentStudyDay
            ]
        );


    // ========================================================
    // SELECTED DAY DATA
    // ========================================================

    const selectedDayData =
        useMemo(
            () => {

                if (!selectedDay) {
                    return null;
                }

                return (
                    studyPlanDays.find(
                        (item) =>
                            item.day ===
                            selectedDay
                    ) || null
                );

            },
            [
                selectedDay,
                studyPlanDays
            ]
        );


    // ========================================================
    // WEEKLY STATISTICS
    // ========================================================

    const weeklyStats =
        useMemo(() => {

            const completed =
                completedDays
                    .map(
                        (item) =>
                            Number(item.day)
                    )
                    .filter(
                        (day) =>
                            Number.isInteger(day) &&
                            day >= 1 &&
                            day <= TOTAL_DAYS
                    );


            const weeks = [];


            for (
                let week = 0;
                week < 5;
                week++
            ) {

                const start =
                    week * 7 + 1;

                const end =
                    Math.min(
                        start + 6,
                        TOTAL_DAYS
                    );

                const total =
                    end - start + 1;


                const completedCount =
                    completed.filter(
                        (day) =>
                            day >= start &&
                            day <= end
                    ).length;


                const percentage =
                    total > 0
                        ? (
                            completedCount /
                            total
                        ) * 100
                        : 0;


                const weekPlanDays =
                    studyPlanDays.filter(
                        (item) =>
                            item.day >= start &&
                            item.day <= end
                    );


                const topics =
                    weekPlanDays
                        .map(
                            (item) =>
                                item.topic
                        )
                        .filter(Boolean);


                const problems =
                    weekPlanDays.reduce(
                        (totalProblems, item) => {

                            const match =
                                item.problems?.match(
                                    /\d+/
                                );

                            return (
                                totalProblems +
                                (
                                    match
                                        ? Number(match[0])
                                        : 0
                                )
                            );

                        },
                        0
                    );


                weeks.push({

                    week: week + 1,

                    start,

                    end,

                    completed:
                        completedCount,

                    total,

                    percentage,

                    topics,

                    problems

                });
            }


            return weeks;

        }, [
            completedDays,
            studyPlanDays
        ]);


    // ========================================================
    // CURRENT WEEK
    // ========================================================

    const currentWeekIndex =
        Math.floor(
            (currentStudyDay - 1) / 7
        );


    const currentWeek =
        weeklyStats[
            currentWeekIndex
        ] ||
        weeklyStats[0];


    // ========================================================
    // MILESTONES
    // ========================================================

    const milestones =
        useMemo(() => {

            const completedCount =
                Number(
                    progress.completed || 0
                );


            return [

                {
                    id: "day5",

                    icon: Target,

                    title: "5 Days Completed",

                    description:
                        "Build your study momentum",

                    target: 5,

                    progress:
                        completedCount,

                    achieved:
                        completedCount >= 5
                },


                {
                    id: "streak7",

                    icon: Flame,

                    title: "7-Day Streak",

                    description:
                        "Stay consistent for one week",

                    target: 7,

                    progress:
                        bestStreak,

                    achieved:
                        bestStreak >= 7
                },


                {
                    id: "days15",

                    icon: Trophy,

                    title: "15 Days Completed",

                    description:
                        "Halfway through the roadmap",

                    target: 15,

                    progress:
                        completedCount,

                    achieved:
                        completedCount >= 15
                },


                {
                    id: "complete",

                    icon: Sparkles,

                    title: "30-Day Plan Completed",

                    description:
                        "Complete your entire roadmap",

                    target: 30,

                    progress:
                        completedCount,

                    achieved:
                        completedCount >= 30
                }

            ];

        }, [
            progress.completed,
            bestStreak
        ]);


    // ========================================================
    // NAVIGATION
    // ========================================================

    const openStudyPlanner = (
        day = null
    ) => {

        if (
            Number.isInteger(
                Number(day)
            ) &&
            Number(day) >= 1 &&
            Number(day) <= TOTAL_DAYS
        ) {

            navigate(
                `/study-planner?day=${Number(day)}`
            );

            return;
        }


        navigate(
            "/study-planner"
        );
    };


    // ========================================================
    // SELECT DAY ON DASHBOARD
    // ========================================================

    const selectDay = (day) => {

        if (
            !Number.isInteger(day) ||
            day < 1 ||
            day > TOTAL_DAYS
        ) {
            return;
        }


        setSearchParams(
            {
                day: String(day)
            },
            {
                replace: true
            }
        );
    };


    // ========================================================
    // CLOSE SELECTED DAY
    // ========================================================

    const closeSelectedDay = () => {

        setSearchParams(
            {},
            {
                replace: true
            }
        );
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                className={`rounded-2xl border p-6 ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-slate-200"
                }`}
            >

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        min-h-[180px]
                    "
                >

                    <div className="text-center">

                        <Loader2
                            size={30}
                            className="
                                animate-spin
                                mx-auto
                                mb-3
                                text-indigo-500
                            "
                        />

                        <p
                            className={
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }
                        >
                            Loading study plan...
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <div
                className={`rounded-2xl border p-6 ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-slate-200"
                }`}
            >

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mb-2
                            "
                        >

                            <CalendarDays
                                size={22}
                                className="text-indigo-500"
                            />

                            <h3
                                className="
                                    font-bold
                                    text-lg
                                "
                            >
                                Study Planner
                            </h3>

                        </div>

                        <p className="text-sm text-red-500">
                            {error}
                        </p>

                    </div>


                    <button
                        onClick={
                            fetchStudyPlan
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            font-semibold
                        "
                    >

                        <RefreshCw size={16} />

                        Retry

                    </button>

                </div>

            </div>

        );
    }


    // ========================================================
    // NO PLAN
    // ========================================================

    if (!hasStudyPlan) {

        return (

            <div
                className={`rounded-2xl border p-6 ${
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
                        gap-5
                    "
                >

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
                                "
                            >

                                <Sparkles
                                    size={22}
                                />

                            </div>

                            <h3
                                className="
                                    text-xl
                                    font-bold
                                "
                            >
                                AI Study Planner
                            </h3>

                        </div>

                        <p
                            className={
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }
                        >
                            Create a personalized
                            30-day DSA study plan
                            based on your LeetCode
                            performance.
                        </p>

                    </div>


                    <button
                        onClick={
                            openStudyPlanner
                        }
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
                            text-white
                            font-semibold
                            whitespace-nowrap
                        "
                    >

                        Generate Study Plan

                        <ArrowRight
                            size={18}
                        />

                    </button>

                </div>

            </div>

        );
    }


    // ========================================================
    // MAIN WIDGET
    // ========================================================

    return (

        <div
            className={`rounded-2xl border overflow-hidden shadow-sm ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    p-6
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                "
            >

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
                            "
                        >

                            <CalendarDays
                                size={22}
                            />

                        </div>

                        <div>

                            <h3
                                className="
                                    text-xl
                                    font-bold
                                "
                            >
                                Study Planner
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                AI-powered 30-day
                                DSA roadmap
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    onClick={
                        openStudyPlanner
                    }
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        font-semibold
                        transition
                    "
                >

                    View Full Plan

                    <ArrowRight
                        size={18}
                    />

                </button>

            </div>


            <div className="px-6 pb-6">

                {/* ==================================================
                    TODAY'S STUDY
                ================================================== */}

                <div
                    className={`rounded-2xl p-5 mb-6 ${
                        theme === "dark"
                            ? "bg-indigo-950/30 border border-indigo-900/50"
                            : "bg-indigo-50 border border-indigo-100"
                    }`}
                >

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-6
                        "
                    >

                        <div className="min-w-0">

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-2
                                "
                            >

                                <Sparkles
                                    size={17}
                                    className="text-indigo-500"
                                />

                                <span
                                    className="
                                        text-xs
                                        font-bold
                                        tracking-wider
                                        text-indigo-500
                                    "
                                >
                                    TODAY'S STUDY
                                </span>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <h4
                                    className="
                                        text-2xl
                                        font-bold
                                    "
                                >
                                    Day {currentStudyDay}
                                </h4>

                                {isTodayCompleted && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            px-2.5
                                            py-1
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            bg-emerald-500/10
                                            text-emerald-500
                                        "
                                    >

                                        <CheckCircle2
                                            size={13}
                                        />

                                        Completed

                                    </span>

                                )}

                            </div>


                            <h5
                                className="
                                    text-lg
                                    font-bold
                                    mt-1
                                "
                            >
                                {todayStudyData?.topic ||
                                    "Today's personalized study"}
                            </h5>


                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                    max-w-2xl
                                "
                            >
                                {todayStudyData?.objective ||
                                    (
                                        isTodayCompleted
                                            ? "Great work! Today's study is complete."
                                            : "Stay consistent with your personalized DSA roadmap."
                                    )}
                            </p>


                            {todayStudyData && (

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                        mt-4
                                    "
                                >

                                    {todayStudyData.difficulty && (

                                        <span
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                bg-blue-500/10
                                                text-blue-500
                                            "
                                        >
                                            {todayStudyData.difficulty}
                                        </span>

                                    )}


                                    {todayStudyData.problems && (

                                        <span
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                bg-purple-500/10
                                                text-purple-500
                                            "
                                        >
                                            {todayStudyData.problems}
                                        </span>

                                    )}


                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            px-3
                                            py-1
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            bg-orange-500/10
                                            text-orange-500
                                        "
                                    >

                                        <Timer
                                            size={12}
                                        />

                                        {getEstimatedTime(
                                            todayStudyData
                                        )}

                                    </span>

                                </div>

                            )}

                        </div>


                        <div className="shrink-0">

                            {isTodayCompleted ? (

                                <button
                                    onClick={() =>
                                        openStudyPlanner(
                                            currentStudyDay
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-3
                                        rounded-xl
                                        border
                                        border-emerald-500/30
                                        text-emerald-500
                                        hover:bg-emerald-500/10
                                        font-semibold
                                        transition
                                    "
                                >

                                    Review Study

                                    <ArrowRight
                                        size={17}
                                    />

                                </button>

                            ) : (

                                <button
                                    onClick={() =>
                                        openStudyPlanner(
                                            currentStudyDay
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        text-white
                                        font-semibold
                                        transition
                                    "
                                >

                                    Start Study

                                    <ArrowRight
                                        size={17}
                                    />

                                </button>

                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                        mb-6
                    "
                >

                    <DashboardStat
                        icon={
                            <CheckCircle2
                                size={19}
                            />
                        }
                        label="Completed"
                        value={`${progress.completed || 0}/${progress.total || TOTAL_DAYS}`}
                        iconClass="text-emerald-500"
                        theme={theme}
                    />


                    <DashboardStat
                        icon={
                            <Target
                                size={19}
                            />
                        }
                        label="Progress"
                        value={`${Math.round(
                            progress.percentage || 0
                        )}%`}
                        iconClass="text-indigo-500"
                        theme={theme}
                    />


                    <DashboardStat
                        icon={
                            <Flame
                                size={19}
                            />
                        }
                        label="Current Streak"
                        value={`${currentStreak} days`}
                        iconClass="text-orange-500"
                        theme={theme}
                    />


                    <DashboardStat
                        icon={
                            <Trophy
                                size={19}
                            />
                        }
                        label="Best Streak"
                        value={`${bestStreak} days`}
                        iconClass="text-yellow-500"
                        theme={theme}
                    />

                </div>


                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mb-7">

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                            text-sm
                            mb-2
                        "
                    >

                        <span
                            className="
                                text-slate-500
                            "
                        >
                            30-Day Plan Progress
                        </span>

                        <span
                            className="
                                font-semibold
                            "
                        >
                            {Math.round(
                                progress.percentage || 0
                            )}%
                        </span>

                    </div>


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
                                duration-700
                            "
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        progress.percentage || 0,
                                        0
                                    ),
                                    100
                                )}%`
                            }}
                        />

                    </div>

                </div>


                {/* ==================================================
                    30 DAY ROADMAP
                ================================================== */}

                <div className="mb-7">

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                            mb-4
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <CalendarDays
                                    size={19}
                                    className="text-indigo-500"
                                />

                                <h4
                                    className="
                                        font-bold
                                        text-lg
                                    "
                                >
                                    30-Day Roadmap
                                </h4>

                            </div>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                "
                            >
                                Click any day to preview
                                its actual AI-generated task.
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-3
                                text-xs
                                text-slate-500
                            "
                        >

                            <Legend
                                className="bg-emerald-500"
                                label="Completed"
                            />

                            <Legend
                                className="bg-indigo-600"
                                label="Today"
                            />

                            <Legend
                                className={
                                    theme === "dark"
                                        ? "bg-slate-700"
                                        : "bg-slate-200"
                                }
                                label="Upcoming"
                            />

                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-5
                            sm:grid-cols-6
                            md:grid-cols-10
                            gap-2
                        "
                    >

                        {Array.from(
                            {
                                length: TOTAL_DAYS
                            },
                            (_, index) => {

                                const day =
                                    index + 1;


                                const completed =
                                    completedDaySet.has(
                                        day
                                    );


                                const current =
                                    day ===
                                    currentStudyDay;


                                const upcoming =
                                    day >
                                    currentStudyDay;


                                const selected =
                                    day ===
                                    selectedDay;


                                const dayData =
                                    studyPlanDays.find(
                                        (item) =>
                                            item.day ===
                                            day
                                    );


                                return (

                                    <button
                                        key={day}
                                        onClick={() =>
                                            selectDay(day)
                                        }
                                        title={
                                            dayData?.topic
                                                ? `Day ${day}: ${dayData.topic}`
                                                : `Open Day ${day}`
                                        }
                                        className={`
                                            relative
                                            aspect-square
                                            rounded-xl
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            border
                                            transition-all
                                            duration-200
                                            hover:-translate-y-0.5
                                            hover:shadow-md
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-indigo-400
                                            ${
                                                selected
                                                    ? "ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900"
                                                    : ""
                                            }
                                            ${
                                                completed
                                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                                    : current
                                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                                        : upcoming
                                                            ? theme === "dark"
                                                                ? "bg-slate-800 border-slate-700 text-slate-500"
                                                                : "bg-slate-100 border-slate-200 text-slate-400"
                                                            : theme === "dark"
                                                                ? "bg-slate-800 border-slate-700 text-slate-300"
                                                                : "bg-white border-slate-200 text-slate-600"
                                            }
                                        `}
                                    >

                                        {completed ? (

                                            <CheckCircle2
                                                size={17}
                                            />

                                        ) : current ? (

                                            <Sparkles
                                                size={16}
                                            />

                                        ) : upcoming ? (

                                            <span
                                                className="
                                                    text-sm
                                                    font-bold
                                                "
                                            >
                                                {day}
                                            </span>

                                        ) : (

                                            <span
                                                className="
                                                    text-sm
                                                    font-bold
                                                "
                                            >
                                                {day}
                                            </span>

                                        )}


                                        <span
                                            className="
                                                text-[10px]
                                                mt-1
                                                font-semibold
                                            "
                                        >
                                            {completed
                                                ? "Done"
                                                : current
                                                    ? "Today"
                                                    : `Day ${day}`
                                            }
                                        </span>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    SELECTED DAY DETAILS
                ================================================== */}

                {selectedDayData && (

                    <div
                        className={`rounded-2xl border p-5 mb-7 ${
                            theme === "dark"
                                ? "bg-slate-800/60 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                        }`}
                    >

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
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

                                    <BookOpen
                                        size={17}
                                        className="text-indigo-500"
                                    />

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-indigo-500
                                        "
                                    >
                                        Day {selectedDayData.day}
                                    </span>

                                </div>


                                <h4
                                    className="
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {selectedDayData.topic}
                                </h4>

                            </div>


                            <button
                                onClick={
                                    closeSelectedDay
                                }
                                className="
                                    self-end
                                    sm:self-auto
                                    p-2
                                    rounded-lg
                                    hover:bg-slate-200
                                    dark:hover:bg-slate-700
                                    text-slate-500
                                    transition
                                "
                                title="Close preview"
                            >

                                <X
                                    size={17}
                                />

                            </button>

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                                mt-4
                            "
                        >

                            {selectedDayData.difficulty && (

                                <span
                                    className="
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        bg-blue-500/10
                                        text-blue-500
                                    "
                                >
                                    {selectedDayData.difficulty}
                                </span>

                            )}


                            {selectedDayData.problems && (

                                <span
                                    className="
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        bg-purple-500/10
                                        text-purple-500
                                    "
                                >
                                    {selectedDayData.problems}
                                </span>

                            )}


                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    bg-orange-500/10
                                    text-orange-500
                                "
                            >

                                <Clock3
                                    size={12}
                                />

                                {getEstimatedTime(
                                    selectedDayData
                                )}

                            </span>


                            {isDayCompleted(
                                completedDaySet,
                                selectedDayData.day
                            ) && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        bg-emerald-500/10
                                        text-emerald-500
                                    "
                                >

                                    <CheckCircle2
                                        size={12}
                                    />

                                    Completed

                                </span>

                            )}

                        </div>


                        {selectedDayData.objective && (

                            <div className="mt-5">

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                        mb-1
                                    "
                                >
                                    Objective
                                </p>

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    {selectedDayData.objective}
                                </p>

                            </div>

                        )}


                        {selectedDayData.practice && (

                            <div className="mt-4">

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                        mb-1
                                    "
                                >
                                    Practice
                                </p>

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    {selectedDayData.practice}
                                </p>

                            </div>

                        )}


                        {selectedDayData.dailyGoal && (

                            <div className="mt-4">

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                        mb-1
                                    "
                                >
                                    Daily Goal
                                </p>

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    {selectedDayData.dailyGoal}
                                </p>

                            </div>

                        )}


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-3
                                mt-5
                            "
                        >

                            <button
                                onClick={() =>
                                    openStudyPlanner(
                                        selectedDayData.day
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    transition
                                "
                            >

                                Start Day{" "}
                                {selectedDayData.day}

                                <ArrowRight
                                    size={16}
                                />

                            </button>


                            <button
                                onClick={
                                    openStudyPlanner
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-300
                                    dark:border-slate-700
                                    text-sm
                                    font-semibold
                                    hover:bg-slate-100
                                    dark:hover:bg-slate-800
                                    transition
                                "
                            >

                                Full Plan

                                <ChevronRight
                                    size={16}
                                />

                            </button>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    WEEK SUMMARY
                ================================================== */}

                <div
                    className={`rounded-2xl border p-5 mb-7 ${
                        theme === "dark"
                            ? "bg-slate-800/50 border-slate-700"
                            : "bg-slate-50 border-slate-200"
                    }`}
                >

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                            mb-5
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <BarChart3
                                    size={19}
                                    className="text-indigo-500"
                                />

                                <h4
                                    className="
                                        font-bold
                                    "
                                >
                                    Current Week Summary
                                </h4>

                            </div>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                "
                            >
                                Week {currentWeek?.week || 1}
                                {" "}
                                • Days{" "}
                                {currentWeek?.start || 1}
                                –
                                {currentWeek?.end || 7}
                            </p>

                        </div>


                        <div
                            className="
                                text-sm
                                font-bold
                                text-indigo-500
                            "
                        >
                            {currentWeek?.completed || 0}/
                            {currentWeek?.total || 7}
                            {" "}
                            completed
                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-4
                        "
                    >

                        <MiniStat
                            icon={
                                <Target
                                    size={17}
                                />
                            }
                            label="Completion"
                            value={`${Math.round(
                                currentWeek?.percentage || 0
                            )}%`}
                            theme={theme}
                        />


                        <MiniStat
                            icon={
                                <BookOpen
                                    size={17}
                                />
                            }
                            label="Topics"
                            value={
                                currentWeek?.topics
                                    ?.length || 0
                            }
                            theme={theme}
                        />


                        <MiniStat
                            icon={
                                <CheckCircle2
                                    size={17}
                                />
                            }
                            label="Planned Problems"
                            value={
                                currentWeek?.problems || 0
                            }
                            theme={theme}
                        />

                    </div>

                </div>


                {/* ==================================================
                    WEEKLY + MILESTONES
                ================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-5
                    "
                >

                    {/* ==================================================
                        WEEKLY COMPLETION
                    ================================================== */}

                    <div
                        className={`rounded-2xl border p-5 ${
                            theme === "dark"
                                ? "bg-slate-800/50 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                        }`}
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-5
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <BarChart3
                                        size={19}
                                        className="text-indigo-500"
                                    />

                                    <h4
                                        className="
                                            font-bold
                                        "
                                    >
                                        Weekly Completion
                                    </h4>

                                </div>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >
                                    Your 30-day roadmap
                                    breakdown
                                </p>

                            </div>

                        </div>


                        <div className="space-y-4">

                            {weeklyStats.map(
                                (week) => {

                                    const active =
                                        week.week ===
                                        currentWeek?.week;


                                    return (

                                        <button
                                            key={
                                                week.week
                                            }
                                            onClick={() =>
                                                selectDay(
                                                    week.start
                                                )
                                            }
                                            className="
                                                w-full
                                                text-left
                                                group
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    justify-between
                                                    text-xs
                                                    mb-1.5
                                                "
                                            >

                                                <span
                                                    className={
                                                        active
                                                            ? "font-bold text-indigo-500"
                                                            : "text-slate-500"
                                                    }
                                                >

                                                    Week{" "}
                                                    {week.week}

                                                    {" "}

                                                    <span>
                                                        ({week.start}-
                                                        {week.end})
                                                    </span>

                                                </span>


                                                <span
                                                    className="
                                                        font-semibold
                                                    "
                                                >
                                                    {
                                                        week.completed
                                                    }/
                                                    {
                                                        week.total
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    h-2
                                                    rounded-full
                                                    bg-slate-200
                                                    dark:bg-slate-700
                                                    overflow-hidden
                                                "
                                            >

                                                <div
                                                    className={`
                                                        h-full
                                                        rounded-full
                                                        transition-all
                                                        ${
                                                            active
                                                                ? "bg-indigo-600"
                                                                : "bg-emerald-500"
                                                        }
                                                    `}
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.max(
                                                                week.percentage,
                                                                0
                                                            ),
                                                            100
                                                        )}%`
                                                    }}
                                                />

                                            </div>

                                        </button>

                                    );

                                }
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        MILESTONES
                    ================================================== */}

                    <div
                        className={`rounded-2xl border p-5 ${
                            theme === "dark"
                                ? "bg-slate-800/50 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                        }`}
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mb-1
                            "
                        >

                            <Trophy
                                size={19}
                                className="text-yellow-500"
                            />

                            <h4
                                className="
                                    font-bold
                                "
                            >
                                Milestones
                            </h4>

                        </div>

                        <p
                            className="
                                text-xs
                                text-slate-500
                                mb-4
                            "
                        >
                            Keep pushing toward
                            your goals.
                        </p>


                        <div className="space-y-4">

                            {milestones.map(
                                (milestone) => {

                                    const Icon =
                                        milestone.icon;


                                    const percentage =
                                        Math.min(
                                            (
                                                milestone.progress /
                                                milestone.target
                                            ) * 100,
                                            100
                                        );


                                    return (

                                        <div
                                            key={
                                                milestone.id
                                            }
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className={`
                                                        w-9
                                                        h-9
                                                        rounded-xl
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                        ${
                                                            milestone.achieved
                                                                ? "bg-emerald-500 text-white"
                                                                : theme === "dark"
                                                                    ? "bg-slate-700 text-slate-500"
                                                                    : "bg-slate-200 text-slate-400"
                                                        }
                                                    `}
                                                >

                                                    {milestone.achieved ? (

                                                        <CheckCircle2
                                                            size={18}
                                                        />

                                                    ) : (

                                                        <Icon
                                                            size={18}
                                                        />

                                                    )}

                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-2
                                                        "
                                                    >

                                                        <p
                                                            className={`
                                                                text-sm
                                                                font-semibold
                                                                ${
                                                                    milestone.achieved
                                                                        ? "text-emerald-500"
                                                                        : ""
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                milestone.title
                                                            }
                                                        </p>


                                                        <span
                                                            className="
                                                                text-[11px]
                                                                text-slate-500
                                                                whitespace-nowrap
                                                            "
                                                        >
                                                            {Math.min(
                                                                milestone.progress,
                                                                milestone.target
                                                            )}
                                                            /
                                                            {
                                                                milestone.target
                                                            }
                                                        </span>

                                                    </div>


                                                    <p
                                                        className="
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >
                                                        {
                                                            milestone.description
                                                        }
                                                    </p>


                                                    {!milestone.achieved && (

                                                        <div
                                                            className="
                                                                h-1.5
                                                                rounded-full
                                                                bg-slate-200
                                                                dark:bg-slate-700
                                                                mt-2
                                                                overflow-hidden
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    h-full
                                                                    rounded-full
                                                                    bg-indigo-500
                                                                    transition-all
                                                                "
                                                                style={{
                                                                    width: `${percentage}%`
                                                                }}
                                                            />

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                {generatedAt && (

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                            mt-6
                            pt-5
                            border-t
                            border-slate-200
                            dark:border-slate-800
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-slate-500
                            "
                        >

                            <Clock3
                                size={14}
                            />

                            Plan generated{" "}

                            {new Date(
                                generatedAt
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )}

                        </div>


                        <button
                            onClick={
                                openStudyPlanner
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-indigo-500
                                hover:text-indigo-600
                            "
                        >

                            Continue Learning

                            <ArrowRight
                                size={16}
                            />

                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}


// ============================================================
// DASHBOARD STAT
// ============================================================

function DashboardStat({
    icon,
    label,
    value,
    iconClass,
    theme
}) {

    return (

        <div
            className={`rounded-xl p-4 ${
                theme === "dark"
                    ? "bg-slate-800"
                    : "bg-slate-100"
            }`}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    mb-2
                "
            >

                <span
                    className={iconClass}
                >
                    {icon}
                </span>

                <span
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    {label}
                </span>

            </div>


            <div
                className="
                    text-2xl
                    font-bold
                "
            >
                {value}
            </div>

        </div>

    );
}


// ============================================================
// MINI STAT
// ============================================================

function MiniStat({
    icon,
    label,
    value,
    theme
}) {

    return (

        <div
            className={`rounded-xl p-4 ${
                theme === "dark"
                    ? "bg-slate-900"
                    : "bg-white"
            }`}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-slate-500
                    mb-2
                "
            >

                <span className="text-indigo-500">
                    {icon}
                </span>

                <span
                    className="
                        text-xs
                        font-medium
                    "
                >
                    {label}
                </span>

            </div>


            <p
                className="
                    text-xl
                    font-bold
                "
            >
                {value}
            </p>

        </div>

    );
}


// ============================================================
// LEGEND
// ============================================================

function Legend({
    className,
    label
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-1.5
            "
        >

            <span
                className={`
                    w-2.5
                    h-2.5
                    rounded-full
                    ${className}
                `}
            />

            {label}

        </div>

    );
}


export default StudyPlanWidget;