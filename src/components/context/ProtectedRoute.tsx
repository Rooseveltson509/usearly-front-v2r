import { useAuth } from "@src/services/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ("user" | "brand")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedTypes }) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <div>Chargement…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && userProfile && !allowedTypes.includes(userProfile.type)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;