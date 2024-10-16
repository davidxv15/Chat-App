import React from "react";
import ReactDOM from "react-dom/client";
import { WebSocketProvider } from "./context/WebSocketContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
        <WebSocketProvider>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="/home" />} />
              <Route path="/home" element={
              <PrivateRoute><Home /></PrivateRoute>
              } />
              <Route path="/chat/:roomName" element={
              <PrivateRoute><ChatRoom /></PrivateRoute>
              } />
              <Route path="login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
      </AuthProvider>
        </WebSocketProvider>
    </Router>
  </React.StrictMode>
);
