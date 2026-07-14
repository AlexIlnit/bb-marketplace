import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";


import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getConversations,
  deleteConversation
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

router.delete("/conversation/:id", authMiddleware, deleteConversation);
export default router;