import {
    Award,
    Star,
    BookOpen,
    Users,
    Target,
    Medal,
    Flame,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";


const AnalyticsCard = ({ dashboard }) => {

    const { theme } = useTheme();


    const textColor =
        theme === "dark"
            ? "text-slate-200"
            : "text-slate-700";


    const mutedColor =
        theme === "dark"
            ? "text-slate-400"
            : "text-slate-500";


    return (

        <div
            className={`
                rounded-2xl
                border
                p-6
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300

                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* ================= HEADER ================= */}

            <div className="flex items-center gap-3 mb-6">

                <div
                    className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center

                        ${
                            theme === "dark"
                                ? "bg-blue-500/10"
                                : "bg-blue-50"
                        }
                    `}
                >

                    <Target
                        size={21}
                        className="text-blue-500"
                    />

                </div>


                <div>

                    <h2
                        className={`
                            text-xl
                            font-bold
                            ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        Analytics
                    </h2>

                    <p
                        className={`text-xs ${mutedColor}`}
                    >
                        Your coding performance
                    </p>

                </div>

            </div>


            {/* ================= ANALYTICS ================= */}

            <div className="space-y-4">


                {/* Placement Score */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl
                        transition

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Target
                            size={20}
                            className="text-blue-500"
                        />

                        <span className={textColor}>
                            Placement Score
                        </span>

                    </div>


                    <span className="font-bold text-blue-600">
                        {dashboard?.placementScore ?? 0}%
                    </span>

                </div>


                {/* Placement Level */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Award
                            size={20}
                            className="text-purple-500"
                        />

                        <span className={textColor}>
                            Placement Level
                        </span>

                    </div>


                    <span
                        className="
                            font-bold
                            text-purple-600
                            dark:text-purple-400
                        "
                    >
                        {dashboard?.placementLevel || "N/A"}
                    </span>

                </div>


                {/* XP */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Star
                            size={20}
                            className="text-yellow-500"
                        />

                        <span className={textColor}>
                            XP
                        </span>

                    </div>


                    <span className="font-bold text-yellow-600">
                        {dashboard?.xp ?? 0}
                    </span>

                </div>


                {/* Streak */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Flame
                            size={20}
                            className="text-orange-500"
                        />

                        <span className={textColor}>
                            Current Streak
                        </span>

                    </div>


                    <span className="font-bold text-orange-500">
                        {dashboard?.streak ?? 0} days
                    </span>

                </div>


                {/* Badges */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Medal
                            size={20}
                            className="text-green-500"
                        />

                        <span className={textColor}>
                            Total Badges
                        </span>

                    </div>


                    <span className="font-bold text-green-600">
                        {dashboard?.totalBadges ?? 0}
                    </span>

                </div>


                {/* Notes */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <BookOpen
                            size={20}
                            className="text-orange-500"
                        />

                        <span className={textColor}>
                            Notes
                        </span>

                    </div>


                    <span className="font-bold text-orange-600">
                        {dashboard?.notesCount ?? 0}
                    </span>

                </div>


                {/* Friends */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        p-3
                        rounded-xl

                        ${
                            theme === "dark"
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                        }
                    `}
                >

                    <div className="flex items-center gap-3">

                        <Users
                            size={20}
                            className="text-cyan-500"
                        />

                        <span className={textColor}>
                            Friends
                        </span>

                    </div>


                    <span className="font-bold text-cyan-600">
                        {dashboard?.friendsCount ?? 0}
                    </span>

                </div>


            </div>

        </div>

    );
};


export default AnalyticsCard;