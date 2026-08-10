import { Flame, Target, TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AnalyticsCard = () => {

    const { theme } = useTheme();

    const weeklyProgress = 60;
    const monthlyProgress = 80;

    return (

        <div
            className={`
                rounded-2xl
                border
                shadow-md
                transition-all
                duration-300
                hover:shadow-xl
                hover:-translate-y-1
                p-6
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* Header */}

            <h2
                className={`text-xl font-bold mb-6 ${
                    theme === "dark"
                        ? "text-white"
                        : "text-slate-900"
                }`}
            >
                📈 Performance Overview
            </h2>

            {/* Current Streak */}

            <div className="flex items-center gap-4 mb-8">

                <div className="p-3 rounded-xl bg-orange-100">

                    <Flame
                        size={22}
                        className="text-orange-600"
                    />

                </div>

                <div>

                    <p
                        className={`text-sm ${
                            theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-500"
                        }`}
                    >
                        Current Streak
                    </p>

                    <h3
                        className={`text-2xl font-bold ${
                            theme === "dark"
                                ? "text-white"
                                : "text-slate-900"
                        }`}
                    >
                        25 Days
                    </h3>

                </div>

            </div>

            {/* Weekly Goal */}

            <div className="mb-6">

                <div className="flex justify-between mb-2">

                    <p
                        className={
                            theme === "dark"
                                ? "text-slate-300"
                                : "text-slate-700"
                        }
                    >
                        Weekly Goal
                    </p>

                    <span className="font-semibold">
                        {weeklyProgress}%
                    </span>

                </div>

                <div
                    className={`w-full h-3 rounded-full overflow-hidden ${
                        theme === "dark"
                            ? "bg-slate-700"
                            : "bg-slate-200"
                    }`}
                >

                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{
                            width: `${weeklyProgress}%`
                        }}
                    />

                </div>

            </div>

            {/* Monthly Goal */}

            <div className="mb-8">

                <div className="flex justify-between mb-2">

                    <p
                        className={
                            theme === "dark"
                                ? "text-slate-300"
                                : "text-slate-700"
                        }
                    >
                        Monthly Goal
                    </p>

                    <span className="font-semibold">
                        {monthlyProgress}%
                    </span>

                </div>

                <div
                    className={`w-full h-3 rounded-full overflow-hidden ${
                        theme === "dark"
                            ? "bg-slate-700"
                            : "bg-slate-200"
                    }`}
                >

                    <div
                        className="h-full bg-green-600 rounded-full transition-all duration-700"
                        style={{
                            width: `${monthlyProgress}%`
                        }}
                    />

                </div>

            </div>

            {/* Footer */}

            <div
                className={`rounded-xl p-4 flex items-center gap-3 ${
                    theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-100"
                }`}
            >

                <TrendingUp className="text-green-500" />

                <p
                    className={
                        theme === "dark"
                            ? "text-slate-300"
                            : "text-slate-700"
                    }
                >
                    You're improving consistently. Keep it up! 🚀
                </p>

            </div>

        </div>

    );

};

export default AnalyticsCard;