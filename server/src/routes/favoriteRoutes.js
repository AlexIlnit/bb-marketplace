import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/favoriteController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", authMiddleware, toggleFavorite);

router.get("/", authMiddleware, getFavorites);

export default router;