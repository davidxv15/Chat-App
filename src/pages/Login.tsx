import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Ensure the recaptcha script is loaded
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); //setting to 'nothing' will clear prev errors
    setLoading(true); //starts the loading...

     // Get reCAPTCHA token from the widget
     const token = window.grecaptcha?.getResponse();
     if (!token) {
       setError("Please complete the CAPTCHA");
       setLoading(false);
       return;
     }

     try {
      // Send reCAPTCHA token to backend for verification
      const captchaResponse = await axios.post("http://localhost:3001/verify-captcha", { token });
      if (captchaResponse.data.message === "Verification successful") {
        // If CAPTCHA is verified, proceed with the login
        await login(username, password, rememberMe); // passing rememberMe state to login func
        navigate("/"); // Redirect to home page after successful login
      } else {
        setError("CAPTCHA failed. Please try again.");
      }
    } catch (error: any) {  // Specify error as any to satisfy TypeScript
      console.error("Login failed:", error);
      setError("Incorrect username, password, or CAPTCHA. Please try again."); // Update error message
    } finally {
      setLoading(false); // Stop the loading process
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md w-80"
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
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex items-center mb-4">
          <label className="flex items-center text-blue-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            Remember Me
          </label>
        </div>


    {/* reCAPTCHA widget */}
<div className="g-recaptcha" data-sitekey="6Ld83EgqAAAAANhjqTjjd1wEBnvlKA74udb2_TPY"></div>


        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md w-full"
          disabled={loading} //disables button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        onClick={() => navigate("/register")}
        className="mt-4 text-blue-600 p-1"
        disabled={loading} //disables button while loading
      >
        New User? Register Here
      </button>
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    </div>
  );
};

export default Login;
