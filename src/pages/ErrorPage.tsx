import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-red-100"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <h1 className="text-4xl font-bold text-red-600 mb-4" id="error-title">
        Something went wrong.
      </h1>
      <p className="text-lg mb-4" id="error-description">
        We encountered an unexpected error. Please try again later.
      </p>
      <button
        onClick={goToHome}
        className="bg-blue-500 text-white p-3 rounded-md"
        aria-label="Go back to the home page"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
