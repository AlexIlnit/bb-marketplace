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

export const getFavorites = async (
  req,
  res
) => {
  const favorites =
    await Favorite.find({
      user: req.user._id
    }).populate("listing");

  res.json(favorites);
};
