import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { getMessages, sendMessage } from "../../api/chatApi";
import { socket } from "../../socket";
import RatingModal from "../../components/rating/RatingModal";
import {
  getDeal,
  requestCompletion,
  confirmDeal,
} from "../../api/dealApi";
import { deleteConversation } from "../../api/chatApi";

export default function ChatRoom({ chatId, otherUserId }) {
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [deal, setDeal] = useState(null);
  const [dealLoading, setDealLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);

  const sellerId =
    typeof deal?.seller === "object"
      ? deal?.seller?._id
      : deal?.seller;

  const buyerId =
    typeof deal?.buyer === "object"
      ? deal?.buyer?._id
      : deal?.buyer;

  const isSeller = sellerId === user._id;
  const isBuyer = buyerId === user._id;

  const chatRef = useRef(null);

  // 📥 load messages
  const loadMessages = async () => {
    const { data } = await getMessages(chatId);
    setMessages(data || []);
  };

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      setLoading(true);
      await loadMessages();
      setLoading(false);
    })();
  }, [chatId]);

  // 📡 new message
  useEffect(() => {
    const handler = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, []);

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      try {
        const { data } = await getDeal(chatId);
        setDeal(data);
      } catch (err) {
        console.log(err);
      } finally {
        setDealLoading(false);
      }
    })();
  }, [chatId]);

  useEffect(() => {
    const handler = ({ conversationId }) => {
      if (conversationId !== chatId) return;

      setMessages((prev) =>
        prev.map((m) => {
          const sender =
            typeof m.senderId === "object"
              ? m.senderId._id
              : m.senderId;

          const isMe = sender === user._id;

          return {
            ...m,
            // только входящие сообщения становятся read
            isRead: isMe ? m.isRead : true,
          };
        })
      );
    };

    socket.on("messagesRead", handler);
    return () => socket.off("messagesRead", handler);
  }, [chatId, user._id]);

  // 📡 typing
  useEffect(() => {
    const handler = ({ senderId, isTyping }) => {
      if (senderId !== otherUserId) return;
      setTyping(isTyping);
    };

    socket.on("typing", handler);

    return () => socket.off("typing", handler);
  }, [otherUserId]);

  // 📜 stable scroll
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages.length]);

  // ✍️ typing emit
  const typingTimeout = useRef(null);

  const handleTyping = () => {
    socket.emit("typing", {
      receiverId: otherUserId,
      isTyping: true,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        receiverId: otherUserId,
        isTyping: false,
      });
    }, 500);
  };

  // 📤 send message
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const temp = text;
    setText("");

    try {
      await sendMessage({
        conversationId: chatId,
        text: temp,
        receiverId: otherUserId,
      });

      await loadMessages();

      socket.emit("sendMessage", {
        receiverId: otherUserId,
        message: {
          _id: Date.now(),
          text: temp,
          senderId: user._id,
          conversationId: chatId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestCompletion = async () => {
    try {
      const { data } = await requestCompletion(chatId);
      setDeal(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeal = async () => {
    try {
      const { data } = await confirmDeal(chatId);
      setDeal(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Асинхронная функция для обработки успешной отправки отзыва
  const handleRatingSubmit = async () => {
    try {
      // Обновляем статус сделки локально, чтобы кнопка "Оставить отзыв" исчезла
      setDeal((prev) => ({
        ...prev,
        buyerRated: true,
      }));

      // ЗАКРЫВАЕМ МОДАЛКУ (удаление чата убрано, чтобы он остался в списке диалогов)
      setShowRating(false); 
      
    } catch (err) {
      console.error("Ошибка при обновлении статуса отзыва:", err);
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
    <div className="h-full flex flex-col overflow-hidden">
      {deal && (
        <div className="border-b bg-white p-4">
          <div className="font-semibold text-lg">Сделка</div>

          <div className="text-sm text-gray-500 mt-1">
            {deal.status === "completed"
              ? "✅ Сделка завершена"
              : "🟡 Сделка в процессе"}
          </div>

          {deal.status === "active" && isSeller && !deal.completionRequested && (
            <button
              onClick={handleRequestCompletion}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
            >
              Завершить сделку
            </button>
          )}

          {deal.status === "active" && isSeller && deal.completionRequested && (
            <div className="mt-3 text-yellow-600 text-sm">
              Ожидаем подтверждения покупателя...
            </div>
          )}

          {deal.status === "active" && isBuyer && !deal.completionRequested && (
            <div className="mt-3 text-sm text-gray-500">
              Продавец еще не завершил сделку.
            </div>
          )}

          {deal.status === "active" && isBuyer && deal.completionRequested && (
            <button
              onClick={handleConfirmDeal}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              Подтвердить завершение
            </button>
          )}

          {deal.status === "completed" && (
            <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-3">
              <div className="text-green-700 font-medium">
                🎉 Сделка успешно завершена
              </div>

              <div className="text-sm text-gray-600 mt-1">
                Теперь обе стороны могут оставить отзыв.
              </div>
            </div>
          )}
          
          {deal.status === "completed" && !deal.buyerRated && (
            <button
              onClick={() => setShowRating(true)}
              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-xl"
            >
              ⭐ Оставить отзыв
            </button>
          )}
        </div>
      )}

      {/* CHAT */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400">Загрузка...</div>
        ) : (
          messages.map((m) => {
            const isObject = typeof m.senderId === "object";
            const isMe =
              (isObject ? m.senderId._id : m.senderId) === user?._id;

            return (
              <div
                key={m._id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <img
                    src={m.senderId?.avatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div className="max-w-[65%]">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {m.text}
                  </div>
                  {isMe && (
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {m.isRead ? "✓✓ прочитано" : "✓ отправлено"}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {typing && <div className="text-xs text-gray-400">Печатает...</div>}
      </div>

      {/* INPUT FORM */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Введите сообщение..."
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:border-green-600"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
        >
          Отправить
        </button>
      </div>

      {/* МОДАЛКА ОТЗЫВА */}
      {showRating && (
  <RatingModal
    dealId={deal?._id} // Передаем ID самой сделки, а не чата
    chatId={chatId}    // Оставляем chatId, если он понадобится для удаления
    onClose={() => setShowRating(false)}
    onSuccess={handleRatingSubmit}
  />
)}
    </div>
  );
}
