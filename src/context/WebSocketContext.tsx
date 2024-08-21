import React, { createContext, useContext, useState } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  initializeWebSocket: (token: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const initializeWebSocket = (token: string) => {
    if (socket) {
      socket.close(); // closes any existing connection before opening new one
    }

    console.log('Attempting to establish WebSocket connection...');
    const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
      // or set a timeout
      setTimeout(() => initializeWebSocket(token), 1000);
    };
    setSocket(ws);
  };

  return (
    <WebSocketContext.Provider value={{ socket, initializeWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
