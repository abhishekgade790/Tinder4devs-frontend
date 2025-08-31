import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import socket from "../utils/socket";
import { addConnections } from "../store/connectionsSlice";
import { BASE_URL } from "../utils/utils";
import axios from "axios";

function Chat() {
  const user = useSelector((state) => state.user);
  const connections = useSelector((state) => state.connections);
  const userId = user?._id;
  const { targetUserId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Auto-scroll to bottom of chat container only
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
      dispatch(addConnections(res.data.data || []));
    } catch (error) {
      console.error("Failed to fetch connections", error);
    }
  };

  // ✅ Fetch connections only when needed
  useEffect(() => {
    fetchChatMessages();
    if (connections?.length === 0) {
      fetchConnections();
    }
  }, []);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Failed to fetch chat history", error);
    }
  };
  
  //filter connection to get target user details
  const targetUser = connections?.find((conn) => conn._id === targetUserId);

  // Join chat + listen for incoming messages
  useEffect(() => {
    if (!userId || !targetUserId) return;

    socket.emit("joinChat", { userId, targetUserId, firstName: user?.firstName });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup: remove only the listener, not disconnect the socket
    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, targetUserId, user?.firstName]);

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMsg = {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Emit to server
    socket.emit("sendMessage", newMsg);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="min-h-[80vh] w-full max-w-4xl shadow-2xl rounded-2xl flex flex-col bg-base-100 backdrop-blur-sm border border-base-300">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-primary-content border-b border-base-300 rounded-t-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar online">
                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={targetUser?.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180"}
                    alt="User Avatar"
                  />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  {targetUser?.firstName + " " + targetUser?.lastName}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <p className="text-sm opacity-90">Active now</p>
                </div>
              </div>
            </div>
            {/* back button */}
            <button 
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => window.history.back()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /> 
              </svg>
            </button>
          </div>
        </div>

        {/* Chat body */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-base-50 to-base-100 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-base-content opacity-70 text-lg">No messages yet</p>
              <p className="text-base-content opacity-50 text-sm">Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.senderId === targetUserId ? "chat-start" : "chat-end"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img 
                      src={msg.senderId === targetUserId 
                        ? (targetUser?.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180")
                        : (user?.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180")
                      } 
                      alt="avatar" 
                    />
                  </div>
                </div>
                <div
                  className={`chat-bubble ${
                    msg.senderId === targetUserId 
                      ? "chat-bubble-neutral shadow-md" 
                      : "chat-bubble-primary shadow-md"
                  } max-w-xs lg:max-w-md`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
                <div className="chat-footer opacity-50 text-xs mt-1">
                  {msg.timestamp}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-base-300 rounded-b-2xl bg-base-200/50 backdrop-blur-sm">
          <form
            className="flex gap-3 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered w-full pl-4 pr-12 py-3 rounded-full border-2 focus:border-primary focus:outline-none transition-all duration-200 shadow-sm"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-circle btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-circle shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              disabled={!messageInput.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;