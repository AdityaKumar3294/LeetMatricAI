import { useTheme } from "../../context/ThemeContext";
import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, color }) => {

    const { theme } = useTheme();

    return (

        <div
            className={`
                rounded-2xl
                p-6
                border
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* Top */}

            <div className="flex items-center justify-between">

                <h3
                    className={`text-sm font-semibold uppercase tracking-wide
                    ${
                        theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    {title}
                </h3>

                <TrendingUp
                    size={20}
                    className="text-green-500"
                />

            </div>

            {/* Value */}

            <h2
                className={`mt-4 text-4xl font-bold ${color}`}
            >
                {value}
            </h2>

            {/* Footer */}

            <p
                className={`mt-3 text-sm
                ${
                    theme === "dark"
                        ? "text-slate-400"
                        : "text-slate-500"
                }`}
            >
                +0 This Week
            </p>

        </div>

    );

};

export default StatCard;