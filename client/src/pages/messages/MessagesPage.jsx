import { useEffect, useState } from "react";
import ConversationsList from "../chat/ConversationsList";
import ChatRoom from "../chat/ChatRoom";
import ChatLayout from "../../layouts/ChatLayout";
import { useLocation } from "react-router-dom";

export default function MessagesPage() {
  const location = useLocation();
const [selectedChat, setSelectedChat] = useState(null);

useEffect(() => {
  if (location.state?.conversationId) {
    setSelectedChat(location.state.conversationId);
  }
}, [location.state]);

  return (
    <ChatLayout>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">

        <div className="w-1/2 border-r bg-white overflow-y-auto">
          <ConversationsList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>

        <div className="w-1/2 bg-gray-50 flex flex-col overflow-hidden">
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