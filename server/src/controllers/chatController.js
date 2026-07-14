import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Deal from "../models/Deal.js";




export const getConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "name avatar")
      .populate("listing", "title images")
      .sort({ updatedAt: -1 });


    const result = await Promise.all(
      conversations.map(async (conversation) => {

        const deal = await Deal.findOne({
          conversation: conversation._id,
        });


        return {
          ...conversation.toObject(),
          deal,
        };

      })
    );


    res.json(result);


  } catch (err) {

    console.error(
      "GET CONVERSATIONS ERROR:",
      err
    );

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
    const conversationId = req.params.id;

    // 1. обновляем прочитанные сообщения
    const result = await Message.updateMany(
      {
        conversationId,
        receiverId: req.user._id,
        isRead: false,
      },
      { isRead: true }
    );

    // 2. если есть изменения → уведомляем отправителя
    if (result.modifiedCount > 0) {
      const conversation = await Conversation.findById(conversationId);

      const senderId = conversation.members
        .map(String)
        .find((id) => id !== String(req.user._id));

      const onlineUsers = req.app.get("onlineUsers");
      const io = req.app.get("io");

      const senderSocket = onlineUsers.get(senderId);

      if (senderSocket) {
        io.to(senderSocket).emit("messagesRead", {
          conversationId,
        });
      }
    }

    // 3. возвращаем сообщения
    const messages = await Message.find({ conversationId })
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

      await Deal.create({
        listing: listingId,
        buyer: req.user._id,
        seller: userId,
        conversation: conversation._id,
      });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteConversation = async(req,res)=>{
 try{

 const conversation =
 await Conversation.findById(
  req.params.id
 );


 if(!conversation){
  return res.status(404).json({
   message:"Диалог не найден"
  });
 }


 if(
 !conversation.members.includes(
  req.user._id
 )
 ){
 return res.status(403).json({
  message:"Нет доступа"
 });
 }


 await Message.deleteMany({
  conversationId:req.params.id
 });


 await conversation.deleteOne();


 res.json({
  message:"Диалог удален"
 });


 }catch(err){

 res.status(500).json({
  message:err.message
 });

 }

};
