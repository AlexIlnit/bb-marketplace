import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  deleteListing,
  updateListing
} from "../controllers/listingController.js";

import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

// 🔒 auth
// router.post("/", authMiddleware, createListing);
router.delete("/:id", authMiddleware, deleteListing);
router.put("/:id", authMiddleware, updateListing);
router.post("/", authMiddleware, upload.array("images", 5), createListing);

export default router;