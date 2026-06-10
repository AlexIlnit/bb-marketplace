import mongoose from "mongoose"; 
import dotenv from "dotenv"; 
import bcrypt from "bcryptjs"; 
import User from "../models/User.js"; dotenv.config(); 
const createAdmin = async () => { 
    try { await mongoose.connect(process.env.MONGO_URI); 
    const existingAdmin = await User.findOne({ role: "admin" }); 
    if (existingAdmin) { console.log("Admin already exists"); process.exit(0); }
     const hashedPassword = await bcrypt.hash("admin123", 10); 
     const admin = new User({ 
        name: "Admin", email: "admin@example.com", password: hashedPassword, role: "admin", 
    }); 
    await admin.save(); console.log("Admin created successfully"); process.exit(0); } 
    catch (err) { console.error("Seed error:", err); process.exit(1); } }; createAdmin();