import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check localStorage for dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="bg-gray-600 dark:bg-gray-600 text-white dark:text-gray-300 px-2 py-2 rounded absolute top-12 right-4"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 dark:text-yellow-300" /> // Show Sun icon in DARK mode
      ) : (
        <MoonIcon className="h-5 w-5 text-purple-300" /> // Show Moon icon in LIGHT mode
      )}
    </button>
  );
};

export default DarkModeToggle;
