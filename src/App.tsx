import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Register from "./pages/home/register/Register";
import { AuthProvider } from "./services/AuthContext";
import Login from "./pages/login/Login";
import ConfirmAccount from "./components/confirm-account/ConfirmAccount";
import GuestRoute from "./components/context/GuestRoute";
import UserProfilePage from "./components/user-profile/UserProfilePage";
import UserAccount from "./components/user-account/UserAccount";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { Home } from "./pages/home";
import RequestResetPassword from "./pages/forgot-and-reset-pwd/RequestResetPassword";
import ResetPassword from "./pages/forgot-and-reset-pwd/ResetPassword";
import NavigateToHome from "./pages/NavigateToHome";
import NewHome from "./pages/newHome/NewHome";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute allowedTypes={["user", "brand"]}>
                  <NavigateToHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/confirm"
              element={
                <GuestRoute>
                  <ConfirmAccount />
                </GuestRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <UserAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <RequestResetPassword />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <GuestRoute>
                  <ResetPassword />
                </GuestRoute>
              }
            />
            <Route path="/home" element={<NewHome />} />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 - Page non trouvée</div>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
