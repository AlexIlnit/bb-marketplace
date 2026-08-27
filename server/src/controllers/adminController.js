import Listing from "../models/Listing.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

/* =====================================================
   GET ALL USERS — ADMIN
===================================================== */

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((user) => user._id);

    const listingStats = await Listing.aggregate([
      {
        $match: {
          user: { $in: userIds },
        },
      },
      {
        $group: {
          _id: "$user",

          listingsCount: {
            $sum: 1,
          },

          approvedCount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "approved"] },
                1,
                0,
              ],
            },
          },

          pendingCount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "pending"] },
                1,
                0,
              ],
            },
          },

          rejectedCount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "rejected"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = new Map(
      listingStats.map((item) => [
        String(item._id),
        item,
      ])
    );

    const result = users.map((user) => {
      const stats =
        statsMap.get(String(user._id)) || {};

      return {
        ...user,

        listingsCount:
          stats.listingsCount || 0,

        approvedCount:
          stats.approvedCount || 0,

        pendingCount:
          stats.pendingCount || 0,

        rejectedCount:
          stats.rejectedCount || 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(
      "GET ADMIN USERS ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   GET ALL LISTINGS — ADMIN
===================================================== */

export const getAdminListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate(
        "user",
        "name email avatar phone role points rating createdAt"
      )
      .populate(
        "category",
        "name slug"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json(listings);
  } catch (err) {
    console.error(
      "GET ADMIN LISTINGS ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   APPROVE LISTING
===================================================== */

export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: "pending",
    });

    if (!listing) {
      return res.status(404).json({
        message:
          "Объявление не найдено или уже обработано",
      });
    }

    const user = await User.findById(
      listing.user
    );

    if (!user) {
      return res.status(404).json({
        message:
          "Владелец объявления не найден",
      });
    }

    listing.status = "approved";

    await listing.save();

    user.points += 1;

    await user.save();

    res.json({
      listing,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
      },
      pointsAdded: 1,
    });
  } catch (err) {
    console.error(
      "APPROVE LISTING ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   REJECT LISTING
===================================================== */

export const rejectListing = async (req, res) => {
  try {
    const listing =
      await Listing.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        },
        {
          new: true,
        }
      );

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    res.json(listing);
  } catch (err) {
    console.error(
      "REJECT LISTING ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   DELETE LISTING
===================================================== */

export const deleteListing = async (req, res) => {
  try {
    const listing =
      await Listing.findByIdAndDelete(
        req.params.id
      );

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    res.json({
      message: "Объявление удалено",
    });
  } catch (err) {
    console.error(
      "DELETE LISTING ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   CHANGE ADMIN PASSWORD
===================================================== */

export const changeAdminPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      oldPassword,
      newPassword,
    } = req.body;

    const admin =
      await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Not an admin",
      });
    }

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        admin.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Old password is incorrect",
      });
    }

    if (
      !newPassword ||
      newPassword.length < 6
    ) {
      return res.status(400).json({
        message:
          "New password must contain at least 6 characters",
      });
    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );

    admin.password = hashed;

    await admin.save();

    res.json({
      message:
        "Password updated successfully",
    });
  } catch (err) {
    console.error(
      "CHANGE ADMIN PASSWORD ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =====================================================
   TOGGLE ADMIN
===================================================== */

export const toggleAdmin = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message:
          "Пользователь не найден",
      });
    }

    if (
      String(user._id) ===
      String(req.user._id)
    ) {
      return res.status(400).json({
        message:
          "Нельзя изменить собственную роль",
      });
    }

    user.role =
      user.role === "admin"
        ? "user"
        : "admin";

    await user.save();

    const result =
      user.toObject();

    delete result.password;
    delete result.__v;

    res.json(result);
  } catch (err) {
    console.error(
      "TOGGLE ADMIN ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};