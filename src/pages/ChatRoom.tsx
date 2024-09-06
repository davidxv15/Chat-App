import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";
import "./ChatRoom.css";
import SoundToggle from "../components/SoundToggle";
import TypingIndicator from "../components/TypingIndicator";
import EmojiPicker from "emoji-picker-react";

const ChatRoom: React.FC = () => {
  const { user, token, loading, logout } = useAuth();
  const { socket, initializeWebSocket } = useWebSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (loading) return; // will only check if loading is done
    console.log("User in ChatRoom:", user);
    console.log("Token in ChatRoom:", token);
    if (!user || !token) {
      console.log("Redirecting to login because user or token is missing");
      navigate("/login");
    } else if (!socket) {
      //only init if no existing socket
      console.log("Initializing WebSocket with token:", token);
      initializeWebSocket(token);
    }
  }, [user, token, loading, socket, navigate, initializeWebSocket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        // Store each message as an object with separate fields
        if (data.message && data.username && data.timestamp) {
          console.log("Message received:", data);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              timestamp: data.timestamp,
              username: data.username,
              message: data.message,
            },
          ]);

          // Play sound if enabled
          if (soundEnabled) {
            const audio = new Audio("/notification.wav");
            audio.play();
          }

          // Handle typing indicator
        } else if (data.typing && data.username) {
          setIsTyping(data.typing);
          setTypingUser(data.username);
        } else {
          console.error("Received data is not valid:", data);
        }
      } catch (error) {
        console.error(
          "Error parsing message:",
          error,
          "Message data:",
          event.data
        );
      }
    };

    socket.addEventListener("message", handleMessage);

    socket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, soundEnabled]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      console.log("Sending message:", message);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const messageData = JSON.stringify({
        username: user?.username, //make sure user is defined and has a username
        message: message,
        timestamp: timestamp,
      });
      socket.send(messageData);
      setMessage("");
    } else {
      console.error("WebSocket is not open or message is empty");
    }
  };

  const handleTyping = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          username: user?.username,
          typing: message.length > 0,
        })
      );
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout(); //will clear user session
    navigate("/login");
    window.location.reload();
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 p-4">
      <h1 className="text-2xl font-bold">Chat Room</h1>

      <SoundToggle
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <button
        onClick={() => {
          navigate("/login");
          window.location.reload();
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-md absolute top-2 right-4"
      >
        Logout
      </button>

      {/* destructure 'msg' into individual spans, as "msg.____", allowing them as CSS selectors */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
        {messages.map((msg, index) => ( // check after scroll functions
          <div key={index} className="message mb-2 p-2 bg-gray-500 rounded">
            <span className="timestamp">{msg.timestamp} </span>
            <span className="username">{msg.username}</span>:
            <span className="message-content"> {msg.message}</span>
          </div>
        ))}

        <TypingIndicator isTyping={isTyping} username={typingUser} />
      </div>

      {/* Emoji Picker */}
      <div className={`emoji-picker-wrapper ${showEmojiPicker ? "show" : ""}`}>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>

      <div className="input-wrapper">
        <button className="emoji-button" onClick={toggleEmojiPicker}>
          {showEmojiPicker ? "❌" : "😀"}
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        {/* Input and Send Button */}
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
