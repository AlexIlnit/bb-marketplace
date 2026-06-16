import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getMyListings } from "../controllers/userController.js";
import User from "../models/User.js";

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

export default router;