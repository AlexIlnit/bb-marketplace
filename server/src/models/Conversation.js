import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },

    lastMessage: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Conversation",
  ConversationSchema
);