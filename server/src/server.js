import "./config/env.js";

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedCategories } from "./seeds/categorySeed.js";

// routes
import adminRoutes from "./routes/adminRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initSocket } from "./socket/index.js";

export const onlineUsers = new Map();
const PORT = process.env.PORT || 5000;

// ================= DB =================
connectDB().then(() => {
  seedCategories();
});

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  // console.log("USER CONNECTED:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
     // 🔥 уведомляем всех что юзер онлайн
  socket.broadcast.emit("userOnline", userId);
  });

  

  socket.on("sendMessage", ({ receiverId, senderId, message }) => {
  const receiverSocket = onlineUsers.get(receiverId);
  const senderSocket = onlineUsers.get(senderId);
    
  if (receiverSocket) {
    io.to(receiverSocket).emit("newMessage", message);
  }

  if (senderSocket) {
    io.to(senderSocket).emit("newMessage", message);
  }
});

  socket.on("typing", ({ receiverId, isTyping }) => {
  const receiverSocket = onlineUsers.get(String(receiverId));

  if (receiverSocket) {
    io.to(receiverSocket).emit("typing", {
      userId: socket.userId,
      isTyping,
    });
  }
});

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        // 🔥 уведомляем оффлайн
      io.emit("userOffline", userId);
        break;
      }
    }
  });
});

// ================= ROUTES (ВСЕ СЮДА) =================
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

app.set("onlineUsers", onlineUsers);


// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});