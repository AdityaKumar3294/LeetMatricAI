const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    badgeName: {
        type: String,
        required: true
    },

    badgeType: {
        type: String,
        required: true
    },

    icon: {
        type: String,
        default: "🏆"
    },

    description: {
        type: String,
        default: ""
    },

    unlockedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Badge", badgeSchema);