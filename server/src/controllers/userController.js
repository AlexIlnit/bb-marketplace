import Listing from "../models/Listing.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ОБНОВЛЕНИЕ ПРОФИЛЯ (имя + пароль)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, phone, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    

    // если меняем пароль
    if (newPassword) {
      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Старый пароль неверный" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // обновляем имя
    if (name) {
      user.name = name;
    }

    // обновление телефона
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};