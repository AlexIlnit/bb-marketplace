import Listing from "../models/Listing.js";

// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const { title, description, price, city, category, images } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price,
      city,
      category,
      images,
      seller: req.user._id
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getListings =
async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit = 12;

    const skip =
      (page - 1) * limit;

    const listings =
      await Listing.find()
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limit);

    const total =
      await Listing.countDocuments();

    res.json({
      listings,
      totalPages:
        Math.ceil(
          total / limit
        )
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("seller", "name email");

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено"
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};