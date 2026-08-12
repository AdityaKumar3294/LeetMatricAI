// Import required packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const codeRoutes = require("./routes/codeRoutes");
const friendRoutes = require("./routes/friendRoutes");
const noteRoutes = require("./routes/noteRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const placementRoutes = require("./routes/placementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const errorHandler = require("./middleware/errorHandler");
const recentActivityRoutes = require("./routes/recentActivityRoutes");
const xpRoutes = require("./routes/xpRoutes");

// Create Express App
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leetcode", leetcodeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use(errorHandler);
app.use("/api/recent-activity", recentActivityRoutes);
app.use("/api/xp", xpRoutes);

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to LeetMatric AI Backend 🚀"
    });
});

// Test Route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working perfectly!"
    });
});

// Read PORT from .env
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});