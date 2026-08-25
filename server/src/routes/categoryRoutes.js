import express from "express";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// Получить категории
router.get("/", getCategories);


// Создать
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createCategory
);


// Изменить
router.patch(
  "/:id",
  authMiddleware,
  adminOnly,
  updateCategory
);


// Удалить
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteCategory
);


export default router;