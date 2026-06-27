import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getAllChats,
  getChatMessages,
  deleteChat,
} from "../controllers/adminChatController.js";

const router = express.Router();

router.get("/chats", authMiddleware, adminOnly, getAllChats);
router.get("/chats/:id/messages", authMiddleware, adminOnly, getChatMessages);
router.delete("/chats/:id", authMiddleware, adminOnly, deleteChat);

export default router;