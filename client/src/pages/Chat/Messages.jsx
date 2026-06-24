import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConversations } from "../../api/chatApi";
import { useAuthStore } from "../../store/authStore";

export default function Messages() {
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

  return (
    <div className="max-w-3xl mx-auto p-4">
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
    <Link key={conv._id} to={`/chat/${conv._id}`}>
      <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl">

        {/* avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full" />

        <div className="flex-1">

          <div className="flex justify-between">
            <p className="font-medium">
              {otherUser?.name}
            </p>

            {/* unread badge */}
            {conv.unreadCount > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 rounded-full">
                {conv.unreadCount}
              </span>
            )}
          </div>

          {/* preview */}
          <p className="text-sm text-gray-500 truncate">
            {conv.lastMessage}
          </p>

        </div>
      </div>
    </Link>
  );
})}
        </div>
      )}
    </div>
  );
}