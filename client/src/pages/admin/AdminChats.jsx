import { useEffect, useState, useRef } from "react";
import {
  getAdminChats,
  getAdminChatMessages,
  deleteChat,
} from "../../api/adminApi";
import { useAuthStore } from "../../store/authStore";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const user = useAuthStore((s) => s.user);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  // авто-scroll вниз при открытии/новых сообщениях
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const loadChats = async () => {
    const { data } = await getAdminChats();
    setChats(data);
  };

  const openChat = async (chat) => {
    setSelectedChat(chat);

    const { data } = await getAdminChatMessages(chat._id);
    setMessages(data);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить чат?");
    if (!ok) return;

    await deleteChat(id);

    setChats((prev) => prev.filter((c) => c._id !== id));

    if (selectedChat?._id === id) {
      setSelectedChat(null);
      setMessages([]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

      {/* LEFT — CHATS LIST */}
      <div className="bg-white rounded-xl p-4 border h-[80vh] overflow-y-auto">
        <h2 className="font-bold mb-4">Чаты</h2>

        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => openChat(chat)}
            className="p-3 border-b cursor-pointer hover:bg-gray-50 transition"
          >
            {/* USERS */}
            <div className="font-semibold text-sm">
              {chat.members?.map((m) => m.name).join(" ↔ ")}
            </div>

            {/* LAST MESSAGE */}
            <div className="text-xs text-gray-500 mt-1 truncate">
              {chat.lastMessage || "Нет сообщений"}
            </div>

            {/* DATE */}
            <div className="text-[10px] text-gray-600 mt-1">
              📅{" "}
              {new Date(chat.updatedAt || chat.createdAt).toLocaleString(
                "ru-RU",
                {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </div>

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(chat._id);
              }}
              className="text-red-500 text-xs mt-2 hover:text-red-700"
            >
              удалить
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT — MESSAGES */}
      <div className="md:col-span-2 bg-white rounded-xl p-4 border h-[80vh] flex flex-col">

        {!selectedChat ? (
          <div className="text-gray-500">Выбери чат</div>
        ) : (
          <>
            <h2 className="font-bold mb-4 border-b pb-2">
              Сообщения
            </h2>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">

              {messages.map((m) => {
                const isMe = m.senderId?._id === user?._id;

                return (
                  <div
                    key={m._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-md px-4 py-2 rounded-2xl shadow-sm wrap-break-words
                        ${isMe
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"}
                      `}
                    >
                      {/* NAME */}
                      <div className="text-[11px] opacity-70 mb-1">
                        {m.senderId?.name}
                      </div>

                      {/* TEXT */}
                      <div className="text-sm whitespace-pre-wrap">
                        {m.text}
                      </div>

                      {/* TIME */}
                      <div className="text-[10px] mt-1 opacity-60 text-right">
                        {new Date(m.createdAt).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* auto scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}