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
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Не найдено" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;