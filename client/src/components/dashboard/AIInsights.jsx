import {
    Brain,
    CheckCircle,
    AlertTriangle,
    Target,
    TrendingUp
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const AIInsights = ({ aiInsights }) => {

    const { theme } = useTheme();

    if (!aiInsights) {

        return (

            <div
                className={`rounded-2xl border p-6 shadow-md ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-200"
                }`}
            >
                Loading AI Insights...
            </div>

        );

    }

    const insights = [

        {
            icon: <CheckCircle className="text-green-500" size={20} />,
            title: aiInsights.strength.title,
            description: aiInsights.strength.message
        },

        {
            icon: <AlertTriangle className="text-yellow-500" size={20} />,
            title: aiInsights.improve.title,
            description: aiInsights.improve.message
        },

        {
            icon: <TrendingUp className="text-blue-500" size={20} />,
            title: aiInsights.progress.title,
            description: aiInsights.progress.message
        },

        {
            icon: <Target className="text-red-500" size={20} />,
            title: aiInsights.goal.title,
            description: aiInsights.goal.message
        }

    ];

    return (

        <div
            className={`rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <Brain className="text-blue-600" />

                <h2
                    className={`text-xl font-bold ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    AI Insights
                </h2>

            </div>

            {/* Insight Cards */}

            <div className="space-y-5">

                {insights.map((item, index) => (

                    <div
                        key={index}
                        className={`flex gap-4 p-4 rounded-xl ${
                            theme === "dark"
                                ? "bg-slate-800"
                                : "bg-slate-100"
                        }`}
                    >

                        <div>

                            {item.icon}

                        </div>

                        <div>

                            <h3
                                className={`font-semibold ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                            >
                                {item.title}
                            </h3>

                            <p
                                className={`text-sm mt-1 ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            >
                                {item.description}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

            {/* AI Summary */}

            <div
                className={`mt-6 rounded-xl p-4 border ${
                    theme === "dark"
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-100 border-slate-200"
                }`}
            >

                <h3
                    className={`text-lg font-bold mb-4 ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    AI Summary
                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-sm text-slate-500">
                            Total Solved
                        </p>

                        <h4 className="text-xl font-bold">
                            {aiInsights.summary.totalSolved}
                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            XP
                        </p>

                        <h4 className="text-xl font-bold">
                            {aiInsights.summary.xp}
                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Easy %
                        </p>

                        <h4 className="text-xl font-bold text-green-500">
                            {aiInsights.summary.easyPercent}%
                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Medium %
                        </p>

                        <h4 className="text-xl font-bold text-yellow-500">
                            {aiInsights.summary.mediumPercent}%
                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Hard %
                        </p>

                        <h4 className="text-xl font-bold text-red-500">
                            {aiInsights.summary.hardPercent}%
                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Streak
                        </p>

                        <h4 className="text-xl font-bold">
                            🔥 {aiInsights.summary.streak}
                        </h4>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AIInsights;