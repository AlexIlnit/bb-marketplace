import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import MainLayout from "../../layouts/MainLayout";

export default function ChatList() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get("/chat/conversations");
    setConversations(data);
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4 space-y-3">

        {conversations.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/chat/${c._id}`)}
            className="p-4 border rounded-xl cursor-pointer hover:bg-gray-50"
          >
            <div className="font-semibold">
              Диалог
            </div>

            <div className="text-sm text-gray-500">
              {c.lastMessage || "Нет сообщений"}
            </div>
          </div>
        ))}

      </div>
    </MainLayout>
  );
}