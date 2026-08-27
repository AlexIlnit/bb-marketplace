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

export const onlineUsers = new Map();

const PORT = process.env.PORT || 5000;

// ================= DB =================

connectDB()
  .then(() => {
    // seedCategories();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ================= HTTP SERVER =================

const server = http.createServer(app);

// ================= SOCKET.IO =================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Передаём socket.io и onlineUsers в Express
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// ================= SOCKET CONNECTION =================

io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  // ================= ADD USER =================

  socket.on("addUser", (userId) => {
    if (!userId) {
      return;
    }

    const id = String(userId);

    socket.userId = id;

    onlineUsers.set(id, socket.id);

    console.log("USER ONLINE:", id);

    socket.broadcast.emit("userOnline", id);
  });

  // ================= TYPING =================

  socket.on("typing", ({ receiverId, isTyping }) => {
    if (!receiverId || !socket.userId) {
      return;
    }

    const receiverSocket = onlineUsers.get(
      String(receiverId)
    );

    if (!receiverSocket) {
      return;
    }

    io.to(receiverSocket).emit("typing", {
      senderId: String(socket.userId),
      isTyping,
    });
  });

  // ================= DISCONNECT =================

  socket.on("disconnect", () => {
    if (!socket.userId) {
      return;
    }

    const userId = String(socket.userId);

    const currentSocket = onlineUsers.get(userId);

    // Не удаляем нового socket,
    // если старый socket отключился
    if (currentSocket === socket.id) {
      onlineUsers.delete(userId);

      console.log("USER OFFLINE:", userId);

      io.emit("userOffline", userId);
    }
  });
});

// ================= ROUTES =================

app.use("/api/admin", adminRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/chat", chatRoutes);

// ================= START SERVER =================

server.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
