import {
    useEffect,
    useState
} from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import {
    Users,
    UserPlus,
    Search,
    UserRound,
    Code2,
    Trophy,
    Loader2
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import {
    searchUsers,
    addFriend,
    getFriends
} from "../services/friendService";

import { useNavigate } from "react-router-dom";


function Friends() {

    const { theme } = useTheme();

    const navigate = useNavigate();

    // ==========================================
    // Search State
    // ==========================================

    const [query, setQuery] = useState("");

    const [searchResults, setSearchResults] =
        useState([]);

    const [searching, setSearching] =
        useState(false);

    const [searchError, setSearchError] =
        useState("");

    // ==========================================
    // Add Friend State
    // ==========================================

    const [addingFriend, setAddingFriend] =
        useState(null);

    const [friendSuccess, setFriendSuccess] =
        useState("");

    const [friends, setFriends] =
        useState([]);

    const [friendsLoading, setFriendsLoading] =
        useState(true);

    const [friendsError, setFriendsError] =
        useState("");
    

    // ==========================================
    // Load Friends
    // ==========================================

    useEffect(() => {

        const fetchFriends = async () => {

            try {

                setFriendsLoading(true);

                const response =
                    await getFriends();

                setFriends(
                    response.friends || []
                );

            } catch (error) {

                console.log(
                    "Get Friends Error:",
                    error
                );

                setFriendsError(
                    error.response?.data?.message ||
                    "Unable to load friends."
                );

            } finally {

                setFriendsLoading(false);

            }

        };

        fetchFriends();

    }, []);


    // ==========================================
    // Search Users
    // ==========================================

    const handleSearch = async () => {

        const trimmedQuery =
            query.trim();

        if (!trimmedQuery) {

            setSearchResults([]);

            setSearchError(
                "Please enter a name, email or LeetCode username."
            );

            setFriendSuccess("");

            return;
        }

        try {

            setSearching(true);

            setSearchError("");

            setFriendSuccess("");

            const response =
                await searchUsers(trimmedQuery);

            setSearchResults(
                response.users || []
            );

        } catch (error) {

            console.log(
                "Friend Search Error:",
                error
            );

            setSearchResults([]);

            setSearchError(
                error.response?.data?.message ||
                "Unable to search users."
            );

        } finally {

            setSearching(false);

        }

    };


    // ==========================================
    // Enter Key Search
    // ==========================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            handleSearch();

        }

    };


    // ==========================================
    // View Public Profile
    // ==========================================

    const handleViewProfile = (userId) => {

        navigate(
            `/friends/profile/${userId}`
        );

    };


    // ==========================================
    // Add Friend
    // ==========================================

    const handleAddFriend = async (user) => {

        try {

            setAddingFriend(user._id);

            setFriendSuccess("");

            setSearchError("");

            await addFriend(
                user.leetcodeUsername
            );

            // Update this specific user's status
            setSearchResults((currentUsers) =>

                currentUsers.map((currentUser) =>

                    currentUser._id === user._id

                        ? {
                            ...currentUser,
                            isFriend: true
                        }

                        : currentUser

                )

            );

            setFriendSuccess(
                `${user.name} added to your friends successfully.`
            );

            const friendsResponse =
                await getFriends();

            setFriends(
                friendsResponse.friends || []
            );

        } catch (error) {

            console.log(
                "Add Friend Error:",
                error
            );

            setSearchError(
                error.response?.data?.message ||
                "Unable to add friend."
            );

        } finally {

            setAddingFriend(null);

        }

    };


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
                                    value={query}
                                    onChange={(event) => {

                                        setQuery(
                                            event.target.value
                                        );

                                        setSearchError("");

                                        setFriendSuccess("");

                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search by name, LeetCode username or email..."
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                                        theme === "dark"
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                    }`}
                                />

                            </div>


                            <button
                                onClick={handleSearch}
                                disabled={searching}
                                className={`px-6 py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                                    searching
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >

                                {searching ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Searching...
                                    </>

                                ) : (

                                    <>
                                        <Search size={18} />
                                        Search
                                    </>

                                )}

                            </button>

                        </div>


                        {/* Search Error */}

                        {searchError && (

                            <p className="mt-3 text-sm text-red-500">

                                {searchError}

                            </p>

                        )}


                        {/* Friend Success */}

                        {friendSuccess && (

                            <p className="mt-3 text-sm text-green-500">

                                ✓ {friendSuccess}

                            </p>

                        )}

                    </div>


                    {/* ================= SEARCH RESULTS ================= */}

                    {searchResults.length > 0 && (

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <Search
                                    size={20}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-bold">
                                    Search Results
                                </h2>

                                <span className="text-sm text-slate-500">
                                    ({searchResults.length})
                                </span>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                {searchResults.map((user) => {

                                    const stats =
                                        user.leetcodeStats || {};

                                    return (

                                        <div
                                            key={user._id}
                                            className={`rounded-2xl border p-5 shadow-md hover:shadow-xl transition-all duration-300 ${
                                                theme === "dark"
                                                    ? "bg-slate-900 border-slate-700"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >

                                            {/* ================= User Header ================= */}

                                            <div className="flex items-center gap-4">

                                                <div
                                                    className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${
                                                        theme === "dark"
                                                            ? "bg-slate-800"
                                                            : "bg-slate-100"
                                                    }`}
                                                >

                                                    {stats.avatar ? (

                                                        <img
                                                            src={stats.avatar}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <UserRound
                                                            size={28}
                                                            className="text-slate-400"
                                                        />

                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-lg truncate">
                                                        {user.name}
                                                    </h3>

                                                    <p className="text-sm text-blue-500 truncate">
                                                        @{user.leetcodeUsername}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================= Stats ================= */}

                                            <div
                                                className={`grid grid-cols-3 gap-2 mt-5 rounded-xl p-3 ${
                                                    theme === "dark"
                                                        ? "bg-slate-800"
                                                        : "bg-slate-100"
                                                }`}
                                            >

                                                <div className="text-center">

                                                    <Code2
                                                        size={17}
                                                        className="mx-auto text-blue-500 mb-1"
                                                    />

                                                    <p className="text-xs text-slate-500">
                                                        Solved
                                                    </p>

                                                    <p className="font-bold">
                                                        {stats.totalSolved || 0}
                                                    </p>

                                                </div>


                                                <div className="text-center">

                                                    <Trophy
                                                        size={17}
                                                        className="mx-auto text-yellow-500 mb-1"
                                                    />

                                                    <p className="text-xs text-slate-500">
                                                        XP
                                                    </p>

                                                    <p className="font-bold">
                                                        {user.xp || 0}
                                                    </p>

                                                </div>


                                                <div className="text-center">

                                                    <UserPlus
                                                        size={17}
                                                        className="mx-auto text-green-500 mb-1"
                                                    />

                                                    <p className="text-xs text-slate-500">
                                                        Rank
                                                    </p>

                                                    <p className="font-bold">
                                                        {stats.ranking || "N/A"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================= Actions ================= */}

                                            <div className="grid grid-cols-2 gap-3 mt-5">

                                                <button
                                                    onClick={() =>
                                                        handleViewProfile(
                                                            user._id
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                                                >
                                                    View Profile
                                                </button>


                                                {user.isFriend ? (

                                                    <button
                                                        disabled
                                                        className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold cursor-default flex items-center justify-center gap-2"
                                                    >

                                                        ✓ Friend

                                                    </button>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            handleAddFriend(user)
                                                        }
                                                        disabled={
                                                            addingFriend === user._id
                                                        }
                                                        className={`px-4 py-2 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                                                            addingFriend === user._id
                                                                ? "bg-blue-400 cursor-not-allowed"
                                                                : "bg-blue-600 hover:bg-blue-700"
                                                        }`}
                                                    >

                                                        {addingFriend === user._id ? (

                                                            <>
                                                                <Loader2
                                                                    size={16}
                                                                    className="animate-spin"
                                                                />

                                                                Adding...
                                                            </>

                                                        ) : (

                                                            <>
                                                                <UserPlus
                                                                    size={16}
                                                                />

                                                                Add Friend
                                                            </>

                                                        )}

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    )}


                    {/* ================= NO RESULTS ================= */}

                    {!searching &&
                        query.trim() &&
                        searchResults.length === 0 &&
                        !searchError && (

                            <div
                                className={`rounded-2xl border p-10 text-center mb-8 ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <Search
                                    size={40}
                                    className="mx-auto text-slate-400 mb-4"
                                />

                                <h3 className="text-lg font-semibold mb-2">
                                    No users found
                                </h3>

                                <p className="text-slate-500">
                                    Try another name, email or LeetCode username.
                                </p>

                            </div>

                        )}


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
                                {friends.length} Friends
                            </span>

                        </div>


                        {/* Error */}

                        {friendsError && (

                            <p className="mb-4 text-sm text-red-500">
                                {friendsError}
                            </p>

                        )}


                        {/* Loading */}

                        {friendsLoading ? (

                            <div className="flex justify-center py-10">

                                <Loader2
                                    size={28}
                                    className="animate-spin text-blue-600"
                                />

                            </div>

                        ) : friends.length === 0 ? (

                            /* Empty */

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
                                    Search for developers above and add them
                                    to your coding network.
                                </p>

                            </div>

                        ) : (

                            /* Friends Grid */

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                {friends.map((friend) => {

                                    const stats =
                                        friend.leetcodeStats || {};

                                    return (

                                        <div
                                            key={friend._id}
                                            className={`rounded-2xl border p-5 ${
                                                theme === "dark"
                                                    ? "bg-slate-800 border-slate-700"
                                                    : "bg-slate-50 border-slate-200"
                                            }`}
                                        >

                                            {/* Header */}

                                            <div className="flex items-center gap-4">

                                                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-slate-200">

                                                    {stats.avatar ? (

                                                        <img
                                                            src={stats.avatar}
                                                            alt={friend.name}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <UserRound
                                                            size={28}
                                                            className="text-slate-400"
                                                        />

                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <h3 className="font-bold truncate">
                                                        {friend.name}
                                                    </h3>

                                                    <p className="text-sm text-blue-500 truncate">
                                                        @{friend.leetcodeUsername}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Stats */}

                                            <div className="grid grid-cols-2 gap-3 mt-5">

                                                <div
                                                    className={`rounded-xl p-3 ${
                                                        theme === "dark"
                                                            ? "bg-slate-900"
                                                            : "bg-white"
                                                    }`}
                                                >

                                                    <p className="text-xs text-slate-500">
                                                        Solved
                                                    </p>

                                                    <p className="font-bold">
                                                        {stats.totalSolved || 0}
                                                    </p>

                                                </div>


                                                <div
                                                    className={`rounded-xl p-3 ${
                                                        theme === "dark"
                                                            ? "bg-slate-900"
                                                            : "bg-white"
                                                    }`}
                                                >

                                                    <p className="text-xs text-slate-500">
                                                        Ranking
                                                    </p>

                                                    <p className="font-bold">
                                                        {stats.ranking || "N/A"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Profile Button */}

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/friends/profile/${friend._id}`
                                                    )
                                                }
                                                className="w-full mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                            >
                                                View Profile
                                            </button>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );

}

export default Friends;