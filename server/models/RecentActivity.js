const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema(
    {
        // ==========================================
        // User
        // ==========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        // ==========================================
        // Activity Type
        // ==========================================

        type: {
            type: String,
            required: true,
        },


        // ==========================================
        // Activity Title
        // ==========================================

        title: {
            type: String,
            required: true,
        },


        // ==========================================
        // Activity Description
        // ==========================================

        description: {
            type: String,
            default: "",
        },


        // ==========================================
        // Problems Solved
        // Used by Weekly Activity Chart
        // ==========================================

        solvedCount: {
            type: Number,
            default: 0,
        },


        // ==========================================
        // Created At
        // ==========================================

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },


    {
        versionKey: false,
    }
);


module.exports = mongoose.model(
    "RecentActivity",
    recentActivitySchema
);