import React, { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";

interface ActiveUsersListProps {
  roomName: string;
}

// This component may become less intensive

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ roomName }) => {
  const { socket } = useWebSocket();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // Handle user list updates
      if (data.type === "userListUpdate" && data.room === roomName) {
        const updatedUsers = [...new Set(data.users as string[])]; // Ensure no duplicates
        setActiveUsers(updatedUsers);
      }
    };
    
    

    socket.addEventListener("message", handleUserListUpdate);

    return () => {
      socket.removeEventListener("message", handleUserListUpdate);
    };
  }, [socket, roomName]);

  return (
    <div className="active-users-list bg-gray-300 dark:bg-gray-700 rounded-md p-2 mt-4 text-sm max-h-16 overflow-y-auto">
      <h2 className="text-center text-md font-bold mb-2">Active Users in {roomName}</h2>
      <ul className="text-gray-700 dark:text-gray-300">
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
