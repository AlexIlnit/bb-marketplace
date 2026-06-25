import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { getMessages, sendMessage } from "../../api/chatApi";

export default function ChatRoom({ chatId }) {
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  const loadMessages = async () => {
    try {
      const { data } = await getMessages(chatId);
      setMessages(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      setLoading(true);
      await loadMessages();
      setLoading(false);
    })();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const tempText = text;
    setText("");

    try {
      await sendMessage({
        conversationId: chatId,
        text: tempText,
      });

      await loadMessages();
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
    <div className="h-full flex flex-col">

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {loading ? (
          <div className="text-center text-gray-400">Загрузка...</div>
        ) : (
          messages.map((m) => {
            const isObject = typeof m.senderId === "object";
            const isMe = (isObject ? m.senderId._id : m.senderId) === user?._id;

            return (
              <div
                key={m._id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >

                {!isMe && (
                  <img
                    src={
                      m.senderId?.avatar ||
                      "/default-avatar.png"
                    }
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div className="flex flex-col max-w-[65%]">

                  {/* NAME */}
                  <span className="text-xs text-gray-500 mb-1">
                    {isObject ? m.senderId.name : "User"}
                  </span>

                  {/* BUBBLE */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm wrap-break-words ${
                      isMe
                        ? "bg-green-600 text-white rounded-br-sm"
                        : "bg-gray-200 text-black rounded-bl-sm"
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

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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