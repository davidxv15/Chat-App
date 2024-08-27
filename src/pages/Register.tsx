import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      // add registration failure msg
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md w-80">
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">
          Register
        </button>
        <button
            onClick={() => navigate('/login')}
            className="mt-4 text-blue-600 p-1 border border-gray-300 rounded-md w-full"
        >
            Login
        </button>
      </form>
    </div>
  );
};

export default Register;
