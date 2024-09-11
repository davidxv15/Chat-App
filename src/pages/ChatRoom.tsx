import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";
import "./ChatRoom.css";
import SoundToggle from "../components/SoundToggle";
import TypingIndicator from "../components/TypingIndicator";
import EmojiPicker from "emoji-picker-react";
import DarkModeToggle from '../components/DarkModeToggle';

interface Message {
  timestamp: string;
  username: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const { user, token, loading, logout } = useAuth();
  const { socket, initializeWebSocket } = useWebSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

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
      setShowEmojiPicker(false); // closes emojis
      inputRef.current?.focus();
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

    // momentarily shift focus away and then back to the input field
    setTimeout(() => {
      inputRef.current?.focus(); //re-focus on input after emoji selection (click)
    }, 200); // short delay for focus restoration after emoji selection
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
    inputRef.current?.focus(); 
  };

  const handleLogout = () => {
    logout(); //will clear user session
    navigate("/login");
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior if the emoji picker is open
      sendMessage(); // Send the message instead
    }
  };


  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold dark:text-gray-400">Chat Room</h1>

      <div className="flex items-center space-x-2">
      <SoundToggle
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      <DarkModeToggle />
      </div>

      <button
      onClick={() => navigate("/home")}
      className="bg-blue-500 text-white py-2 px-4 py-2 rounded-md dark:bg-blue-800 dark:text-gray-400"
      >
        Home
      </button>
      <button
        onClick={() => {
          navigate("/login");
          window.location.reload();
        }}
        className="bg-red-600 text-white dark:bg-red-800 dark:text-gray-400 px-4 py-2 rounded-md absolute top-2 right-4 hover:bg-red-400"
      >
        Logout
      </button>

      {/* destructure 'msg' into individual spans, as "msg.____", allowing them as CSS selectors */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto dark:bg-gray-800" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message mb-2 p-2 bg-gray-600 rounded"
            ref={index === messages.length - 1 ? lastMessageRef : null} 
          >
            <span className="timestamp">{msg.timestamp}</span>
            <span className="username">{msg.username}</span>: <span className="message-content">{msg.message}</span>
          </div>
        ))}

        <TypingIndicator isTyping={isTyping} username={typingUser} />
      </div>

      {/* Emoji Picker */}
      <div className={`emoji-picker-wrapper ${showEmojiPicker ? "show" : ""}`}>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>

      <div className="input-wrapper dark:bg-gray-800">
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
          className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white"
          placeholder="Type your message..."
          value={message}
          ref={inputRef}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown} // Custom behavior when emoji picker is open
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-md dark:bg-blue-800 dark:text-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
