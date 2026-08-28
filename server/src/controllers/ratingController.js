import Rating from "../models/Rating.js";
import Deal from "../models/Deal.js";
import User from "../models/User.js";


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
        message:"Сделка не найдена",
      });
    }


    if (deal.status !== "completed") {
      return res.status(400).json({
        message:"Сделка еще не завершена",
      });
    }


    const userId = req.user._id.toString();


    let seller;
    let buyer;


    // если отзыв оставляет продавец
    if (
      deal.seller.toString() === userId
    ) {

      seller = deal.buyer;
      buyer = deal.seller;


    } 
    // если отзыв оставляет покупатель
    else if (
      deal.buyer.toString() === userId
    ) {

      seller = deal.seller;
      buyer = deal.buyer;


    } else {

      return res.status(403).json({
        message:"Вы не участник сделки",
      });

    }


    const exists = await Rating.findOne({
      seller,
      buyer,
      listing: deal.listing._id,
    });


    if (exists) {
      return res.status(400).json({
        message:"Вы уже оставили отзыв",
      });
    }


    await Rating.create({

      seller,

      buyer,

      listing: deal.listing._id,

      stars,

      comment,

    });


    const ratings =
      await Rating.find({
        seller,
      });


    const count = ratings.length;


    const average =
      ratings.reduce(
        (sum,r)=>sum+r.stars,
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

// отмечаем, что пользователь уже оставил отзыв
if (deal.buyer.toString() === userId) {
  deal.buyerRated = true;
}

if (deal.seller.toString() === userId) {
  deal.sellerRated = true;
}

await deal.save();

res.json({
  message: "Отзыв добавлен",
  deal,
});


  } catch(err){

    console.error(
      "CREATE RATING ERROR:",
      err
    );

    res.status(500).json({
      message:err.message,
    });

  }
};
export const getSellerRatings = async (req, res) => {
  try {

    const ratings = await Rating.find({
      seller: req.params.sellerId,
    })
      .populate("buyer", "name avatar")
      .populate("listing", "title")
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

export const replyToRating = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Введите текст ответа",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        message: "Ответ не должен превышать 500 символов",
      });
    }

    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({
        message: "Отзыв не найден",
      });
    }

    // Отвечать может только продавец,
    // которому оставили этот отзыв
    if (
      rating.seller.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Вы не можете отвечать на этот отзыв",
      });
    }

    const now = new Date();

    // Если ответа ещё нет — создаём.
    // Если есть — обновляем.
    if (!rating.sellerReply) {
      rating.sellerReply = {};
    }

    rating.sellerReply.text = text.trim();

    if (!rating.sellerReply.createdAt) {
      rating.sellerReply.createdAt = now;
    }

    rating.sellerReply.updatedAt = now;

    await rating.save();

    const updatedRating = await Rating.findById(rating._id)
      .populate("buyer", "name avatar")
      .populate("listing", "title");

    res.json({
      message: "Ответ на отзыв сохранён",
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
