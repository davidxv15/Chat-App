import React from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the import path as necessary

const Greeting: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="bg-gray-800 bg-opacity-80 text-gray-300 dark:text-gray-400 dark:bg-gray-900"
      style={{
        position: "absolute",
        top: ".5rem",
        left: "1rem",
        height: "1.2rem",
        // color: "#9CA3AF",
        // fontWeight: "bold",
        // backgroundColor: "#E5E7EB",
        padding: "5px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        verticalAlign: "sub",
        lineHeight: ".45rem",
      }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
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
