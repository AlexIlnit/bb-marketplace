import { useEffect, useState } from "react";
import ConversationsList from "../chat/ConversationsList";
import ChatRoom from "../Chat/ChatRoom";
import ChatLayout from "../../layouts/ChatLayout";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function MessagesPage() {
  const location = useLocation();

  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Если открыли конкретный чат с другой страницы
  useEffect(() => {
    if (location.state?.conversationId) {
      setSelectedChat(location.state.conversationId);

      // Здесь объекта conversation ещё может не быть.
      // ConversationsList позже загрузит его.
      setSelectedConversation(null);
    }
  }, [location.state]);

  const handleSelectChat = (conversation) => {
    if (!conversation?._id) return;

    setSelectedChat(conversation._id);
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setSelectedConversation(null);
  };

  return (
    <ChatLayout>
      <Helmet>
        <title>Сообщения | BB доска объявлений</title>
        <meta
          name="description"
          content="Сообщения пользователя"
        />
      </Helmet>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">

        {/* =========================
            СПИСОК ДИАЛОГОВ
        ========================= */}

        <div
          className={`
            w-full
            lg:w-1/2
            min-w-0
            border-r
            bg-white
            overflow-y-auto
            ${selectedChat ? "hidden lg:block" : "block"}
          `}
        >
          <ConversationsList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        </div>

        {/* =========================
            CHAT
        ========================= */}

        <div
          className={`
            w-full
            lg:w-1/2
            min-w-0
            bg-gray-50
            flex
            flex-col
            overflow-hidden
            ${selectedChat ? "flex" : "hidden lg:flex"}
          `}
        >
          {selectedChat ? (
            <ChatRoom
              chatId={selectedChat}
              conversation={selectedConversation}
              onBack={handleBackToList}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              Выберите диалог
            </div>
          )}
        </div>

      </div>
    </ChatLayout>
  );
}