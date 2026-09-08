import Listing from "../models/Listing.js";
import { createNotification } from "../utils/createNotification.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import Category from "../models/Category.js";


// =====================================
// Получить категорию и все её подкатегории
// =====================================

const getCategoryTreeIds = async (categoryId) => {
  const categories = await Category.find({})
    .select("_id parent")
    .lean();

  const ids = [categoryId.toString()];
  const queue = [categoryId.toString()];

  while (queue.length) {
    const parentId = queue.shift();

    for (const category of categories) {
      if (
        category.parent &&
        category.parent.toString() === parentId
      ) {
        const childId = category._id.toString();

        if (!ids.includes(childId)) {
          ids.push(childId);
          queue.push(childId);
        }
      }
    }
  }

  return ids;
};
// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

if (user?.isBlocked) {
  return res.status(403).json({
    message: "Ваш аккаунт заблокирован. Размещение объявлений недоступно."
  });
}
    const { title, description, price, region, city, category, condition, sellerType, showPhone, allowChat, characteristics  } = req.body;

    const imageUrls = [];

if (req.files?.length) {
  for (const file of req.files) {
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "listings" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    imageUrls.push(uploaded.secure_url);
  }
}
let parsedCharacteristics = {};

if (characteristics) {
  try {
    parsedCharacteristics =
      typeof characteristics === "string"
        ? JSON.parse(characteristics)
        : characteristics;
  } catch (error) {
    return res.status(400).json({
      message: "Некорректные характеристики",
    });
  }
}

const listing = await Listing.create({
  title,
  description,
  price,
  region,
  city,
  category,
  images: imageUrls,
  condition: condition || "used",
  sellerType: sellerType || "private",
  user: req.user._id,
  status: "pending",
  showPhone: showPhone !== "false",
  allowChat: allowChat !== "false",
  characteristics: parsedCharacteristics,
});
console.log("AFTER SAVE:", listing.characteristics);
console.log(
  "AFTER SAVE JSON:",
  JSON.stringify(listing.characteristics, null, 2)
);
// =====================================
// Уведомление продавцу
// =====================================

await createNotification(
  req.user._id,
  "Ваше объявление отправлено на модерацию ⏳",
  "info"
);

// =====================================
// Уведомление администраторам
// =====================================

const admins = await User.find({
  role: "admin",
  isBlocked: { $ne: true },
}).select("_id");

await Promise.all(
  admins.map((admin) =>
    createNotification(
      admin._id,
      `Новое объявление "${listing.title}" ожидает модерации 📝`,
      "info"
    )
  )
);
    res.status(201).json(listing);
  } catch (error) {
    console.error("CREATE LISTING ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getListings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 24;
    const skip = (page - 1) * limit;

    const filter = {
      status: "approved"
    };
// console.log("========== GET LISTINGS ==========");
    // console.log("QUERY:", req.query);
    const city = req.query.city;
    const region = req.query.region; // Получаем область из фронтенда

    if (req.query.category) {
  const category = await Category.findOne({
    slug: req.query.category,
  }).lean();

  if (!category) {
    return res.json({
      listings: [],
      totalPages: 0,
    });
  }

  const categoryIds = await getCategoryTreeIds(
    category._id
  );

  filter.category = {
    $in: categoryIds,
  };
}
    
    // 🔥 ПРЯМАЯ ФИЛЬТРАЦИЯ ПО ОБЛАСТЯМ И ГОРОДАМ
    if (city && city !== "Вся Беларусь" && city !== "Все города" && city !== "Все области") {
      // Если выбран конкретный город — фильтруем строго по нему
      filter.city = city;
    } else if (region && region !== "Вся Беларусь" && region !== "Все области" && region !== "Все города") {
      // Если город НЕ выбран (или выбран "Все города"), но выбрана область — фильтруем НАПРЯМУЮ по полю region
      filter.region = region;
    }

    if (req.query.condition) {
      filter.condition = req.query.condition;
    }

    if (req.query.sellerType) {
      filter.sellerType = req.query.sellerType;
    }

    if (req.query.priceFrom || req.query.priceTo) {
      filter.price = {};

      if (req.query.priceFrom) {
        filter.price.$gte = Number(req.query.priceFrom);
      }

      if (req.query.priceTo) {
        filter.price.$lte = Number(req.query.priceTo);
      }
    }

   if (req.query.search) {
  filter.title = {
    $regex: escapeRegex(req.query.search),
    $options: "i",
  };
}
// =====================================
// ДИНАМИЧЕСКИЕ ХАРАКТЕРИСТИКИ
// =====================================
//
// Формат:
// characteristics_brand=BMW
// characteristics_model=3 Series
// characteristics_engine=Бензин
//
// В MongoDB:
// characteristics.brand
// characteristics.model
// characteristics.engine
// =====================================

for (const [key, value] of Object.entries(req.query)) {
  if (!key.startsWith("characteristics_")) {
    continue;
  }

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    continue;
  }

  const characteristicName =
    key.replace("characteristics_", "");

  const fieldPath =
    `characteristics.${characteristicName}`;

  // Числовые значения
  //
  // В CreateListing значения из FormData
  // могут сохраняться как строки.
  //
  // Поэтому допускаем и число, и строку.
  if (
    [
      "year",
      "mileage",
      "engineVolume",
      "loadCapacity",
      "ram",
      "storage",
      "rooms",
      "area",
      "livingArea",
      "kitchenArea",
      "floor",
      "floors",
      "yearBuilt",
      "age",
      "weight",
      "screenSize",
    ].includes(characteristicName)
  ) {
    const numericValue = Number(value);

    if (!Number.isNaN(numericValue)) {
      filter[fieldPath] = {
        $in: [numericValue, String(value)],
      };
    } else {
      filter[fieldPath] = String(value);
    }

    continue;
  }

  // Обычные select/text характеристики
  filter[fieldPath] = String(value);
}
    // console.log("FINAL FILTER 👉", filter);

  const now = new Date();

const topFilter = {
  $or: [
    { isTop: { $ne: true } },
    {
      isTop: true,
      topUntil: { $gt: now },
    },
  ],
};

const finalFilter = {
  ...filter,
  ...topFilter,
};

const listings = await Listing.find(finalFilter)
  .populate("category", "name slug")
  .sort({
    isTop: -1,
    createdAt: -1,
  })
  .skip(skip)
  .limit(limit);

const total = await Listing.countDocuments(finalFilter);
    res.json({
      listings,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate(
        "user",
        "name email avatar phone rating"
      )
      .populate("category");

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    const sellerListingsCount =
      await Listing.countDocuments({
        user: listing.user._id,
        status: "approved",
      });

    const listingData = listing.toObject();

    // =====================================
    // Скрываем телефон
    // =====================================

    if (listingData.showPhone === false) {
      if (listingData.user) {
        delete listingData.user.phone;
      }
    }

    res.json({
      ...listingData,
      sellerListingsCount,
    });

  } catch (error) {
    console.error(
      "GET LISTING BY ID ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(req.user._id);

if (user?.isBlocked) {
  return res.status(403).json({
    message: "Ваш аккаунт заблокирован."
  });
}

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено"
      });
    }

    if (
      listing.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Нет доступа"
      });
    }

    await listing.deleteOne();

    res.json({
      message: "Объявление удалено"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const updateListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user?.isBlocked) {
      return res.status(403).json({
        message: "Ваш аккаунт заблокирован."
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено"
      });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Нет доступа"
      });
    }

    const {
      title,
      description,
      price,
      region,
      city,
      category,
      condition,
      sellerType,
      showPhone,
      allowChat,
      existingImages,
      characteristics
    } = req.body;

    let parsedCharacteristics = listing.characteristics || {};

if (characteristics !== undefined) {
  try {
    parsedCharacteristics =
      typeof characteristics === "string"
        ? JSON.parse(characteristics)
        : characteristics;
  } catch (error) {
    return res.status(400).json({
      message: "Некорректные характеристики",
    });
  }
}

    // Проверяем способы связи
    const parsedShowPhone =
      showPhone === undefined
        ? listing.showPhone
        : showPhone !== "false";

    const parsedAllowChat =
      allowChat === undefined
        ? listing.allowChat
        : allowChat !== "false";

    if (!parsedShowPhone && !parsedAllowChat) {
      return res.status(400).json({
        message: "Выберите хотя бы один способ связи с покупателями."
      });
    }

    // Существующие фотографии
    let currentImages = [];

    if (existingImages !== undefined) {
      try {
        currentImages = JSON.parse(existingImages);

        if (!Array.isArray(currentImages)) {
          currentImages = [];
        }
      } catch {
        return res.status(400).json({
          message: "Некорректный список фотографий"
        });
      }
    }

    // Загружаем новые фотографии
    const newImageUrls = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "listings"
            },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          ).end(file.buffer);
        });

        newImageUrls.push(uploaded.secure_url);
      }
    }

    const finalImages = [
      ...currentImages,
      ...newImageUrls
    ];

    if (finalImages.length === 0) {
      return res.status(400).json({
        message: "Добавьте хотя бы одну фотографию"
      });
    }

    // Обновляем только разрешённые поля
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.region = region;
    listing.city = city;
    listing.category = category;
    listing.condition = condition || "used";
    listing.sellerType = sellerType || "private";

    listing.showPhone = parsedShowPhone;
    listing.allowChat = parsedAllowChat;

    listing.images = finalImages;

    // После изменения — снова на модерацию
    listing.status = "pending";
    listing.isTop = false;
    listing.topUntil = null;
    listing.characteristics = parsedCharacteristics;
    await listing.save();

    await createNotification(
      listing.user,
      "Ваше объявление отправлено на повторную модерацию ⏳",
      "info"
    );

    res.json(listing);

  } catch (error) {
    console.error("UPDATE LISTING ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};
export const getListingsCount = async (req, res) => {
  try {
    const filter = {
      status: "approved",
    };

    const city = req.query.city;
    const region = req.query.region;

    // =====================================
    // ГОРОД
    // =====================================

    if (
      city &&
      city !== "Вся Беларусь" &&
      city !== "Все города" &&
      city !== "Все области"
    ) {
      // Если выбран конкретный город —
      // считаем только объявления этого города
      filter.city = city;
    }

    // =====================================
    // ОБЛАСТЬ
    // =====================================

    else if (
      region &&
      region !== "Вся Беларусь" &&
      region !== "Все области" &&
      region !== "Все города"
    ) {
      // Если город не выбран —
      // считаем объявления всей области
      filter.region = region;
    }

    const total = await Listing.countDocuments(filter);

    res.json({ total });

  } catch (error) {
    console.error("GET LISTINGS COUNT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const promoteListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Ваш аккаунт заблокирован.",
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    // Только владелец может продвигать своё объявление
    if (
      listing.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    if (listing.status !== "approved") {
      return res.status(400).json({
        message: "Продвигать можно только опубликованное объявление",
      });
    }

    // Если уже активно
    if (
      listing.isTop &&
      listing.topUntil &&
      new Date(listing.topUntil) > new Date()
    ) {
      return res.status(400).json({
        message: "Объявление уже находится в ТОП",
      });
    }

    const COST = 10;

    if ((user.points || 0) < COST) {
      return res.status(400).json({
        message: "Недостаточно баллов",
        required: COST,
        points: user.points || 0,
      });
    }

    // Списываем 10 баллов
    user.points -= COST;

    // ТОП на 7 дней
    const topUntil = new Date();
    topUntil.setDate(topUntil.getDate() + 7);

    listing.isTop = true;
    listing.topUntil = topUntil;

    await user.save();
    await listing.save();

    res.json({
      message: "Объявление поднято в ТОП",
      listing,
      points: user.points,
    });

  } catch (error) {
    console.error("PROMOTE LISTING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};