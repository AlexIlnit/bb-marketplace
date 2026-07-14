import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// одна оценка за одно объявление
ratingSchema.index(
  {
    seller: 1,
    buyer: 1,
    listing: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Rating", ratingSchema);