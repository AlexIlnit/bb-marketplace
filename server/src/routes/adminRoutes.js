import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

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

/* ================= LISTINGS ================= */

router.get("/listings", adminOnly, async (req, res) => {
  const listings = await Listing.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.json(listings);
});

router.patch("/listings/:id/approve", adminOnly, async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  res.json(listing);
});

router.patch("/listings/:id/reject", adminOnly, async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  res.json(listing);
});

router.delete("/listings/:id", adminOnly, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;