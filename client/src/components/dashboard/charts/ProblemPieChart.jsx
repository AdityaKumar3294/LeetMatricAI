import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import { PieChart as PieChartIcon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const data = [
    { name: "Easy", value: 120 },
    { name: "Medium", value: 85 },
    { name: "Hard", value: 35 },
];

const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
];

const ProblemPieChart = () => {

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

                <PieChartIcon
                    className="text-blue-600"
                    size={22}
                />

                <h2
                    className={`text-xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    Problem Distribution
                </h2>

            </div>

            <ResponsiveContainer width="100%" height="85%">

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={4}
                        label
                        animationDuration={1200}
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />

                        ))}

                    </Pie>

                    <Tooltip
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
                                "0 8px 20px rgba(0,0,0,0.15)"
                        }}
                    />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

};

export default ProblemPieChart;