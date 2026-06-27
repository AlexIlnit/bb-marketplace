import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import { connectDB } from "../src/config/db.js";
import Category from "../src/models/Category.js";

async function run() {
  await connectDB();

  const db = mongoose.connection.db;

  console.log("🚀 Migration started...");

  // Получаем все категории
  const categories = await Category.find();

  // Создаем словарь slug -> ObjectId
  const categoryMap = {};

  categories.forEach((cat) => {
    categoryMap[cat.slug] = cat._id;
  });

  console.log("Категории:");

  Object.keys(categoryMap).forEach((slug) => {
    console.log(`${slug} -> ${categoryMap[slug]}`);
  });

  // Читаем объявления напрямую из MongoDB
  const listings = await db.collection("listings").find({}).toArray();

  let updated = 0;
  let skipped = 0;

  for (const listing of listings) {
    const oldCategory = listing.category;

    // Уже ObjectId
    if (oldCategory instanceof mongoose.Types.ObjectId) {
      skipped++;
      continue;
    }

    if (!oldCategory) {
      console.log(`⚠️ ${listing._id} category отсутствует`);
      skipped++;
      continue;
    }

    const newCategoryId = categoryMap[oldCategory];

    if (!newCategoryId) {
      console.log(
        `❌ Не найдена категория "${oldCategory}" для объявления ${listing._id}`
      );
      skipped++;
      continue;
    }

    await db.collection("listings").updateOne(
      { _id: listing._id },
      {
        $set: {
          category: newCategoryId,
        },
      }
    );

    console.log(
      `✅ ${listing.title}: ${oldCategory} → ${newCategoryId}`
    );

    updated++;
  }

  console.log("\n====================");
  console.log("🎉 ГОТОВО");
  console.log("Обновлено:", updated);
  console.log("Пропущено:", skipped);

  process.exit();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});