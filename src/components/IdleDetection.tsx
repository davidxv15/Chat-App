import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming this is your auth context
import { useParams } from 'react-router-dom';

interface IdleDetectionProps {
  timeout: number; // Total inactivity time before warning, in ms
  warningTime: number; // Time before actual logout to show warning, in ms
}

const IdleDetection: React.FC<IdleDetectionProps> = ({
  timeout = 240 * 60 * 1000, // 4 hours
  warningTime = 300 * 1000 // 5 minute warning
}) => {
  const { logout } = useAuth();
  const { roomName } = useParams<{ roomName: string }>();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningTime / 1000); // Countdown in seconds

  const resetTimer = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    setShowWarning(false);
    startIdleTimer();
  };

  const startIdleTimer = () => {
    timeoutId.current = setTimeout(() => {
      setShowWarning(true);
      startWarningCountdown();
    }, timeout - warningTime); // Trigger warning before actual logout
  };

  const startWarningCountdown = () => {
    let remainingTime = warningTime / 1000; // Seconds

    const countdownInterval = setInterval(() => {
      remainingTime -= 1;
      setCountdown(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        logout(); // Trigger logout if countdown reaches 0
        alert(`You have been logged out from ${roomName} due to inactivity.`);
      }
    }, 1000);
  };

  useEffect(() => {
    startIdleTimer();

    const handleUserActivity = () => resetTimer();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    showWarning && (
      <div
        role="dialog"
        aria-labelledby="warning-title"
        aria-describedby="warning-description"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
