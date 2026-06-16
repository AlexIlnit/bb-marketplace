import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getMyListings } from "../controllers/userController.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/my-listings", authMiddleware, getMyListings);
router.put(
  "/avatar",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user._id
      );

      user.avatar = req.body.avatar;

      await user.save();

      res.json(user);

    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);
router.get("/:id/profile", async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      });
    }

    const listings = await Listing.find({
      user: user._id,
      status: "approved"
    }).sort({
      createdAt: -1
    });

    res.json({
      user,
      listings
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;