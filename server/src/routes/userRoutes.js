import express from "express";
import { protect } from "../middleware/auth.js";
import { getMyListings } from "../controllers/userController.js";

const router = express.Router();

router.get("/my-listings", protect, getMyListings);

export default router;