import {
    Trophy,
    Flame,
    Code2,
    Star
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";


const LeaderboardTable = ({
    leaderboard = [],
    currentUser = null
}) => {

    const { theme } = useTheme();


    // ======================================
    // Rank Icon
    // ======================================

    const getRankIcon = (rank) => {

        if (rank === 1) return "🥇";

        if (rank === 2) return "🥈";

        if (rank === 3) return "🥉";

        return `#${rank}`;

    };


    return (

        <div
            className={`rounded-2xl border shadow-md
            transition-all duration-300 overflow-hidden
            ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* ================= HEADER ================= */}

            <div className="p-6 flex items-center gap-3">

                <Trophy
                    className="text-yellow-500"
                    size={26}
                />

                <h2
                    className={`text-xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    Global Leaderboard
                </h2>

            </div>


            {/* ================= CURRENT USER ================= */}

            {currentUser && (

                <div
                    className={`mx-6 mb-6 rounded-xl p-5
                    border
                    ${
                        theme === "dark"
                            ? "bg-blue-950/40 border-blue-800"
                            : "bg-blue-50 border-blue-200"
                    }`}
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p
                                className={`text-sm
                                ${
                                    theme === "dark"
                                        ? "text-blue-300"
                                        : "text-blue-600"
                                }`}
                            >
                                Your Rank
                            </p>

                            <h3
                                className={`text-3xl font-bold
                                ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                            >
                                #{currentUser.rank}
                            </h3>

                        </div>


                        <div className="text-right">

                            <p
                                className={`font-semibold
                                ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                            >
                                {currentUser.name}
                            </p>

                            <p className="text-blue-500 font-bold">
                                {currentUser.xp} XP
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* ================= TABLE ================= */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr
                            className={`text-left text-sm
                            ${
                                theme === "dark"
                                    ? "bg-slate-800 text-slate-400"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                        >

                            <th className="px-6 py-4">
                                Rank
                            </th>

                            <th className="px-6 py-4">
                                User
                            </th>

                            <th className="px-6 py-4">
                                XP
                            </th>

                            <th className="px-6 py-4">
                                Level
                            </th>

                            <th className="px-6 py-4">
                                Solved
                            </th>

                            <th className="px-6 py-4">
                                Streak
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {leaderboard.map((user) => {

                            const isCurrentUser =
                                currentUser &&
                                user.id === currentUser.id;


                            return (

                                <tr
                                    key={user.id}
                                    className={`border-t transition
                                    ${
                                        theme === "dark"
                                            ? "border-slate-800"
                                            : "border-slate-200"
                                    }
                                    ${
                                        isCurrentUser
                                            ? theme === "dark"
                                                ? "bg-blue-950/30"
                                                : "bg-blue-50"
                                            : ""
                                    }
                                    hover:bg-slate-50
                                    dark:hover:bg-slate-800`}
                                >

                                    {/* Rank */}

                                    <td className="px-6 py-4">

                                        <span className="text-xl">

                                            {getRankIcon(user.rank)}

                                        </span>

                                    </td>


                                    {/* User */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/default-avatar.png";
                                                }}
                                            />

                                            <div>

                                                <p
                                                    className={`font-semibold
                                                    ${
                                                        theme === "dark"
                                                            ? "text-white"
                                                            : "text-slate-900"
                                                    }`}
                                                >
                                                    {user.name}

                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs text-blue-500">
                                                            You
                                                        </span>
                                                    )}

                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {user.leetcodeUsername || "No username"}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* XP */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-1">

                                            <Star
                                                size={16}
                                                className="text-yellow-500"
                                            />

                                            <span
                                                className={`font-bold
                                                ${
                                                    theme === "dark"
                                                        ? "text-white"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {user.xp}
                                            </span>

                                        </div>

                                    </td>


                                    {/* Level */}

                                    <td className="px-6 py-4">

                                        <span
                                            className="px-3 py-1 rounded-full
                                            bg-purple-100 text-purple-700
                                            text-sm font-semibold"
                                        >
                                            Level {user.level}
                                        </span>

                                    </td>


                                    {/* Solved */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-1">

                                            <Code2
                                                size={16}
                                                className="text-blue-500"
                                            />

                                            {user.totalSolved}

                                        </div>

                                    </td>


                                    {/* Streak */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-1">

                                            <Flame
                                                size={17}
                                                className="text-orange-500"
                                            />

                                            {user.streak}

                                        </div>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>


            {/* ================= EMPTY STATE ================= */}

            {leaderboard.length === 0 && (

                <div className="p-10 text-center">

                    <p className="text-slate-500">
                        No leaderboard data available.
                    </p>

                </div>

            )}

        </div>

    );

};


export default LeaderboardTable;