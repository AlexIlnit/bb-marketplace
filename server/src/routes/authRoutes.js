import express from "express";
import {
  register,
  login,
  verifyEmail
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user._id);

    user.name = name || user.name;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;