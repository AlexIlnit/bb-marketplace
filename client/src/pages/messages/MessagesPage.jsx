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

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">

  <div className="w-1/2 min-w-0 border-r bg-white overflow-y-auto">
    <ConversationsList
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
    />
  </div>

  <div className="w-1/2 min-w-0 bg-gray-50 flex flex-col overflow-hidden">
    {selectedChat ? (
      <ChatRoom chatId={selectedChat} />
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