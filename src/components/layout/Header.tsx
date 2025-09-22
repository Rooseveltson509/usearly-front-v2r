import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.scss";
import Logo from "@src/assets/logo.svg";
import { useAuth } from "@src/services/AuthContext";

const Header = () => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/"); // retour à l'accueil après déconnexion
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={Logo} alt="Usearly Logo" />
          <span className="logo-text">Usearly</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/home" className="link">
            Accueil
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/feedback" className="link">
              Feedbacks
            </NavLink>
          )}
          <NavLink to="/marque" className="link">
            Marques
          </NavLink>
          <NavLink to="/impact" className="link">
            Impact
          </NavLink>
        </nav>

        <div className="header-right" ref={dropdownRef}>
          {/* 🔔 Notification */}
          {isAuthenticated && (
            <div className="notif-button">
              <i className="fa fa-bell" />
            </div>
          )}

          {/* 👤 Menu utilisateur */}
          <div
            className={`user-toggle ${userMenuOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleUserMenu();
            }}
          >
            <i className="far fa-user" />
            <span className="header-user">
              {isAuthenticated
                ? `Bonjour ${userProfile?.pseudo || "Utilisateur"}`
                : "Mon compte"}
            </span>
            <i
              className={`fa fa-chevron-down ${userMenuOpen ? "rotated" : ""}`}
            />
          </div>

          {userMenuOpen && (
            <div className="user-dropdown-menu">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mon profil
                  </NavLink>
                  <NavLink
                    to="/account"
                    className="menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mon compte
                  </NavLink>
                  <span className="menu-item" onClick={handleLogout}>
                    Se déconnecter
                  </span>
                </>
              ) : (
                <>
                  <NavLink
                    to="/signup"
                    className="menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    S'inscrire
                  </NavLink>
                  <NavLink
                    to="/lookup"
                    className="menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Se connecter
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
