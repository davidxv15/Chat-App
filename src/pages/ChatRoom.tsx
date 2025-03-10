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
import Greeting from "../components/Greeting";
import IdleDetection from "../components/IdleDetection";
import axios from "axios";

interface Message {
  timestamp: string;
  username: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const { room } = useParams<{ room: string }>(); // get room name from url
  // const { handleLogout, startInactivityTimer } = useAuth();
  const { user, token, loading, logout, setUser, setToken } = useAuth();
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

  const [activeUsers, setActiveUsers] = useState<string[]>([]);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch messages for a room from the backend
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = sessionStorage.getItem(`messages-${roomName}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else if (roomName) {
        // Fetch from the backend if no messages are found in sessionStorage
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/messages/${roomName}`

          );
          const fetchedMessages = response.data;
          setMessages(fetchedMessages);

          // Store fetched messages in sessionStorage for future use
          sessionStorage.setItem(
            `messages-${roomName}`,
            JSON.stringify(fetchedMessages)
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    if (roomName) {
      loadMessages();
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
              username: user?.username, // added username!
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

  // New WebSocket closure handling effect
  // useEffect(() => {
  //   if (socket) {
  //     socket.onclose = () => {
  //       // Ensure the user is removed from the active users list when WebSocket closes
  //       if (socket.readyState === WebSocket.CLOSED) {
  //         socket.send(
  //           JSON.stringify({
  //             type: "leave",
  //             room: roomName,
  //             username: user?.username,
  //           })
  //         );
  //         handleLogout();
  //       }
  //     };
  //   }
  // }, [socket, roomName, user?.username]); // Add necessary dependencies

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
  
    // Handles incoming WebSocket messages
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket Message Received:", data);
  
        if (!data.type) {
          console.error("❌ Invalid message format: Missing type", data);
          return;
        }
  
        switch (data.type) {
          case "userListUpdate":
            console.log("👥 User List Update:", data.users);
            setActiveUsers(data.users || []);
            break;
  
          case "join":
            console.log(`✅ User joined room: ${data.room}, username: ${data.username}`);
            break;
  
          case "leave":
            console.log(`🚪 User left room: ${data.room}, username: ${data.username}`);
            break;
  
          case "message":
            console.log(`💬 Message received in ${data.room}: ${data.message}`);
            const newMessage = {
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
              username: data.username,
              message: data.message,
            };
  
            setMessages((prev) => {
              const updatedMessages = [...prev, newMessage];
  
              // Store messages in sessionStorage
              sessionStorage.setItem(`messages-${roomName}`, JSON.stringify(updatedMessages));
  
              return updatedMessages;
            });
  
            // Play notification sound **if enabled**
            if (soundEnabled) {
              const audio = new Audio("/notification.wav");
              audio.play();
            }
            break;
  
          case "typing":
            console.log(`⌨ ${data.username} is typing...`);
            setIsTyping(data.typing);
            setTypingUser(data.username);
            break;
  
          default:
            console.warn("⚠️ Unrecognized WebSocket event type:", data.type);
        }
      } catch (error) {
        console.error("❌ WebSocket message parsing error:", error);
      }
    };
  
    // **Auto-reconnect logic**
    const handleClose = () => {
      console.warn("🚨 WebSocket Disconnected. Attempting Reconnect...");
      setTimeout(() => {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          initializeWebSocket(token); // Reinitialize WebSocket
        }
      }, 3000); // Wait 3 sec before reconnecting
    };
  
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
  
    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
    };
  }, [socket, roomName, token, soundEnabled]);
  
  
  
  const reconnectWebSocket = () => {
    console.warn("🔄 Attempting to reconnect WebSocket...");
  
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      initializeWebSocket(token); // Ensure token is passed correctly
    }
  };
  

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
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
  const handleLogout = async () => {
    console.warn("🚨 handleLogout was called! Checking why...");
    console.trace(); // Shows full call stack
    try {
      // Notify WebSocket that the user is leaving the room
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "leave",
            room: roomName,
            username: user?.username,
          })
        );
      }

      // Send a request to the backend to delete the messages
      console.warn("🗑️ Deleting user messages...");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/messages/${user?.username}`
      );

      // Clear all room messages from sessionStorage
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("messages-")) {
          sessionStorage.removeItem(key);
        }
      });

      // Clear user authentication
      setUser(null);
      setToken(null);
      console.warn("🧹 Clearing session & localStorage...");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("username");

      // Remove WebSocket connection if needed
      if (socket) {
        console.warn("🧹 Clearing session & localStorage...");
        socket.close();
      }

      // Redirect to login
      console.warn("🚪 Redirecting to /login");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const handleTabClose = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        // Ensure the 'leave' event is sent when the tab is closed
        socket.send(
          JSON.stringify({
            type: "leave",
            room: roomName,
            username: user?.username,
          })
        );
        handleLogout(); // Trigger full logout logic
      }
    };

    // Listen for the tab/window being closed
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [socket, roomName, user?.username]); // Ensure it's triggered by any changes to socket or user state

  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout | null = null;

    const checkLogoutConditions = () => {
      if (!user || !token) {
        console.warn("🚨 User or token missing, logging out...");
        // handle logout func was here...
        return;
      }

      if (socket && socket.readyState === WebSocket.CLOSED) {
        console.warn("🔌 WebSocket disconnected. Waiting to see if it reconnects...");

        // Wait 10 seconds before logging out
        logoutTimeout = setTimeout(() => {
          if (socket.readyState === WebSocket.CLOSED) {
            console.warn("⏳ Still disconnected. Logging out.");
            handleLogout();
          } else {
            console.log("✅ WebSocket reconnected. Canceling logout.");
          }
        }, 100000); // 10 seconds delay
      }
    };

    window.addEventListener("beforeunload", checkLogoutConditions);

    return () => {
      window.removeEventListener("beforeunload", checkLogoutConditions);
      if (logoutTimeout) clearTimeout(logoutTimeout); // Cleanup timeout if component unmounts
    };
}, [user, token, socket]); 


  // Also call handleLogout on WebSocket closure or timeout
  useEffect(() => {
    if (socket) {
      socket.onclose = () => {
      //  handle logout func was here
      };
    }
  }, [socket]);

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
    <div className="chatroom-container sticky-header sticky">
      <IdleDetection timeout={240 * 60 * 1000} warningTime={10 * 60 * 1000} onLogout={handleLogout} />
      <div
        className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 p-4 sticky top-0"
        role="main"
        aria-labelledby="chat-title"
      >
        <h1
          id="chat-title"
          className="font-bold text-2xl text-gray-800 dark:text-gray-400 flex justify-center items-center align-middle"
        >
          {" "}
          {roomName
            ? roomName.charAt(0).toUpperCase() + roomName.slice(1)
            : "General"}{" "}
          {/* <br /> */}
          Chat
        </h1>
        <ActiveUsers
          room={roomName || "defaultRoom"}
          aria-label="Active users"
        />

        <Greeting aria-label={`Greeting message for ${user?.username}`} />

        <div className="flex items-center space-x-2">
          <SoundToggle
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            aria-label="Toggle notification sounds"
          />
          <DarkModeToggle aria-label="Toggle dark mode" />
        </div>
        {/* <div className="flex flex-col min- bg-gray-200 dark:bg-gray-900 dark:text-gray-400 p-2">
    <ActiveUsersList roomName={roomName!} />
  </div> */}

        <button
          onClick={() => navigate("/home")}
          aria-label="Home button to chatroom selection"
          className={`home-button font-bold bg-blue-500 text-gray-black px-4 py-1 text-2xl rounded-md hover:bg-blue-800 hover:text-white dark:bg-blue-800 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white sticky transition-all duration-500 ease-in-out ${
            isScrolled ? "w-36 mx-auto" : "w-full mx-auto"
          }`}
        >
          Home
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-gray-200 dark:bg-red-800 dark:text-gray-400 px-4 py-2 rounded-md absolute top-2 right-4 hover:bg-red-800 dark:hover:bg-red-600 dark:hover:text-white"
          aria-label="Logout from the Chat Application"
        >
          Logout
        </button>

        <div
          className="flex-1 bg-gray-200 p-2 pt-1 rounded-lg shadow-md overflow-y-auto dark:bg-gray-800"
          ref={chatContainerRef}
          aria-live="polite"
          aria-relevant="additions text"
          role="log"
        >
          {messages.map((msg, index) => (
            <div // edit msgs
              key={index}
              className="message mb-2 p-2 bg-gray-600 rounded"
              ref={index === messages.length - 1 ? lastMessageRef : null}
              aria-label={`Message from ${msg.username} at ${msg.timestamp}`}
            >
              <span className="timestamp" aria-hidden="true">
                {msg.timestamp}
              </span>
              <span className="username">{msg.username}</span> :{" "}
              <span className="message-content">{msg.message}</span>
            </div>
          ))}

          <TypingIndicator
            isTyping={isTyping}
            username={typingUser}
            aria-label={`${user?.username} is typing`}
          />
        </div>

        {/* Emoji Picker */}
        <div
          className={`emoji-picker-wrapper ${showEmojiPicker ? "show" : ""}`}
          id="emoji-picker"
          role="dialog"
          aria-label="Emoji picker"
          aria-live="polite"
          aria-expanded={showEmojiPicker}
        >
          {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
        </div>

        <div className="input-wrapper bg-blue-500 dark:bg-blue-800">
          <button
            className="emoji-button"
            onClick={toggleEmojiPicker}
            aria-label={
              showEmojiPicker ? "Close emoji picker" : "Open emoji picker"
            }
            aria-expanded={showEmojiPicker}
            aria-controls="emoji-picker"
          >
            {showEmojiPicker ? "❌" : "😀"}
          </button>

          {showEmojiPicker && (
            <div
              className="emoji-picker-wrapper"
              id=""
              role="dialog"
              aria-label="Emoji picker"
              aria-live="polite"
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          {/* Input and Send Button */}
          <input
            type="text"
            className="flex-1 p-2 rounded-md text-black bg-gray-200 dark:bg-gray-800 dark:text-white"
            placeholder="Type your message..."
            aria-label="Message input"
            aria-required="true"
            role="textbox"
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
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
