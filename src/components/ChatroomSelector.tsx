import React from "react";
import { useNavigate } from "react-router-dom";

const ChatroomSelector: React.FC = () => {
  const navigate = useNavigate();

  // Room names and routes
  const chatrooms = [
    { name: "General", route: "general" },
    { name: "Development", route: "development" },
    { name: "Gaming", route: "gaming" },
    { name: "Movies", route: "movies" },
  ];

  const handleRoomSelection = (route: string) => {
    navigate(`/chat/${route}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {chatrooms.map((room) => (
        <button
          key={room.route}
          onClick={() => handleRoomSelection(room.route)}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700 transition"
        >
          {room.name}
        </button>
      ))}
    </div>
  );
};

export default ChatroomSelector;
