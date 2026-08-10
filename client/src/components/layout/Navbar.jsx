import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {

    const { user, logout } = useAuth();
    const { theme } = useTheme();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "?";

    return (

        <header
            className={`sticky top-0 z-20 flex items-center justify-between px-8 py-5 shadow-md transition-all duration-300 border-b
            ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* Left */}

            <div>

                <h1
                    className={`text-2xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    Welcome, {user?.name || "User"} 👋
                </h1>

                <p
                    className={`mt-1
                    ${
                        theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Let's improve your coding journey today.
                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-5">

                <ThemeToggle />

                {/* Avatar */}

                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">

                    {firstLetter}

                </div>

                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 text-white font-medium shadow-md"
                >
                    <LogOut size={18} />

                    Logout
                </button>

            </div>

        </header>

    );

};

export default Navbar;