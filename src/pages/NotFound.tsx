import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-800"
      role="main"
      aria-labelledby="not-found-title"
    >
      <h1
        className="text-4xl font-bold mb-4 text-gray-200"
        id="not-found-title"
      >
        404 - Page Not Found
      </h1>
      <p className="mb-4 text-gray-200" role="alert" aria-live="assertive">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white p-2 rounded-md text-gray-200"
        aria-label="Navigate back to the home page"
      >
        Navigate Home
      </button>
    </div>
  );
};

export default NotFound;
