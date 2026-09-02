import {
    CheckCircle,
    Trophy,
    Clock,
    Flame,
    Zap,
    Code2,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const RecentActivity = ({ activities = [] }) => {

    const { theme } = useTheme();

    // =====================================================
    // ACTIVITY CONFIG
    // =====================================================

    const getActivityConfig = (type) => {

        switch (type?.toLowerCase()) {

            case "leetcode":
                return {
                    icon: Code2,
                    iconColor: "text-orange-500",
                    iconBg:
                        theme === "dark"
                            ? "bg-orange-500/10"
                            : "bg-orange-100",
                    badge:
                        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
                };

            case "streak":
                return {
                    icon: Flame,
                    iconColor: "text-pink-500",
                    iconBg:
                        theme === "dark"
                            ? "bg-pink-500/10"
                            : "bg-pink-100",
                    badge:
                        "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
                };

            case "badge":
                return {
                    icon: Trophy,
                    iconColor: "text-purple-500",
                    iconBg:
                        theme === "dark"
                            ? "bg-purple-500/10"
                            : "bg-purple-100",
                    badge:
                        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
                };

            case "xp":
                return {
                    icon: Zap,
                    iconColor: "text-indigo-500",
                    iconBg:
                        theme === "dark"
                            ? "bg-indigo-500/10"
                            : "bg-indigo-100",
                    badge:
                        "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
                };

            default:
                return {
                    icon: CheckCircle,
                    iconColor: "text-green-500",
                    iconBg:
                        theme === "dark"
                            ? "bg-green-500/10"
                            : "bg-green-100",
                    badge:
                        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
                };
        }
    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (date) => {

        if (!date) return "Just now";

        const activityDate = new Date(date);

        if (Number.isNaN(activityDate.getTime())) {
            return "Just now";
        }

        const diff = Math.floor(
            (new Date() - activityDate) / 1000
        );

        if (diff < 60) {
            return "Just now";
        }

        if (diff < 3600) {
            const minutes = Math.floor(diff / 60);

            return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        }

        if (diff < 86400) {
            const hours = Math.floor(diff / 3600);

            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        if (diff < 604800) {
            const days = Math.floor(diff / 86400);

            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        return activityDate.toLocaleDateString();
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className={`
                rounded-2xl border shadow-md
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300 p-6
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center gap-3 mb-7">

                <div
                    className={`
                        w-10 h-10 rounded-xl
                        flex items-center justify-center
                        ${
                            theme === "dark"
                                ? "bg-blue-500/10"
                                : "bg-blue-100"
                        }
                    `}
                >
                    <Clock
                        size={21}
                        className="text-blue-600"
                    />
                </div>

                <div>

                    <h2
                        className={`
                            text-xl font-bold
                            ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        Recent Activity
                    </h2>

                    <p
                        className={`
                            text-xs mt-0.5
                            ${
                                theme === "dark"
                                    ? "text-slate-500"
                                    : "text-slate-500"
                            }
                        `}
                    >
                        Your latest coding achievements
                    </p>

                </div>

            </div>


            {/* =================================================
                ACTIVITY LIST
            ================================================= */}

            {activities.length === 0 ? (

                <div
                    className={`
                        rounded-xl p-8 text-center
                        border border-dashed
                        ${
                            theme === "dark"
                                ? "bg-slate-800 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                        }
                    `}
                >

                    <Clock
                        size={42}
                        className={`
                            mx-auto
                            ${
                                theme === "dark"
                                    ? "text-slate-600"
                                    : "text-slate-300"
                            }
                        `}
                    />

                    <p
                        className={`
                            text-lg font-semibold mt-4
                            ${
                                theme === "dark"
                                    ? "text-slate-300"
                                    : "text-slate-700"
                            }
                        `}
                    >
                        No recent activity
                    </p>

                    <p
                        className={`
                            text-sm mt-2
                            ${
                                theme === "dark"
                                    ? "text-slate-500"
                                    : "text-slate-500"
                            }
                        `}
                    >
                        Start solving problems to build your activity timeline.
                    </p>

                </div>

            ) : (

                <div className="relative">

                    {activities.map((activity, index) => {

                        const config =
                            getActivityConfig(activity.type);

                        const Icon =
                            config.icon;

                        const isLast =
                            index === activities.length - 1;

                        return (

                            <div
                                key={activity._id}
                                className="relative flex gap-4 group"
                            >

                                {/* =================================
                                    TIMELINE
                                ================================= */}

                                <div className="flex flex-col items-center">

                                    {/* Icon Circle */}

                                    <div
                                        className={`
                                            relative z-10
                                            w-11 h-11
                                            rounded-full
                                            flex items-center justify-center
                                            shrink-0
                                            transition-all duration-300
                                            group-hover:scale-110
                                            ${config.iconBg}
                                        `}
                                    >

                                        <Icon
                                            size={21}
                                            className={config.iconColor}
                                        />

                                    </div>


                                    {/* Connector */}

                                    {!isLast && (

                                        <div
                                            className={`
                                                w-px flex-1 min-h-[75px]
                                                ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }
                                            `}
                                        />

                                    )}

                                </div>


                                {/* =================================
                                    ACTIVITY CONTENT
                                ================================= */}

                                <div
                                    className={`
                                        flex-1 min-w-0
                                        rounded-xl
                                        p-3
                                        mb-4
                                        transition-all duration-300
                                        group-hover:-translate-y-0.5
                                        ${
                                            theme === "dark"
                                                ? "bg-slate-800 hover:bg-slate-750"
                                                : "bg-slate-50 hover:bg-slate-100"
                                        }
                                    `}
                                >

                                    {/* Title + Badge */}

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            gap-2
                                        "
                                    >

                                        <h3
                                            className={`
                                                font-semibold
                                                ${
                                                    theme === "dark"
                                                        ? "text-white"
                                                        : "text-slate-900"
                                                }
                                            `}
                                        >
                                            {activity.title}
                                        </h3>


                                        <span
                                            className={`
                                                self-start
                                                sm:self-auto
                                                px-2.5 py-1
                                                rounded-full
                                                text-[11px]
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                ${config.badge}
                                            `}
                                        >
                                            {activity.type}
                                        </span>

                                    </div>


                                    {/* Description */}

                                    {activity.description && (

                                        <p
                                            className={`
                                                text-sm mt-1.5
                                                leading-relaxed
                                                ${
                                                    theme === "dark"
                                                        ? "text-slate-400"
                                                        : "text-slate-600"
                                                }
                                            `}
                                        >
                                            {activity.description}
                                        </p>

                                    )}


                                    {/* Time */}

                                    <div
                                        className={`
                                            flex items-center gap-1.5
                                            text-xs mt-2
                                            ${
                                                theme === "dark"
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }
                                        `}
                                    >

                                        <Clock size={12} />

                                        {formatTime(activity.createdAt)}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <div
                className={`
                    mt-5
                    rounded-xl
                    p-4
                    flex items-start gap-3
                    border
                    ${
                        theme === "dark"
                            ? "bg-yellow-500/5 border-yellow-500/10"
                            : "bg-yellow-50 border-yellow-100"
                    }
                `}
            >

                <div
                    className={`
                        w-9 h-9
                        rounded-lg
                        flex items-center justify-center
                        shrink-0
                        ${
                            theme === "dark"
                                ? "bg-yellow-500/10"
                                : "bg-yellow-100"
                        }
                    `}
                >

                    <Trophy
                        size={19}
                        className="text-yellow-500"
                    />

                </div>


                <p
                    className={`
                        text-sm leading-relaxed
                        ${
                            theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-600"
                        }
                    `}
                >
                    Keep solving consistently to build your streak,
                    earn XP, and unlock new achievements.
                </p>

            </div>

        </div>

    );

};

export default RecentActivity;