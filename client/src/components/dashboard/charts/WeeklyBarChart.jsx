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


const WeeklyBarChart = ({ dashboard }) => {

    const { theme } = useTheme();

    const data = dashboard?.weeklyActivity || [];


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
                    className="text-blue-600"
                    size={22}
                />

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
                    Weekly Activity
                </h2>

            </div>


            {/* No Activity */}

            {data.length === 0 ? (

                <div className="flex flex-col items-center justify-center h-[300px]">

                    <BarChart3
                        size={42}
                        className={
                            theme === "dark"
                                ? "text-slate-600"
                                : "text-slate-300"
                        }
                    />

                    <p
                        className={`
                            text-lg
                            font-semibold
                            mt-4

                            ${
                                theme === "dark"
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        No activity yet
                    </p>

                    <p
                        className={`
                            text-sm
                            mt-2

                            ${
                                theme === "dark"
                                    ? "text-slate-500"
                                    : "text-slate-400"
                            }
                        `}
                    >
                        Start solving problems to see your weekly activity.
                    </p>

                </div>

            ) : (

                <ResponsiveContainer
                    width="100%"
                    height="85%"
                >

                    <BarChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
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
                            }}
                        />


                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fill:
                                    theme === "dark"
                                        ? "#cbd5e1"
                                        : "#475569",
                            }}
                        />


                        <Tooltip
                            formatter={(value) => [
                                `${value} Problems`,
                                "Solved",
                            ]}

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
                            radius={[8, 8, 0, 0]}
                            animationDuration={1200}
                        />

                    </BarChart>

                </ResponsiveContainer>

            )}

        </div>

    );
};


export default WeeklyBarChart;