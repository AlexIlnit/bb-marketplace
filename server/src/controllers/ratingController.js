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
        rating:{
          average:
          Number(
            average.toFixed(1)
          ),
          count,
        }
      }
    );


    res.json({
      message:"Отзыв добавлен",
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