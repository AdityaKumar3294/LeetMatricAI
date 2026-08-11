import {
    User,
    Mail,
    Trophy,
    Flame,
    Star,
    Award
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const ProfileCard = ({ dashboard }) => {

    const { theme } = useTheme();

    const user = dashboard?.user;
    const stats = dashboard?.leetcodeStats;

    return (

        <div
            className={`
                rounded-2xl
                border
                p-6
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                ${
                    theme === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                }
            `}
        >

            <h2 className="text-xl font-bold mb-6">
                👤 Profile
            </h2>

            <div className="flex items-center gap-5 mb-6">

                <img
                    src={stats?.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                />

                <div>

                    <h3 className="text-2xl font-bold">
                        {user?.name}
                    </h3>

                    <p
                        className={
                            theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-600"
                        }
                    >
                        @{user?.leetcodeUsername}
                    </p>

                </div>

            </div>

            <div className="space-y-4">

                <div className="flex items-center gap-3">
                    <Mail size={18} className="text-blue-500" />
                    <span>{user?.email}</span>
                </div>

                <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-yellow-500" />
                    <span>Ranking : {stats?.ranking}</span>
                </div>

                <div className="flex items-center gap-3">
                    <Star size={18} className="text-green-500" />
                    <span>XP : {dashboard?.xp}</span>
                </div>

                <div className="flex items-center gap-3">
                    <Flame size={18} className="text-orange-500" />
                    <span>Streak : {dashboard?.streak} days</span>
                </div>

                <div className="flex items-center gap-3">
                    <Award size={18} className="text-purple-500" />
                    <span>
                        {dashboard?.placementLevel}
                        {" "}
                        ({dashboard?.placementScore}%)
                    </span>
                </div>

            </div>

        </div>

    );

};

export default ProfileCard;