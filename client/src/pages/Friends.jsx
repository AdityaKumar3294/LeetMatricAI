import {
    useEffect,
    useRef,
    useState
} from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import {
    Users,
    UserPlus,
    Search,
    UserRound,
    UserMinus,
    Code2,
    Trophy,
    Loader2
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import {
    searchUsers,
    addFriend,
    getFriends,
    removeFriend
} from "../services/friendService";

import { useNavigate } from "react-router-dom";


function Friends() {

    const { theme } = useTheme();

    const navigate = useNavigate();

    const searchInputRef = useRef(null);


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
    // Friend State
    // ==========================================

    const [addingFriend, setAddingFriend] =
        useState(null);

    const [removingFriend, setRemovingFriend] =
        useState(null);

    const [friendToRemove, setFriendToRemove] =
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

                setFriendsError("");

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
    // Auto Dismiss Notifications
    // ==========================================

    useEffect(() => {

        if (
            !friendSuccess &&
            !searchError &&
            !friendsError
        ) {
            return;
        }

        const timer = setTimeout(() => {

            setFriendSuccess("");

            setSearchError("");

            setFriendsError("");

        }, 4000);

        return () =>
            clearTimeout(timer);

    }, [
        friendSuccess,
        searchError,
        friendsError
    ]);


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

            setFriendsError("");

            const response =
                await searchUsers(
                    trimmedQuery
                );

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
    // Focus Search
    // ==========================================

    const focusSearch = () => {

        searchInputRef.current?.focus();

    };


    // ==========================================
    // Clear Search
    // ==========================================

    const clearSearch = () => {

        setQuery("");

        setSearchResults([]);

        setSearchError("");

        setFriendSuccess("");

        focusSearch();

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

            setAddingFriend(
                user._id
            );

            setFriendSuccess("");

            setSearchError("");

            setFriendsError("");

            await addFriend(
                user.leetcodeUsername
            );


            // --------------------------------------
            // Update Search Result
            // --------------------------------------

            setSearchResults(
                (currentUsers) =>
                    currentUsers.map(
                        (currentUser) =>

                            currentUser._id ===
                            user._id

                                ? {
                                    ...currentUser,
                                    isFriend: true
                                }

                                : currentUser
                    )
            );


            // --------------------------------------
            // Success Message
            // --------------------------------------

            setFriendSuccess(
                `${user.name} added to your friends successfully.`
            );


            // --------------------------------------
            // Refresh Friends List
            // --------------------------------------

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


    // ==========================================
    // Open Remove Confirmation
    // ==========================================

    const confirmRemoveFriend = (friend) => {

        setFriendToRemove(friend);

        setFriendsError("");

        setSearchError("");

        setFriendSuccess("");

    };


    // ==========================================
    // Remove Friend
    // ==========================================

    const handleRemoveFriend = async (friend) => {

        try {

            setRemovingFriend(
                friend._id
            );

            setFriendsError("");

            setSearchError("");

            setFriendSuccess("");


            // --------------------------------------
            // API Request
            // --------------------------------------

            await removeFriend(
                friend._id
            );


            // --------------------------------------
            // Remove From Friends List
            // --------------------------------------

            setFriends(
                (currentFriends) =>
                    currentFriends.filter(
                        (currentFriend) =>
                            currentFriend._id !==
                            friend._id
                    )
            );


            // --------------------------------------
            // Update Search Result
            // --------------------------------------

            setSearchResults(
                (currentUsers) =>
                    currentUsers.map(
                        (user) =>

                            user._id ===
                            friend._id

                                ? {
                                    ...user,
                                    isFriend: false
                                }

                                : user
                    )
            );


            // --------------------------------------
            // Success
            // --------------------------------------

            setFriendSuccess(
                `${friend.name} removed from your friends.`
            );

            return true;

        } catch (error) {

            console.log(
                "Remove Friend Error:",
                error
            );

            setFriendsError(
                error.response?.data?.message ||
                "Unable to remove friend."
            );

            return false;

        } finally {

            setRemovingFriend(null);

        }

    };


    return (

        <div
            className={`min-h-screen transition-colors duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            {/* ================= Sidebar ================= */}

            <Sidebar />


            {/* ================= Main Content ================= */}

            <div
                className="min-h-screen lg:ml-64"
            >

                <Navbar />


                <main
                    className="px-4 py-5 sm:px-6 lg:p-6"
                >


                    {/* ================= HEADER ================= */}

                    <div className="mb-6 sm:mb-8">

                        <div
                            className="flex items-start sm:items-center gap-3"
                        >

                            <div
                                className="flex-shrink-0 mt-1 sm:mt-0"
                            >

                                <Users
                                    size={28}
                                    className="text-blue-600"
                                />

                            </div>


                            <div>

                                <h1
                                    className="text-2xl sm:text-3xl font-bold"
                                >
                                    Friends
                                </h1>

                                <p
                                    className={`mt-1 text-sm sm:text-base ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    Connect with developers, compare coding
                                    progress, and grow together.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================= SEARCH CARD ================= */}

                    <div
                        className={`rounded-2xl border p-4 sm:p-6 shadow-md mb-6 sm:mb-8 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div
                            className="flex items-center gap-3 mb-4"
                        >

                            <UserPlus
                                size={21}
                                className="text-blue-600"
                            />

                            <h2
                                className="text-lg sm:text-xl font-bold"
                            >
                                Find Developers
                            </h2>

                        </div>


                        <div
                            className="flex flex-col sm:flex-row gap-3"
                        >

                            <div
                                className="relative flex-1 min-w-0"
                            >

                                <Search
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    onChange={(event) => {

                                        setQuery(
                                            event.target.value
                                        );

                                        setSearchError("");

                                        setFriendSuccess("");

                                    }}
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    placeholder="Search name, username or email..."
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition text-sm sm:text-base ${
                                        theme === "dark"
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                    }`}
                                />

                            </div>


                            <button
                                onClick={
                                    handleSearch
                                }
                                disabled={
                                    searching
                                }
                                className={`w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
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

                                        <Search
                                            size={18}
                                        />

                                        Search

                                    </>

                                )}

                            </button>

                        </div>


                        {/* ================= SEARCH ERROR ================= */}

                        {searchError && (

                            <div
                                className={`mt-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                    theme === "dark"
                                        ? "bg-red-950/30 border-red-800 text-red-400"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >

                                <div
                                    className="flex items-start gap-2 min-w-0"
                                >

                                    <span>
                                        ⚠
                                    </span>

                                    <span>
                                        {searchError}
                                    </span>

                                </div>


                                <button
                                    onClick={() =>
                                        setSearchError("")
                                    }
                                    className="flex-shrink-0 text-lg opacity-60 hover:opacity-100"
                                >
                                    ×
                                </button>

                            </div>

                        )}


                        {/* ================= SUCCESS ================= */}

                        {friendSuccess && (

                            <div
                                className={`mt-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                    theme === "dark"
                                        ? "bg-green-950/30 border-green-800 text-green-400"
                                        : "bg-green-50 border-green-200 text-green-700"
                                }`}
                            >

                                <div
                                    className="flex items-center gap-3 min-w-0"
                                >

                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            theme === "dark"
                                                ? "bg-green-900"
                                                : "bg-green-100"
                                        }`}
                                    >
                                        ✓
                                    </div>

                                    <span>
                                        {friendSuccess}
                                    </span>

                                </div>


                                <button
                                    onClick={() =>
                                        setFriendSuccess("")
                                    }
                                    className="flex-shrink-0 text-lg opacity-60 hover:opacity-100"
                                >
                                    ×
                                </button>

                            </div>

                        )}

                    </div>


                    {/* ================= SEARCH RESULTS ================= */}

                    {searchResults.length > 0 && (

                        <section className="mb-8">

                            <div
                                className="flex items-center gap-2 mb-4"
                            >

                                <Search
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2
                                    className="text-lg sm:text-xl font-bold"
                                >
                                    Search Results
                                </h2>

                                <span
                                    className="text-sm text-slate-500"
                                >
                                    ({searchResults.length})
                                </span>

                            </div>


                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                            >

                                {searchResults.map(
                                    (user) => {

                                        const stats =
                                            user.leetcodeStats ||
                                            {};

                                        return (

                                            <div
                                                key={
                                                    user._id
                                                }
                                                className={`rounded-2xl border p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 ${
                                                    theme === "dark"
                                                        ? "bg-slate-900 border-slate-700"
                                                        : "bg-white border-slate-200"
                                                }`}
                                            >

                                                {/* User Header */}

                                                <div
                                                    className="flex items-center gap-3 sm:gap-4"
                                                >

                                                    <div
                                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
                                                            theme === "dark"
                                                                ? "bg-slate-800"
                                                                : "bg-slate-100"
                                                        }`}
                                                    >

                                                        {stats.avatar ? (

                                                            <img
                                                                src={
                                                                    stats.avatar
                                                                }
                                                                alt={
                                                                    user.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            <UserRound
                                                                size={26}
                                                                className="text-slate-400"
                                                            />

                                                        )}

                                                    </div>


                                                    <div
                                                        className="min-w-0"
                                                    >

                                                        <h3
                                                            className="font-bold text-base sm:text-lg truncate"
                                                        >
                                                            {
                                                                user.name
                                                            }
                                                        </h3>

                                                        <p
                                                            className="text-sm text-blue-500 truncate"
                                                        >
                                                            @
                                                            {
                                                                user.leetcodeUsername
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Stats */}

                                                <div
                                                    className={`grid grid-cols-3 gap-1.5 sm:gap-2 mt-5 rounded-xl p-2.5 sm:p-3 ${
                                                        theme === "dark"
                                                            ? "bg-slate-800"
                                                            : "bg-slate-100"
                                                    }`}
                                                >

                                                    <div
                                                        className="text-center min-w-0"
                                                    >

                                                        <Code2
                                                            size={16}
                                                            className="mx-auto text-blue-500 mb-1"
                                                        />

                                                        <p className="text-[11px] sm:text-xs text-slate-500">
                                                            Solved
                                                        </p>

                                                        <p
                                                            className="font-bold text-sm sm:text-base"
                                                        >
                                                            {
                                                                stats.totalSolved ||
                                                                0
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="text-center min-w-0"
                                                    >

                                                        <Trophy
                                                            size={16}
                                                            className="mx-auto text-yellow-500 mb-1"
                                                        />

                                                        <p className="text-[11px] sm:text-xs text-slate-500">
                                                            XP
                                                        </p>

                                                        <p
                                                            className="font-bold text-sm sm:text-base"
                                                        >
                                                            {
                                                                user.xp ||
                                                                0
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="text-center min-w-0"
                                                    >

                                                        <UserPlus
                                                            size={16}
                                                            className="mx-auto text-green-500 mb-1"
                                                        />

                                                        <p className="text-[11px] sm:text-xs text-slate-500">
                                                            Rank
                                                        </p>

                                                        <p
                                                            className="font-bold text-sm sm:text-base truncate"
                                                        >
                                                            {
                                                                stats.ranking ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Actions */}

                                                <div
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5"
                                                >

                                                    <button
                                                        onClick={() =>
                                                            handleViewProfile(
                                                                user._id
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                                    >

                                                        <UserRound
                                                            size={16}
                                                        />

                                                        Profile

                                                    </button>


                                                    {user.isFriend ? (

                                                        <button
                                                            disabled
                                                            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-green-600 text-white font-semibold cursor-default"
                                                        >

                                                            ✓ Friend

                                                        </button>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                handleAddFriend(
                                                                    user
                                                                )
                                                            }
                                                            disabled={
                                                                addingFriend ===
                                                                user._id
                                                            }
                                                            className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                                                                addingFriend ===
                                                                user._id
                                                                    ? "bg-blue-400 cursor-not-allowed"
                                                                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                                                            }`}
                                                        >

                                                            {addingFriend ===
                                                            user._id ? (

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

                                    }
                                )}

                            </div>

                        </section>

                    )}


                    {/* ================= NO SEARCH RESULTS ================= */}

                    {!searching &&
                        query.trim() &&
                        searchResults.length === 0 &&
                        !searchError && (

                            <div
                                className={`rounded-2xl border p-8 sm:p-10 text-center mb-8 ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <div
                                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 ${
                                        theme === "dark"
                                            ? "bg-slate-800"
                                            : "bg-slate-100"
                                    }`}
                                >

                                    <Search
                                        size={30}
                                        className="text-slate-400"
                                    />

                                </div>


                                <h3
                                    className="text-xl font-bold mb-2"
                                >
                                    No developers found
                                </h3>


                                <p
                                    className={`max-w-md mx-auto leading-6 text-sm sm:text-base ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    We couldn't find anyone matching{" "}

                                    <span className="font-semibold">
                                        "{query}"
                                    </span>.

                                    {" "}Try searching with a different
                                    name, email, or LeetCode username.
                                </p>


                                <button
                                    onClick={
                                        clearSearch
                                    }
                                    className="mt-5 px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                                >
                                    Clear Search
                                </button>

                            </div>

                        )}


                    {/* ================= MY FRIENDS ================= */}

                    <section
                        className={`rounded-2xl border p-4 sm:p-6 shadow-md ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        {/* Header */}

                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
                        >

                            <div
                                className="flex items-center gap-3"
                            >

                                <Users
                                    size={21}
                                    className="text-blue-600"
                                />

                                <h2
                                    className="text-lg sm:text-xl font-bold"
                                >
                                    My Friends
                                </h2>

                            </div>


                            <span
                                className="self-start sm:self-auto text-sm text-slate-500"
                            >

                                {friends.length}{" "}

                                {
                                    friends.length === 1
                                        ? "Friend"
                                        : "Friends"
                                }

                            </span>

                        </div>


                        {/* Friends Error */}

                        {friendsError && (

                            <div
                                className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                    theme === "dark"
                                        ? "bg-red-950/30 border-red-800 text-red-400"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >

                                <div
                                    className="flex items-start gap-2 min-w-0"
                                >

                                    <span>
                                        ⚠
                                    </span>

                                    <span>
                                        {friendsError}
                                    </span>

                                </div>


                                <button
                                    onClick={() =>
                                        setFriendsError("")
                                    }
                                    className="flex-shrink-0 text-lg opacity-60 hover:opacity-100"
                                >
                                    ×
                                </button>

                            </div>

                        )}


                        {/* Friends Loading */}

                        {friendsLoading ? (

                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                            >

                                {[1, 2, 3].map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className={`rounded-2xl border p-5 animate-pulse ${
                                                theme === "dark"
                                                    ? "bg-slate-800 border-slate-700"
                                                    : "bg-slate-50 border-slate-200"
                                            }`}
                                        >

                                            <div
                                                className="flex items-center gap-4"
                                            >

                                                <div
                                                    className={`w-14 h-14 rounded-full flex-shrink-0 ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div
                                                    className="flex-1 space-y-2"
                                                >

                                                    <div
                                                        className={`h-4 rounded w-28 ${
                                                            theme === "dark"
                                                                ? "bg-slate-700"
                                                                : "bg-slate-200"
                                                        }`}
                                                    />

                                                    <div
                                                        className={`h-3 rounded w-36 ${
                                                            theme === "dark"
                                                                ? "bg-slate-700"
                                                                : "bg-slate-200"
                                                        }`}
                                                    />

                                                </div>

                                            </div>


                                            <div
                                                className="grid grid-cols-2 gap-3 mt-5"
                                            >

                                                <div
                                                    className={`h-16 rounded-xl ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div
                                                    className={`h-16 rounded-xl ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                            </div>


                                            <div
                                                className="grid grid-cols-3 gap-2 mt-5"
                                            >

                                                <div
                                                    className={`h-10 rounded-xl ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div
                                                    className={`h-10 rounded-xl ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div
                                                    className={`h-10 rounded-xl ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : friends.length === 0 ? (

                            /* ================= EMPTY FRIENDS STATE ================= */

                            <div
                                className="flex flex-col items-center justify-center py-12 sm:py-14 text-center"
                            >

                                <div
                                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${
                                        theme === "dark"
                                            ? "bg-blue-950"
                                            : "bg-blue-50"
                                    }`}
                                >

                                    <Users
                                        size={36}
                                        className="text-blue-600"
                                    />

                                </div>


                                <h3
                                    className="text-xl font-bold mb-2"
                                >
                                    Build Your Coding Network
                                </h3>


                                <p
                                    className={`max-w-md leading-6 mb-6 text-sm sm:text-base ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >
                                    Connect with developers, compare LeetCode
                                    progress, discover your strengths and
                                    weaknesses, and grow together.
                                </p>


                                <button
                                    onClick={
                                        focusSearch
                                    }
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                                >

                                    <Search
                                        size={18}
                                    />

                                    Find Developers

                                </button>

                            </div>

                        ) : (

                            /* ================= FRIENDS GRID ================= */

                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                            >

                                {friends.map(
                                    (friend) => {

                                        const stats =
                                            friend.leetcodeStats ||
                                            {};

                                        return (

                                            <div
                                                key={
                                                    friend._id
                                                }
                                                className={`rounded-2xl border p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 ${
                                                    theme === "dark"
                                                        ? "bg-slate-800 border-slate-700"
                                                        : "bg-slate-50 border-slate-200"
                                                }`}
                                            >

                                                {/* Friend Header */}

                                                <div
                                                    className="flex items-start gap-3 sm:gap-4"
                                                >

                                                    <div
                                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${
                                                            theme === "dark"
                                                                ? "bg-slate-700"
                                                                : "bg-slate-200"
                                                        }`}
                                                    >

                                                        {stats.avatar ? (

                                                            <img
                                                                src={
                                                                    stats.avatar
                                                                }
                                                                alt={
                                                                    friend.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            <UserRound
                                                                size={26}
                                                                className="text-slate-400"
                                                            />

                                                        )}

                                                    </div>


                                                    <div
                                                        className="min-w-0 flex-1"
                                                    >

                                                        <div
                                                            className="flex flex-wrap items-center gap-2"
                                                        >

                                                            <h3
                                                                className="font-bold truncate max-w-full"
                                                            >
                                                                {
                                                                    friend.name
                                                                }
                                                            </h3>


                                                            <span
                                                                className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold"
                                                            >
                                                                ✓ Friend
                                                            </span>

                                                        </div>


                                                        <p
                                                            className="text-sm text-blue-500 truncate mt-1"
                                                        >
                                                            @
                                                            {
                                                                friend.leetcodeUsername
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Stats */}

                                                <div
                                                    className="grid grid-cols-2 gap-3 mt-5"
                                                >

                                                    <div
                                                        className={`rounded-xl p-3 ${
                                                            theme === "dark"
                                                                ? "bg-slate-900"
                                                                : "bg-white"
                                                        }`}
                                                    >

                                                        <p
                                                            className="text-xs text-slate-500"
                                                        >
                                                            Solved
                                                        </p>

                                                        <p
                                                            className="font-bold text-lg mt-1"
                                                        >
                                                            {
                                                                stats.totalSolved ||
                                                                0
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className={`rounded-xl p-3 ${
                                                            theme === "dark"
                                                                ? "bg-slate-900"
                                                                : "bg-white"
                                                        }`}
                                                    >

                                                        <p
                                                            className="text-xs text-slate-500"
                                                        >
                                                            Ranking
                                                        </p>

                                                        <p
                                                            className="font-bold text-lg mt-1"
                                                        >
                                                            {
                                                                stats.ranking ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Friend Actions */}

                                                <div
                                                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5"
                                                >

                                                    {/* Profile */}

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/friends/profile/${friend._id}`
                                                            )
                                                        }
                                                        className="w-full min-w-0 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-semibold transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                                    >

                                                        <UserRound
                                                            size={16}
                                                            className="flex-shrink-0"
                                                        />

                                                        <span
                                                            className="truncate"
                                                        >
                                                            Profile
                                                        </span>

                                                    </button>


                                                    {/* Compare */}

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/friends/compare/${friend._id}`
                                                            )
                                                        }
                                                        className="w-full min-w-0 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg"
                                                    >

                                                        <Trophy
                                                            size={16}
                                                            className="flex-shrink-0"
                                                        />

                                                        <span
                                                            className="truncate"
                                                        >
                                                            Compare
                                                        </span>

                                                    </button>


                                                    {/* Remove */}

                                                    <button
                                                        onClick={() =>
                                                            confirmRemoveFriend(
                                                                friend
                                                            )
                                                        }
                                                        disabled={
                                                            removingFriend ===
                                                            friend._id
                                                        }
                                                        className={`w-full min-w-0 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${
                                                            removingFriend ===
                                                            friend._id
                                                                ? "bg-red-400 cursor-not-allowed"
                                                                : "bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
                                                        }`}
                                                    >

                                                        {removingFriend ===
                                                        friend._id ? (

                                                            <>

                                                                <Loader2
                                                                    size={16}
                                                                    className="animate-spin flex-shrink-0"
                                                                />

                                                                <span
                                                                    className="truncate"
                                                                >
                                                                    Removing
                                                                </span>

                                                            </>

                                                        ) : (

                                                            <>

                                                                <UserMinus
                                                                    size={16}
                                                                    className="flex-shrink-0"
                                                                />

                                                                <span
                                                                    className="truncate"
                                                                >
                                                                    Remove
                                                                </span>

                                                            </>

                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==========================================
                        Remove Friend Confirmation Modal
                    ========================================== */}

                    {friendToRemove && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        >

                            {/* Overlay */}

                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => {

                                    if (
                                        removingFriend !==
                                        friendToRemove._id
                                    ) {

                                        setFriendToRemove(
                                            null
                                        );

                                    }

                                }}
                            />


                            {/* Modal */}

                            <div
                                className={`relative w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                {/* Icon */}

                                <div
                                    className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5"
                                >

                                    <UserMinus
                                        size={24}
                                        className="text-red-600"
                                    />

                                </div>


                                {/* Title */}

                                <h2
                                    className="text-xl font-bold mb-2"
                                >
                                    Remove Friend?
                                </h2>


                                {/* Message */}

                                <p
                                    className={`text-sm leading-6 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >

                                    Are you sure you want to remove{" "}

                                    <span
                                        className={`font-semibold ${
                                            theme === "dark"
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {
                                            friendToRemove.name
                                        }
                                    </span>

                                    {" "}from your friends?

                                </p>


                                {/* Modal Buttons */}

                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
                                >

                                    {/* Cancel */}

                                    <button
                                        onClick={() =>
                                            setFriendToRemove(
                                                null
                                            )
                                        }
                                        disabled={
                                            removingFriend ===
                                            friendToRemove._id
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border-2 font-semibold transition ${
                                            theme === "dark"
                                                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                                                : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        Cancel
                                    </button>


                                    {/* Confirm */}

                                    <button
                                        onClick={
                                            async () => {

                                                const success =
                                                    await handleRemoveFriend(
                                                        friendToRemove
                                                    );

                                                if (
                                                    success
                                                ) {

                                                    setFriendToRemove(
                                                        null
                                                    );

                                                }

                                            }
                                        }
                                        disabled={
                                            removingFriend ===
                                            friendToRemove._id
                                        }
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition ${
                                            removingFriend ===
                                            friendToRemove._id
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >

                                        {removingFriend ===
                                        friendToRemove._id ? (

                                            <>

                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                                Removing...

                                            </>

                                        ) : (

                                            <>

                                                <UserMinus
                                                    size={17}
                                                />

                                                Remove Friend

                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>

    );

}


export default Friends;