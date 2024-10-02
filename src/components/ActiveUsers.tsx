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
    <div className="active-users-list text-gray-100 bg-gray-800 px-2 py-2 absolute top-2 left-4">
      <h3 className="Active-users">Active Users:</h3>
      <ul className="">
        {activeUsers.map(user => (
          <li key={user} className="">{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
