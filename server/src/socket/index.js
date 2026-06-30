import { Server } from "socket.io";
import { onlineUsers } from "./onlineUsers.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      onlineUsers.set(String(userId), socket.id);
    });
  });

  return io;
};