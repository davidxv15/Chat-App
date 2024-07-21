import React from 'react';

const ChatRoom: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
        {/* Chat messages will go here */}
      </div>
      <input
        type="text"
        className="mt-4 p-2 border border-gray-300 rounded-md"
        placeholder="Type your message..."
      />
    </div>
  );
};

export default ChatRoom;
