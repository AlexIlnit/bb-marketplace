import Conversation from "../models/Conversation.js";
import Deal from "../models/Deal.js";

export const getDeal = async (req, res) => {
  try {

    let deal = await Deal.findOne({
      conversation: req.params.conversationId,
    });

    // если сделки нет - создаем
    if (!deal) {

      const conversation =
  await Conversation.findById(
    req.params.conversationId
  ).populate("listing");

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }


      const seller = conversation.listing.user;

const buyer = conversation.members.find(
  id => id.toString() !== seller.toString()
);


      deal = await Deal.create({
  conversation: conversation._id,
  listing: conversation.listing._id,

  buyer,
  seller,
});

    }


    res.json(deal);

  } catch (err) {

    console.error("GET DEAL ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const requestCompletion = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const deal = await Deal.findOne({
      conversation: conversationId,
    });

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    if (deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Только продавец может завершить сделку",
      });
    }

    deal.completionRequested = true;

    await deal.save();

    res.json(deal);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const confirmDeal = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const deal = await Deal.findOne({
      conversation: conversationId,
    });

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    if (deal.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Только покупатель может подтвердить сделку",
      });
    }

    if (!deal.completionRequested) {
      return res.status(400).json({
        message: "Продавец еще не запросил завершение",
      });
    }

    deal.status = "completed";
    deal.buyerConfirmed = true;
    deal.sellerConfirmed = true;

    await deal.save();

    res.json(deal);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const cancelDeal = async (req, res) => {
  const { conversationId } = req.params;

  const deal = await Deal.findOne({
    conversation: conversationId,
  });

  if (!deal) {
    return res.status(404).json({
      message: "Сделка не найдена",
    });
  }

  if (deal.status !== "active") {
    return res.status(400).json({
      message: "Сделку уже нельзя отменить",
    });
  }

  deal.status = "cancelled";
  deal.completionRequested = false;

  await deal.save();

  res.json(deal);
};