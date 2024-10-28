import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import Bulletin from "./Bulletin";
import Contact from "./Contact";

const ChatroomSelector: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useWebSocket();
  const [roomUsers, setRoomUsers] = useState<{ [roomName: string]: string[] }>({});

  const rooms = ["General", "Sports", "Tech", "Movies", "Music", "Art", "Food", "H.R."];

   //for user list updates to each room
   useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "userListUpdate") {
        setRoomUsers((prevRoomUsers) => ({
          ...prevRoomUsers,
          [data.room]: data.users,
        }));
      }
    };

    socket.addEventListener("message", handleUserListUpdate);

    return () => {
      socket.removeEventListener("message", handleUserListUpdate);
    };
  }, [socket]);

  const handleRoomSelection = (room: string) => {
    // Send "join" event to WebSocket server
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "join",
          room: room.toLowerCase(),
        })
      );
    }

    // Navigate to the selected chat room
    navigate(`/chat/${room.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 pb-6"
    role="main" 
    aria-labelledby="chat-room-selection-title"
    >
      <hr aria-hidden="true" />
      <br aria-hidden="true" />
      <h1 
      id="chat-room-selection-title" 
      className="text-2xl mb-2 text-gray-200 pt-0">Select a Chat Room</h1>
      <div 
      className="grid grid-cols-3 gap-4"
      role="group" 
      aria-label="Chat Room Selection"
      >
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => handleRoomSelection(room)}
            className="bg-blue-800 text-xl text-gray-200 py-2 px-5 rounded border border-gray-500 hover:bg-blue-700"
            aria-label={`Join ${room} chat room`}
          >
            {room}
          </button>
        ))}
      </div>
      <Bulletin />
      <Contact /> 
    </div>
  );
};

export default ChatroomSelector;
