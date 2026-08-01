// Import required packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Create Express App
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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