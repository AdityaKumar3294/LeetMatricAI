import {
    Brain,
    CheckCircle,
    AlertTriangle,
    Target,
    TrendingUp
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const AIInsights = () => {

    const { theme } = useTheme();

    const insights = [
        {
            icon: <CheckCircle className="text-green-500" size={20} />,
            title: "Strength",
            description: "Excellent consistency in solving Easy problems."
        },
        {
            icon: <AlertTriangle className="text-yellow-500" size={20} />,
            title: "Improve",
            description: "Focus on Hard problems to increase your rating."
        },
        {
            icon: <TrendingUp className="text-blue-500" size={20} />,
            title: "Progress",
            description: "Your coding activity increased by 18% this week."
        },
        {
            icon: <Target className="text-red-500" size={20} />,
            title: "Today's Goal",
            description: "Solve 5 Medium problems and review Graphs."
        }
    ];

    return (

        <div
            className={`rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6
            ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            <div className="flex items-center gap-3 mb-6">

                <Brain className="text-blue-600" />

                <h2
                    className={`text-xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    AI Insights
                </h2>

            </div>

            <div className="space-y-5">

                {insights.map((item, index) => (

                    <div
                        key={index}
                        className={`flex gap-4 p-4 rounded-xl
                        ${
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
                                className={`font-semibold
                                ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                            >
                                {item.title}
                            </h3>

                            <p
                                className={`text-sm mt-1
                                ${
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

        </div>

    );

};

export default AIInsights;