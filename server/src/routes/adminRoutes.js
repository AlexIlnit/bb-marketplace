import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { createNotification } from "../utils/createNotification.js";

const router = express.Router();

/* ================= USERS ================= */

router.get("/users", adminOnly, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
});


router.delete("/users/:id", adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.patch("/users/:id/block", adminOnly, async (req, res) => {
  // console.log("BLOCK REQUEST HIT:", req.params.id);
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ================= LISTINGS ================= */

router.get("/listings", adminOnly, async (req, res) => {
  const listings = await Listing.find()
    .populate("user")
    .populate("category", "name slug") // 👈 ДОБАВИТЬ
    .sort({ createdAt: -1 });

  res.json(listings);
});

router.patch("/listings/:id/approve", adminOnly, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing не найден" });
    }

    listing.status = "approved";
    await listing.save();

    // await createNotification(
    //   listing.user,
    //   "Ваше объявление опубликовано ✅",
    //   "success"
    // );
    const userId = listing.user._id || listing.user;

await createNotification(
  userId,
  "Ваше объявление опубликовано ✅",
  "success"
);

    res.json(listing);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/listings/:id/reject", adminOnly, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing не найден" });
    }

    listing.status = "rejected";
    await listing.save();

    await createNotification(
      listing.user,
      "Ваше объявление отклонено ❌. Исправьте его и отправьте снова.",
      "error"
    );

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/listings/:id", adminOnly, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});



export default router;