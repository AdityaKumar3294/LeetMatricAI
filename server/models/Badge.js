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

    description: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      default: ""
    },

    earnedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Badge", badgeSchema);