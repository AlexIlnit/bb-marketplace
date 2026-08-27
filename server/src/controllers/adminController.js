import Listing from "../models/Listing.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: "pending",
    });

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено или уже обработано",
      });
    }

    // Одобряем объявление
    listing.status = "approved";

    await listing.save();

    // Начисляем 1 балл владельцу
    const user = await User.findByIdAndUpdate(
      listing.user,
      {
        $inc: {
          points: 1,
        },
      },
      {
        returnDocument: "after",
      }
    ).select("name email points");

    if (!user) {
      return res.status(404).json({
        message: "Владелец объявления не найден",
      });
    }

    res.json({
      listing,
      user,
      pointsAdded: 1,
    });

  } catch (err) {
    console.error("APPROVE LISTING ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* REJECT */
export const rejectListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { returnDocument: "after" }
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

export const changeAdminPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Not an admin"
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    admin.password = hashed;

    await admin.save();

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controller
export const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "Пользователь не найден",
      });

    user.role =
      user.role === "admin"
        ? "user"
        : "admin";

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};