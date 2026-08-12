import {
    CheckCircle,
    Trophy,
    Clock,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const RecentActivity = ({ activities = [] }) => {

    const { theme } = useTheme();

    const badgeColor = (type) => {

        switch (type?.toLowerCase()) {

            case "easy":
                return "bg-green-100 text-green-700";

            case "medium":
                return "bg-yellow-100 text-yellow-700";

            case "hard":
                return "bg-red-100 text-red-700";

            case "contest":
                return "bg-blue-100 text-blue-700";

            case "leetcode":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-slate-200 text-slate-700";
        }

    };

    const formatTime = (date) => {

        if (!date) return "Just now";

        const diff =
            Math.floor(
                (new Date() - new Date(date)) / 1000
            );

        if (diff < 60)
            return "Just now";

        if (diff < 3600)
            return `${Math.floor(diff / 60)} min ago`;

        if (diff < 86400)
            return `${Math.floor(diff / 3600)} hours ago`;

        if (diff < 604800)
            return `${Math.floor(diff / 86400)} days ago`;

        return new Date(date).toLocaleDateString();

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

            {/* Header */}

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

            {/* Activities */}

            <div className="space-y-4">

                {activities.length === 0 ? (

                    <div
                        className={`rounded-xl p-6 text-center
                        ${
                            theme === "dark"
                                ? "bg-slate-800 text-slate-400"
                                : "bg-slate-100 text-slate-600"
                        }`}
                    >

                        No recent activity yet.

                    </div>

                ) : (

                    activities.map((activity) => (

                        <div
                            key={activity._id}
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
                                        {activity.description}
                                    </p>

                                    <p
                                        className={`text-xs mt-1
                                        ${
                                            theme === "dark"
                                                ? "text-slate-500"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {formatTime(activity.createdAt)}
                                    </p>

                                </div>

                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(activity.type)}`}
                            >
                                {activity.type}
                            </span>

                        </div>

                    ))

                )}

            </div>

            {/* Footer */}

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
                    Every coding session is recorded here. Keep solving problems consistently to build your coding streak and unlock new achievements.
                </p>

            </div>

        </div>

    );

};

export default RecentActivity;