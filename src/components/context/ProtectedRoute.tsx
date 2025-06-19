import { useAuth } from "@src/services/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ("user" | "brand")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedTypes }) => {
  const { isAuthenticated, userProfile } = useAuth();

  // 🔐 Si non authentifié → redirection immédiate
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔁 Si authentifié mais profil non encore chargé → chargement
  if (isAuthenticated && !userProfile) {
    return <div>Chargement…</div>;
  }

  // 🚫 Si le type d'utilisateur est non autorisé
  if (allowedTypes && userProfile && !allowedTypes.includes(userProfile.type)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
