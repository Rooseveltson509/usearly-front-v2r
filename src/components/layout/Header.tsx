import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.scss";
import Logo from "@src/assets/logo.svg";
import { useAuth } from "@src/services/AuthContext";
import { getNotifications } from "@src/services/notificationService";
import Buttons from "@src/components/buttons/Buttons";

const HEADER_HIDE_SCROLL_Y = 30;
const HEADER_SHOW_TOP_SCROLL_Y = 2;
const getGlobalScrollY = () =>
  Math.max(window.scrollY, document.documentElement.scrollTop, 0);

interface HeaderProps {
  heroMode?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ heroMode = false, children }) => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [shakeBell, setShakeBell] = useState(false);
  const prevUnreadCountRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const hasCrossedHideThresholdRef = useRef(false);
  const hiddenRef = useRef(false);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    const getScrollY = () =>
      Math.max(getGlobalScrollY(), mainElement?.scrollTop ?? 0);

    const updateHeaderVisibility = () => {
      const currentScrollY = getScrollY();
      const isAtTop = currentScrollY <= HEADER_SHOW_TOP_SCROLL_Y;

      if (isAtTop) {
        hasCrossedHideThresholdRef.current = false;
      } else if (currentScrollY > HEADER_HIDE_SCROLL_Y) {
        hasCrossedHideThresholdRef.current = true;
      }

      const nextHiddenState =
        !mobileMenuOpen && hasCrossedHideThresholdRef.current;

      if (nextHiddenState !== hiddenRef.current) {
        hiddenRef.current = nextHiddenState;
        setIsHeaderHidden(nextHiddenState);
      }

      tickingRef.current = false;
      rafIdRef.current = null;
    };

    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(updateHeaderVisibility);
    };

    hasCrossedHideThresholdRef.current = false;
    hiddenRef.current = false;

    window.addEventListener("scroll", onScroll, { passive: true });
    mainElement?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      mainElement?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [mobileMenuOpen, location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`header component-header-container ${heroMode ? "hero-mode" : ""} ${
        isHeaderHidden ? "is-hidden" : ""
      }`}
    >
      <div className="header-container">
        {/* ================= LOGO ================= */}
        <div className="logo" onClick={() => navigate("/home")}>
          <img src={Logo} alt="Usearly Logo" />
          <span className="logo-text">Usearly</span>
        </div>

        {/* ================= BURGER (Mobile only via CSS) ================= */}
        <div
          className={`burger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ================= NAVIGATION / DRAWER ================= */}
        <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          {/* ======= NAV LINKS ======= */}
          <NavLink
            to="/home"
            className="link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Accueil
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/feedback"
              className="link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Feedbacks
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/profile"
              className="link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mon profil
            </NavLink>
          )}

          <NavLink
            to="/about"
            className="link"
            onClick={() => setMobileMenuOpen(false)}
          >
            A propos
          </NavLink>

          {/* ================= MOBILE ACCOUNT SECTION ================= */}
          <div className="mobile-divider" />

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div
                className="mobile-item"
                onClick={() => {
                  navigate("/notifications");
                  setMobileMenuOpen(false);
                }}
              >
                <i className="fa fa-bell" />
                Notifications
                {notifications.some((n) => !n.read) && (
                  <span className="mobile-badge">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </div>

              {/* Account */}
              <div
                className="mobile-item"
                onClick={() => {
                  navigate("/account");
                  setMobileMenuOpen(false);
                }}
              >
                <i className="far fa-user" />
                Mon compte
              </div>

              {/* ADMIN */}
              {(userProfile?.role === "admin" ||
                userProfile?.role === "super_admin") && (
                <div className="mobile-subsection">
                  <span className="mobile-subtitle">Administration</span>

                  <div
                    className="mobile-item"
                    onClick={() => {
                      navigate("/admin/users");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Gérer les utilisateurs
                  </div>

                  {userProfile?.role === "super_admin" && (
                    <div
                      className="mobile-item"
                      onClick={() => {
                        navigate("/admin/admins");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Gérer les admins
                    </div>
                  )}

                  <div
                    className="mobile-item"
                    onClick={() => {
                      navigate("/admin/brands");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Gérer les marques
                  </div>
                </div>
              )}

              {/* Logout */}
              <div
                className="mobile-item danger"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Se déconnecter
              </div>
            </>
          ) : (
            <>
              <div
                className="mobile-item"
                onClick={() => {
                  navigate("/lookup");
                  setMobileMenuOpen(false);
                }}
              >
                Connecter
              </div>

              <div
                className="mobile-item"
                onClick={() => {
                  navigate("/lookup");
                  setMobileMenuOpen(false);
                }}
              >
                S'inscrire
              </div>
            </>
          )}

          {/* ================= LOGO BOTTOM ================= */}
          <div
            className="mobile-logo"
            onClick={() => {
              navigate("/home");
              setMobileMenuOpen(false);
            }}
          >
            <img src={Logo} alt="Usearly Logo" />
            <span>Usearly</span>
          </div>
        </nav>

        {/* ================= DESKTOP RIGHT SIDE ================= */}
        <div className="header-right" ref={dropdownRef}>
          {isAuthenticated && (
            <div
              className="notif-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/notifications");
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

          {isAuthenticated ? (
            <div
              className={`user-toggle ${userMenuOpen ? "open" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen((prev) => !prev);
              }}
            >
              <i className="far fa-user" />
              <span className="header-user">
                Bonjour {userProfile?.pseudo || "Utilisateur"}
              </span>
              <i
                className={`fa fa-chevron-down ${
                  userMenuOpen ? "rotated" : ""
                }`}
              />
            </div>
          ) : (
            <>
              <Buttons
                onClick={() => navigate("/lookup")}
                addClassName="header-nav-button login-button"
                title="Connecter"
              />
              <Buttons
                onClick={() => navigate("/lookup")}
                addClassName="header-nav-button signup-button"
                title="S'inscrire"
              />
            </>
          )}

          {userMenuOpen && (
            <div className="user-dropdown-menu">
              <NavLink
                to="/account"
                className="menu-item"
                onClick={() => setUserMenuOpen(false)}
              >
                Mon compte
              </NavLink>

              {(userProfile?.role === "admin" ||
                userProfile?.role === "super_admin") && (
                <div className="menu-item submenu">
                  <span className="submenu-label">
                    Administration <i className="fa fa-chevron-right" />
                  </span>
                  <div className="submenu-panel">
                    <NavLink
                      to="/admin/users"
                      className="submenu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Gérer les utilisateurs
                    </NavLink>

                    {userProfile?.role === "super_admin" && (
                      <NavLink
                        to="/admin/admins"
                        className="submenu-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Gérer les admins
                      </NavLink>
                    )}

                    <NavLink
                      to="/admin/brands"
                      className="submenu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Gérer les marques
                    </NavLink>
                  </div>
                </div>
              )}

              <span className="menu-item danger" onClick={handleLogout}>
                Se déconnecter
              </span>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {heroMode && <div className="header-hero-slot">{children}</div>}
    </header>
  );
};

export default Header;
