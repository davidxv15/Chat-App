import React from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the import path as necessary

const Greeting: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#f0f0f0",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {user?.username ? (
        <span>{`Hello, ${user.username}!`}</span>
      ) : (
        <span>Hello, Guest!</span>
      )}
    </div>
  );
};

export default Greeting;
