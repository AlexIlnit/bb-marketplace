import express from "express";
import Notification from "../models/Notification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Получить уведомления текущего пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (err) {
    console.error("Ошибка получения уведомлений:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// Пометить уведомление как прочитанное
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Уведомление не найдено",
      });
    }

    notification.isRead = true;

    await notification.save();

    // Оставляем максимум 3 прочитанных уведомления
    const readNotifications = await Notification.find({
      user: req.user._id,
      isRead: true,
    }).sort({
      createdAt: -1,
    });

    if (readNotifications.length > 3) {
      const toDelete = readNotifications.slice(3);

      await Notification.deleteMany({
        _id: {
          $in: toDelete.map((n) => n._id),
        },
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Ошибка чтения уведомления:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;