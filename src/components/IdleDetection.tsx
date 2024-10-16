import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming this is your auth context
import { useParams } from 'react-router-dom';

interface IdleDetectionProps {
  timeout: number; // Total inactivity time before warning, in ms
  warningTime: number; // Time before actual logout to show warning, in ms
}

const IdleDetection: React.FC<IdleDetectionProps> = ({
  timeout = 6 * 60 * 1000, // 4 hours
  warningTime = 1 * 60 * 1000 // 5 minute warning
}) => {
  const { logout } = useAuth();
  const { roomName } = useParams<{ roomName: string }>();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalId = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningTime / 1000); // Countdown in seconds

  const resetTimer = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (countdownIntervalId.current) clearInterval(countdownIntervalId.current);
    setShowWarning(false);
    startIdleTimer();
  };

  const startIdleTimer = () => {
    console.log('Idle timer started');
    timeoutId.current = setTimeout(() => {
      console.log('Showing warning modal');
      setShowWarning(true);
      startWarningCountdown();
    }, timeout - warningTime);
  };

  const startWarningCountdown = () => {
    let remainingTime = warningTime / 1000;

    countdownIntervalId.current = setInterval(() => {
      setCountdown((prev) => prev - 1); // Update state with countdown

      remainingTime -= 1;
      if (remainingTime <= 0) {
        clearInterval(countdownIntervalId.current); // Stop countdown
        logout(); // Log the user out
        alert(`You have been logged out from ${roomName} due to inactivity.`);
      }
    }, 1000);
  };

  useEffect(() => {
    startIdleTimer();

    const handleUserActivity = () => {
        console.log('User activity detected, resetting timer.');
        resetTimer(); // Reset on any user interaction
      };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (countdownIntervalId.current) clearInterval(countdownIntervalId.current); // Cleanup
    };
  }, []);

  if (!showWarning) return null;

  return (
    showWarning && (
      <div
        role="dialog"
        aria-labelledby="warning-title"
        aria-describedby="warning-description"
        className="fixed inset-0 flex items-center justify-center bg-black z-50"
      >
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h2 id="warning-title" className="text-2xl font-bold mb-2">
            Inactivity Warning
          </h2>
          <p id="warning-description" className="mb-4">
            You will be logged out in <strong>{countdown}</strong> seconds due to inactivity.
          </p>
          <button
            onClick={resetTimer}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    )
  );
};

export default IdleDetection;
