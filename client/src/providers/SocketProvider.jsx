import { useEffect } from "react";
import { socket } from "../socket";
import { useAuthStore } from "../store/authStore";

export default function SocketProvider({ children }) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?._id) return;

    // 🔌 connect socket
    socket.connect();

    // 👤 register user
    socket.emit("addUser", user._id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return children;
}