import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import MainLayout from "../../layouts/MainLayout";

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    const { data } = await api.get(`/chat/messages/${id}`);
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const { data } = await api.post("/chat/message", {
      conversationId: id,
      text,
    });

    setMessages((prev) => [...prev, data]);
    setText("");
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto h-[80vh] flex flex-col border rounded-xl bg-white">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === user._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] ${
                  msg.senderId === user._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 border rounded-xl p-2"
          />

          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 rounded-xl"
          >
            ➤
          </button>
        </div>

      </div>
    </MainLayout>
  );
}