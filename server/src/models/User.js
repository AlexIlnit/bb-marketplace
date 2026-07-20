import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    acceptedTerms: {
      type: Boolean,
      default: false,
    },

    acceptedTermsVersion: {
      type: String,
      default: "1.0",
    },

    acceptedTermsDate: {
      type: Date,
    },

    avatar: {
      type: String,
      default: "",
    },

    rating: {
     average: {
     type: Number,
     default: 0,
    },
    count: {
    type: Number,
    default: 0,
     },
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    online: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    socketId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);