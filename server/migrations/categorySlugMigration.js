import mongoose from "mongoose";
import Category from "../models/Category.js";
import "../config/env.js";

const slugMap = {
  "real-estate": "nedvizhimost",
  cars: "avto",
  electronics: "elektronika",
  work: "rabota",
  clothes: "odezhda",
  services: "uslugi",
  animals: "zhivotnye",
  "home-garden": "dom-i-sad",
};

const migrateCategorySlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
      const category = await Category.findOne({
        slug: oldSlug,
      });

      if (!category) {
        console.log(`⏭️ Не найдена категория: ${oldSlug}`);
        continue;
      }

      const existingNewSlug = await Category.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
      });

      if (existingNewSlug) {
        console.log(
          `⚠️ Slug "${newSlug}" уже используется другой категорией`
        );
        continue;
      }

      category.slug = newSlug;
      await category.save();

      console.log(
        `✅ ${category.name}: ${oldSlug} → ${newSlug}`
      );
    }

    console.log("🎉 Миграция slug завершена");
  } catch (error) {
    console.error("❌ CATEGORY MIGRATION ERROR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

migrateCategorySlugs();