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
    <Link
      key={conv._id}
      to={`/chat/${conv._id}`}
      className="block border rounded-xl p-4 hover:bg-gray-50"
    >
      <div className="font-semibold">
        {otherUser?.name}
      </div>
    </Link>
  );
})}
        </div>
      )}
    </div>
  );
}