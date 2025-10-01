import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import GuestRoute from "@src/components/context/GuestRoute";
//import Login from "@src/pages/auth/Login/Login";

// ✅ Lazy imports
const Register = lazy(() => import("@src/pages/auth/Register/Register"));
const Login = lazy(() => import("@src/pages/auth/Login/Login"));
const ConfirmAccount = lazy(
  () => import("@src/components/confirm-account/ConfirmAccount"),
);
const RequestResetPassword = lazy(
  () => import("@src/pages/forgot-and-reset-pwd/RequestResetPassword"),
);
const ResetPassword = lazy(
  () => import("@src/pages/forgot-and-reset-pwd/ResetPassword"),
);

export const authRoutes: RouteObject[] = [
  {
    path: "/signup",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/confirm",
    element: (
      <GuestRoute>
        <ConfirmAccount />
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <RequestResetPassword />
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <ResetPassword />
      </GuestRoute>
    ),
  },
];
