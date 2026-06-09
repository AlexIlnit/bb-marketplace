import Notification from "../models/Notification.js";

export const createNotification = async (userId, message, type = "info") => {
  try {
    await Notification.create({
      user: userId,
      message,
      type
    });
  } catch (err) {
    console.error("Notification error:", err);
  }
};