import Listing from "../models/Listing.js";

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};