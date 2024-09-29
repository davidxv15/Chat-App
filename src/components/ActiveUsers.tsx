import React, { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext"; 

const ActiveUsers: React.FC<{ room: string }> = ({ room }) => {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { socket } = useWebSocket(); 

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "userListUpdate" && data.room === room) {
        setActiveUsers(data.users);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket, room]);

  return (
    <div className="active-users-list text-gray-200 bg-gray-800 px-4 py-2 w-24">
      <h3>Active Users:</h3>
      <ul>
        {activeUsers.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
