import express from "express";
import {
  getListings,
  getListingById,
  createListing
} from "../controllers/listingController.js";
import { deleteListing } from "../controllers/listingController.js";

import { updateListing } from "../controllers/listingController.js";

import { protect } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

// 🔒 защищённый роут
router.post("/", protect, createListing);

router.delete(
  "/:id",
  authMiddleware,
  deleteListing
);

router.put(
  "/:id",
  authMiddleware,
  updateListing
);

export default router;