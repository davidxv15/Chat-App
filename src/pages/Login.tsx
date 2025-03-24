import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

declare global {
  interface Window {
    grecaptcha: any;
    onCaptchaComplete: (token: string) => void;
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
  const [captchaComplete, setCaptchaComplete] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const [showCreds, setShowCreds ] = useState(false);


  // Ensure the recaptcha script loads
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Defining the callback function for the CAPTCHA completion
    window.onCaptchaComplete = (token: string) => {
      console.log("CAPTCHA completed, token:", token);
      // setCaptchaToken(token);
      setCaptchaComplete(true); // Set your state or perform other actions

      // Focus the login button after CAPTCHA is complete
      if (loginButtonRef.current) {
        loginButtonRef.current.focus();
        console.log("Login button focused after CAPTCHA completion.");
      }
    };
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); //setting to 'nothing' will clear prev errors
    setLoading(true); //starts the loading...

    // Get reCAPTCHA token from the widget
    const token = window.grecaptcha.getResponse();
    console.log("reCAPTCHA Token:", token);
    if (!token) {
      setError("Please complete the CAPTCHA");
      setLoading(false);
      return;
    }

    try {
      // Send recaptcha token to backend for verification
      const captchaResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify-captcha`,
        { token }
      );
      if (captchaResponse.data.message === "Verification successful") {
        // If captcha is verified, proceed with the login
        await login(username, password, rememberMe); // passing rememberMe state to login func
        navigate("/"); // Redirect to home page after successful login
      } else {
        setError("CAPTCHA failed. Please try again.");
      }
    } catch (error: any) {
      // Specify error as any to satisfy TypeScript
      console.error("Login failed:", error);
      setError("Incorrect username, password, or CAPTCHA. Please try again."); // Update error message
    } finally {
      setLoading(false); // Stop the loading process
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (captchaComplete) {
        loginButtonRef.current?.click(); // Programmatically trigger the click
      } else {
        setError("Please complete the CAPTCHA before submitting.");
      }
    }
  };

  useEffect(() => {
    if (captchaComplete && loginButtonRef.current) {
      // Focus the login button automatically when the CAPTCHA is completed
      loginButtonRef.current.focus();
      console.log("Login button automatically focused after CAPTCHA.");
    }
  }, [captchaComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 full-screen-page"
      role="main"
      aria-labelledby="login-title"
    >
      {/* Quick Access Demo Credentials Notice */}
      <div
        className="p-2 mb-4 rounded-2xl border border-yellow-500 bg-gradient-to-br from-stone-600 via-stone-300 to-stone-500 text-black shadow-lg max-w-md text-center opacity-75"
        role="alert"
        aria-label="Recruiter quick login info"
      >
        <button
          onClick={() => setShowCreds((prev) => !prev)}
          className="w-full text-md font-semibold mb-1 text-gray-800 flex items-center justify-between gap-2 hover:underline"
          aria-expanded={showCreds}
          aria-controls="demo-creds"
        >
          ⚠️ Quick Access for Recruiters ⚠️
          <span>{showCreds ? "▲" : "▼"}</span>
        </button>

        {showCreds && (
          <div
          id="demo-creds"
          className="flex justify-between gap-6 text-sm font-mono text-gray-900 mt-2"
          >
            {/* First Set */}
            <div className="text-left border border-black p-2 rounded-md w-full">
              <p>
                Username: <code className="text-green-500">demo1</code>
              </p>
              <p>
                Password: <code className="text-green-500">demo1</code>
              </p>
            </div>

            {/* Second Set */}
            <div className="text-left border border-black p-2 rounded-md w-full">
              <p>
                Username: <code className="text-pink-600">demo2</code>
              </p>
              <p>
                Password: <code className="text-pink-600">demo2</code>
              </p>
            </div>
          </div>
        )}
      </div>

      <h1
        id="login-title"
        className="text-4xl font-bold mb-4 text-gray-200 italic-slant"
      >
        Login
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 p-4 rounded-lg shadow-md w-80"
        onKeyDown={handleKeyDown} // event to form
        aria-labelledby="login-title"
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
        {error && (
          <div className="text-red-600 mb-4" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="flex items-center mb-4">
          <label className="flex items-center text-blue-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
              aria-checked={rememberMe}
            />
            Remember Me
          </label>
        </div>

        {/* reCAPTCHA widget */}
        <div
          className="g-recaptcha"
          data-sitekey="6Ld83EgqAAAAANhjqTjjd1wEBnvlKA74udb2_TPY"
          data-callback="onCaptchaComplete"
          role="group"
          aria-labelledby="captcha-info"
        ></div>
        <div id="captcha-info" className="sr-only">
          This site is protected by reCAPTCHA, and the Google Privacy Policy and
          Terms of Service apply.
        </div>

        <button
          ref={loginButtonRef}
          type="submit"
          disabled={!captchaComplete}
          className="bg-blue-600 text-white p-2 mt-3 rounded-md w-full"
          // disabled={loading} //disables button while loading
          aria-busy={loading}
          aria-label={loading ? "Logging in..." : "Login"}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        onClick={() => navigate("/register")}
        className="mt-4 text-blue-800 p-1"
      >
        New User? Register Here
      </button>

      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
    </div>
  );
};

export default Login;

// check paths, routes, and keys for 3rd party update
