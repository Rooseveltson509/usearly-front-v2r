import { Navigate } from "react-router-dom";
import { useAuth } from "@src/services/AuthContext";
import type { JSX } from "react";

interface GuestRouteProps {
  children: JSX.Element;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, userProfile } = useAuth();

  if (isAuthenticated) {
    const redirectPath = userProfile?.type === "brand" ? "/dashboard-brand" : "/home";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default GuestRoute;
