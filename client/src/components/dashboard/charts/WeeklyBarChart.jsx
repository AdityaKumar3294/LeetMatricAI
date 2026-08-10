import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { BarChart3 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const data = [
    { day: "Mon", solved: 3 },
    { day: "Tue", solved: 6 },
    { day: "Wed", solved: 2 },
    { day: "Thu", solved: 8 },
    { day: "Fri", solved: 5 },
    { day: "Sat", solved: 10 },
    { day: "Sun", solved: 4 },
];

const WeeklyBarChart = () => {

    const { theme } = useTheme();

    return (

        <div
            className={`
                rounded-2xl
                border
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                p-6
                h-[420px]
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <BarChart3
                    size={22}
                    className="text-blue-600"
                />

                <h2
                    className={`text-xl font-bold ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    Weekly Activity
                </h2>

            </div>

            <ResponsiveContainer width="100%" height="85%">

                <BarChart data={data}>

                    <CartesianGrid
                        strokeDasharray="4 4"
                        stroke={
                            theme === "dark"
                                ? "#334155"
                                : "#e2e8f0"
                        }
                    />

                    <XAxis
                        dataKey="day"
                        tick={{
                            fill:
                                theme === "dark"
                                    ? "#cbd5e1"
                                    : "#475569",
                            fontSize: 13,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{
                            fill:
                                theme === "dark"
                                    ? "#cbd5e1"
                                    : "#475569",
                            fontSize: 13,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        cursor={{
                            fill:
                                theme === "dark"
                                    ? "#1e293b"
                                    : "#f8fafc",
                        }}
                        contentStyle={{
                            backgroundColor:
                                theme === "dark"
                                    ? "#1e293b"
                                    : "#ffffff",
                            border: "none",
                            borderRadius: "12px",
                            color:
                                theme === "dark"
                                    ? "#ffffff"
                                    : "#111827",
                            boxShadow:
                                "0 8px 20px rgba(0,0,0,0.15)",
                        }}
                    />

                    <Bar
                        dataKey="solved"
                        fill="#2563eb"
                        radius={[10, 10, 0, 0]}
                        animationDuration={1200}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default WeeklyBarChart;