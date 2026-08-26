import Favorite from "../models/Favorite.js";

export const addFavorite = async (
  req,
  res
) => {
  try {

    const exists =
      await Favorite.findOne({
        user: req.user._id,
        listing: req.params.id
      });

    if (exists) {
      return res.status(200).json({
        message: "Уже в избранном"
      });
    }

    const favorite =
      await Favorite.create({
        user: req.user._id,
        listing: req.params.id
      });

    res.status(201).json(favorite);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const removeFavorite = async (
  req,
  res
) => {
  await Favorite.findOneAndDelete({
    user: req.user._id,
    listing: req.params.id
  });

  res.json({
    message: "Removed"
  });
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id
    })
      .populate({
        path: "listing",
        model: "Listing"
      })
      .lean();

    // Удаляем записи, у которых объявление уже удалено
    const validFavorites = favorites.filter(
      (favorite) => favorite.listing !== null
    );

    // Заодно удаляем битые записи из БД
    const invalidFavorites = favorites.filter(
      (favorite) => favorite.listing === null
    );

    if (invalidFavorites.length > 0) {
      await Favorite.deleteMany({
        _id: {
          $in: invalidFavorites.map(
            (favorite) => favorite._id
          )
        }
      });
    }

    res.json(validFavorites);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      listing: req.params.id
    });

    if (existing) {
      await existing.deleteOne();

      return res.json({
        isFavorite: false
      });
    }

    await Favorite.create({
      user: req.user._id,
      listing: req.params.id
    });

    return res.json({
      isFavorite: true
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};