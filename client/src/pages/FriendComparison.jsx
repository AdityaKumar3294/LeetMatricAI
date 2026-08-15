import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Trophy,
    Code2,
    Target,
    Brain,
    Loader2,
    Flame
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import {
    compareFriend,
    aiCompareFriend
} from "../services/friendService";

function FriendComparison() {

    const { friendId } = useParams();

    const navigate = useNavigate();

    const { theme } = useTheme();

    const [comparison, setComparison] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [aiReport, setAiReport] = useState("");

    const [aiLoading, setAiLoading] = useState(false);

    const [aiError, setAiError] = useState("");

    const handleAIComparison = async () => {

        try {

            setAiLoading(true);

            setAiError("");

            const response =
                await aiCompareFriend(friendId);

            setAiReport(
                response.report || ""
            );

        } catch (error) {

            console.log(
                "AI Comparison Error:",
                error
            );

            setAiError(
                error.response?.data?.message ||
                "Unable to generate AI comparison."
            );

        } finally {

            setAiLoading(false);

        }

    };

    // ==========================================
    // Fetch Comparison
    // ==========================================

    useEffect(() => {

        const fetchComparison = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await compareFriend(friendId);

                setComparison(
                    response.comparison
                );

            } catch (error) {

                console.log(
                    "Friend Comparison Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load friend comparison."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchComparison();

    }, [friendId]);


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div
                className={`flex min-h-screen items-center justify-center ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <div className="flex items-center gap-3">

                    <Loader2
                        size={28}
                        className="animate-spin text-blue-600"
                    />

                    <span className="text-xl font-semibold">
                        Comparing profiles...
                    </span>

                </div>

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error || !comparison) {

        return (

            <div
                className={`flex min-h-screen items-center justify-center ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <div className="text-center">

                    <p className="text-red-500 mb-4">
                        {error || "Comparison unavailable."}
                    </p>

                    <button
                        onClick={() => navigate("/friends")}
                        className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Back to Friends
                    </button>

                </div>

            </div>

        );

    }


    const {
        you,
        friend,
        winner,
        difference,
        message
    } = comparison;


    // ==========================================
    // Comparison Stats
    // ==========================================

    const stats = [

        {
            label: "Total Solved",
            icon: (
                <Code2
                    size={22}
                    className="text-blue-500"
                />
            ),
            you: you.totalSolved,
            friend: friend.totalSolved
        },

        {
            label: "Easy",
            icon: (
                <Target
                    size={22}
                    className="text-green-500"
                />
            ),
            you: you.easySolved,
            friend: friend.easySolved
        },

        {
            label: "Medium",
            icon: (
                <Code2
                    size={22}
                    className="text-yellow-500"
                />
            ),
            you: you.mediumSolved,
            friend: friend.mediumSolved
        },

        {
            label: "Hard",
            icon: (
                <Trophy
                    size={22}
                    className="text-red-500"
                />
            ),
            you: you.hardSolved,
            friend: friend.hardSolved
        },

        {
            label: "LeetCode Ranking",
            icon: (
                <Trophy
                    size={22}
                    className="text-purple-500"
                />
            ),
            you: you.ranking,
            friend: friend.ranking
        }

    ];


    // ==========================================
    // Render
    // ==========================================

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


                <main className="p-6">

                    {/* ==========================================
                        Header
                    ========================================== */}

                    <button
                        onClick={() => navigate("/friends")}
                        className="flex items-center gap-2 mb-6 text-blue-600 font-semibold hover:text-blue-700 transition"
                    >

                        <ArrowLeft size={18} />

                        Back to Friends

                    </button>


                    <div className="mb-8">

                        <div className="flex items-center gap-3">

                            <Trophy
                                size={30}
                                className="text-yellow-500"
                            />

                            <h1 className="text-3xl font-bold">
                                Friend Comparison
                            </h1>

                        </div>

                        <p
                            className={`mt-2 ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }`}
                        >
                            Compare your LeetCode progress with your friend.
                        </p>

                    </div>


                    {/* ==========================================
                        User Headers
                    ========================================== */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* You */}

                        <div
                            className={`rounded-2xl border p-6 shadow-md ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                                    <Code2
                                        size={30}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <p className="text-sm text-blue-500 font-semibold">
                                        YOU
                                    </p>

                                    <h2 className="text-xl font-bold">
                                        {you.leetcodeUsername}
                                    </h2>

                                </div>

                            </div>

                        </div>


                        {/* Friend */}

                        <div
                            className={`rounded-2xl border p-6 shadow-md ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">

                                    <Code2
                                        size={30}
                                        className="text-purple-600"
                                    />

                                </div>

                                <div>

                                    <p className="text-sm text-purple-500 font-semibold">
                                        FRIEND
                                    </p>

                                    <h2 className="text-xl font-bold">
                                        {friend.leetcodeUsername}
                                    </h2>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        Comparison Stats
                    ========================================== */}

                    <div
                        className={`mt-8 rounded-2xl border shadow-md overflow-hidden ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="p-6">

                            <h2 className="text-xl font-bold mb-6">
                                Performance Comparison
                            </h2>


                            <div className="space-y-5">

                                {stats.map((item) => {

                                    const youValue =
                                        Number(item.you) || 0;

                                    const friendValue =
                                        Number(item.friend) || 0;

                                    const maxValue =
                                        Math.max(
                                            youValue,
                                            friendValue,
                                            1
                                        );

                                    const youPercent =
                                        (youValue / maxValue) * 100;

                                    const friendPercent =
                                        (friendValue / maxValue) * 100;

                                    return (

                                        <div
                                            key={item.label}
                                            className={`rounded-xl p-4 ${
                                                theme === "dark"
                                                    ? "bg-slate-800"
                                                    : "bg-slate-50"
                                            }`}
                                        >

                                            {/* Label */}

                                            <div className="flex items-center gap-2 mb-4">

                                                {item.icon}

                                                <span className="font-semibold">
                                                    {item.label}
                                                </span>

                                            </div>


                                            {/* Values */}

                                            <div className="grid grid-cols-2 gap-6">

                                                {/* You */}

                                                <div>

                                                    <div className="flex justify-between mb-2">

                                                        <span className="text-sm text-blue-500 font-semibold">
                                                            {you.leetcodeUsername}
                                                        </span>

                                                        <span className="font-bold">
                                                            {item.you}
                                                        </span>

                                                    </div>

                                                    <div
                                                        className={`w-full h-3 rounded-full ${
                                                            theme === "dark"
                                                                ? "bg-slate-700"
                                                                : "bg-slate-200"
                                                        }`}
                                                    >

                                                        <div
                                                            className="h-full rounded-full bg-blue-600 transition-all duration-700"
                                                            style={{
                                                                width:
                                                                    `${youPercent}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>


                                                {/* Friend */}

                                                <div>

                                                    <div className="flex justify-between mb-2">

                                                        <span className="text-sm text-purple-500 font-semibold">
                                                            {friend.leetcodeUsername}
                                                        </span>

                                                        <span className="font-bold">
                                                            {item.friend}
                                                        </span>

                                                    </div>

                                                    <div
                                                        className={`w-full h-3 rounded-full ${
                                                            theme === "dark"
                                                                ? "bg-slate-700"
                                                                : "bg-slate-200"
                                                        }`}
                                                    >

                                                        <div
                                                            className="h-full rounded-full bg-purple-600 transition-all duration-700"
                                                            style={{
                                                                width:
                                                                    `${friendPercent}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        Winner
                    ========================================== */}

                    <div
                        className={`mt-8 rounded-2xl border p-8 text-center shadow-md ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <Trophy
                            size={40}
                            className="mx-auto text-yellow-500 mb-4"
                        />

                        <p className="text-sm text-slate-500 uppercase tracking-wide">
                            Current Winner
                        </p>

                        <h2 className="text-3xl font-bold mt-2">

                            {winner === "Tie"
                                ? "It's a Tie! 🤝"
                                : winner}

                        </h2>

                        <p
                            className={`mt-3 ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }`}
                        >
                            {message}
                        </p>

                        <p className="mt-3 font-semibold text-blue-500">
                            Difference: {difference} problems
                        </p>

                    </div>


                    {/* ==========================================
                        Gemini AI Friend Comparison
                    ========================================== */}

                    <div
                        className={`mt-8 rounded-2xl border p-6 shadow-md ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        {/* Header */}

                        <div className="flex items-center gap-3 mb-2">

                            <Brain
                                className="text-blue-600"
                                size={26}
                            />

                            <div>

                                <h2 className="text-xl font-bold">
                                    Gemini AI Friend Analysis
                                </h2>

                                <p
                                    className={`text-sm mt-1 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    Get AI-powered insights based on both
                                    LeetCode profiles.
                                </p>

                            </div>

                        </div>


                        {/* Analyze Button */}

                        {!aiReport && (

                            <button
                                onClick={handleAIComparison}
                                disabled={aiLoading}
                                className={`mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition ${
                                    aiLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >

                                {aiLoading ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Gemini is analyzing...
                                    </>

                                ) : (

                                    <>
                                        <Brain size={18} />

                                        Analyze with Gemini
                                    </>

                                )}

                            </button>

                        )}


                        {/* AI Error */}

                        {aiError && (

                            <div
                                className={`mt-4 rounded-xl border p-4 ${
                                    theme === "dark"
                                        ? "bg-red-950/30 border-red-800"
                                        : "bg-red-50 border-red-200"
                                }`}
                            >

                                <p className="text-sm text-red-500">
                                    {aiError}
                                </p>

                            </div>

                        )}


                        {/* AI Report */}

                        {aiReport && (

                            <div
                                className={`mt-6 rounded-xl border p-5 ${
                                    theme === "dark"
                                        ? "bg-slate-800 border-slate-700"
                                        : "bg-slate-50 border-slate-200"
                                }`}
                            >

                                <div className="flex items-center gap-2 mb-4">

                                    <Brain
                                        size={20}
                                        className="text-blue-500"
                                    />

                                    <h3 className="font-bold text-lg">
                                        AI Analysis
                                    </h3>

                                </div>


                                <div
                                    className={`whitespace-pre-wrap text-sm leading-7 ${
                                        theme === "dark"
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}
                                >
                                    {aiReport}
                                </div>

                            </div>

                        )}


                        {/* Generate Again */}

                        {aiReport && !aiLoading && (

                            <button
                                onClick={handleAIComparison}
                                className="mt-4 text-sm text-blue-500 font-semibold hover:text-blue-600 transition"
                            >
                                ↻ Generate Again
                            </button>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );

}


export default FriendComparison;