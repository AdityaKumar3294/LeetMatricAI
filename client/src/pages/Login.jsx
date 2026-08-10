import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import ThemeToggle from "../components/common/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import { loginUser } from "../services/authService";

function Login() {
  const { theme } = useTheme();
  const { login } = useAuth();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      console.log("LOGIN RESPONSE:", data);

      // Save JWT Token
      localStorage.setItem("token", data.token);

      // Save logged-in user in AuthContext
      login(data.user);

      toast.success("Login Successful 🚀");

      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center transition-all duration-300 px-5 ${
        theme === "dark" ? "bg-slate-900" : "bg-slate-100"
      }`}
    >
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div
        className={`w-full max-w-md rounded-3xl p-8 shadow-2xl backdrop-blur-lg ${
          theme === "dark"
            ? "bg-slate-800/70 text-white"
            : "bg-white/80 text-black"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-2">
          LeetMetricAI 🚀
        </h1>

        <p className="text-center opacity-70 mb-8">
          Sign in to continue
        </p>

        <form
          className="space-y-5"
          onSubmit={handleLogin}
        >
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 opacity-60"
              size={20}
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full rounded-xl border pl-11 pr-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 opacity-60"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border pl-11 pr-12 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 opacity-80">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;