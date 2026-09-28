import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarCheck, Flame, Trophy, Loader2 } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import API from "../../services/api";

const WEEKS = 53;
const RANGE_DAYS = 365;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COLORS = {
    dark: ["#1e293b", "#14532d", "#15803d", "#22c55e", "#4ade80"],
    light: ["#e2e8f0", "#bbf7d0", "#4ade80", "#16a34a", "#166534"],
};

const toKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// 0 = none, then 1, 2-3, 4-5, 6+ problems in a day
const getLevel = (n) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4);

const CodingHeatmap = () => {
    const { theme } = useTheme();
    const dark = theme === "dark";
    const palette = dark ? COLORS.dark : COLORS.light;
    const muted = dark ? "text-slate-400" : "text-slate-500";

    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hovered, setHovered] = useState(null);

    // ---------------------------------------------------------
    // FETCH
    // ---------------------------------------------------------
    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await API.get("/activity/heatmap");
                setHeatmap(response.data.heatmap || []);
            } catch (err) {
                console.error("HEATMAP FETCH ERROR:", err);
                setError("Unable to load coding activity");
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmap();
    }, []);

    // ---------------------------------------------------------
    // BUILD GRID + STATS
    // ---------------------------------------------------------
    const { weeks, monthLabels, stats } = useMemo(() => {
        const counts = {};
        heatmap.forEach((item) => {
            counts[item.date] = (counts[item.date] || 0) + (item.solved || 0);
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // First visible day = 364 days ago (365-day window, same as before)
        const rangeStart = new Date(today);
        rangeStart.setDate(today.getDate() - (RANGE_DAYS - 1));

        // Grid starts on the Sunday of that week
        const gridStart = new Date(rangeStart);
        gridStart.setDate(rangeStart.getDate() - rangeStart.getDay());

        const weeks = [];
        const monthLabels = [];

        for (let w = 0; w < WEEKS; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(gridStart);
                date.setDate(gridStart.getDate() + w * 7 + d);

                if (date < rangeStart || date > today) {
                    week.push(null);
                    continue;
                }

                const key = toKey(date);
                week.push({
                    key,
                    date,
                    solved: counts[key] || 0,
                    isToday: date.getTime() === today.getTime(),
                });

                // Label the column that contains the 1st of a month
                if (date.getDate() === 1) {
                    monthLabels.push({ week: w, name: MONTHS[date.getMonth()] });
                }
            }
            weeks.push(week);
        }

        const days = weeks.flat().filter(Boolean);
        const totalSolved = days.reduce((s, d) => s + d.solved, 0);
        const activeDays = days.filter((d) => d.solved > 0).length;

        let longest = 0;
        let run = 0;
        days.forEach((d) => {
            run = d.solved > 0 ? run + 1 : 0;
            longest = Math.max(longest, run);
        });

        let current = 0;
        for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].solved > 0) current++;
            else if (i === days.length - 1) continue; // today may not be done yet
            else break;
        }

        return { weeks, monthLabels, stats: { totalSolved, activeDays, longest, current } };
    }, [heatmap]);

    const formatDay = (cell) =>
        `${cell.solved} ${cell.solved === 1 ? "problem" : "problems"} solved on ${cell.date.toLocaleDateString(
            "en-US",
            { weekday: "short", month: "short", day: "numeric", year: "numeric" }
        )}`;

    // ---------------------------------------------------------
    // SHARED SHELL
    // ---------------------------------------------------------
    const shell = `rounded-2xl p-6 shadow-lg border mt-7 ${
        dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    }`;

    const iconBox = (
        <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                dark ? "bg-green-500/10" : "bg-green-50"
            }`}
        >
            <Activity size={21} className="text-green-500" />
        </div>
    );

    if (loading) {
        return (
            <section className={shell}>
                <div className="flex items-center gap-3">
                    {iconBox}
                    <div>
                        <h3 className="text-xl font-bold">Coding Activity</h3>
                        <p className={`text-sm ${muted}`}>Loading your activity...</p>
                    </div>
                </div>
                <div className="h-40 flex items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-green-500" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={shell}>
                <div className="flex items-center gap-3">
                    {iconBox}
                    <h3 className="text-xl font-bold">Coding Activity</h3>
                </div>
                <p className="mt-6 text-sm text-red-500">{error}</p>
            </section>
        );
    }

    // ---------------------------------------------------------
    // MAIN UI
    // ---------------------------------------------------------
    return (
        <section className={shell}>
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
                <div className="flex items-center gap-3">
                    {iconBox}
                    <div>
                        <h3 className="text-xl font-bold">Coding Activity</h3>
                        <p className={`text-sm ${muted}`}>
                            {stats.totalSolved} {stats.totalSolved === 1 ? "problem" : "problems"} solved in the last
                            year
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <MiniStat
                        icon={<CalendarCheck size={18} className="text-green-500" />}
                        label="Active days"
                        value={stats.activeDays}
                        dark={dark}
                    />
                    <MiniStat
                        icon={<Flame size={18} className="text-orange-500" />}
                        label="Current streak"
                        value={`${stats.current}d`}
                        dark={dark}
                    />
                    <MiniStat
                        icon={<Trophy size={18} className="text-yellow-500" />}
                        label="Longest streak"
                        value={`${stats.longest}d`}
                        dark={dark}
                    />
                </div>
            </div>

            {/* HEATMAP */}
            <div
                className={`rounded-xl p-5 border ${
                    dark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
            >
                {/* overflow-y-hidden removes the stray vertical scrollbar;
                    p-1 leaves room for the hover ring/scale so it isn't clipped */}
                <div className="overflow-x-auto overflow-y-hidden p-1">
                    <div
                        className="grid gap-[3px] min-w-[760px]"
                        style={{
                            gridTemplateColumns: `28px repeat(${WEEKS}, minmax(0, 1fr))`,
                            gridTemplateRows: "auto repeat(7, auto)",
                        }}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Month labels */}
                        {monthLabels.map((m) => (
                            <span
                                key={`${m.name}-${m.week}`}
                                className={`text-xs font-medium whitespace-nowrap mb-1 ${muted}`}
                                style={{ gridRow: 1, gridColumn: m.week + 2 }}
                            >
                                {m.name}
                            </span>
                        ))}

                        {/* Day labels */}
                        {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                            <span
                                key={i}
                                className={`text-xs flex items-center ${muted}`}
                                style={{ gridRow: i + 2, gridColumn: 1 }}
                            >
                                {label}
                            </span>
                        ))}

                        {/* Cells */}
                        {weeks.map((week, w) =>
                            week.map((cell, d) =>
                                cell ? (
                                    <div
                                        key={cell.key}
                                        onMouseEnter={() => setHovered(cell)}
                                        title={formatDay(cell)}
                                        className={`aspect-square rounded-[3px] cursor-pointer transition-transform hover:scale-125 ${
                                            cell.isToday ? "ring-1 ring-blue-400" : ""
                                        }`}
                                        style={{
                                            gridRow: d + 2,
                                            gridColumn: w + 2,
                                            backgroundColor: palette[getLevel(cell.solved)],
                                        }}
                                    />
                                ) : null
                            )
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <p className={`text-sm min-h-[20px] ${muted}`}>
                        {hovered ? formatDay(hovered) : "Hover over a day to see details"}
                    </p>

                    <div className={`flex items-center gap-1.5 text-xs ${muted}`}>
                        <span>Less</span>
                        {palette.map((c, i) => (
                            <span key={i} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: c }} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MiniStat = ({ icon, label, value, dark }) => (
    <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            dark ? "bg-slate-800/60 border-slate-700/60" : "bg-slate-50 border-slate-200"
        }`}
    >
        {icon}
        <div>
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
            <p className="text-lg font-bold leading-tight">{value}</p>
        </div>
    </div>
);

export default CodingHeatmap;
