import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  Trophy,
  Brain,
} from "lucide-react";

const Sidebar = () => {
  const { theme } = useTheme();
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: <Brain size={20} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: <FileText size={20} />,
    },
    {
      name: "Friends",
      path: "/friends",
      icon: <Users size={20} />,
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: <Trophy size={20} />,
    },
  ];

  return (
      <aside
          className={`w-64 h-screen fixed left-0 top-0 shadow-xl transition-all duration-300 ${
              theme === "dark"
                  ? "bg-black text-white"
                  : "bg-slate-900 text-white"
          }`}
      >
      <div className="text-2xl font-bold text-center py-6.5 border-b border-slate-700">
        LeetMetricAI 🚀
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                            ? "hover:bg-slate-800"
                            : "hover:bg-slate-700"
                }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;