import express from "express";
import Notification from "../models/Notification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;