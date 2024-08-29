import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { decode } from 'jwt-decode';


const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  // ADD LOADING STATE
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decodedToken: any = (jwtDecode as any)(savedToken); // Decode token = checks it's expiration
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // If token is expired, clear the storage and set user to null
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        setToken(null);
        axios.defaults.headers.common["Authorization"] = "";
      } else {
        // If token is still good, set both user and token state
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        setUser({ username: localStorage.getItem("username") });
      }
    }
    setLoading(false); // Finished checking session state
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });
    setToken(data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);
    setUser({ username });
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
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
  };

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
