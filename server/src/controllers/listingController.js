import Listing from "../models/Listing.js";
import { createNotification } from "../utils/createNotification.js";
import User from "../models/User.js";
// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

if (user?.isBlocked) {
  return res.status(403).json({
    message: "Ваш аккаунт заблокирован. Размещение объявлений недоступно."
  });
}
    const { title, description, price, city, category, images, condition, sellerType  } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price,
      city,
      category,
      images,
      condition: condition || "used",
      sellerType: sellerType || "private",
      user: req.user._id,
      status: "pending"
    });
await createNotification(
  req.user._id,
  "Ваше объявление отправлено на модерацию ⏳",
  "info"
);
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getListings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter = {
      status: "approved"
    };

    const city = req.query.city;

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if ( city && city !== "Вся Беларусь") {
      filter.city = city;
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
        $regex: req.query.search,
        $options: "i"
      };
    }

    // console.log("FINAL FILTER 👉", filter);

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(filter);

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
      .populate("user", "name email avatar");

    if (!listing) {
      return res.status(404).json({
        message: "Объявление не найдено"
      });
    }

    const sellerListingsCount =
      await Listing.countDocuments({
        user: listing.user._id,
        status: "approved"
      });

    res.json({
      ...listing.toObject(),
      sellerListingsCount
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
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
      return res.status(404).json({ message: "Не найдено" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    // обновляем поля
    Object.assign(listing, req.body);

    listing.status = "pending";

    await listing.save();

    await createNotification(
      listing.user,
      "Ваше объявление отправлено на повторную модерацию ⏳",
      "info"
    );

    res.json(listing);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};