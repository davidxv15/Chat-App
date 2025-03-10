import { useEffect, useRef } from "react";

interface IdleDetectionProps {
  timeout: number; // Time before logout
  warningTime: number; // Time before warning
  onLogout: () => void;
}

const IdleDetection: React.FC<IdleDetectionProps> = ({ timeout, warningTime, onLogout }) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const warningId = useRef<NodeJS.Timeout | null>(null);

  // Function to reset the idle timer
  const resetTimer = () => {
    console.log("🟢 User activity detected. Resetting Idle Timer.");

    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (warningId.current) clearTimeout(warningId.current);

    // **Set a new warning timeout before the full logout**
    warningId.current = setTimeout(() => {
      console.warn("⚠️ Warning: You will be logged out soon due to inactivity.");
    }, timeout - warningTime); // Warn the user before auto-logout

    // **Set full logout timer**
    timeoutId.current = setTimeout(() => {
      console.error("🚨 Logging out due to inactivity.");
      onLogout();
    }, timeout);
  };

  useEffect(() => {
    resetTimer(); // Initialize timer on mount

    // Reset timer when user interacts
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (warningId.current) clearTimeout(warningId.current);
    };
  }, [timeout]);

  return null; // No UI, just background logic
};

export default IdleDetection;
