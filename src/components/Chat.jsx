import React, { useEffect, useState } from "react";
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

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

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
      console.log("Fetching connections...");
      fetchConnections();
    }
  }, []);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
      console.log(res.data);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-h-[80vh] w-full max-w-3xl border rounded-xl flex flex-col bg-base-100">
        {/* Header */}
        <div className="navbar bg-base-200 border-b rounded-t-xl">
          <div className="flex items-center gap-3">
            <img
              src={targetUser?.photoUrl || "https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-base">
                {targetUser?.firstName + " " + targetUser?.lastName}
              </h2>
              <p className="text-xs text-success">online</p>
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-y-auto p-4 bg-base-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${msg.senderId === targetUserId ? "chat-start" : "chat-end"} mb-2`}
            >
              <div
                className={`chat-bubble ${msg.senderId === targetUserId ? "chat-bubble-neutral" : "chat-bubble-primary"
                  }`}
              >
                {msg.text}
              </div>
              <time className="text-[10px] text-gray-500 ml-1">{msg.timestamp}</time>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="p-2 border-t rounded-b-xl bg-base-200">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Type a message"
              className="input input-bordered flex-1 focus:outline-none"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
