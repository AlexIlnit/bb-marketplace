import { useEffect, useState } from "react";
import { getConversations } from "../../api/chatApi";
import { useAuthStore } from "../../store/authStore";
import { socket } from "../../socket";

export default function ConversationsList({
  selectedChat,
  setSelectedChat,
}) {
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
    
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
  if (activeTab === "all") return true;

  if (activeTab === "active")
    return c.deal?.status === "active";

  if (activeTab === "completed")
    return c.deal?.status === "completed";

  if (activeTab === "cancelled")
    return c.deal?.status === "cancelled";

  return true;
});
    const counts = {
  all: conversations.length,
  active: conversations.filter(
    (c) => c.deal?.status === "active"
  ).length,
  completed: conversations.filter(
    (c) => c.deal?.status === "completed"
  ).length,
  cancelled: conversations.filter(
    (c) => c.deal?.status === "cancelled"
  ).length,
};

  useEffect(() => {
    socket.on("userOnline", (userId) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          members: c.members.map((m) =>
            m._id === userId ? { ...m, online: true } : m
          ),
        }))
      );
    });

    socket.on("userOffline", (userId) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          members: c.members.map((m) =>
            m._id === userId ? { ...m, online: false } : m
          ),
        }))
      );
    });


    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  return (
    <div className="w-full p-10">
      <h1 className="text-2xl font-bold mb-4">
        Мои сообщения
      </h1>

      <div className="mb-6 overflow-x-auto">
  <div className="flex gap-3 min-w-max">

    <button
      onClick={() => setActiveTab("all")}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition whitespace-nowrap ${
        activeTab === "all"
          ? "bg-green-600 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>Все</span>

      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === "all"
            ? "bg-white/20"
            : "bg-gray-200"
        }`}
      >
        {counts.all}
      </span>
    </button>

    <button
      onClick={() => setActiveTab("active")}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition whitespace-nowrap ${
        activeTab === "active"
          ? "bg-yellow-500 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>🟡 В процессе</span>

      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === "active"
            ? "bg-white/20"
            : "bg-gray-200"
        }`}
      >
        {counts.active}
      </span>
    </button>

    <button
      onClick={() => setActiveTab("completed")}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition whitespace-nowrap ${
        activeTab === "completed"
          ? "bg-green-600 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>✅ Завершённые</span>

      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === "completed"
            ? "bg-white/20"
            : "bg-gray-200"
        }`}
      >
        {counts.completed}
      </span>
    </button>

    <button
      onClick={() => setActiveTab("cancelled")}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition whitespace-nowrap ${
        activeTab === "cancelled"
          ? "bg-red-600 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>❌ Отменённые</span>

      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === "cancelled"
            ? "bg-white/20"
            : "bg-gray-200"
        }`}
      >
        {counts.cancelled}
      </span>
    </button>

  </div>
</div>

      {filteredConversations.length === 0 ? (
        <p>Диалогов пока нет</p>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conv) => {
            const otherUser = conv.members.find(
              (m) => String(m._id) !== String(user._id)
            );

            return (
              <div
                key={conv._id}
                onClick={() => setSelectedChat(conv._id)}
                className={`
                  cursor-pointer
                  p-4
                  rounded-2xl
                  transition
                  ${
                    selectedChat === conv._id
                      ? "bg-green-50 border border-green-500"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                <div className="
                  flex
                  items-center
                  gap-5
                  p-5
                  bg-white
                  rounded-3xl
                  border
                  hover:shadow-lg
                  hover:border-green-500
                  transition-all
                  duration-200
                ">
                  <img
                    src={
                      conv.listing?.images?.[0] ||
                      otherUser?.avatar ||
                      "/default-avatar.png"
                    }
                    alt=""
                    className="
                      w-20
                      h-20
                      rounded-2xl
                      object-cover
                      shrink-0
                    "
                  />

                  <div className="flex-1 min-w-0">

  <div className="flex justify-between items-start">

    <div>

      <h3 className="font-semibold text-gray-900 flex items-center">
        {otherUser?.name}

        {otherUser?.online && (
          <span className="w-2 h-2 bg-green-500 rounded-full ml-2" />
        )}
      </h3>

      <div className="text-xs mt-1">
        {conv.deal?.status === "active" && (
          <span className="text-yellow-600">
            🟡 Сделка в процессе
          </span>
        )}

        {conv.deal?.status === "completed" && (
          <span className="text-green-600">
            ✅ Сделка завершена
          </span>
        )}

        {conv.deal?.status === "cancelled" && (
          <span className="text-red-600">
            ❌ Сделка отменена
          </span>
        )}
      </div>

    </div>

    <span className="text-xs text-gray-400">
      {new Date(conv.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>

  </div>

  {conv.listing?.title && (
    <p className="text-xs text-green-600 truncate mt-2">
      {conv.listing.title}
    </p>
  )}

  <div className="flex justify-between items-center mt-2">

    <p className="text-base text-gray-500 truncate">
      {conv.lastMessage}
    </p>

    {conv.unreadCount > 0 && (
      <span
        className="
          ml-2
          w-6
          h-6
          flex
          items-center
          justify-center
          rounded-full
          bg-green-600
          text-white
          text-xs
          shrink-0
        "
      >
        {conv.unreadCount}
      </span>
    )}

  </div>

</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
