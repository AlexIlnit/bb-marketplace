import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "name avatar")
      .populate("listing", "title images")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    // 1. создаём сообщение
    const message = await Message.create({
      conversationId,
      text,
      senderId: req.user._id,
    });

    // 2. обновляем диалог (ВАЖНО СРАЗУ ПОСЛЕ СООБЩЕНИЯ)
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: new Date(),
    });

    // 3. возвращаем сообщение
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
    .populate("senderId", "name avatar _id")
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, userId] },
      listing: listingId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, userId],
        listing: listingId,
      });
    }

    res.json(conversation); // 👈 ВАЖНО: без обёрток
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};