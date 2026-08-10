import { User, Mail, Code2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const ProfileCard = () => {

    const { user } = useAuth();
    const { theme } = useTheme();

    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "?";

    return (

        <div
            className={`
                rounded-2xl
                border
                shadow-md
                transition-all
                duration-300
                hover:shadow-xl
                hover:-translate-y-1
                p-6
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            {/* Header */}

            <h2
                className={`text-xl font-bold mb-6 ${
                    theme === "dark"
                        ? "text-white"
                        : "text-slate-900"
                }`}
            >
                👤 Profile
            </h2>

            {/* Avatar */}

            <div className="flex flex-col items-center mb-8">

                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">

                    {firstLetter}

                </div>

                <h3
                    className={`mt-4 text-xl font-bold ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    {user?.name || "User"}
                </h3>

                <p
                    className={`text-sm ${
                        theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Keep solving. Keep growing 🚀
                </p>

            </div>

            {/* User Information */}

            <div className="space-y-5">

                {/* Name */}

                <div className="flex items-center gap-4">

                    <div className="p-3 rounded-xl bg-blue-100">

                        <User
                            size={20}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <p
                            className={`text-sm ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Name
                        </p>

                        <p
                            className={`font-semibold ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            {user?.name || "N/A"}
                        </p>

                    </div>

                </div>

                {/* Email */}

                <div className="flex items-center gap-4">

                    <div className="p-3 rounded-xl bg-green-100">

                        <Mail
                            size={20}
                            className="text-green-600"
                        />

                    </div>

                    <div>

                        <p
                            className={`text-sm ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            Email
                        </p>

                        <p
                            className={`font-semibold break-all ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            {user?.email || "N/A"}
                        </p>

                    </div>

                </div>

                {/* LeetCode */}

                <div className="flex items-center gap-4">

                    <div className="p-3 rounded-xl bg-yellow-100">

                        <Code2
                            size={20}
                            className="text-yellow-600"
                        />

                    </div>

                    <div>

                        <p
                            className={`text-sm ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            LeetCode Username
                        </p>

                        <p
                            className={`font-semibold ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            {user?.leetcodeUsername || "Not Added"}
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ProfileCard;