import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Code2,
    Trophy,
    Flame,
    Zap,
    Award,
    Hash,
    Star,
    Pencil,
    X,
    Save,
    Loader2,
    Activity,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CodingHeatmap from "../components/profile/CodingHeatmap";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import API from "../services/api";

const Profile = () => {

    const { theme } = useTheme();
    const { user: authUser } = useAuth();

    const [user, setUser] = useState(null);
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        leetcodeUsername: "",
        profileImage: "",
    });


    // ============================================================
    // FETCH PROFILE
    // ============================================================

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const [profileResponse, dashboardResponse] =
                await Promise.all([
                    API.get("/auth/me"),
                    API.get("/dashboard"),
                ]);


            if (profileResponse.data.success) {

                const userData =
                    profileResponse.data.user;

                setUser(userData);

                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    leetcodeUsername:
                        userData.leetcodeUsername || "",
                    profileImage:
                        userData.profileImage || "",
                });

            }


            if (dashboardResponse.data.success) {

                setWeeklyActivity(
                    dashboardResponse.data.dashboard.weeklyActivity || []
                );

            }

        } catch (err) {

            console.error("PROFILE FETCH ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load profile"
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // HANDLE FORM INPUT
    // ============================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ============================================================
    // OPEN EDIT MODAL
    // ============================================================

    const handleEdit = () => {

        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            leetcodeUsername:
                user?.leetcodeUsername || "",
            profileImage:
                user?.profileImage || "",
        });

        setIsEditing(true);

    };


    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const handleSave = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            const response = await API.put(
                "/auth/profile",
                formData
            );

            if (response.data.success) {

                setUser((prev) => ({
                    ...prev,
                    ...response.data.user,
                }));

                setIsEditing(false);

            }

        } catch (err) {

            console.error("PROFILE UPDATE ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update profile"
            );

        } finally {

            setSaving(false);

        }
    };


    // ============================================================
    // CALCULATE LEVEL
    // ============================================================

    const calculateLevel = (xp = 0) => {

        if (xp < 100) return "Beginner";
        if (xp < 300) return "Learner";
        if (xp < 600) return "Intermediate";
        if (xp < 1000) return "Advanced";
        return "Expert";

    };


    // ============================================================
    // XP PROGRESS
    // ============================================================

    const calculateXPProgress = (xp = 0) => {

        if (xp < 100) {
            return {
                current: xp,
                next: 100,
                percentage: (xp / 100) * 100,
            };
        }

        if (xp < 300) {
            return {
                current: xp - 100,
                next: 200,
                percentage: ((xp - 100) / 200) * 100,
            };
        }

        if (xp < 600) {
            return {
                current: xp - 300,
                next: 300,
                percentage: ((xp - 300) / 300) * 100,
            };
        }

        if (xp < 1000) {
            return {
                current: xp - 600,
                next: 400,
                percentage: ((xp - 600) / 400) * 100,
            };
        }

        return {
            current: 100,
            next: 100,
            percentage: 100,
        };
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <div
                className={`min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="ml-64">

                    <Navbar />

                    <div className="flex items-center justify-center h-[80vh]">

                        <Loader2
                            size={40}
                            className="animate-spin text-blue-500"
                        />

                    </div>

                </div>

            </div>

        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (!user) {

        return (

            <div
                className={`min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="ml-64">

                    <Navbar />

                    <div className="flex items-center justify-center h-[80vh]">

                        <p className="text-red-500">
                            {error || "Unable to load profile"}
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // ============================================================
    // DATA
    // ============================================================

    const stats = user.leetcodeStats || {};

    const xp = user.xp || 0;

    const streak = user.streak || 0;

    const level = calculateLevel(xp);

    const xpProgress = calculateXPProgress(xp);

    const firstLetter =
        user.name?.charAt(0)?.toUpperCase() || "?";

    const problemDistribution = [
        {
            name: "Easy",
            value: stats.easySolved || 0,
        },
        {
            name: "Medium",
            value: stats.mediumSolved || 0,
        },
        {
            name: "Hard",
            value: stats.hardSolved || 0,
        },
    ];

    const weeklyTotal = weeklyActivity.reduce(
        (total, day) => total + (day.solved || 0),
        0
    );


    // ============================================================
    // BADGES
    // ============================================================

    const badges = [

        ...(user.xpBreakdown?.hard > 0
            ? ["Hard Challenger"]
            : []),

        ...(user.xpBreakdown?.medium > 0
            ? ["Medium Master"]
            : []),

        ...(streak >= 7
            ? ["7 Day Streak"]
            : []),

        ...(xp >= 500
            ? ["XP Hunter"]
            : []),

    ];


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div
            className={`min-h-screen transition-all duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            <Sidebar />

            <div className="ml-64">

                <Navbar />


                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <main className="p-8 max-w-7xl mx-auto">


                    {/* PAGE TITLE */}

                    <div className="mb-8">

                        <h2 className="text-3xl font-bold">
                            My Profile
                        </h2>

                        <p
                            className={`mt-1 ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Your coding journey and achievements
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* PROFILE HEADER */}
                    {/* ================================================= */}

                    <section
                        className={`rounded-2xl p-7 shadow-lg border ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


                            {/* PROFILE INFO */}

                            <div className="flex items-center gap-5">

                                {/* AVATAR */}

                                {user.profileImage ? (

                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                                    />

                                ) : (

                                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">

                                        {firstLetter}

                                    </div>

                                )}


                                <div>

                                    <h1 className="text-3xl font-bold">
                                        {user.name}
                                    </h1>

                                    <p className="text-blue-500 font-medium mt-1">
                                        @{user.leetcodeUsername || "leetcode-user"}
                                    </p>

                                    <p
                                        className={`mt-2 ${
                                            theme === "dark"
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        CSE Student • ABES Engineering College
                                    </p>

                                    <p
                                        className={`text-sm mt-1 ${
                                            theme === "dark"
                                                ? "text-slate-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {user.email}
                                    </p>

                                </div>

                            </div>


                            {/* EDIT BUTTON */}

                            <button
                                onClick={handleEdit}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                            >

                                <Pencil size={18} />

                                Edit Profile

                            </button>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* LEETCODE PROBLEM STATS */}
                    {/* ================================================= */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">


                        {/* TOTAL */}

                        <StatCard
                            icon={<Code2 size={24} />}
                            title="Problems Solved"
                            value={stats.totalSolved || 0}
                            subtitle="Total"
                            theme={theme}
                        />


                        {/* EASY */}

                        <StatCard
                            icon={<Star size={24} />}
                            title="Easy"
                            value={stats.easySolved || 0}
                            subtitle="Problems"
                            theme={theme}
                        />


                        {/* MEDIUM */}

                        <StatCard
                            icon={<Zap size={24} />}
                            title="Medium"
                            value={stats.mediumSolved || 0}
                            subtitle="Problems"
                            theme={theme}
                        />


                        {/* HARD */}

                        <StatCard
                            icon={<Trophy size={24} />}
                            title="Hard"
                            value={stats.hardSolved || 0}
                            subtitle="Problems"
                            theme={theme}
                        />

                    </section>


                    {/* ================================================= */}
                    {/* LOWER SECTION */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">


                        {/* ================================================= */}
                        {/* LEETCODE STATISTICS */}
                        {/* ================================================= */}

                        <section
                            className={`rounded-2xl p-6 shadow-lg border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <h3 className="text-xl font-bold mb-6">
                                LeetCode Statistics
                            </h3>


                            <div className="space-y-5">


                                <InfoRow
                                    icon={<Hash size={20} />}
                                    label="Ranking"
                                    value={
                                        stats.ranking
                                            ? `#${stats.ranking.toLocaleString()}`
                                            : "N/A"
                                    }
                                    theme={theme}
                                />


                                <InfoRow
                                    icon={<Award size={20} />}
                                    label="Reputation"
                                    value={
                                        stats.reputation ?? 0
                                    }
                                    theme={theme}
                                />


                                <InfoRow
                                    icon={<Code2 size={20} />}
                                    label="Last Synced"
                                    value={
                                        stats.lastSynced
                                            ? new Date(
                                                stats.lastSynced
                                            ).toLocaleDateString()
                                            : "Never"
                                    }
                                    theme={theme}
                                />

                            </div>

                        </section>


                        {/* ================================================= */}
                        {/* GAMIFICATION */}
                        {/* ================================================= */}

                        <section
                            className={`rounded-2xl p-6 shadow-lg border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <h3 className="text-xl font-bold mb-6">
                                Gamification
                            </h3>


                            <div className="grid grid-cols-2 gap-4 mb-6">


                                <div
                                    className={`p-4 rounded-xl ${
                                        theme === "dark"
                                            ? "bg-slate-800"
                                            : "bg-slate-100"
                                    }`}
                                >

                                    <div className="flex items-center gap-2 text-yellow-500">

                                        <Zap size={20} />

                                        <span className="font-medium">
                                            XP
                                        </span>

                                    </div>

                                    <p className="text-2xl font-bold mt-2">
                                        {xp}
                                    </p>

                                </div>


                                <div
                                    className={`p-4 rounded-xl ${
                                        theme === "dark"
                                            ? "bg-slate-800"
                                            : "bg-slate-100"
                                    }`}
                                >

                                    <div className="flex items-center gap-2 text-orange-500">

                                        <Flame size={20} />

                                        <span className="font-medium">
                                            Streak
                                        </span>

                                    </div>

                                    <p className="text-2xl font-bold mt-2">
                                        {streak} days
                                    </p>

                                </div>

                            </div>


                            {/* LEVEL */}

                            <div>

                                <div className="flex justify-between mb-2">

                                    <span className="font-semibold">
                                        Level: {level}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                        {xp} XP
                                    </span>

                                </div>


                                <div
                                    className={`h-3 rounded-full overflow-hidden ${
                                        theme === "dark"
                                            ? "bg-slate-800"
                                            : "bg-slate-200"
                                    }`}
                                >

                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                xpProgress.percentage,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>


                                <p className="text-xs text-slate-500 mt-2">
                                    {level === "Expert"
                                        ? "Maximum level reached 🎉"
                                        : `${xpProgress.current} / ${xpProgress.next} XP toward next level`
                                    }
                                </p>

                            </div>

                        </section>

                    </div>

                    {/* ================================================= */}
                    {/* PROBLEM DISTRIBUTION + CODING ACTIVITY */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">


                        {/* ================================================= */}
                        {/* PROBLEM DISTRIBUTION */}
                        {/* ================================================= */}

                        <section
                            className={`rounded-2xl p-6 shadow-lg border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center gap-3 mb-6">

                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        theme === "dark"
                                            ? "bg-blue-500/10"
                                            : "bg-blue-50"
                                    }`}
                                >
                                    <Code2
                                        size={21}
                                        className="text-blue-500"
                                    />
                                </div>

                                <div>

                                    <h3 className="text-xl font-bold">
                                        Problem Distribution
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Problems solved by difficulty
                                    </p>

                                </div>

                            </div>


                            <div className="flex flex-col sm:flex-row items-center gap-8">


                                {/* DONUT CHART */}

                                <div className="w-52 h-52">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={problemDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={82}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >

                                                <Cell fill="#22c55e" />

                                                <Cell fill="#f59e0b" />

                                                <Cell fill="#ef4444" />

                                            </Pie>

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        theme === "dark"
                                                            ? "#0f172a"
                                                            : "#ffffff",

                                                    border:
                                                        theme === "dark"
                                                            ? "1px solid #334155"
                                                            : "1px solid #e2e8f0",

                                                    borderRadius: "12px",
                                                }}
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>


                                {/* LEGEND */}

                                <div className="flex-1 w-full space-y-4">

                                    <DistributionRow
                                        label="Easy"
                                        value={stats.easySolved || 0}
                                        total={stats.totalSolved || 0}
                                        dot="bg-green-500"
                                    />

                                    <DistributionRow
                                        label="Medium"
                                        value={stats.mediumSolved || 0}
                                        total={stats.totalSolved || 0}
                                        dot="bg-yellow-500"
                                    />

                                    <DistributionRow
                                        label="Hard"
                                        value={stats.hardSolved || 0}
                                        total={stats.totalSolved || 0}
                                        dot="bg-red-500"
                                    />

                                </div>

                            </div>

                        </section>


                        {/* ================================================= */}
                        {/* CODING ACTIVITY */}
                        {/* ================================================= */}

                        <section
                            className={`rounded-2xl p-6 shadow-lg border ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div className="flex items-center justify-between mb-6">

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            theme === "dark"
                                                ? "bg-orange-500/10"
                                                : "bg-orange-50"
                                        }`}
                                    >
                                        <Activity
                                            size={21}
                                            className="text-orange-500"
                                        />
                                    </div>

                                    <div>

                                        <h3 className="text-xl font-bold">
                                            Coding Activity
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Your activity this week
                                        </p>

                                    </div>

                                </div>


                                <div className="text-right">

                                    <p className="text-2xl font-bold">
                                        {weeklyTotal}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        this week
                                    </p>

                                </div>

                            </div>


                            {/* WEEKLY BARS */}

                            <div className="grid grid-cols-7 gap-3 items-end h-44">

                                {weeklyActivity.map((day, index) => {

                                    const maxSolved =
                                        Math.max(
                                            ...weeklyActivity.map(
                                                (item) =>
                                                    item.solved || 0
                                            ),
                                            1
                                        );

                                    const height =
                                        day.solved > 0
                                            ? Math.max(
                                                (day.solved / maxSolved) * 100,
                                                8
                                            )
                                            : 4;

                                    return (

                                        <div
                                            key={`${day.day}-${index}`}
                                            className="h-full flex flex-col items-center justify-end gap-2"
                                        >

                                            <span className="text-xs font-medium text-slate-500">
                                                {day.solved || 0}
                                            </span>

                                            <div
                                                className={`w-full max-w-8 rounded-t-lg transition-all duration-500 ${
                                                    day.solved > 0
                                                        ? "bg-green-600 hover:bg-green-500"
                                                        : theme === "dark"
                                                            ? "bg-slate-800"
                                                            : "bg-slate-200"
                                                }`}
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                                title={`${day.day}: ${day.solved || 0} problems`}
                                            />

                                        </div>

                                    );

                                })}

                            </div>


                            {/* DAY LABELS */}

                            <div className="grid grid-cols-7 gap-3 mt-3">

                                {weeklyActivity.map((day, index) => (

                                    <div
                                        key={`${day.day}-label-${index}`}
                                        className="text-center text-xs text-slate-500"
                                    >
                                        {day.day}
                                    </div>

                                ))}

                            </div>

                        </section>

                    </div>

                    <CodingHeatmap />


                    {/* ================================================= */}
                    {/* ACHIEVEMENTS */}
                    {/* ================================================= */}

                    <section
                        className={`rounded-2xl p-6 shadow-lg border mt-7 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center justify-between mb-6">

                            <h3 className="text-xl font-bold">
                                Achievements
                            </h3>

                            <span className="text-sm text-slate-500">
                                {badges.length} badges
                            </span>

                        </div>


                        {badges.length > 0 ? (

                            <div className="flex flex-wrap gap-4">

                                {badges.map((badge, index) => (

                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 px-5 py-3 rounded-xl ${
                                            theme === "dark"
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }`}
                                    >

                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">

                                            <Trophy size={20} />

                                        </div>

                                        <span className="font-medium">
                                            {badge}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <p className="text-slate-500">
                                Complete challenges to earn badges 🏆
                            </p>

                        )}

                    </section>


                    {/* ================================================= */}
                    {/* ACCOUNT INFORMATION */}
                    {/* ================================================= */}

                    <section
                        className={`rounded-2xl p-6 shadow-lg border mt-7 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <h3 className="text-xl font-bold mb-6">
                            Account Information
                        </h3>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                            <AccountItem
                                icon={<User size={20} />}
                                label="Name"
                                value={user.name}
                                theme={theme}
                            />


                            <AccountItem
                                icon={<Mail size={20} />}
                                label="Email"
                                value={user.email}
                                theme={theme}
                            />


                            <AccountItem
                                icon={<Code2 size={20} />}
                                label="LeetCode Username"
                                value={
                                    user.leetcodeUsername ||
                                    "Not connected"
                                }
                                theme={theme}
                            />

                        </div>

                    </section>


                </main>

            </div>


            {/* ===================================================== */}
            {/* EDIT PROFILE MODAL */}
            {/* ===================================================== */}

            {isEditing && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

                    <div
                        className={`w-full max-w-lg rounded-2xl shadow-2xl ${
                            theme === "dark"
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-900"
                        }`}
                    >


                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between p-6 border-b border-slate-700/30">

                            <div>

                                <h3 className="text-xl font-bold">
                                    Edit Profile
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Update your profile information
                                </p>

                            </div>


                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 rounded-lg hover:bg-slate-700/20 transition"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSave}
                            className="p-6 space-y-5"
                        >


                            {/* NAME */}

                            <InputField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={<User size={18} />}
                                theme={theme}
                            />


                            {/* EMAIL */}

                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={<Mail size={18} />}
                                theme={theme}
                            />


                            {/* LEETCODE */}

                            <InputField
                                label="LeetCode Username"
                                name="leetcodeUsername"
                                value={formData.leetcodeUsername}
                                onChange={handleChange}
                                icon={<Code2 size={18} />}
                                theme={theme}
                            />


                            {/* PROFILE IMAGE */}

                            <InputField
                                label="Profile Image URL"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleChange}
                                icon={<User size={18} />}
                                theme={theme}
                            />


                            {error && (

                                <p className="text-sm text-red-500">
                                    {error}
                                </p>

                            )}


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className={`px-5 py-2.5 rounded-xl ${
                                        theme === "dark"
                                            ? "bg-slate-800 hover:bg-slate-700"
                                            : "bg-slate-200 hover:bg-slate-300"
                                    }`}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
                                >

                                    {saving ? (

                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Save size={18} />

                                    )}

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    theme,
}) => {

    return (

        <div
            className={`rounded-2xl p-6 shadow-lg border ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
            }`}
        >

            <div className="flex items-center justify-between">

                <div className="text-blue-500">
                    {icon}
                </div>

            </div>

            <p className="text-3xl font-bold mt-4">
                {value.toLocaleString()}
            </p>

            <p className="font-medium mt-1">
                {title}
            </p>

            <p className="text-sm text-slate-500">
                {subtitle}
            </p>

        </div>

    );
};


// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({
    icon,
    label,
    value,
    theme,
}) => {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                <div
                    className={`p-2 rounded-lg ${
                        theme === "dark"
                            ? "bg-slate-800 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                    }`}
                >
                    {icon}
                </div>

                <span className="text-slate-500">
                    {label}
                </span>

            </div>

            <span className="font-semibold">
                {value}
            </span>

        </div>

    );
};


// ============================================================
// ACCOUNT ITEM
// ============================================================

const AccountItem = ({
    icon,
    label,
    value,
    theme,
}) => {

    return (

        <div
            className={`p-4 rounded-xl ${
                theme === "dark"
                    ? "bg-slate-800"
                    : "bg-slate-100"
            }`}
        >

            <div className="flex items-center gap-2 text-blue-500">

                {icon}

                <span className="text-sm font-medium">
                    {label}
                </span>

            </div>

            <p className="mt-2 font-semibold break-all">
                {value}
            </p>

        </div>

    );
};


// ============================================================
// INPUT FIELD
// ============================================================

const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    icon,
    theme,
}) => {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>

            <div className="relative">

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">

                    {icon}

                </div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                        theme === "dark"
                            ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                            : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    }`}
                />

            </div>

        </div>

    );
};

// ============================================================
// DISTRIBUTION ROW
// ============================================================

const DistributionRow = ({
    label,
    value,
    total,
    dot,
}) => {

    const percentage =
        total > 0
            ? ((value / total) * 100).toFixed(1)
            : "0.0";

    return (

        <div>

            <div className="flex items-center justify-between mb-1.5">

                <div className="flex items-center gap-2">

                    <span
                        className={`w-2.5 h-2.5 rounded-full ${dot}`}
                    />

                    <span className="text-sm font-medium">
                        {label}
                    </span>

                </div>

                <span className="text-sm font-semibold">
                    {value}
                </span>

            </div>


            <div className="flex items-center gap-3">

                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">

                    <div
                        className={`h-full rounded-full ${dot}`}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />

                </div>

                <span className="text-xs text-slate-500 w-10 text-right">
                    {percentage}%
                </span>

            </div>

        </div>

    );
};

export default Profile;