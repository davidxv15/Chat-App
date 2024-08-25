import React from "react";
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dkgray-100">
      <h1 className="text-3xl font-bold">Welcome to Real-Time Chat</h1>
      <button onClick={goToChat}
      className="bg-blue-400 text-white px-4 py-2 rounded-md"
      >
        Chat!
      </button>
    </div>
  );
};

export default Home;
