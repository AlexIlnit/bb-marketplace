import express from "express";
import {
  getDeal,
  confirmDeal,
  requestCompletion
} from "../controllers/dealController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:conversationId", authMiddleware , getDeal);

router.post("/request", authMiddleware, requestCompletion);

router.post("/confirm", authMiddleware, confirmDeal);

export default router;