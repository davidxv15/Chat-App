import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      console.log('Attempting to establish WebSocket connection...');
      const ws = new WebSocket('ws://localhost:3000');
      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setSocket(null);
        socketRef.current = null;
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 1000);
      };
    };

    if (!socketRef.current) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
