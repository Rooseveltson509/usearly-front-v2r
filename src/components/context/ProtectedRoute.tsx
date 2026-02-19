import { useAuth } from "@src/services/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ("user" | "brand")[];
  allowedRoles?: ("user" | "admin" | "super_admin")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedTypes,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <div>Chargement…</div>;
  }

  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/home" replace />;
  }

  // ✅ vérification du TYPE
  if (allowedTypes && !allowedTypes.includes(userProfile.type)) {
    return <Navigate to="/" replace />;
  }

  // ✅ vérification du ROLE
  if (allowedRoles && !allowedRoles.includes(userProfile.role ?? "user")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
