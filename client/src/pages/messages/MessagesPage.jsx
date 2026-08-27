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

  // Если открыли чат с другого места сайта
  useEffect(() => {
    if (location.state?.conversationId) {
      setSelectedChat(location.state.conversationId);
    }
  }, [location.state]);

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation._id);
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setSelectedConversation(null);
  };

  const otherUser = selectedConversation?.members?.find(
    (member) => String(member._id) !== String(selectedConversation?.currentUserId)
  );

  return (
    <ChatLayout>
      <Helmet>
        <title>Сообщения | BB доска объявлений</title>
        <meta
          name="description"
          content="Сообщения пользователя"
        />
      </Helmet>

      <div className="h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">

        <div className="h-full max-w-375 mx-auto flex">

          {/* ========================= */}
          {/* СПИСОК ДИАЛОГОВ */}
          {/* ========================= */}

          <aside
            className={`
              w-full
              md:w-95
              lg:w-105
              shrink-0
              bg-white
              border-r
              border-gray-200
              overflow-hidden
              ${selectedChat ? "hidden md:flex md:flex-col" : "flex flex-col"}
            `}
          >
            <ConversationsList
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setSelectedConversation={setSelectedConversation}
            />
          </aside>

          {/* ========================= */}
          {/* ЧАТ */}
          {/* ========================= */}

          <main
            className={`
              flex-1
              min-w-0
              bg-gray-50
              ${selectedChat ? "flex flex-col" : "hidden md:flex"}
            `}
          >
            {selectedChat ? (
              <ChatRoom
                chatId={selectedChat}
                otherUserId={otherUser?._id}
                conversation={selectedConversation}
                onBack={handleBackToList}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">

                  <div className="
                    w-20
                    h-20
                    mx-auto
                    mb-5
                    rounded-full
                    bg-white
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    text-3xl
                  ">
                    💬
                  </div>

                  <h2 className="
                    text-lg
                    font-semibold
                    text-gray-900
                  ">
                    Выберите диалог
                  </h2>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    Здесь появится ваша переписка
                  </p>

                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </ChatLayout>
  );
}