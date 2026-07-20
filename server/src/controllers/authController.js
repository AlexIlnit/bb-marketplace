import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
  name,
  email,
  phone,
  password,
  acceptedTerms,
  acceptedTermsVersion
} = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    if (acceptedTerms !== true) {

 return res.status(400).json({
   message:
   "Необходимо принять пользовательское соглашение"
 });

}

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      acceptedTerms: true,
      acceptedTermsVersion: "1.0",
      acceptedTermsDate: new Date()
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
      role: user.role,
      isBlocked: user.isBlocked,
      acceptedTerms: user.acceptedTerms,
      acceptedTermsVersion: user.acceptedTermsVersion,
      acceptedTermsDate: user.acceptedTermsDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
      role: user.role,
      isBlocked: user.isBlocked
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};