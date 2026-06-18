import mongoose from "mongoose";

const listingSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      images: [String],

      city: String,

      region: {
        type: String,
        required: true
      },

      category: String,

      views: {
        type: Number,
        default: 0
      },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },
      condition: {
        type: String,
        enum: ["new", "used"],
        default: "used"
      },

      sellerType: {
        type: String,
        enum: ["private", "company"],
        default: "private"
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User"
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Listing",
  listingSchema
);