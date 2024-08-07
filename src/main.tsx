import React from "react";
import ReactDOM from "react-dom/client";
import { WebSocketProvider } from "./context/WebSocketContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import { AuthProvider } from './context/AuthContext';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="chat" element={<ChatRoom />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </WebSocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
