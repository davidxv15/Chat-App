import React from "react";
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold">Welcome to Real-Time Chat</h1>
      <button onClick={goToChat}
      className="mt-9 px-1 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-800"
      >
        Chat!
      </button>
    </div>
  );
};

export default Home;
