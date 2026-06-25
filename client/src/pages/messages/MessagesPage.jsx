import { useState } from "react";
import ConversationsList from "../chat/ConversationsList";
import ChatRoom from "../chat/ChatRoom";
import ChatLayout from "../../layouts/ChatLayout";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ChatLayout>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">

        <div className="w-1/3 border-r bg-white overflow-y-auto">
          <ConversationsList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>

        <div className="w-2/3 bg-gray-50 flex flex-col overflow-hidden">
          {selectedChat ? (
            <ChatRoom chatId={selectedChat} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Выберите диалог
            </div>
          )}
        </div>

      </div>
    </ChatLayout>
  );
}