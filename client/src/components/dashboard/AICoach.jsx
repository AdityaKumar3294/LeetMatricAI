import {
    Brain,
    Target,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Sparkles
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const AICoach = ({ aiCoach }) => {

    const { theme } = useTheme();

    if (!aiCoach) {

        return (

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md">

                Loading AI Coach...

            </div>

        );

    }

    return (

        <div
            className={`rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 p-6
            ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <Brain className="text-violet-500" />

                <h2
                    className={`text-xl font-bold ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    AI Coach
                </h2>

            </div>

            {/* Strength */}

            <div
                className={`rounded-xl p-4 mb-4 ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <div className="flex gap-3">

                    <ShieldCheck className="text-green-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            {aiCoach.strength.title}

                        </h3>

                        <p className="text-sm mt-1">

                            {aiCoach.strength.message}

                        </p>

                    </div>

                </div>

            </div>

            {/* Weakness */}

            <div
                className={`rounded-xl p-4 mb-4 ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <div className="flex gap-3">

                    <AlertTriangle className="text-yellow-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            {aiCoach.weakness.title}

                        </h3>

                        <p className="text-sm mt-1">

                            {aiCoach.weakness.message}

                        </p>

                    </div>

                </div>

            </div>

            {/* Daily Goal */}

            <div
                className={`rounded-xl p-4 mb-4 ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <div className="flex gap-3">

                    <Target className="text-red-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Daily Goal

                        </h3>

                        <p className="text-sm mt-1">

                            {aiCoach.dailyGoal}

                        </p>

                    </div>

                </div>

            </div>

            {/* Weekly Goal */}

            <div
                className={`rounded-xl p-4 mb-6 ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <div className="flex gap-3">

                    <TrendingUp className="text-blue-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Weekly Goal

                        </h3>

                        <p className="text-sm mt-1">

                            {aiCoach.weeklyGoal}

                        </p>

                    </div>

                </div>

            </div>
                    <div className="grid grid-cols-3 gap-4">

                <div
                    className={`rounded-xl p-4 text-center ${
                        theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                >

                    <Sparkles className="mx-auto text-purple-500 mb-2" />

                    <p className="text-sm">

                        Confidence

                    </p>

                    <h2 className="text-2xl font-bold">

                        {aiCoach.confidence}%

                    </h2>

                </div>

                <div
                    className={`rounded-xl p-4 text-center ${
                        theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                >

                    <TrendingUp className="mx-auto text-green-500 mb-2" />

                    <p className="text-sm">

                        Placement

                    </p>

                    <h2 className="text-2xl font-bold">

                        {aiCoach.placementReadiness}%

                    </h2>

                </div>

                <div
                    className={`rounded-xl p-4 text-center ${
                        theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                >

                    <Brain className="mx-auto text-blue-500 mb-2" />

                    <p className="text-sm">

                        Interview

                    </p>

                    <h2 className="font-bold">

                        {aiCoach.interviewReadiness}

                    </h2>

                </div>

            </div>

        </div>

);

};

export default AICoach;