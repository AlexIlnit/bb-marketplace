import Listing from "../models/Listing.js";
import User from "../models/User.js";

/* GET ALL USERS (ADMIN) */
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL LISTINGS (ADMIN) */
export const getAdminListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("user", "name email")        // 👈 ВОТ ЭТО
      .populate("category", "name slug")     // 👈 ВОТ ЭТО
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* APPROVE */
export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* REJECT */
export const rejectListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};