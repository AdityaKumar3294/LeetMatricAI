import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Code2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

import { registerUser } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        leetcodeUsername: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [touched, setTouched] = useState({});

    // -----------------------------------------
    // Handle input changes
    // -----------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // -----------------------------------------
    // Handle blur
    // -----------------------------------------
    const handleBlur = (e) => {
        const { name } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    // -----------------------------------------
    // Password strength
    // -----------------------------------------
    const getPasswordStrength = () => {
        const password = formData.password;

        if (!password) {
            return {
                score: 0,
                label: "",
            };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {
            return {
                score,
                label: "Weak",
            };
        }

        if (score <= 3) {
            return {
                score,
                label: "Medium",
            };
        }

        return {
            score,
            label: "Strong",
        };
    };

    const passwordStrength = getPasswordStrength();

    // -----------------------------------------
    // Validation
    // -----------------------------------------
    const validateForm = () => {
        const name = formData.name.trim();
        const email = formData.email.trim();
        const leetcodeUsername = formData.leetcodeUsername.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!name) {
            return "Please enter your full name.";
        }

        if (name.length < 2) {
            return "Name must contain at least 2 characters.";
        }

        if (!email) {
            return "Please enter your email address.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!leetcodeUsername) {
            return "Please enter your LeetCode username.";
        }

        if (!password) {
            return "Please enter a password.";
        }

        if (password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        return null;
    };

    // -----------------------------------------
    // Submit
    // -----------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const registerData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                leetcodeUsername: formData.leetcodeUsername.trim(),
                password: formData.password,
            };

            console.log("🔵 REGISTER: Sending registration request...");

            const response = await registerUser(registerData);

            console.log("🟢 REGISTER: Registration successful:", response);

            setSuccess(
                "Account created successfully! Redirecting you to login..."
            );

            setFormData({
                name: "",
                email: "",
                leetcodeUsername: "",
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            console.error("🔴 REGISTER ERROR:", err);

            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message;

            if (backendMessage) {
                setError(backendMessage);
            } else {
                setError(
                    "Unable to create your account. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // Input component
    // -----------------------------------------
    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-gray-50/80 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-800";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-8 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-indigo-100/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 lg:grid-cols-2">

                    {/* =====================================
                        LEFT SIDE
                    ====================================== */}
                    <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">

                        {/* Decorative circles */}
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

                        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

                        <div className="relative z-10">

                            {/* Logo */}
                            <div className="mb-12 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                                    <Code2 size={24} />
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold">
                                        LeetMatric
                                    </h1>

                                    <p className="text-xs text-indigo-100">
                                        AI
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
                                    <Sparkles size={14} />
                                    AI-Powered Coding Platform
                                </div>

                                <h2 className="text-4xl font-bold leading-tight">
                                    Build your coding journey.
                                    <span className="block text-indigo-200">
                                        Smarter with AI.
                                    </span>
                                </h2>

                                <p className="mt-6 leading-7 text-indigo-100">
                                    Track your LeetCode progress, analyze your
                                    performance, create personalized study
                                    plans and become interview ready.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="mt-10 space-y-4">

                                {[
                                    "Track your LeetCode progress",
                                    "Get personalized AI insights",
                                    "Prepare for technical interviews",
                                ].map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2
                                            size={20}
                                            className="shrink-0 text-indigo-200"
                                        />

                                        <span className="text-sm text-indigo-50">
                                            {feature}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Security */}
                        <div className="relative z-10 flex items-center gap-3 text-xs text-indigo-100">
                            <ShieldCheck size={18} />

                            <span>
                                Your account and data are securely protected.
                            </span>
                        </div>
                    </div>

                    {/* =====================================
                        RIGHT SIDE
                    ====================================== */}
                    <div className="p-6 sm:p-10 lg:p-12">

                        {/* Mobile logo */}
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <Code2 size={22} />
                            </div>

                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">
                                    LeetMatric AI
                                </h1>

                                <p className="text-xs text-gray-500">
                                    Code smarter.
                                </p>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Start your personalized coding journey today.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{success}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your full name"
                                        className={inputClass}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="you@example.com"
                                        className={inputClass}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* LeetCode Username */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    LeetCode Username
                                </label>

                                <div className="relative">
                                    <Code2
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="leetcodeUsername"
                                        value={formData.leetcodeUsername}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Your LeetCode username"
                                        className={inputClass}
                                        autoComplete="username"
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-gray-400">
                                    This will be used to fetch your coding
                                    statistics.
                                </p>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Create a strong password"
                                        className={`${inputClass} pr-12`}
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* Password strength */}
                                {formData.password && (
                                    <div className="mt-3">
                                        <div className="mb-1.5 flex justify-between text-xs">
                                            <span className="text-gray-500">
                                                Password strength
                                            </span>

                                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                                {passwordStrength.label}
                                            </span>
                                        </div>

                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <div
                                                    key={item}
                                                    className={`h-1.5 flex-1 rounded-full ${
                                                        item <=
                                                        passwordStrength.score
                                                            ? "bg-indigo-500"
                                                            : "bg-gray-200 dark:bg-gray-700"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Confirm your password"
                                        className={`${inputClass} pr-12`}
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />

                                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                                    I agree to the LeetMatric AI{" "}
                                    <span className="font-medium text-indigo-600">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="font-medium text-indigo-600">
                                        Privacy Policy
                                    </span>
                                    .
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account

                                        <ArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login */}
                        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;