import { useEffect, useState } from "react";
import { Trophy, Star, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const LevelCard = ({ dashboard }) => {

    const { theme } = useTheme();

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(null);

    useEffect(() => {

        if (!dashboard?.level) return;

        const currentLevel = dashboard.level;

        const storedLevel = localStorage.getItem(
            "leetmetric_previous_level"
        );

        // First visit
        if (storedLevel === null) {

            localStorage.setItem(
                "leetmetric_previous_level",
                currentLevel
            );

            return;
        }

        const previousLevel = Number(storedLevel);

        // Level increased
        if (currentLevel > previousLevel) {

            setNewLevel(currentLevel);
            setShowLevelUp(true);

            localStorage.setItem(
                "leetmetric_previous_level",
                currentLevel
            );

            const timer = setTimeout(() => {

                setShowLevelUp(false);

            }, 5000);

            return () => clearTimeout(timer);
        }

        // Keep localStorage synchronized
        if (currentLevel !== previousLevel) {

            localStorage.setItem(
                "leetmetric_previous_level",
                currentLevel
            );

        }

    }, [dashboard?.level]);

    if (!dashboard) return null;

    return (

        <>

            {/* ================= LEVEL UP POPUP ================= */}

            {showLevelUp && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                    <div
                        className={`relative w-[90%] max-w-md rounded-3xl p-8 text-center shadow-2xl
                        ${
                            theme === "dark"
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-900"
                        }`}
                    >

                        <div className="flex justify-center mb-4">

                            <div className="rounded-full bg-yellow-400/20 p-5">

                                <Sparkles
                                    size={50}
                                    className="text-yellow-500"
                                />

                            </div>

                        </div>

                        <h2 className="text-3xl font-extrabold text-yellow-500">

                            🎉 LEVEL UP!

                        </h2>

                        <p
                            className={`mt-3 text-lg
                            ${
                                theme === "dark"
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }`}
                        >

                            Congratulations! You reached

                        </p>

                        <p className="mt-2 text-5xl font-black">

                            Level {newLevel}

                        </p>

                        <button
                            onClick={() => setShowLevelUp(false)}
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
                        >

                            Continue 🚀

                        </button>

                    </div>

                </div>

            )}

            {/* ================= LEVEL CARD ================= */}

            <div
                className={`rounded-2xl border p-6 shadow-md hover:shadow-xl transition-all duration-300
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }`}
            >

                {/* Header */}

                <div className="flex items-center gap-3 mb-5">

                    <Trophy
                        className="text-yellow-500"
                        size={28}
                    />

                    <h2
                        className={`text-2xl font-bold
                        ${
                            theme === "dark"
                                ? "text-white"
                                : "text-slate-900"
                        }`}
                    >

                        Level {dashboard.level}

                    </h2>

                </div>

                {/* Stars */}

                <div className="flex gap-1 mb-5">

                    {Array.from({
                        length: Math.min(dashboard.level, 10)
                    }).map((_, index) => (

                        <Star
                            key={index}
                            size={18}
                            className="fill-yellow-400 text-yellow-400"
                        />

                    ))}

                </div>

                {/* XP */}

                <div className="flex justify-between mb-2">

                    <span className="font-medium">
                        XP
                    </span>

                    <span className="font-bold">

                        {dashboard.xp} / {dashboard.nextLevelXP}

                    </span>

                </div>

                {/* Progress */}

                <div
                    className={`w-full h-4 rounded-full overflow-hidden
                    ${
                        theme === "dark"
                            ? "bg-slate-700"
                            : "bg-slate-200"
                    }`}
                >

                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-700"
                        style={{
                            width: `${dashboard.progress}%`
                        }}
                    />

                </div>

                {/* Progress Information */}

                <div className="flex justify-between mt-3 text-sm">

                    <span>

                        {dashboard.progress}% Complete

                    </span>

                    <span>

                        {dashboard.remainingXP} XP Remaining

                    </span>

                </div>

                {/* Statistics */}

                <div
                    className={`mt-6 grid grid-cols-2 gap-4
                    ${
                        theme === "dark"
                            ? "text-slate-300"
                            : "text-slate-700"
                    }`}
                >

                    <div className="rounded-xl p-4 bg-blue-500/10">

                        <p className="text-sm">
                            Current XP
                        </p>

                        <h3 className="text-xl font-bold">
                            {dashboard.xp}
                        </h3>

                    </div>

                    <div className="rounded-xl p-4 bg-green-500/10">

                        <p className="text-sm">
                            Next Level XP
                        </p>

                        <h3 className="text-xl font-bold">
                            {dashboard.nextLevelXP}
                        </h3>

                    </div>

                    <div className="rounded-xl p-4 bg-yellow-500/10">

                        <p className="text-sm">
                            Remaining XP
                        </p>

                        <h3 className="text-xl font-bold">
                            {dashboard.remainingXP}
                        </h3>

                    </div>

                    <div className="rounded-xl p-4 bg-purple-500/10">

                        <p className="text-sm">
                            Next Level
                        </p>

                        <h3 className="text-xl font-bold">
                            {dashboard.level + 1}
                        </h3>

                    </div>

                </div>

                {/* Motivation */}

                <div
                    className={`mt-6 rounded-xl p-4
                    ${
                        theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                >

                    <p className="font-medium">

                        🚀 Keep solving problems to reach

                        <span className="font-bold">

                            {" "}Level {dashboard.level + 1}

                        </span>

                    </p>

                </div>

            </div>

        </>

    );

};

export default LevelCard;