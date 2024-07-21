import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form>
          <input
            type="text"
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Username"
          />
          <input
            type="password"
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Password"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
