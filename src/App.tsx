import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Register from "./pages/home/register/Register";
import { AuthProvider } from "./services/AuthContext";
//import ProtectedRoute from "./components/context/ProtectedRoute";
import Login from "./pages/login/Login";
import ConfirmAccount from "./components/confirm-account/ConfirmAccount";
import GuestRoute from "./components/context/GuestRoute";
import UserProfilePage from "./components/user-profile/UserProfilePage";
import UserAccount from "./components/user-account/UserAccount";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/signup" element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
            />
            <Route path="/login" element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
            />
            <Route path="/confirm" element={
              <GuestRoute>
                <ConfirmAccount />
              </GuestRoute>
            }
            />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/account" element={<UserAccount />} />
            {/* <Route path="/confirm" element={<ConfirmAccount />} /> */}

            {/*             <Route
              path="/home"
              element={
                <ProtectedRoute allowedTypes={["user"]}>
                  <HomePage />
                </ProtectedRoute>
              }
            /> */}

            {/*             <Route
              path="/dashboard-brand"
              element={
                <ProtectedRoute allowedTypes={["brand"]}>
                  <DashboardBrand />
                </ProtectedRoute>
              }
            /> */}

            <Route path="*" element={<div>404 - Page non trouvée</div>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
