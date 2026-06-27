import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";


import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getConversations,
  getAllConversations,
  getConversationMessagesAdmin,
  deleteConversationAdmin,
} from "../controllers/chatController.js";

const router = express.Router();

// 📌 создать или получить диалог
router.post("/conversation", authMiddleware, getOrCreateConversation);

// 📌 отправить сообщение
router.post("/message", authMiddleware, sendMessage);

// 📌 получить сообщения конкретного диалога
router.get("/messages/:id", authMiddleware, getMessages);

// 📌 список всех диалогов пользователя
router.get("/conversations", authMiddleware, getConversations);

router.get("/admin/conversations", authMiddleware, adminOnly, getAllConversations);

router.get("/admin/messages/:id", authMiddleware, adminOnly, getConversationMessagesAdmin);

router.delete("/admin/conversation/:id", authMiddleware, adminOnly, deleteConversationAdmin);

export default router;