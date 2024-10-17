import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // loading captcha script, same as in login
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

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

    // Get the reCAPTCHA token
    const token = window.grecaptcha.getResponse();
    if (!token) {
      setError("Please complete the CAPTCHA");
      setLoading(false);
      return;
    }

    try {
      // Send reCAPTCHA token and registration data to the backend
      const captchaResponse = await axios.post(
        "http://localhost:3001/verify-captcha",
        { token }
      );

      if (captchaResponse.data.message === "Verification successful") {
        // Proceed with registration if CAPTCHA is valid
        await axios.post("http://localhost:3001/api/auth/register", {
          username,
          password,
        });
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        setError("CAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Invalid Username. Try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900"
      role="main"
      aria-labelledby="register-title"
    >
      <h1 id="register-title" className="text-4xl text-gray-200 font-bold mb-4">
        Register
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 p-4 rounded-lg shadow-md w-80"
        onKeyDown={handleKeyDown}
        aria-labelledby="register-title"
        aria-describedby="recaptcha-info"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          aria-label="Enter your username"
          aria-required="true"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          aria-label="Enter your password"
          aria-required="true"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          aria-label="Confirm your password"
          aria-required="true"
        />
        {error && (
          <div className="text-red-500 mb-4" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 mb-4" role="status" aria-live="polite">
            {success}
          </div>
        )}{" "}
        {/* Success message */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-1 rounded-md w-full mb-4"
          disabled={loading} // Disable button while loading
          aria-busy={loading}
          aria-label={loading ? "Registering..." : "Register"}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {/* reCAPTCHA widget */}
        <div
          className="g-recaptcha"
          data-sitekey="6Ld83EgqAAAAANhjqTjjd1wEBnvlKA74udb2_TPY"
          role="group"
          aria-labelledby="recaptcha-info"
        ></div>
        <div id="recaptcha-info" className="sr-only">
          This site is protected by reCAPTCHA, and the Google Privacy Policy and
          Terms of Service apply.
        </div>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-gray-200 bg-blue-600 p-1 border border-gray-400 rounded-md w-full"
          disabled={loading} // Disable button while loading
          aria-busy={loading}
          aria-label="Login if you are a returning user"
        >
          Returning User Login Here
        </button>
      </form>
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
    </div>
  );
};

export default Register;
