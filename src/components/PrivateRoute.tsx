import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading  } = useAuth();
        console.log('User in PrivateRoute:', user);

    if (loading) {
        return <div>Authenticating...</div>;
    }
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
