import express from "express";
import {
  register,
  login,
  verifyEmail
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.put("/profile", authMiddleware, async (req, res) => {

  try {

    const {
      name,
      phone,
      oldPassword,
      newPassword
    } = req.body;


    const user = await User.findById(req.user._id);


    // если меняем пароль - проверяем старый
    if(newPassword){

      if(!oldPassword){
        return res.status(400).json({
          message:"Введите старый пароль"
        });
      }


      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );


      if(!isMatch){

        return res.status(400).json({
          message:"Старый пароль указан неверно"
        });

      }


      user.password = await bcrypt.hash(
        newPassword,
        10
      );

    }


    // только после проверки меняем данные

    if(name){
      user.name = name;
    }


    if(phone){
      user.phone = phone;
    }


    await user.save();


    res.json({
      name:user.name,
      phone:user.phone
    });


  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }

});

export default router;