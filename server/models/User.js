const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC USER INFORMATION
    // ============================================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // ============================================================
    // LEETCODE PROFILE
    // ============================================================

    leetcodeUsername: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ============================================================
    // USER ROLE
    // ============================================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ============================================================
    // GAMIFICATION
    // ============================================================

    streak: {
      type: Number,
      default: 0,
    },

    xp: {
      type: Number,
      default: 0,
    },

    xpBreakdown: {
      easy: {
        type: Number,
        default: 0,
      },

      medium: {
        type: Number,
        default: 0,
      },

      hard: {
        type: Number,
        default: 0,
      },

      streak: {
        type: Number,
        default: 0,
      },

      badges: {
        type: Number,
        default: 0,
      },
    },

    // ============================================================
    // LEETCODE STATISTICS
    // ============================================================

    leetcodeStats: {
      totalSolved: {
        type: Number,
        default: 0,
      },

      easySolved: {
        type: Number,
        default: 0,
      },

      mediumSolved: {
        type: Number,
        default: 0,
      },

      hardSolved: {
        type: Number,
        default: 0,
      },

      ranking: {
        type: Number,
        default: 0,
      },

      reputation: {
        type: Number,
        default: 0,
      },

      avatar: {
        type: String,
        default: "",
      },

      lastSynced: {
        type: Date,
      },
    },

    // ============================================================
    // AI PERSONALIZED STUDY PLAN
    // ============================================================

    studyPlan: {

    // Gemini generated study plan
    content: {
        type: String,
        default: "",
    },

    // Date when the current plan was generated
    generatedAt: {
        type: Date,
    },

    // ==========================================================
    // STUDY PLAN PROGRESS
    // ==========================================================

    completedDays: [
        {
        // Day number of the 30-day plan
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 30,
        },

        // When the student completed this day
        completedAt: {
            type: Date,
            default: Date.now,
        },
        },
    ],

    // ==========================================================
    // STUDY PLAN MILESTONES
    // ==========================================================

    milestones: [
        {
        // Number of completed days when milestone was achieved
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 30,
        },

        // Milestone title
        title: {
            type: String,
            required: true,
        },

        // Bonus XP awarded
        bonusXP: {
            type: Number,
            default: 0,
        },

        // When milestone was achieved
        achievedAt: {
            type: Date,
            default: Date.now,
        },
        },
    ],
    },

    // ============================================================
    // AI PERFORMANCE ANALYSIS
    // ============================================================

    aiAnalysis: {
      // Gemini generated analysis
      content: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      // When this analysis was generated
      generatedAt: {
        type: Date,
        default: null,
      },

      // Profile data used to generate this analysis
      statsSnapshot: {
        totalSolved: {
          type: Number,
          default: 0,
        },

        easySolved: {
          type: Number,
          default: 0,
        },

        mediumSolved: {
          type: Number,
          default: 0,
        },

        hardSolved: {
          type: Number,
          default: 0,
        },

        ranking: {
          type: Number,
          default: 0,
        },

        reputation: {
          type: Number,
          default: 0,
        },

        xp: {
          type: Number,
          default: 0,
        },

        streak: {
          type: Number,
          default: 0,
        },
      },
    },

    // ============================================================
    // COMPANY ROADMAPS
    // ============================================================

    companyRoadmaps: [
      {
        company: {
          type: String,
          required: true,
        },

        content: {
          type: String,
          default: "",
        },

        generatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================================================
    // RESUME HISTORY
    // ============================================================

    resumeHistory: [
      {
        filename: {
          type: String,
          default: "",
        },

        originalname: {
          type: String,
          default: "",
        },

        path: {
          type: String,
          default: "",
        },

        extractedText: {
          type: String,
          default: "",
        },

        analysis: {
          type: String,
          default: "",
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================================================
    // AI ACTIVITY HISTORY
    // ============================================================

    aiHistory: [
      {
        feature: {
          type: String,

          enum: [
            "chat",
            "resume",
            "study-plan",
            "roadmap",
            "interview",
            "explain",
            "bug",
            "optimize",
            "complexity",
            "convert",
            "generate-code",
          ],

          required: true,
        },

        input: {
          type: String,
          default: "",
        },

        output: {
          type: String,
          default: "",
        },

        language: {
          type: String,
          default: "",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================================================
    // FRIENDS
    // ============================================================

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ============================================================
    // ACTIVITY TRACKING
    // ============================================================

    lastActive: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);