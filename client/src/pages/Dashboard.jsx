import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import StatCard from "../components/dashboard/StatCard";

import ProfileCard from "../components/dashboard/ProfileCard";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";

import ProblemPieChart from "../components/dashboard/charts/ProblemPieChart";
import WeeklyBarChart from "../components/dashboard/charts/WeeklyBarChart";

import RecentActivity from "../components/dashboard/RecentActivity";
import AIInsights from "../components/dashboard/AIInsights";

import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import { getRecentActivities } from "../services/recentActivityService";
import AICoach from "../components/dashboard/AICoach";

function Dashboard() {

    const { theme } = useTheme();
    const [dashboard, setDashboard] = useState(null);
    const [aiInsights, setAIInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await getDashboardData();

                setDashboard(response.dashboard);

                setAIInsights(response.aiInsights);
                
                const activityResponse = await getRecentActivities();
                console.log("Activity Response:", activityResponse);
                console.log("Activities:", activityResponse.activities);

                setActivities(activityResponse.activities);
            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, []);

    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen text-2xl font-bold">

                Loading Dashboard...

            </div>

        );

    }

    return (

        <div
            className={`flex min-h-screen transition-colors duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            {/* Sidebar */}

            <Sidebar />

            {/* Main Content */}

            <div className="flex-1 ml-64">

                <Navbar />

                <main className="p-6">

                    {/* Heading */}

                    <h2 className="text-3xl font-bold mb-2">
                        Welcome to LeetMetricAI 🚀
                    </h2>

                    <p
                        className={`mb-8 ${
                            theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-600"
                        }`}
                    >
                        Track your coding journey with AI-powered analytics.
                    </p>

                    {/* ================= Stats Cards ================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <StatCard
                            title="Total Solved"
                            value={dashboard?.leetcodeStats?.totalSolved || 0}
                            color="text-blue-600"
                        />

                        <StatCard
                            title="Easy"
                            value={dashboard?.leetcodeStats?.easySolved || 0}
                            color="text-green-600"
                        />

                        <StatCard
                            title="Medium"
                            value={dashboard?.leetcodeStats?.mediumSolved || 0}
                            color="text-yellow-500"
                        />

                        <StatCard
                            title="Hard"
                            value={dashboard?.leetcodeStats?.hardSolved || 0}
                            color="text-red-600"
                        />

                    </div>

                    {/* ================= Profile Section ================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        <ProfileCard dashboard={dashboard} />
                        <AnalyticsCard dashboard={dashboard} />

                    </div>

                    {/* ================= Charts Section ================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        <ProblemPieChart dashboard={dashboard} />
                        <WeeklyBarChart dashboard={dashboard} />

                    </div>

                    {/* ================= Recent Activity ================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        <RecentActivity activities={activities} />
                        <AIInsights aiInsights={aiInsights} />

                    </div>

                    <div className="mt-8">

                        <AICoach aiCoach={dashboard?.aiCoach} />

                    </div>

                </main>

            </div>

        </div>

    );
}

export default Dashboard;