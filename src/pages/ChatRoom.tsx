import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import './ChatRoom.css';

const ChatRoom: React.FC = () => {
  const { user, token, loading, logout } = useAuth();
  const { socket, initializeWebSocket } = useWebSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (loading) return; // will only check if loading is done
    console.log('User in ChatRoom:', user);
    console.log('Token in ChatRoom:', token);
    if (!user || !token) {
      console.log('Redirecting to login because user or token is missing');
      navigate('/login');
    } else if (token && !socket) { //only init if no existing socket

      console.log('Initializing WebSocket with token:', token);
      initializeWebSocket(token);
    }
  }, [user, token, loading, socket, navigate, initializeWebSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data); // Parse the JSON string once
        console.log('Message received:', data);
  
        if (typeof data === 'object' && data.message && data.username) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${data.username}: ${data.message}`,
          ]);
          if (soundEnabled) {
            const audio = new Audio('/notification.wav');
            audio.play();
          }
        } else {
          console.error('Received data is not a valid message object:', data);
        }
      } catch (error) {
        console.error('Error parsing message:', error, 'Message data:', event.data);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket, soundEnabled]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      console.log('Sending message:', message);
      const messageData = JSON.stringify({
        username: user?.username, //make sure user is defined and has a username
        message: message,
      });
      socket.send(messageData);
      setMessage('');
    } else {
      console.error('WebSocket is not open or message is empty');
    }
  };

  const handleLogout = () => {
    logout(); //will clear user session
    navigate('/login');
    window.location.reload();
  }

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Chat Room</h1>
      <label className="flex items-center space-x-2">
    <span>Sound</span>
    <input 
      type="checkbox" 
      checked={soundEnabled} 
      onChange={() => setSoundEnabled(!soundEnabled)} 
      className="toggle-checkbox" 
    />
  </label>
      <button onClick={() => {
        navigate('/login');
        window.location.reload();
      }} className="bg-red-600 text-white px-4 py-2 rounded-md ml-60 mb-2 mt-0 pt-2 pl-3">
        Logout
      </button>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-200 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
