import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatroomSelector from "../components/ChatroomSelector";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const goToChat = () => {
    navigate("/chat");
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4 top-2">
      <h1 className="text-3xl font-bold text-gray-200">Welcome to Real-Time Chat</h1>
      <ChatroomSelector />
      {/* <button
        onClick={goToChat}
        ref={buttonRef}
        className="mt-9 px-1 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-800"
      >
        Chat!
      </button> */}
    </div>
  );
};

export default Home;
