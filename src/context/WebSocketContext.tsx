import React, { createContext, useContext, useEffect, useRef } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      console.log('Attempting to establish WebSocket connection...');
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
        console.log('WebSocket connection established');
        socket.current = ws;
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        socket.current = null;
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 1000);
      };

      setSocket(ws);
    };

    if (!socket.current) {
      connectWebSocket();
    }

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
