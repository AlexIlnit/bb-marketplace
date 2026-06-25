import { io } from "socket.io-client";

// один singleton socket (ВАЖНО)
export const socket = io("http://localhost:5000", {
  autoConnect: false,
});