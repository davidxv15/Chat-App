import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";
import "./ChatRoom.css";
import SoundToggle from "../components/SoundToggle";
import TypingIndicator from "../components/TypingIndicator";
import EmojiPicker from "emoji-picker-react";
import DarkModeToggle from "../components/DarkModeToggle";
import ActiveUsers from "../components/ActiveUsers";

interface Message {
  timestamp: string;
  username: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const { room } = useParams<{ room: string }>(); // get room name from url
  const { user, token, loading, logout } = useAuth();
  const { socket, initializeWebSocket } = useWebSocket();
  const { roomName } = useParams<{ roomName: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const savedSoundPref = localStorage.getItem("soundEnabled");
    return savedSoundPref !== null ? JSON.parse(savedSoundPref) : false;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem(`messages-${roomName}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [roomName]);
  

  useEffect(() => {
    const savedSoundPref = localStorage.getItem("soundEnabled");
    console.log("Loaded sound preference from localStorage:", savedSoundPref); // Check what's loaded
    if (savedSoundPref !== null) {
      setSoundEnabled(JSON.parse(savedSoundPref)); // Parsed and set
    }
  }, []); // Only load on mount, no need to add soundEnabled to this dependency array

  useEffect(() => {
    if (socket && roomName) {
      const sendJoinMessage = () => {
        //check if websocket is open first
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "join",
              room: roomName,
              username: user?.username,
            })
          );
          console.log(`Joined room: ${roomName} as ${user?.username}`);
        }
      };

      const sendLeaveMessage = () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "leave",
              room: roomName,
              username: user?.username,
            })
          );
          console.log(`Left room: ${roomName} as ${user?.username}`);
        }
      };

      // If the WebSocket is still connecting, wait for it to open before sending the join message
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", sendJoinMessage);
      } else {
        sendJoinMessage();
      }

      return () => {
        sendLeaveMessage(); // Send leave message when component unmounts
        socket.removeEventListener("open", sendJoinMessage); // 'Cleanup' event listener on unmount
      };
    }
  }, [socket, roomName, user?.username]);

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
        console.log("Message received on client:", data);

        if (data.message && data.username && data.room === roomName) {
          const newMessage = {
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            username: data.username,
            message: data.message,
          };
          //update msgs state on new msg
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
  
            // Store updated messages in sessionStorage
            sessionStorage.setItem(
              `messages-${roomName}`,
              JSON.stringify(updatedMessages)
            );
  
            return updatedMessages;
          });

          // Play sound if enabled
          if (soundEnabled) {
            const audio = new Audio("/notification.wav");
            audio.play();
          }

          // Handle typing indicator only if same room
        } else if (data.typing && data.username && data.room === roomName) {
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
  }, [socket, soundEnabled, roomName]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      console.log("Sending message:", message);
      const timestamp = new Date().toISOString(); 
      const messageData = JSON.stringify({
        type: "message",
        room: roomName,
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
          type: "typing",
          username: user?.username,
          room: roomName, // include the room in the typing event
          typing: message.length > 0,
        })
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Detects how far the page has scrolled
      const threshold = 70; //  where you want the change to happen
      if (scrollPosition > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Ensures socket is cleaned up when user logs out
  const handleLogout = () => {
    // Clear all room messages from sessionStorage
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("messages-")) {
        sessionStorage.removeItem(key);
      }
    });
  
    logout(); // Your existing logout logic
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
    <div className="sticky-header sticky">
      <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 p-4 sticky top-0">
        <h1 className="text-3xl font-bold dark:text-gray-400 flex justify-center items-center">
          {" "}
          {roomName
            ? roomName.charAt(0).toUpperCase() + roomName.slice(1)
            : "General"}{" "}
          Chat
        </h1>
        <ActiveUsers room={roomName || 'defaultRoom'} />

        <div className="flex items-center space-x-2">
          <SoundToggle
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
          <DarkModeToggle />
        </div>
        {/* <div className="flex flex-col min- bg-gray-200 dark:bg-gray-900 dark:text-gray-400 p-2">
    <ActiveUsersList roomName={roomName!} />
  </div> */}

        <button
          onClick={() => navigate("/home")}
          className={`home-button font-bold bg-blue-500 text-white px-4 py-1 text-2xl rounded-md hover:bg-blue-800 dark:bg-blue-800 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white sticky transition-all duration-500 ease-in-out ${
            isScrolled ? "w-36 mx-auto" : "w-full mx-auto"
          }`}
        >
          Home
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white dark:bg-red-800 dark:text-gray-400 px-4 py-2 rounded-md absolute top-2 right-4 hover:bg-red-800 dark:hover:bg-red-600 dark:hover:text-white"
        >
          Logout
        </button>

        <div
          className="flex-1 bg-white p-4 pt-0 rounded-lg shadow-md overflow-y-auto dark:bg-gray-800"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <div // edit msgs
              key={index}
              className="message mb-2 p-2 bg-gray-600 rounded"
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <span className="timestamp">{msg.timestamp}</span>
              <span className="username">{msg.username}</span> :{" "}
              <span className="message-content">{msg.message}</span>
            </div>
          ))}

          <TypingIndicator isTyping={isTyping} username={typingUser} />
        </div>

        {/* Emoji Picker */}
        <div
          className={`emoji-picker-wrapper ${showEmojiPicker ? "show" : ""}`}
        >
          {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
        </div>

        <div className="input-wrapper bg-blue-500 dark:bg-blue-800">
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
            className="flex-1 p-2 rounded-md text-black dark:bg-gray-800 dark:text-white"
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
            className="ml-2 bg-blue-500 text-white p-2 rounded-md border border-gray-300 dark:border-gray-800 hover:bg-blue-800 dark:bg-blue-800 dark:text-gray-400 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
