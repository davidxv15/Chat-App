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
        color: "#9CA3AF",
        fontWeight: "bold",
        // backgroundColor: "#4B5563",
        padding: "5px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        verticalAlign: "sub",
        lineHeight: "5px"
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
