import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getMyListings } from "../controllers/userController.js";

const router = express.Router();

router.get("/my-listings", authMiddleware, getMyListings);

export default router;