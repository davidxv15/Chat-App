import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

interface IdleDetectionProps {
  timeout: number; // Milliseconds until logout
  roomName: string;
}

const IdleDetection: React.FC<IdleDetectionProps> = ({ timeout, roomName }) => {
  const { logout } = useAuth(); // Using logout from AuthContext
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Reset the inactivity timer
  const resetTimer = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      if (roomName) {
        logout(); // Trigger logout if timer expires
        alert("You've been logged out due to inactivity.");
      }
    }, timeout);
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "click", "touchstart"];

    // Attach event listeners to detect user activity
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Cleanup on unmount
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [roomName, timeout]);

  return null; // No visible UI
};

export default IdleDetection;
