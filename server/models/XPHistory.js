const mongoose = require("mongoose");

const xpHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "problem",
                "streak",
                "badge",
                "contest",
                "other"
            ],
            default: "other"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "XPHistory",
    xpHistorySchema
);