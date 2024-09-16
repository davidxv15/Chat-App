import React, { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";

interface ActiveUsersListProps {
  roomName: string;
}

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ roomName }) => {
  const { socket } = useWebSocket();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "userListUpdate") {
        setActiveUsers(data.users);
      }
    };

    socket.addEventListener("message", handleUserListUpdate);

    return () => {
      socket.removeEventListener("message", handleUserListUpdate);
    };
  }, [socket]);

  return (
    <div className="active-users-list">
      <h2 className="text-xl font-bold">Active Users in {roomName}</h2>
      <ul>
        {activeUsers.length > 0 ? (
          activeUsers.map((user, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {user}
            </li>
          ))
        ) : (
          <p>No active users in this room</p>
        )}
      </ul>
    </div>
  );
};

export default ActiveUsersList;