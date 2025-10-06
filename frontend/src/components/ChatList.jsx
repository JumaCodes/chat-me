import React, { useEffect } from "react";
import { useChatStore } from "../zustand/store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

const ChatList = () => {
  const { getMyChatPartners, Chats, isUsersLoading, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    // Fetch chat partners once when the component mounts
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (!Chats || Chats.length === 0) return <NoChatsFound />;

  return (
    <div className="chat-list p-4 space-y-2">
      {Chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-800/50 transition"
        >
          <img
            src={chat.profilePicture || "/avatar.png"}
            alt={chat.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-slate-200 font-medium">{chat.fullName}</h4>
            <p className="text-slate-400 text-sm truncate w-40">
              {chat.lastMessage || "No messages yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
