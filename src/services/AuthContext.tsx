import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@src/services/apiService";

interface UserProfile {
  id?:string;
  avatar: string;
  type: "user" | "brand";
  pseudo?: string;
  email?: string;
  born?: string;
  gender?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (accessToken: string, profile: UserProfile, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const login = async (
    accessToken: string,
    profile: UserProfile,
    rememberMe = false
  ) => {
    apiService.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    localStorage.setItem("userType", profile.type);
    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
    }

    // 🔄 On récupère le vrai profil (avec pseudo, avatar, etc.)
    await fetchUserProfile();

    setIsAuthenticated(true);

    if (profile.type === "user") {
      navigate("/home");
    } else {
      navigate("/dashboard-brand");
    }
  };

  const logout = () => {
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
      setUserProfile({ ...res.data, type: res.data.role || "user" });
    } catch (err) {
      console.error("Erreur profil", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const type = localStorage.getItem("userType");

    if (token && type) {
      apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUserProfile({ avatar: "", type: type as "user" | "brand" });

      // 🔁 Important : fetch infos complètes
      fetchUserProfile();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userProfile, login, logout, setUserProfile, fetchUserProfile }}
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
