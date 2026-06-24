import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    });

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

    const message = await Message.create({
      conversationId,
      text,
      senderId: req.user._id,
    });

    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, userId],
      });
    }

    res.json(conversation); // 👈 ВАЖНО: без обёрток
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};