import React, { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext"; 

const ActiveUsers: React.FC<{ room: string }> = ({ room }) => {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { socket } = useWebSocket(); 

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
    <div className="active-users-list hover:scale-125 text-orange-200 bg-gray-800 px-2 py-1">
      <h3 className="Active-users">Online</h3>
      <ul className="">
        {activeUsers.map(user => (
          <li key={user} className="">{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
