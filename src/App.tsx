import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Register from "./pages/auth/Register/Register";
import { AuthProvider } from "./services/AuthContext";
import Login from "./pages/auth/Login/Login";
import ConfirmAccount from "./components/confirm-account/ConfirmAccount";
import GuestRoute from "./components/context/GuestRoute";
import UserProfilePage from "./components/user-profile/UserProfilePage";
import UserAccount from "./pages/UserAccount/UserAccount";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { Home } from "./pages/home";
import RequestResetPassword from "./pages/forgot-and-reset-pwd/RequestResetPassword";
import ResetPassword from "./pages/forgot-and-reset-pwd/ResetPassword";
import NavigateToHome from "./pages/NavigateToHome";
import NewHome from "./pages/newHome/NewHome";
import CheckUser from "./pages/auth/CheckUser";
import SuggestionDetail from "./components/suggestion-detail/SuggestionDetail";
import PublicSuggestionPage from "./components/shared/public/PublicSuggestionPage";
import CoupDeCoeurDetail from "./components/shared/share-modal/coupdecoeur-detail/CoupDeCoeurDetail";
import ReportDetail from "./pages/home/report-detail/ReportDetail";
import NotificationsPage from "./components/notification/NotificationsPage";
import UsearlyDraw from "./components/background/Usearly";
import AboutPage from "./pages/about/AboutPage";
import AboutClassicPage from "./pages/aboutClassic/AboutClassicPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import AdminBrandsPage from "./pages/admin/brands/AdminBrandsPage";
import DashboardUser from "./pages/dashboardUser/DashboardUser";

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
                  <>
                    <Register />
                    <UsearlyDraw />
                  </>
                </GuestRoute>
              }
            />
            <Route
              path="/lookup"
              element={
                <GuestRoute>
                  <>
                    <CheckUser />
                    <UsearlyDraw />
                  </>
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
              path="/admin/brands"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <AdminBrandsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/share/:id/public"
              element={
                <GuestRoute>
                  <PublicSuggestionPage />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <>
                    <Login />
                    <UsearlyDraw />
                  </>
                </GuestRoute>
              }
            />
            {/* about */}
            <Route path="/about" element={<AboutClassicPage />} />
            <Route path="/about-legacy" element={<AboutPage />} />
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
              path="/suggestions/:id"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <SuggestionDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/description/:id"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <ReportDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coupsdecoeur/:id"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <CoupDeCoeurDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <NotificationsPage />
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
            <Route
              path="/dashboard-user"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <DashboardUser />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
