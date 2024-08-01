import React, { createContext, useContext, useEffect, useRef } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socket.current) {
      const ws = new WebSocket('ws://localhost:3000');
      socket.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        socket.current = null;
      };
    }

    return () => {
      socket.current?.close();
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
