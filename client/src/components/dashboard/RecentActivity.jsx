import {
    CheckCircle,
    Trophy,
    Clock
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const activities = [
    {
        title: "Solved Two Sum",
        difficulty: "Easy",
        time: "2 hours ago"
    },
    {
        title: "Solved Binary Tree",
        difficulty: "Medium",
        time: "Yesterday"
    },
    {
        title: "Weekly Contest 462",
        difficulty: "Contest",
        time: "2 days ago"
    },
    {
        title: "Solved Trapping Rain Water",
        difficulty: "Hard",
        time: "3 days ago"
    }
];

const RecentActivity = () => {

    const { theme } = useTheme();

    const badgeColor = (difficulty) => {

        switch (difficulty) {

            case "Easy":
                return "bg-green-100 text-green-700";

            case "Medium":
                return "bg-yellow-100 text-yellow-700";

            case "Hard":
                return "bg-red-100 text-red-700";

            default:
                return "bg-blue-100 text-blue-700";
        }
    };

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

                <Clock className="text-blue-600" />

                <h2
                    className={`text-xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    Recent Activity
                </h2>

            </div>

            <div className="space-y-4">

                {activities.map((activity, index) => (

                    <div
                        key={index}
                        className={`rounded-xl p-4 flex justify-between items-center
                        ${
                            theme === "dark"
                                ? "bg-slate-800"
                                : "bg-slate-100"
                        }`}
                    >

                        <div className="flex gap-3 items-center">

                            <CheckCircle
                                className="text-green-500"
                                size={20}
                            />

                            <div>

                                <h3
                                    className={`font-semibold
                                    ${
                                        theme === "dark"
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}
                                >
                                    {activity.title}
                                </h3>

                                <p
                                    className={`text-sm
                                    ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    {activity.time}
                                </p>

                            </div>

                        </div>

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(activity.difficulty)}`}
                        >
                            {activity.difficulty}
                        </span>

                    </div>

                ))}

            </div>

            <div
                className={`mt-6 rounded-xl p-4 flex items-center gap-3
                ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <Trophy className="text-yellow-500" />

                <p
                    className={
                        theme === "dark"
                            ? "text-slate-300"
                            : "text-slate-700"
                    }
                >
                    Keep participating in weekly contests to improve your ranking.
                </p>

            </div>

        </div>

    );

};

export default RecentActivity;