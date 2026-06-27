import { useEffect, useState } from "react";
import {
  getAdminChats,
  getAdminChatMessages,
  deleteAdminChat,
} from "../../api/adminApi";
import { Trash2 } from "lucide-react";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================
  // LOAD ALL CHATS
  // =====================
  const loadChats = async () => {
    try {
      const { data } = await getAdminChats();
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // =====================
  // OPEN CHAT
  // =====================
  const openChat = async (chat) => {
    setActiveChat(chat);
    setLoading(true);

    try {
      const { data } = await getAdminChatMessages(chat._id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // DELETE CHAT
  // =====================
  const handleDelete = async (id) => {
    if (!confirm("Удалить этот чат?")) return;

    try {
      await deleteAdminChat(id);

      setActiveChat(null);
      setMessages([]);
      loadChats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* ===================== */}
      {/* LEFT: CHAT LIST */}
      {/* ===================== */}
      <div className="border rounded-xl bg-white p-4 h-[75vh] overflow-y-auto">

        <h2 className="font-bold text-lg mb-4">
          Чаты пользователей
        </h2>

        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => openChat(chat)}
            className={`p-3 border-b cursor-pointer rounded-lg mb-2 transition
              hover:bg-gray-50 ${
                activeChat?._id === chat._id
                  ? "bg-blue-50"
                  : ""
              }`}
          >

            {/* USERS */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              {chat.members?.map((u, i) => (
                <span key={u._id}>
                  {u.name}
                  {i === 0 && chat.members.length > 1 && " ↔ "}
                </span>
              ))}
            </div>

            {/* LISTING */}
            <div className="text-xs text-gray-500 mt-1">
              📦 {chat.listing?.title || "Без объявления"}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {new Date(chat.updatedAt).toLocaleString()}
            </div>

          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* RIGHT: MESSAGES */}
      {/* ===================== */}
      <div className="md:col-span-2 border rounded-xl bg-white p-4 h-[75vh] flex flex-col">

        {!activeChat ? (
          <div className="text-gray-500 text-center mt-20">
            Выберите чат
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between border-b pb-3 mb-3">

              <div>
                <h3 className="font-bold">
                  {activeChat.members
                    .map((m) => m.name)
                    .join(" ↔ ")}
                </h3>

                <p className="text-xs text-gray-500">
                  📦 {activeChat.listing?.title}
                </p>
              </div>

              <button
                onClick={() =>
                  handleDelete(activeChat._id)
                }
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2">

              {loading ? (
                <p className="text-gray-500">
                  Загрузка...
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-2 rounded-lg max-w-[70%]
                      ${
                        msg.senderId?._id ===
                        activeChat.members[0]._id
                          ? "bg-gray-100"
                          : "bg-blue-100 ml-auto"
                      }`}
                  >

                    <div className="text-xs font-semibold">
                      {msg.senderId?.name}
                    </div>

                    <div className="text-sm">
                      {msg.text}
                    </div>

                    <div className="text-[10px] text-gray-400">
                      {new Date(
                        msg.createdAt
                      ).toLocaleString()}
                    </div>

                  </div>
                ))
              )}

            </div>
          </>
        )}
      </div>

    </div>
  );
}