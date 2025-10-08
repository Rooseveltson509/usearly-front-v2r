import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.scss";
import Logo from "@src/assets/logo.svg";
import { useAuth } from "@src/services/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "@src/services/notificationService";

const Header = () => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  // 🔹 Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Erreur fetchNotifications:", err);
      setNotifications([]);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("❌ Erreur markAsRead:", err);
    }
  };

  // 🔹 Charger notifs au mount + refresh auto toutes les 10s
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // refresh toutes les 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/"); // retour à l'accueil après déconnexion
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
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

        {/* Partie droite : notifs + utilisateur */}
        <div className="header-right" ref={dropdownRef}>
          {/* 🔔 Notifications */}
          {isAuthenticated && (
            <div
              className="notif-button"
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen((prev) => !prev);
              }}
            >
              <i className="fa fa-bell" />
              {Array.isArray(notifications) &&
                notifications.filter((n) => !n.read).length > 0 && (
                  <span className="notif-count">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}

              {notifOpen && (
                <div className="notif-dropdown">
                  {notifications.length === 0 ? (
                    <p className="empty">Aucune notification</p>
                  ) : (
                    <>
                      {/* 🔹 Limite à 20 notifs max */}
                      {notifications.slice(0, 20).map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${n.read ? "read" : "unread"}`}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.suggestionId) {
                              navigate(`/suggestions/${n.suggestionId}`);
                            } else if (n.coupDeCoeurId) {
                              navigate(`/coupsdecoeur/${n.coupDeCoeurId}`);
                            }
                          }}
                        >
                          {n.message}
                        </div>
                      ))}

                      {/* 🔹 Bouton voir toutes */}
                      {notifications.length > 20 && (
                        <div
                          className="notif-see-all"
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/notifications");
                          }}
                        >
                          Voir toutes les notifications →
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
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
