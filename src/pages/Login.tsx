import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); //setting to 'nothing' will clear prev errors
    setLoading(true); //starts the loading...

    try {
      await login(username, password);
      navigate('/'); //redirect to home page after successful login 
    } catch (error) {
      console.error('Login failed:', error);
      setError('Incorrect username or password'); // add login failure message
    } finally {
      setLoading(false); // ... ends loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
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
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full"
        disabled={loading} //disables button while loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <button
      onClick={() => navigate('/register')}
      className="mt-4 text-blue-500 p-1"
      disabled={loading} //disables button while loading
      >
        New User? Register Here
      </button>
    </div>
  );
};

export default Login;
