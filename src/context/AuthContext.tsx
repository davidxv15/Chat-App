import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  // ADD LOADING STATE!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    console.log('Saved token in AuthContext:', savedToken);
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      const savedUsername = localStorage.getItem('username');
      console.log('Saved username in AuthContext:', savedUsername);
      setUser({ username: savedUsername });
    }
    setLoading(false); //reset loading AFTER state is init
  }, []);
  

  const login = async (username: string, password: string) => {
    const { data } = await axios.post('http://localhost:3000/api/auth/login', { username, password });
    setToken(data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username); // Optional: store username for later use
    setUser({ username });
  };

  const register = async (username: string, password: string) => {
    await axios.post('http://localhost:3000/api/auth/register', { username, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
