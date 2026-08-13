import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { Users, UserPlus, Search } from "lucide-react";

import { useTheme } from "../context/ThemeContext";

function Friends() {

    const { theme } = useTheme();

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

                    {/* ================= HEADER ================= */}

                    <div className="mb-8">

                        <div className="flex items-center gap-3 mb-2">

                            <Users
                                size={30}
                                className="text-blue-600"
                            />

                            <h1 className="text-3xl font-bold">
                                Friends
                            </h1>

                        </div>

                        <p
                            className={
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }
                        >
                            Connect with other developers, compare your
                            coding progress, and grow together.
                        </p>

                    </div>


                    {/* ================= SEARCH CARD ================= */}

                    <div
                        className={`rounded-2xl border p-6 shadow-md mb-8 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center gap-3 mb-4">

                            <UserPlus
                                size={22}
                                className="text-blue-600"
                            />

                            <h2 className="text-xl font-bold">
                                Find Developers
                            </h2>

                        </div>


                        <div className="flex flex-col md:flex-row gap-3">

                            <div className="relative flex-1">

                                <Search
                                    size={20}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search by name, LeetCode username or email..."
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                                        theme === "dark"
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                    }`}
                                />

                            </div>


                            <button
                                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            >
                                Search
                            </button>

                        </div>

                    </div>


                    {/* ================= MY FRIENDS ================= */}

                    <div
                        className={`rounded-2xl border p-6 shadow-md ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center justify-between mb-6">

                            <div className="flex items-center gap-3">

                                <Users
                                    size={22}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-bold">
                                    My Friends
                                </h2>

                            </div>

                            <span className="text-sm text-slate-500">
                                0 Friends
                            </span>

                        </div>


                        {/* Empty State */}

                        <div className="flex flex-col items-center justify-center py-12 text-center">

                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                <Users
                                    size={30}
                                    className="text-slate-400"
                                />

                            </div>


                            <h3 className="text-lg font-semibold mb-2">
                                No friends yet
                            </h3>


                            <p
                                className={`max-w-md ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            >
                                Search for other developers and add them
                                as friends to compare your coding journey.
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );
}

export default Friends;