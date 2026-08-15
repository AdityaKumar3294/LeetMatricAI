import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    UserRound,
    Trophy,
    Flame,
    Code2,
    Target,
    Users,
    UserPlus,
    Loader2
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import {
    getPublicProfile,
    addFriend
} from "../services/friendService";


function PublicProfile() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const { theme } = useTheme();

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ==========================================
    // Add Friend State
    // ==========================================

    const [addingFriend, setAddingFriend] =
        useState(false);

    const [friendMessage, setFriendMessage] =
        useState("");

    const [friendError, setFriendError] =
        useState("");


    // ==========================================
    // Fetch Public Profile
    // ==========================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getPublicProfile(userId);

                setProfile(response.profile);

            } catch (error) {

                console.log(
                    "Public Profile Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, [userId]);


    // ==========================================
    // Add Friend
    // ==========================================

    const handleAddFriend = async () => {

        if (!profile?.leetcodeUsername) {

            setFriendError(
                "This user does not have a LeetCode username."
            );

            return;

        }

        try {

            setAddingFriend(true);

            setFriendMessage("");

            setFriendError("");

            await addFriend(
                profile.leetcodeUsername
            );

            // Update profile status immediately
            setProfile((currentProfile) => {

                if (!currentProfile) {
                    return currentProfile;
                }

                return {
                    ...currentProfile,
                    isFriend: true,
                    friendsCount:
                        (currentProfile.friendsCount || 0) + 1
                };

            });

            setFriendMessage(
                `${profile.name} added to your friends successfully.`
            );

        } catch (error) {

            console.log(
                "Add Friend Error:",
                error
            );

            setFriendError(
                error.response?.data?.message ||
                "Unable to add friend."
            );

        } finally {

            setAddingFriend(false);

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div
                className={`flex min-h-screen items-center justify-center ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <div className="flex items-center gap-3">

                    <Loader2
                        size={24}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-xl font-semibold">
                        Loading profile...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error || !profile) {

        return (

            <div
                className={`flex min-h-screen items-center justify-center ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <div className="text-center">

                    <p className="text-red-500 mb-4">
                        {error || "Profile not found."}
                    </p>

                    <button
                        onClick={() => navigate("/friends")}
                        className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Back to Friends
                    </button>

                </div>

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

            {/* ================= Sidebar ================= */}

            <Sidebar />


            {/* ================= Main Content ================= */}

            <div className="flex-1 ml-64">

                <Navbar />

                <main className="p-6">

                    {/* ================= Back Button ================= */}

                    <button
                        onClick={() => navigate("/friends")}
                        className="flex items-center gap-2 mb-6 text-blue-600 font-semibold hover:text-blue-700 transition"
                    >

                        <ArrowLeft size={18} />

                        Back to Friends

                    </button>


                    {/* ================= Profile Header ================= */}

                    <div
                        className={`rounded-2xl border p-8 shadow-md ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

                            {/* Avatar */}

                            <div
                                className={`w-28 h-28 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                {profile.avatar ? (

                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                        onError={(event) => {

                                            event.currentTarget.style.display =
                                                "none";

                                        }}
                                    />

                                ) : (

                                    <UserRound
                                        size={48}
                                        className="text-slate-400"
                                    />

                                )}

                            </div>


                            {/* Profile Information */}

                            <div className="flex-1 text-center md:text-left">

                                <h1 className="text-3xl font-bold">
                                    {profile.name}
                                </h1>

                                <p className="text-blue-500 mt-1">
                                    @{profile.leetcodeUsername}
                                </p>


                                {/* Quick Stats */}

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">

                                    <span>
                                        ⭐ {profile.xp} XP
                                    </span>

                                    <span>
                                        🔥 {profile.streak} day streak
                                    </span>

                                    <span>
                                        👥 {profile.friendsCount} friends
                                    </span>

                                </div>


                                {/* ================= Friend Action ================= */}

                                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">

                                    {profile.isFriend ? (

                                        <button
                                            disabled
                                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-green-600 text-white cursor-default"
                                        >

                                            ✓ Friend

                                        </button>

                                    ) : (

                                        <button
                                            onClick={handleAddFriend}
                                            disabled={addingFriend}
                                            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition ${
                                                addingFriend
                                                    ? "bg-blue-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                        >

                                            {addingFriend ? (

                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Adding...
                                                </>

                                            ) : (

                                                <>
                                                    <UserPlus
                                                        size={18}
                                                    />

                                                    Add Friend
                                                </>

                                            )}

                                        </button>

                                    )}

                                </div>


                                {/* Success */}

                                {friendMessage && (

                                    <p className="mt-3 text-green-500 font-medium">

                                        ✓ {friendMessage}

                                    </p>

                                )}


                                {/* Error */}

                                {friendError && (

                                    <p className="mt-3 text-red-500 font-medium">

                                        {friendError}

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ================= Stats ================= */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">


                        {/* Total Solved */}

                        <div
                            className={`rounded-2xl border p-5 ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <Code2
                                className="text-blue-500 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                                Total Solved
                            </p>

                            <h2 className="text-2xl font-bold">
                                {profile.totalSolved}
                            </h2>

                        </div>


                        {/* Easy */}

                        <div
                            className={`rounded-2xl border p-5 ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <Target
                                className="text-green-500 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                                Easy
                            </p>

                            <h2 className="text-2xl font-bold">
                                {profile.easySolved}
                            </h2>

                        </div>


                        {/* Medium */}

                        <div
                            className={`rounded-2xl border p-5 ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <Trophy
                                className="text-yellow-500 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                                Medium
                            </p>

                            <h2 className="text-2xl font-bold">
                                {profile.mediumSolved}
                            </h2>

                        </div>


                        {/* Hard */}

                        <div
                            className={`rounded-2xl border p-5 ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <Flame
                                className="text-red-500 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                                Hard
                            </p>

                            <h2 className="text-2xl font-bold">
                                {profile.hardSolved}
                            </h2>

                        </div>

                    </div>


                    {/* ================= LeetCode Profile ================= */}

                    <div
                        className={`mt-8 rounded-2xl border p-6 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-center gap-3 mb-6">

                            <Code2
                                className="text-blue-500"
                            />

                            <h2 className="text-xl font-bold">
                                LeetCode Profile
                            </h2>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Ranking */}

                            <div
                                className={`rounded-xl p-4 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                <p className="text-sm text-slate-500">
                                    Global Ranking
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    #{profile.ranking}
                                </p>

                            </div>


                            {/* Reputation */}

                            <div
                                className={`rounded-xl p-4 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                <p className="text-sm text-slate-500">
                                    Reputation
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    {profile.reputation}
                                </p>

                            </div>


                            {/* XP */}

                            <div
                                className={`rounded-xl p-4 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                <p className="text-sm text-slate-500">
                                    LeetMetricAI XP
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    ⭐ {profile.xp}
                                </p>

                            </div>


                            {/* Streak */}

                            <div
                                className={`rounded-xl p-4 ${
                                    theme === "dark"
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            >

                                <p className="text-sm text-slate-500">
                                    Coding Streak
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    🔥 {profile.streak}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================= Footer Tip ================= */}

                    <div
                        className={`mt-8 rounded-2xl border p-5 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div className="flex items-start gap-3">

                            <Users
                                className="text-blue-500 mt-1"
                                size={22}
                            />

                            <div>

                                <h3 className="font-semibold">
                                    Developer Profile
                                </h3>

                                <p
                                    className={`text-sm mt-1 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    Connect with developers, compare
                                    your progress, and grow together.
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default PublicProfile;