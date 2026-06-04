import express from "express";
import {
  getListings,
  getListingById,
  createListing
} from "../controllers/listingController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

// 🔒 защищённый роут
router.post("/", protect, createListing);

export default router;