import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";
import { getAIAnalysis } from '../services/aiService';

import {
    Brain,
    Target,
    TrendingUp,
    Award,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    CalendarDays,
    Loader2,
    RefreshCw
} from "lucide-react";


function AIAnalysis() {

    const { theme } = useTheme();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchAnalysis = async () => {
        try {
            console.log("🔵 FRONTEND STEP 1: UI triggered fetchAnalysis...");
            setLoading(true);
            setError(null);

            console.log("🔵 FRONTEND STEP 2: Calling getAIAnalysis() service...");
            const result = await getAIAnalysis();
            
            console.log("🔵 FRONTEND STEP 5: Received backend result:", result);

            if (result.success && result.data) {
                setAnalysis(result.data);
            } else {
                throw new Error(result.message || "Failed to load analysis data.");
            }
        } catch (error) {
            console.log("🔴 FRONTEND ERROR:", error);
            setError(error.message || "Unable to load AI analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, 
    []);

    // ==========================================
    // Loading
    // ==========================================

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

                    <div className="flex justify-center items-center h-[80vh]">

                        <div className="text-center">

                            <Loader2
                                size={45}
                                className="animate-spin mx-auto mb-4 text-blue-600"
                            />

                            <p className="text-lg font-semibold">
                                AI is analyzing your performance...
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error) {

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

                        <div className="max-w-3xl mx-auto mt-20">

                            <div
                                className={`rounded-2xl p-8 text-center border ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-800"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <AlertTriangle
                                    size={50}
                                    className="mx-auto mb-4 text-red-500"
                                />

                                <h2 className="text-2xl font-bold mb-3">
                                    AI Analysis Unavailable
                                </h2>

                                <p
                                    className={`mb-6 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    {error}
                                </p>

                                <button
                                    onClick={fetchAnalysis}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
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


    // ==========================================
    // Main UI
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

                    {/* ================================= */}
                    {/* Header */}
                    {/* ================================= */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                        <div>

                            <div className="flex items-center gap-3 mb-2">

                                <div className="p-3 rounded-xl bg-blue-600 text-white">

                                    <Brain size={28} />

                                </div>

                                <h1 className="text-3xl font-bold">
                                    AI Performance Analysis
                                </h1>

                            </div>

                            <p
                                className={
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }
                            >
                                Get personalized insights into your LeetCode
                                performance and interview readiness.
                            </p>

                        </div>


                        <button
                            onClick={fetchAnalysis}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >

                            <RefreshCw size={18} />

                            Regenerate Analysis

                        </button>

                    </div>


                    {/* ================================= */}
                    {/* Score Cards */}
                    {/* ================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Overall Score */}

                        <div
                            className={`rounded-2xl p-6 shadow-sm border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-3 mb-5">

                                <Target className="text-blue-600" />

                                <h2 className="text-lg font-semibold">
                                    Overall Performance
                                </h2>

                            </div>

                            <div className="flex items-center gap-6">

                                <div className="relative w-28 h-28">

                                    <div className="w-full h-full rounded-full border-[10px] border-blue-100 flex items-center justify-center">

                                        <span className="text-3xl font-bold">
                                            {analysis?.overallScore || 0}
                                        </span>

                                    </div>

                                </div>

                                <div>

                                    <p className="text-2xl font-bold">
                                        {analysis?.performanceLevel || "Unknown"}
                                    </p>

                                    <p
                                        className={`mt-1 ${
                                            theme === "dark"
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        Performance Level
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Interview Readiness */}

                        <div
                            className={`rounded-2xl p-6 shadow-sm border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-3 mb-5">

                                <TrendingUp className="text-green-500" />

                                <h2 className="text-lg font-semibold">
                                    Interview Readiness
                                </h2>

                            </div>

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-4xl font-bold">
                                        {analysis?.interviewReadiness?.score || 0}
                                        <span className="text-xl">/100</span>
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        {analysis?.interviewReadiness?.status}
                                    </p>

                                </div>

                                <Award
                                    size={55}
                                    className="text-green-500"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Overall Assessment */}
                    {/* ================================= */}

                    <div
                        className={`mt-6 rounded-2xl p-6 border shadow-sm ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center gap-3 mb-4">

                            <Brain className="text-purple-500" />

                            <h2 className="text-xl font-bold">
                                Overall Assessment
                            </h2>

                        </div>

                        <p className="leading-7">
                            {analysis?.overallAssessment}
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* Difficulty Analysis */}
                    {/* ================================= */}

                    <div className="mt-6">

                        <h2 className="text-2xl font-bold mb-4">
                            Difficulty Analysis
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {[
                                {
                                    title: "Easy",
                                    value: analysis?.difficultyAnalysis?.easy,
                                    icon: CheckCircle,
                                    iconClass: "text-green-500"
                                },
                                {
                                    title: "Medium",
                                    value: analysis?.difficultyAnalysis?.medium,
                                    icon: TrendingUp,
                                    iconClass: "text-yellow-500"
                                },
                                {
                                    title: "Hard",
                                    value: analysis?.difficultyAnalysis?.hard,
                                    icon: AlertTriangle,
                                    iconClass: "text-red-500"
                                }
                            ].map((item) => {

                                const Icon = item.icon;

                                return (

                                    <div
                                        key={item.title}
                                        className={`rounded-2xl p-6 border shadow-sm ${
                                            theme === "dark"
                                                ? "bg-slate-900 border-slate-800"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >

                                        <div className="flex items-center gap-3 mb-4">

                                            <Icon
                                                className={item.iconClass}
                                            />

                                            <h3 className="text-lg font-bold">
                                                {item.title}
                                            </h3>

                                        </div>

                                        <p className="text-sm leading-6">
                                            {item.value}
                                        </p>

                                    </div>

                                );

                            })}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Strengths & Weaknesses */}
                    {/* ================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        {/* Strengths */}

                        <div
                            className={`rounded-2xl p-6 border shadow-sm ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-3 mb-5">

                                <CheckCircle className="text-green-500" />

                                <h2 className="text-xl font-bold">
                                    Strengths
                                </h2>

                            </div>

                            <div className="space-y-4">

                                {analysis?.strengths?.map(
                                    (strength, index) => (

                                        <div
                                            key={index}
                                            className="flex gap-3"
                                        >

                                            <span className="text-green-500 font-bold">
                                                ✓
                                            </span>

                                            <p>
                                                {strength}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Weaknesses */}

                        <div
                            className={`rounded-2xl p-6 border shadow-sm ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-3 mb-5">

                                <AlertTriangle className="text-red-500" />

                                <h2 className="text-xl font-bold">
                                    Areas to Improve
                                </h2>

                            </div>

                            <div className="space-y-4">

                                {analysis?.weaknesses?.map(
                                    (weakness, index) => (

                                        <div
                                            key={index}
                                            className="flex gap-3"
                                        >

                                            <span className="text-red-500 font-bold">
                                                !
                                            </span>

                                            <p>
                                                {weakness}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Consistency */}
                    {/* ================================= */}

                    <div
                        className={`mt-6 rounded-2xl p-6 border shadow-sm ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center gap-3 mb-4">

                            <CalendarDays className="text-blue-500" />

                            <h2 className="text-xl font-bold">
                                Practice Consistency
                            </h2>

                        </div>

                        <p className="leading-7">
                            {analysis?.consistency}
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* Recommendations */}
                    {/* ================================= */}

                    <div className="mt-8">

                        <div className="flex items-center gap-3 mb-4">

                            <Lightbulb className="text-yellow-500" />

                            <h2 className="text-2xl font-bold">
                                Personalized Recommendations
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {analysis?.recommendations?.map(
                                (recommendation, index) => (

                                    <div
                                        key={index}
                                        className={`rounded-2xl p-6 border shadow-sm ${
                                            theme === "dark"
                                                ? "bg-slate-900 border-slate-800"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >

                                        <div className="flex gap-4">

                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">

                                                {index + 1}

                                            </div>

                                            <p className="leading-6">
                                                {recommendation}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Action Plan */}
                    {/* ================================= */}

                    <div className="mt-8">

                        <div className="flex items-center gap-3 mb-4">

                            <CalendarDays className="text-blue-500" />

                            <h2 className="text-2xl font-bold">
                                Action Plan
                            </h2>

                        </div>

                        <div
                            className={`rounded-2xl p-6 border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="space-y-5">

                                {analysis?.actionPlan?.map(
                                    (action, index) => (

                                        <div
                                            key={index}
                                            className="flex gap-4 items-start"
                                        >

                                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                                                {index + 1}

                                            </div>

                                            <p className="leading-7 pt-1">
                                                {action}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Motivational Tip */}
                    {/* ================================= */}

                    <div
                        className={`mt-8 mb-8 rounded-2xl p-8 border ${
                            theme === "dark"
                                ? "bg-blue-950/40 border-blue-900"
                                : "bg-blue-50 border-blue-200"
                        }`}
                    >

                        <div className="flex items-start gap-4">

                            <Brain
                                size={32}
                                className="text-blue-500 flex-shrink-0"
                            />

                            <div>

                                <h2 className="text-xl font-bold mb-2">
                                    Your AI Mentor Says 🚀
                                </h2>

                                <p className="leading-7">
                                    {analysis?.motivationalTip}
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}


export default AIAnalysis;