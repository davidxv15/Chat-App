import React from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the import path as necessary

const Greeting: React.FC = () => {
  const { user } = useAuth();

  return (
    <div 
    className="text-gray-600 dark:text-gray-400 dark:bg-gray-900"
      style={{
        position: "absolute",
        top: ".5rem",
        left: "1rem",
        height: "1rem",
        // color: "#9CA3AF",
        // fontWeight: "bold",
        // backgroundColor: "#E5E7EB",
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
