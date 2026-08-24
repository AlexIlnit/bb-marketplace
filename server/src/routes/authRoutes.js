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


    if(!user){
      return res.status(404).json({
        message:"Пользователь не найден"
      });
    }


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


      if(newPassword.length < 6){
        return res.status(400).json({
          message:"Новый пароль минимум 6 символов"
        });
      }


      user.password = await bcrypt.hash(
        newPassword,
        10
      );

    }


    if(name !== undefined){
      user.name = name;
    }


    if(phone !== undefined){
      user.phone = phone;
    }


    await user.save();


    res.json({
      message:"Профиль обновлен",
      user:{
        name:user.name,
        phone:user.phone,
        acceptedTerms:user.acceptedTerms,
        acceptedTermsVersion:user.acceptedTermsVersion,
        acceptedTermsDate:user.acceptedTermsDate
      }
    });


  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }

});

export default router;