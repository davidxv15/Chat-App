import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useWebSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && message) {
      console.log("Sending message:", message);
      socket.send(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="mt-4 p-2 border border-gray-300 rounded-md"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="mt-2 bg-blue-500 text-white p-2 rounded-md"
      >
        Send!
      </button>
    </div>
  );
};

export default ChatRoom;
