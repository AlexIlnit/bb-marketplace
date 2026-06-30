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
  const onlineUsers = req.app.get("onlineUsers");
  const io = req.app.get("io");
  try {
    const { conversationId, text } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const receiverId = conversation.members.find(
      (id) => id.toString() !== req.user._id.toString()
    );

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      conversationId,
      text,
      senderId: req.user._id,
      receiverId,
    });
    const fullMessage = await Message.findById(message._id)
      .populate("senderId", "name avatar");

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: new Date(),
    });

    // socket
    const io = req.app.get("io");

    const receiverSocketId = onlineUsers.get(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", fullMessage);
    }

    res.json(message);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
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
