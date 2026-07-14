import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createRating,
  getSellerRatings,
} from "../controllers/ratingController.js";

const router = express.Router();

// Создать отзыв
router.post("/", authMiddleware, createRating);

// Получить отзывы продавца
router.get("/:sellerId", getSellerRatings);

export default router;