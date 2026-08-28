import Rating from "../models/Rating.js";
import Deal from "../models/Deal.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

// =====================================================
// СОЗДАТЬ ОТЗЫВ
// =====================================================

export const createRating = async (req, res) => {
  try {
    const {
      dealId,
      stars,
      comment,
    } = req.body;

    const deal = await Deal.findById(dealId)
      .populate("listing");

    if (!deal) {
      return res.status(404).json({
        message: "Сделка не найдена",
      });
    }

    if (deal.status !== "completed") {
      return res.status(400).json({
        message: "Сделка еще не завершена",
      });
    }

    const userId = req.user._id.toString();

    let seller;
    let buyer;

    // ==========================================
    // Отзыв оставляет продавец
    // ==========================================

    if (deal.seller.toString() === userId) {
      seller = deal.buyer;
      buyer = deal.seller;
    }

    // ==========================================
    // Отзыв оставляет покупатель
    // ==========================================

    else if (deal.buyer.toString() === userId) {
      seller = deal.seller;
      buyer = deal.buyer;
    }

    else {
      return res.status(403).json({
        message: "Вы не участник сделки",
      });
    }

    // ==========================================
    // Проверяем существующий отзыв
    // ==========================================

    const exists = await Rating.findOne({
      seller,
      buyer,
      listing: deal.listing._id,
    });

    if (exists) {
      return res.status(400).json({
        message: "Вы уже оставили отзыв",
      });
    }

    // ==========================================
    // Создаем отзыв
    // ==========================================

    const rating = await Rating.create({
      seller,
      buyer,
      listing: deal.listing._id,
      stars,
      comment: comment || "",
    });

    // ==========================================
    // Пересчитываем рейтинг
    // ==========================================

    const ratings = await Rating.find({
      seller,
    });

    const count = ratings.length;

    const average =
      ratings.reduce(
        (sum, r) => sum + r.stars,
        0
      ) / count;

    await User.findByIdAndUpdate(
      seller,
      {
        rating: {
          average: Number(
            average.toFixed(1)
          ),
          count,
        },
      }
    );

    // ==========================================
    // Отмечаем оставившего отзыв
    // ==========================================

    if (
      deal.buyer.toString() === userId
    ) {
      deal.buyerRated = true;
    }

    if (
      deal.seller.toString() === userId
    ) {
      deal.sellerRated = true;
    }

    await deal.save();

    // ==========================================
    // Данные автора отзыва
    // ==========================================

    const author = await User.findById(
      req.user._id
    ).select("name");

    const authorName =
      author?.name || "Пользователь";

    // ==========================================
    // УВЕДОМЛЕНИЕ О НОВОМ ОТЗЫВЕ
    // ==========================================

    try {
      await createNotification(
  seller.toString(),
  `Пользователь оставил вам новый отзыв ⭐`,
  "info"
);

      console.log(
        "RATING NOTIFICATION SENT:",
        seller.toString()
      );

    } catch (notificationError) {
      console.error(
        "RATING NOTIFICATION ERROR:",
        notificationError
      );
    }

    // ==========================================
    // Ответ
    // ==========================================

    res.status(201).json({
      message: "Отзыв добавлен",
      deal,
      rating,
    });

  } catch (err) {
    console.error(
      "CREATE RATING ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// ПОЛУЧИТЬ ОТЗЫВЫ ПРОДАВЦА
// =====================================================

export const getSellerRatings = async (
  req,
  res
) => {
  try {
    const ratings =
      await Rating.find({
        seller: req.params.sellerId,
      })
        .populate(
          "buyer",
          "name avatar"
        )
        .populate(
          "seller",
          "name avatar"
        )
        .populate(
          "listing",
          "title"
        )
        .sort({
          createdAt: -1,
        });

    res.json(ratings);

  } catch (err) {
    console.error(
      "GET SELLER RATINGS ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// ОТВЕТИТЬ НА ОТЗЫВ
// =====================================================

export const replyToRating = async (
  req,
  res
) => {
  try {
    const { text } = req.body;

    // ==========================================
    // Проверяем текст
    // ==========================================

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Введите текст ответа",
      });
    }

    const replyText = text.trim();

    if (replyText.length > 500) {
      return res.status(400).json({
        message:
          "Ответ не может быть длиннее 500 символов",
      });
    }

    // ==========================================
    // Находим отзыв
    // ==========================================

    const rating =
      await Rating.findById(
        req.params.ratingId
      )
        .populate(
          "buyer",
          "name avatar"
        )
        .populate(
          "seller",
          "name avatar"
        )
        .populate(
          "listing",
          "title"
        );

    if (!rating) {
      return res.status(404).json({
        message: "Отзыв не найден",
      });
    }

    // ==========================================
    // Только продавец может отвечать
    // ==========================================

    if (
      rating.seller._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Вы не можете отвечать на этот отзыв",
      });
    }

    // ==========================================
    // Проверяем, новый это ответ или изменение
    // ==========================================

    const isNewReply =
      !rating.sellerReply?.text;

    const now = new Date();

    // ==========================================
    // Сохраняем ответ
    // ==========================================

    if (isNewReply) {
      rating.sellerReply = {
        text: replyText,
        createdAt: now,
        updatedAt: now,
      };
    } else {
      rating.sellerReply.text =
        replyText;

      rating.sellerReply.updatedAt =
        now;
    }

    await rating.save();

    // ==========================================
    // УВЕДОМЛЕНИЕ ПОКУПАТЕЛЮ
    // Только при первом ответе
    // ==========================================

    if (isNewReply) {
      try {
        const sellerName =
          rating.seller?.name ||
          "Продавец";

        await createNotification(
          rating.buyer._id,
          `${sellerName} ответил на ваш отзыв 💬`,
          "info"
        );

        console.log(
          "REPLY NOTIFICATION SENT:",
          rating.buyer._id.toString()
        );

      } catch (notificationError) {
        console.error(
          "REPLY NOTIFICATION ERROR:",
          notificationError
        );
      }
    }

    // ==========================================
    // Возвращаем обновленный отзыв
    // ==========================================

    const updatedRating =
      await Rating.findById(
        rating._id
      )
        .populate(
          "buyer",
          "name avatar"
        )
        .populate(
          "seller",
          "name avatar"
        )
        .populate(
          "listing",
          "title"
        );

    res.json({
      message: isNewReply
        ? "Ответ сохранен"
        : "Ответ изменен",

      rating: updatedRating,
    });

  } catch (err) {
    console.error(
      "REPLY TO RATING ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

