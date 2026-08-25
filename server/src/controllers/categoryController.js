import Category from "../models/Category.js";
import Listing from "../models/Listing.js";


// =========================
// Получить категории
// =========================
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "category",
          as: "listings",
        },
      },

      {
        $addFields: {
          listingsCount: {
            $size: "$listings",
          },

          pendingCount: {
            $size: {
              $filter: {
                input: "$listings",
                as: "listing",
                cond: {
                  $eq: ["$$listing.status", "pending"],
                },
              },
            },
          },

          approvedCount: {
            $size: {
              $filter: {
                input: "$listings",
                as: "listing",
                cond: {
                  $eq: ["$$listing.status", "approved"],
                },
              },
            },
          },

          rejectedCount: {
            $size: {
              $filter: {
                input: "$listings",
                as: "listing",
                cond: {
                  $eq: ["$$listing.status", "rejected"],
                },
              },
            },
          },
        },
      },

      {
        $project: {
          listings: 0,
        },
      },

      {
        $sort: {
          name: 1,
        },
      },
    ]);

    res.json(categories);

  } catch (error) {
    console.error(
      "Ошибка получения категорий:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Создать категорию
// =========================
export const createCategory = async (req, res) => {
  try {
    const { name, icon, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Введите название категории",
      });
    }

    const cleanName = name.trim();

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${cleanName}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Такая категория уже существует",
      });
    }

    const slug = createSlug(cleanName);

    const existingSlug = await Category.findOne({
      slug,
    });

    if (existingSlug) {
      return res.status(400).json({
        message: "Категория с таким адресом уже существует",
      });
    }

    const category = await Category.create({
      name: cleanName,
      slug,
      icon: icon || "box",
      image: image || undefined,
    });

    res.status(201).json(category);

  } catch (error) {
    console.error("Ошибка создания категории:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Редактировать категорию
// =========================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Введите название категории",
      });
    }

    const cleanName = name.trim();

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Категория не найдена",
      });
    }

    // Проверяем, нет ли другой категории
    // с таким названием
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${cleanName}$`,
        $options: "i",
      },
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Такая категория уже существует",
      });
    }

    const slug = createSlug(cleanName);

    // Проверяем slug
    const duplicateSlug = await Category.findOne({
      _id: { $ne: id },
      slug,
    });

    if (duplicateSlug) {
      return res.status(400).json({
        message: "Категория с таким адресом уже существует",
      });
    }

    category.name = cleanName;
    category.slug = slug;

    if (icon !== undefined) {
      category.icon = icon;
    }

    if (image !== undefined) {
      category.image = image;
    }

    await category.save();

    res.json(category);

  } catch (error) {
    console.error("Ошибка обновления категории:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Удалить категорию
// =========================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Категория не найдена",
      });
    }

    // Проверяем объявления
    const listingsCount = await Listing.countDocuments({
      category: id,
    });

    if (listingsCount > 0) {
      return res.status(400).json({
        message: `Нельзя удалить категорию. В ней находится ${listingsCount} объявлений.`,
        listingsCount,
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      message: "Категория удалена",
    });

  } catch (error) {
    console.error("Ошибка удаления категории:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Создание slug
// =========================
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}