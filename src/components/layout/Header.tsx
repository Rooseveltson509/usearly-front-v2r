import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.scss";
import Logo from "@src/assets/logo.svg";
import { useAuth } from "@src/services/AuthContext";
import { getNotifications } from "@src/services/notificationService";

const Header = () => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [shakeBell, setShakeBell] = useState(false);
  const prevUnreadCountRef = useRef(0);

  // 🔹 Fermer le menu utilisateur quand on clique ailleurs
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

  // 🔹 Récupérer les notifications (petite liste pour le compteur)
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : [];

      // ✅ Détection d'une nouvelle notification non lue → animation cloche
      const prevUnread = prevUnreadCountRef.current;
      const currentUnread = list.filter((n) => !n.read).length;

      if (currentUnread > prevUnread) {
        setShakeBell(true);
        setTimeout(() => setShakeBell(false), 700);
      }

      prevUnreadCountRef.current = currentUnread;
      setNotifications(list);
    } catch (err) {
      console.error("❌ Erreur fetchNotifications:", err);
      setNotifications([]);
    }
  };

  // 🔹 Auto-refresh du compteur toutes les 15 secondes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/home")}>
          <img src={Logo} alt="Usearly Logo" />
          <span className="logo-text">Usearly</span>
        </div>

        {/* Navigation */}
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

        {/* Droite : notifications + profil */}
        <div className="header-right" ref={dropdownRef}>
          {/* 🔔 Notifications */}
          {isAuthenticated && (
            <div
              className="notif-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/notifications"); // 🔗 redirection directe
              }}
            >
              <i className={`fa fa-bell ${shakeBell ? "shake" : ""}`} />
              {notifications.some((n) => !n.read) && (
                <span className="notif-count">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>
          )}

          {/* 👤 Menu utilisateur */}
          <div
            className={`user-toggle ${userMenuOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((prev) => !prev);
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
