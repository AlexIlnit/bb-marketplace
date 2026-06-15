import express from "express";
import {
  register,
  login
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

router.post("/register", register);
router.post("/login", login);

export default router;