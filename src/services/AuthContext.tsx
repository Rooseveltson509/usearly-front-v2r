import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, logoutUser } from "@src/services/apiService";
import { refreshToken } from "@src/services/refreshToken";
import {
  getAccessToken,
  isTokenExpired,
  storeTokenInCurrentStorage,
} from "@src/services/tokenStorage";

interface UserProfile {
  id?: string;
  avatar: string;
  type: "user" | "brand";
  role?: "user" | "admin" | "super_admin";
  pseudo?: string;
  email?: string;
  born?: string;
  gender?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: (
    accessToken: string,
    profile: UserProfile,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (
    accessToken: string,
    profile: UserProfile,
    rememberMe = false,
  ) => {
    apiService.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    localStorage.setItem("userType", profile.type);
    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
    }

    try {
      const res = await apiService.get("/user/me");
      const fullProfile: UserProfile = {
        ...res.data,
        type: "user", // 👈 un user reste un user
        role: res.data.role, // 👈 admin ou user
      };

      setUserProfile(fullProfile);
      setIsAuthenticated(true);

      if (fullProfile.type === "user") {
        navigate("/profile");
      } else {
        navigate("/dashboard-brand");
      }
    } catch (err) {
      console.error("❌ Erreur de récupération du profil après login", err);
    }
  };

  const logout = () => {
    logoutUser(); // 👉 vide le cookie côté back

    setIsAuthenticated(false);
    setUserProfile(null);
    delete apiService.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    sessionStorage.removeItem("accessToken");
    navigate("/");
  };

  const fetchUserProfile = async () => {
    try {
      const res = await apiService.get("/user/me");
      setUserProfile({
        ...res.data,
        type: "user",
        role: res.data.role,
      });
    } catch (err) {
      console.error("Erreur profil", err);
      throw err;
    }
  };

  useEffect(() => {
    const tryRestoreSession = async () => {
      const storedUserType =
        localStorage.getItem("userType") || sessionStorage.getItem("userType");
      const accessToken = getAccessToken();

      // 🛡️ Empêche la boucle infinie si rien n’est stocké côté front
      if (!storedUserType && !accessToken) {
        console.warn("🚫 Aucun userType ni accessToken. Session ignorée.");
        setIsLoading(false);
        return;
      }

      let token = accessToken;

      if (!token || isTokenExpired(token)) {
        console.log("🔄 Aucun token valide, tentative de refresh...");
        try {
          token = await refreshToken();
          if (token) {
            storeTokenInCurrentStorage(token);
          } else {
            console.warn("🚫 Aucun token reçu après refresh. Déconnexion...");
            logout(); // ✅ stoppe tout
            return;
          }
        } catch (error) {
          console.error("❌ Erreur lors du refresh token :", error);
          logout(); // ✅ évite la boucle
          return;
        }
      }

      // 👇 Ensuite : profil utilisateur
      try {
        const res = await apiService.get("/user/me");
        const profile: UserProfile = {
          ...res.data,
          type: "user",
          role: res.data.role,
        };

        setUserProfile(profile);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération du profil :", err);
        logout(); // ou handleLogout()
      } finally {
        setIsLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userProfile,
        login,
        logout,
        setUserProfile,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
