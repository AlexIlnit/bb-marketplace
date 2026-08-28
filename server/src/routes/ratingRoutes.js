import express from "express";

import { authMiddleware } from "../middleware/auth.js";

import {
  createRating,
  getSellerRatings,
  replyToRating,
} from "../controllers/ratingController.js";

const router = express.Router();

// Создать отзыв
router.post(
  "/",
  authMiddleware,
  createRating
);

// Получить отзывы продавца
router.get(
  "/:sellerId",
  getSellerRatings
);

// Ответить на отзыв
router.patch(
  "/:ratingId/reply",
  authMiddleware,
  replyToRating
);

export default router;
