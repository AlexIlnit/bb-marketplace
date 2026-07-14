import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConversations } from "../../api/chatApi";
import { useAuthStore } from "../../store/authStore";
import { socket } from "../../socket";

export default function ConversationsList({
  selectedChat,
  setSelectedChat,
}) {
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState([]);
    
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

      {conversations.length === 0 ? (
        <p>Диалогов пока нет</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
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
                    <div className="flex justify-between items-center">
                      <h3 className="
                        font-semibold
                        text-gray-900
                        truncate
                        flex
                        items-center
                      ">
                        {otherUser?.name}
                        {otherUser?.online && (
                          <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2 shrink-0" />
                        )}
                        {conv.deal && (
                          <div className="text-xs text-gray-500 font-normal ml-3">
                            {conv.deal.status === "completed"
                              ? "✅ Завершена"
                              : "🟡 В процессе"}
                          </div>
                        )}
                      </h3>

                      <span className="
                        text-xs
                        text-gray-400
                      ">
                        {new Date(conv.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {conv.listing?.title && (
                      <p className="
                        text-xs
                        text-green-600
                        truncate
                        mt-0.5
                      ">
                        {conv.listing.title}
                      </p>
                    )}

                    <div className="
                      flex
                      justify-between
                      items-center
                      mt-1
                    ">
                      <p className="
                        text-base
                        text-gray-500
                        truncate
                      ">
                        {conv.lastMessage}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="
                          ml-2
                          w-5.5
                          h-5.5
                          flex
                          items-center
                          justify-center
                          bg-green-600
                          text-white
                          text-xs
                          rounded-full
                          shrink-0
                        ">
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
