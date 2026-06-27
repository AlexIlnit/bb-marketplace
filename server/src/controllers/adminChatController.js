import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// 📌 все чаты (админ)
export const getAllChats = async (req, res) => {
  try {
    const chats = await Conversation.find()
      .populate("members", "name email avatar")
      .populate("listing", "title")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 сообщения конкретного чата
export const getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
      .populate("senderId", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 удалить чат (и все сообщения)
export const deleteChat = async (req, res) => {
  try {
    const id = req.params.id;

    await Message.deleteMany({ conversationId: id });
    await Conversation.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};