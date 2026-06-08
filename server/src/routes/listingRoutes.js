import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  deleteListing,
  updateListing
} from "../controllers/listingController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

// 🔒 auth
router.post("/", authMiddleware, createListing);
router.delete("/:id", authMiddleware, deleteListing);
router.put("/:id", authMiddleware, updateListing);

export default router;