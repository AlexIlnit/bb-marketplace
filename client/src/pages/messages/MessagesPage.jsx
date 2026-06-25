import { useState } from "react";

import ConversationsList from "../chat/ConversationsList";
import ChatRoom from "../chat/ChatRoom";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="h-[calc(100vh-80px)] flex">

      {/* LEFT */}
      <div className="w-1/3 border-r bg-white">
        <ConversationsList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>

      {/* RIGHT */}
      <div className="w-2/3 bg-gray-50">
        {selectedChat ? (
          <ChatRoom chatId={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Выберите диалог
          </div>
        )}
      </div>

    </div>
  );
}