import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@src/components/context/ProtectedRoute";
import { Home } from "@src/pages/home";

// ✅ Lazy imports
const UserProfilePage = lazy(() => import("@src/components/user-profile/UserProfilePage"));
const UserAccount = lazy(() => import("@src/pages/UserAccount/UserAccount"));
const NavigateToHome = lazy(() => import("@src/pages/NavigateToHome"));
const NewHome = lazy(() => import("@src/pages/newHome/NewHome"));

export const userRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute allowedTypes={["user", "brand"]}>
        <NavigateToHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedTypes={["user"]}>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute allowedTypes={["user"]}>
        <UserAccount />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: <NewHome />,
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute allowedTypes={["user"]}>
        <Home />
      </ProtectedRoute>
    ),
  },
];
