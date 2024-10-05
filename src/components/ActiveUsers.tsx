import React, { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext"; 

const ActiveUsers: React.FC<{ room: string }> = ({ room }) => {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);  
  const { socket } = useWebSocket(); 

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //active users websocket logic
  useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "userListUpdate" && data.room === room) {
        setActiveUsers(data.users);
      }
    };

    socket.addEventListener("message", handleUserListUpdate);

    return () => {
      socket.removeEventListener("message", handleUserListUpdate);
    };
  }, [socket, room]);

  return (
    <div className={`active-users-list hover:scale-125 bg-gray-800 bg-opacity-80 text-white px-2 pl-4 py-0 sticky  dark:bg-opacity-5 backdrop-blur-sm dark:text-yellow-100 transition-all duration-500 ease-in-out ${isScrolled ? 'transform translate-y-[4.5rem]' : ''}`}>
      <h3 className="Active-users opacity-60">Online</h3>
      <ul className="">
        {activeUsers.map(user => (
          <li key={user} className="opacity-60">{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
