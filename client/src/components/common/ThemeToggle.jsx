import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-11 h-11 rounded-full
        flex items-center justify-center
        shadow-lg transition-all duration-300
        hover:scale-110
        ${
          theme === "light"
            ? "bg-white border border-gray-300 text-slate-700"
            : "bg-slate-800 border border-slate-600 text-yellow-400"
        }
      `}
    >
      {theme === "light" ? (
        <Moon size={20} strokeWidth={2.2} />
      ) : (
        <Sun size={20} strokeWidth={2.2} />
      )}
    </button>
  );
}

export default ThemeToggle;