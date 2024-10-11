import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { socket } = useWebSocket();
  let inactivityTimeout: NodeJS.Timeout;

  const handleLogout = async () => {
    try {
      // Notify WebSocket that the user is leaving the room
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "leave",
            room: "roomName", // Ensure roomName is passed or available
            username: user?.username,
          })
        );
      }

      // Perform cleanup
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("username");

      // Clear all room messages from sessionStorage
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("messages-")) {
          sessionStorage.removeItem(key);
        }
      });

      // Close WebSocket if needed
      if (socket) {
        socket.close();
      }

      // Navigate to login screen
      navigate("/login");
      window.location.reload(); // Optional: force page reload
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Token on load: ", savedToken);
    if (savedToken) {
      const decodedToken: any = jwtDecode(savedToken); // Decode the saved token
      console.log("Decoded Token: ", decodedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log("Token expired, clearing local storage");
        //If token is expired, clear the localestorage and set user & token to null (below)
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("username");
        sessionStorage.removeItem("username");
        setUser(null);
        setToken(null);
        axios.defaults.headers.common["Authorization"] = "";
      } else {
        console.log("Token is valid, setting user and token");
        // If token is still valid, SET both user and token state
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        setUser({ username: localStorage.getItem("username") || sessionStorage.getItem("username")  });
      }
    }
    setLoading(false); // Finished checking session state, so loading must be set false
  }, [navigate]);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const { data } = await axios.post("http://localhost:3001/api/auth/login", {
      username,
      password,
    });
    setToken(data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    // Clear any existing data before log in 
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");


    if (rememberMe) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
    } else {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("username", username);
    }
    setUser({ username });
    startInactivityTimer();
  };

  const register = async (username: string, password: string) => {
    await axios.post("http://localhost:3000/api/auth/register", {
      username,
      password,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
     // strike messages from sessionStorage on log out
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("messages-")) {
      sessionStorage.removeItem(key);
    }
  });

  delete axios.defaults.headers.common["Authorization"];
  navigate("/login");
};

const startInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    // handleLogout, as it has full 'cleanup' and removal of DB & DOM data
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "leave",
          room: roomName,
          username: user?.username,
        })
      );
    }
    handleLogout(); // Call the full logout logic
    alert("You have been logged out due to inactivity.");
  }, 30 * 60 * 1000); // 30 minutes inactivity timeout
};

  useEffect(() => {
    const resetTimer = () => {
      startInactivityTimer();
    };

  const handleError = () => {
    navigate('/error');
  }


    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, handleLogout, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
