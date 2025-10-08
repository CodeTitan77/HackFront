import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  
  const formatTime = (timestamp) => { 
    if (!timestamp) return "";
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffMs = now - msgTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    return msgTime.toLocaleDateString();
  };

  // ✅ Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages?.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName || "Unknown",
          lastName: senderId?.lastName || "",
          text,
          createdAt, 
        };
      });
      setMessages(chatMessages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // ✅ Fetch target user's details
  const fetchTargetUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
        withCredentials: true,
      });
      setTargetUser(res?.data?.user);
    } catch (error) {
      console.error("Error fetching target user:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchTargetUser();
  }, []);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    const timestamp = new Date().toISOString();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
      createdAt: timestamp,
    });

    
    setMessages((prev) => [
      ...prev,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
        createdAt: timestamp,
      },
    ]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
    });

    socket.on("messageRecieved", ({ firstName, lastName, text, createdAt }) => {
      setMessages((prev) => [
        ...prev,
        { firstName, lastName: lastName || "", text, createdAt },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50 pb-24 md:pb-8">
      {/* ✅ Chat Container with proper mobile spacing */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-2 py-2 md:p-4">
        <div className="flex flex-col border border-gray-300 bg-[#fdf6ec] text-gray-900 rounded-lg shadow-md" style={{ height: 'calc(100vh - 200px)' }}>
          {/* ✅ Header */}
          <div className="p-3 md:p-4 border-b border-gray-300 text-base md:text-lg font-semibold text-center text-gray-700 bg-[#f9f2e9] rounded-t-lg flex-shrink-0">
            Chat {targetUser && `with ${targetUser.firstName}`}
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  "chat " +
                  (user.firstName === msg.firstName ? "chat-end" : "chat-start")
                }
              >
                <div className="chat-header text-xs md:text-sm text-gray-500 mb-1">
                  {`${msg.firstName} ${msg.lastName}`}
                  <time className="text-[10px] md:text-xs opacity-50 ml-2">
                    {formatTime(msg.createdAt)}
                  </time>
                </div>
                <div
                  className={`chat-bubble text-sm md:text-base ${
                    user.firstName === msg.firstName
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50 text-[10px] md:text-xs mt-1 text-gray-500">
                  {`Seen ${formatTime(msg.createdAt)}`}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section - Fixed at bottom with proper spacing */}
          <div className="p-2 md:p-4 border-t border-gray-300 flex items-center gap-2 bg-[#f9f2e9] rounded-b-lg flex-shrink-0">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white border border-gray-300 text-gray-800 rounded-lg px-3 py-2 md:p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm md:text-base"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-2 md:px-4 md:py-2.5 rounded-lg transition-all text-sm md:text-base whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;