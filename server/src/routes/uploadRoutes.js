import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import { authMiddleware }  from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), uploadImage);

export default router;