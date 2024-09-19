import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";

const ChatroomSelector: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useWebSocket();
  const [roomUsers, setRoomUsers] = useState<{ [roomName: string]: string[] }>({});

  const rooms = ["General", "Sports", "Tech", "Movies", "Music", "Collectors", "Food"];

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
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Select a Chat Room</h1>
      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => handleRoomSelection(room)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {room}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatroomSelector;
