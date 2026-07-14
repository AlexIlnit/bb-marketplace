import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    buyerConfirmed: {
      type: Boolean,
      default: false,
    },

    sellerConfirmed: {
      type: Boolean,
      default: false,
    },

    buyerRated: {
      type: Boolean,
      default: false,
    },

    completionRequested: {
        type: Boolean,
        default: false,
    },

    sellerRated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Deal", dealSchema);