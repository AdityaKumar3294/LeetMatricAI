const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
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

    leetcodeUsername: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    streak: {
      type: Number,
      default: 0,
    },

    xp: {
      type: Number,
      default: 0,
    },

    leetcodeStats: {
      totalSolved: {
          type: Number,
          default: 0
      },
      easySolved: {
          type: Number,
          default: 0
      },
      mediumSolved: {
          type: Number,
          default: 0
      },
      hardSolved: {
          type: Number,
          default: 0
      },
      ranking: {
          type: Number,
          default: 0
      },
      reputation: {
          type: Number,
          default: 0
      },
      avatar: {
          type: String,
          default: ""
      },
      lastSynced: {
          type: Date
      }
    },

    studyPlan: {
      content: {
          type: String,
          default: ""
      },
      generatedAt: {
          type: Date
      }
    },

    companyRoadmaps: [
      {
          company: {
              type: String,
              required: true
          },
          content: {
              type: String,
              default: ""
          },
          generatedAt: {
              type: Date,
              default: Date.now
          }
      }
    ],

    resumeHistory: [
      {
          filename: {
              type: String,
              default: ""
          },

          originalname: {
              type: String,
              default: ""
          },

          path: {
              type: String,
              default: ""
          },

          extractedText: {
              type: String,
              default: ""
          },

          analysis: {
              type: String,
              default: ""
          },

          uploadedAt: {
              type: Date,
              default: Date.now
          }
      }
    ],

    // ==============================
    // AI Activity History
    // ==============================

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
                    "generate-code"
                ],
                required: true
            },

            input: {
                type: String,
                default: ""
            },

            output: {
                type: String,
                default: ""
            },

            language: {
                type: String,
                default: ""
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    friends: [
        {
            type: require("mongoose").Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    
    streak: {
        type: Number,
        default: 0
    },

    lastActive: {
        type: Date,
        default: null
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);