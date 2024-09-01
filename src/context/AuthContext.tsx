import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let inactivityTimeout: NodeJS.Timeout;

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (savedToken) {
      const decodedToken: any = jwtDecode(savedToken); // Decode the saved token
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        //If token is expired, clear the localestorage and set user & token to null (below)
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("username");
        sessionStorage.removeItem("username");
        setUser(null);
        setToken(null);
        axios.defaults.headers.common["Authorization"] = "";
      } else {
        // If token is still valid, SET both user and token state
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        setUser({ username: localStorage.getItem("username") || sessionStorage.getItem("username")  });
      }
    }
    setLoading(false); // Finished checking session state, so loading must be set false
  }, [navigate]);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const { data } = await axios.post("http://localhost:3000/api/auth/login", {
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
    delete axios.defaults.headers.common["Authorization"];
    navigate('/login'); // redirects to login after logout
  };

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, 1 * 60 * 1000); // 15 minutes inactivity timeout
  };

  useEffect(() => {
    const resetTimer = () => {
      startInactivityTimer();
    };

  const handleError = () => {
    navigate('error');
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
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
