import React from "react";
import { useNavigate } from "react-router-dom";

const ChatroomSelector: React.FC = () => {
  const navigate = useNavigate();
  const rooms = ["General", "Sports", "Tech", "Movies", "Music", "Collectors", "Food"];

  const handleRoomSelection = (room: string) => {
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
