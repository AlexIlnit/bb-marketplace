import Category from "../models/Category.js";
import Listing from "../models/Listing.js";


// =====================================================
// Получить все категории
// =====================================================

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
          parent: 1,
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


// =====================================================
// Создать категорию
// =====================================================

export const createCategory = async (req, res) => {
  try {
    const {
      name,
      icon,
      image,
      parent,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Введите название категории",
      });
    }

    const cleanName = name.trim();

    // -------------------------------------------------
    // Проверка parent
    // -------------------------------------------------

    let parentCategory = null;

    if (parent) {
      parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({
          message: "Родительская категория не найдена",
        });
      }
    }

    // -------------------------------------------------
    // Проверка названия
    // -------------------------------------------------

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(cleanName)}$`,
        $options: "i",
      },

      parent: parentCategory
        ? parentCategory._id
        : null,
    });

    if (existingCategory) {
      return res.status(400).json({
        message:
          "Такая категория уже существует в этом разделе",
      });
    }

    // -------------------------------------------------
    // Создание slug
    // -------------------------------------------------

    const slug = createSlug(cleanName);

    const existingSlug = await Category.findOne({
      slug,
    });

    if (existingSlug) {
      return res.status(400).json({
        message:
          "Категория с таким адресом уже существует",
      });
    }

    // -------------------------------------------------
    // Создание
    // -------------------------------------------------

    const category = await Category.create({
      name: cleanName,
      slug,
      icon: icon || "box",
      image: image || "",
      parent: parentCategory
        ? parentCategory._id
        : null,
    });

    res.status(201).json(category);

  } catch (error) {
    console.error(
      "Ошибка создания категории:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Редактировать категорию
// =====================================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      icon,
      image,
      parent,
    } = req.body;

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

    // -------------------------------------------------
    // Нельзя сделать категорию родителем самой себя
    // -------------------------------------------------

    if (
      parent &&
      String(parent) === String(id)
    ) {
      return res.status(400).json({
        message:
          "Категория не может быть родителем самой себя",
      });
    }

    // -------------------------------------------------
    // Проверяем родителя
    // -------------------------------------------------

    let parentCategory = null;

    if (parent) {
      parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({
          message:
            "Родительская категория не найдена",
        });
      }

      // Не разрешаем делать подкатегорию
      // дочерней подкатегории
      if (parentCategory.parent) {
        return res.status(400).json({
          message:
            "Нельзя создавать подкатегорию внутри подкатегории",
        });
      }
    }

    // -------------------------------------------------
    // Проверка дубликата
    // -------------------------------------------------

    const duplicate = await Category.findOne({
      _id: { $ne: id },

      name: {
        $regex: `^${escapeRegex(cleanName)}$`,
        $options: "i",
      },

      parent: parentCategory
        ? parentCategory._id
        : null,
    });

    if (duplicate) {
      return res.status(400).json({
        message:
          "Такая категория уже существует в этом разделе",
      });
    }

    // -------------------------------------------------
    // Slug
    // -------------------------------------------------

    const slug = createSlug(cleanName);

    const duplicateSlug = await Category.findOne({
      _id: { $ne: id },
      slug,
    });

    if (duplicateSlug) {
      return res.status(400).json({
        message:
          "Категория с таким адресом уже существует",
      });
    }

    // -------------------------------------------------
    // Обновление
    // -------------------------------------------------

    category.name = cleanName;
    category.slug = slug;

    category.parent = parentCategory
      ? parentCategory._id
      : null;

    if (icon !== undefined) {
      category.icon = icon;
    }

    if (image !== undefined) {
      category.image = image;
    }

    await category.save();

    res.json(category);

  } catch (error) {
    console.error(
      "Ошибка обновления категории:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Удалить категорию
// =====================================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Категория не найдена",
      });
    }

    // -------------------------------------------------
    // Проверяем объявления
    // -------------------------------------------------

    const listingsCount =
      await Listing.countDocuments({
        category: id,
      });

    if (listingsCount > 0) {
      return res.status(400).json({
        message:
          `Нельзя удалить категорию. ` +
          `В ней находится ${listingsCount} объявлений.`,
        listingsCount,
      });
    }

    // -------------------------------------------------
    // Если это главная категория —
    // проверяем подкатегории
    // -------------------------------------------------

    const childrenCount =
      await Category.countDocuments({
        parent: id,
      });

    if (childrenCount > 0) {
      return res.status(400).json({
        message:
          `Нельзя удалить категорию. ` +
          `Сначала удалите её подкатегории (${childrenCount}).`,
        childrenCount,
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      message: "Категория удалена",
    });

  } catch (error) {
    console.error(
      "Ошибка удаления категории:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Slug
// =====================================================

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}


// =====================================================
// Безопасный RegExp
// =====================================================

function escapeRegex(text) {
  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}