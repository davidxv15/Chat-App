import React from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the import path as necessary

const Greeting: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        position: "absolute",
        top: ".5rem",
        left: "1rem",
        height: "1rem",
        color: "#f1f1f1",
        backgroundColor: "#4B5563",
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
