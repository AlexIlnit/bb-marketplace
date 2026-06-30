import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { getMessages, sendMessage } from "../../api/chatApi";
import { socket } from "../../socket";

export default function ChatRoom({ chatId, otherUserId }) {
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  const chatRef = useRef(null);

  // 📥 load messages
  const loadMessages = async () => {
    const { data } = await getMessages(chatId);
    setMessages(data || []);
  };

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      setLoading(true);
      await loadMessages();
      setLoading(false);
    })();
  }, [chatId]);

  // 📡 new message
  useEffect(() => {
    const handler = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, []);

  // 📡 typing
  useEffect(() => {
    const handler = (status) => setTyping(status);

    socket.on("typing", handler);
    return () => socket.off("typing", handler);
  }, []);

  // 📜 stable scroll
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages.length]);

  // ✍️ typing emit
  const handleTyping = () => {
    socket.emit("typing", {
      receiverId: otherUserId,
      isTyping: true,
    });

    setTimeout(() => {
      socket.emit("typing", {
        receiverId: otherUserId,
        isTyping: false,
      });
    }, 800);
  };

  // 📤 send message
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const temp = text;
    setText("");

    const newMsg = {
      _id: Date.now(),
      text: temp,
      senderId: user._id,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await sendMessage({
        conversationId: chatId,
        text: temp,
      });

      socket.emit("sendMessage", {
        receiverId: otherUserId,
        message: {
          _id: Date.now(),
          text: temp,
          senderId: user._id,
          conversationId: chatId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!chatId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Выберите диалог
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* CHAT */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {loading ? (
          <div className="text-center text-gray-400">Загрузка...</div>
        ) : (
          messages.map((m) => {
            const isObject = typeof m.senderId === "object";
            const isMe =
              (isObject ? m.senderId._id : m.senderId) === user?._id;

            return (
              <div
                key={m._id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <img
                    src={m.senderId?.avatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div className="max-w-[65%]">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {isMe && (
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })
        )}

        {/* typing INSIDE CHAT */}
        {typing && (
          <div className="text-xs text-gray-400 px-2">
            печатает...
          </div>
        )}
      </div>

      {/* INPUT FIXED */}
      <div className="shrink-0 border-t bg-white p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSendMessage()
          }
          className="flex-1 border rounded-xl p-3"
          placeholder="Написать сообщение..."
        />

        <button
          onClick={handleSendMessage}
          className="bg-green-600 text-white px-4 rounded-xl"
        >
          ➤
        </button>
      </div>

    </div>
  );
}