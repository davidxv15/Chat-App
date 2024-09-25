import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clears previous error message
    setSuccess(""); // Resets success message

    //before 'setLoading', check if PWords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true); // Start loading (then the next bit of code...)

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        username,
        password,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Delay before redirecting to login
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Invalid Username. Try again");
    } finally {
      setLoading(false); // ... End loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-2xl text-gray-200 font-bold mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 p-4 rounded-lg shadow-md w-80"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}{" "}
        {/* Success message */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-1 rounded-md w-full"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* reCAPTCHA widget */}
<div className="g-recaptcha" data-sitekey="6Ld83EgqAAAAANhjqTjjd1wEBnvlKA74udb2_TPY"></div>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-gray-200 bg-blue-900 p-1 border border-gray-400 rounded-md w-full"
          disabled={loading} // Disable button while loading
        >
          Returning User Login Here
        </button>
      </form>
    </div>
  );
};

export default Register;
