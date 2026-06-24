import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { getMessages, sendMessage } from "../../api/chatApi";

export default function ChatRoom() {
  const { id } = useParams();

  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  // 📥 загрузка сообщений
  const loadMessages = async () => {
    try {
      const { data } = await getMessages(id);
      console.log("MESSAGES:", data);
      setMessages(data || []);
    } catch (err) {
      console.log("LOAD MESSAGES ERROR:", err);
    }
  };

  // 🚀 init
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      setLoading(true);
      await loadMessages();
      setLoading(false);
    };

    init();
  }, [id]);

  // 📌 автоскролл
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 отправка
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    try {
      await sendMessage({
        conversationId: id,
        text,
      });

      setText("");
      await loadMessages();
    } catch (err) {
      console.log("SEND ERROR:", err);
    }
  };
  

  // ⛔ важно: НЕ блокируем UI вообще
  if (!id) {
    return <div className="p-6 text-red-500">Нет chat id</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[80vh]">

      {/* 📩 messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 border rounded-xl bg-white">

        {loading ? (
          <p className="text-gray-400 text-center">Загрузка...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center">Нет сообщений</p>
        ) : (
          messages.map((m) => {
  const isObject = typeof m.senderId === "object";

  const senderId = isObject ? m.senderId._id : m.senderId;
  const senderName = isObject ? m.senderId.name : "User";
  const senderAvatar = isObject ? m.senderId.avatar : null;

  const isMe = senderId === user?._id;

  return (
    <div
      key={m._id}
      className={`flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >

      {/* 👤 AVATAR LEFT */}
      {!isMe && (
        <img
          src={senderAvatar || "/default-avatar.png"}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* 💬 MESSAGE BLOCK */}
      <div className={`flex flex-col max-w-[70%]`}>
        
        {/* NAME */}
        <div
          className={`text-xs mb-1 text-gray-500 ${
            isMe ? "text-right" : "text-left"
          }`}
        >
          {senderName}
        </div>

        {/* BUBBLE */}
        <div
          className={`px-3 py-2 rounded-2xl text-sm break-words shadow-sm ${
            isMe
              ? "bg-green-600 text-white rounded-br-sm"
              : "bg-gray-100 text-black rounded-bl-sm"
          }`}
        >
          {m.text}
        </div>
      </div>

      {/* 👤 AVATAR RIGHT */}
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

        <div ref={bottomRef} />
      </div>

      {/* ✍️ input */}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 border rounded-xl p-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
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