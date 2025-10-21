import React, { useEffect, useState, useRef, useCallback } from "react";
import "./NotificationsPage.scss";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@src/services/notificationService";
import NotificationCardRenderer from "./NotificationCardRenderer";
import Avatar from "../shared/Avatar";
import PurpleBanner from "../../pages/home/components/purpleBanner/PurpleBanner";
import UserStatsCard from "../user-profile/UserStatsCard";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  suggestionId?: string;
  coupDeCoeurId?: string;
  descriptionId?: string;
  sender?: { pseudo: string; avatar: string };
  suggestion?: any;
  coupDeCoeur?: any;
  description?: any;
}

const LIMIT = 10;

const sortNotifications = (list: Notification[]) =>
  [...list].sort((a, b) => {
    if (a.read === b.read) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.read ? 1 : -1;
  });

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "suggestion" | "coupdecoeur" | "report"
  >("all");
  const [loading, setLoading] = useState(false);
  const [openNotifId, setOpenNotifId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [shakeBell, setShakeBell] = useState(false);
  const prevUnreadCountRef = useRef(0);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 📌 Scroll infini : observe le dernier élément */
  const lastNotifRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  /** 🔔 Détecte nouvelles notifications pour shake */
  useEffect(() => {
    const currentUnread = notifications.filter((n) => !n.read).length;
    if (currentUnread > prevUnreadCountRef.current) {
      setShakeBell(true);
      setTimeout(() => setShakeBell(false), 800);
    }
    prevUnreadCountRef.current = currentUnread;
  }, [notifications]);

  /** 📬 Récupération des notifications */
  const fetchNotifications = useCallback(
    async (opts?: { reset?: boolean; refresh?: boolean }) => {
      try {
        setLoading(true);
        const currentPage = opts?.reset || opts?.refresh ? 1 : page;
        const res = await getAllNotifications(currentPage, LIMIT, filter);
        const newNotifs = res.notifications || [];

        setNotifications((prev) => {
          // ✅ Cas 1 : reset total (changement de filtre)
          if (opts?.reset) {
            return sortNotifications(newNotifs);
          }

          // ✅ Cas 2 : refresh auto (toutes les 15 s)
          if (opts?.refresh) {
            // ➜ on ajoute uniquement les nouvelles non présentes
            const merged = [...newNotifs, ...prev].filter(
              (n, i, arr) => arr.findIndex((x) => x.id === n.id) === i,
            );
            // ⚠️ Pas de tri ici pour éviter de déplacer les notifs déjà affichées
            return merged;
          }

          // ✅ Cas 3 : pagination
          const merged = [...prev, ...newNotifs].filter(
            (n, i, arr) => arr.findIndex((x) => x.id === n.id) === i,
          );
          return sortNotifications(merged);
        });

        setHasMore(currentPage < res.totalPages);
      } catch (err) {
        console.error("❌ Erreur fetchNotifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, filter],
  );

  /** 🧭 Changement de filtre → reset complet */
  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
    fetchNotifications({ reset: true });
  }, [filter]);

  /** 🚀 Chargement initial et pagination */
  useEffect(() => {
    fetchNotifications();
  }, [page]);

  /** ⏱️ Refresh auto toutes les 15s (page 1 uniquement, filtre actif) */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications({ refresh: true });
    }, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  /** ✅ Marquer comme lue */
  const handleMarkAsRead = async (notifId: string) => {
    try {
      await markNotificationAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("⚠️ Erreur markAsRead:", err);
    }
  };

  /** 🗑️ Supprimer une notification */
  const handleDelete = async (notifId: string) => {
    try {
      await deleteNotification(notifId);
      const notifEl = document.getElementById(`notif-${notifId}`);
      if (notifEl) {
        notifEl.classList.add("fade-out");
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notifId));
        }, 300);
      }
    } catch (err) {
      console.error("❌ Erreur deleteNotification:", err);
    }
  };

  /** 🎯 Clic sur une notification */
  const handleClick = async (notif: Notification) => {
    const willOpen = openNotifId !== notif.id;
    setOpenNotifId(willOpen ? notif.id : null);
    if (!notif.read) await handleMarkAsRead(notif.id);
  };

  return (
    <>
      <PurpleBanner navOn={false} />
      <div className="notifications-layout">
        {/* 🧑‍💼 Carte utilisateur à gauche */}
        <aside className="notifications-sidebar">
          <UserStatsCard />
        </aside>

        {/* 📩 Contenu notifications (inchangé) */}
        <section className="notifications-main">
          <div className="notifications-page">
            {/* === Filtres === */}
            <div className="notif-filters">
              {["all", "suggestion", "coupdecoeur", "report"].map((t) => (
                <button
                  key={t}
                  className={filter === t ? "active" : ""}
                  onClick={() => setFilter(t as any)}
                >
                  {t === "all"
                    ? "Toutes"
                    : t === "report"
                      ? "Signalements"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* === Bandeau supérieur (inchangé) === */}
            <div className="notifications-banner-container">
              <div className="notif-banner-content">
                <div className="notif-header-text">
                  <h2>🔔 Mes notifications</h2>
                  <p className="notif-subtitle">
                    Restez informé de vos interactions récentes
                  </p>
                </div>
                <div className="notif-header-illustration">
                  {/* ton SVG complet intact */}
                  <svg
                    className={`notif-bell ${shakeBell ? "shake" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="153"
                    height="169"
                    viewBox="0 0 153 169"
                    fill="none"
                  >
                    <path
                      d="M52.4264 145.93C53.084 148.863 53.3 151.344 54.4855 154.195C62.0162 172.352 87.253 174.09 97.0395 157.051C99.1418 153.394 99.9049 150.25 100.462 146.074L141.413 145.748C151.79 143.319 156.45 131.085 150.134 122.378C145.123 115.466 135.288 117.146 132.308 106.126C129.965 97.4772 132.284 80.1743 131.708 70.2486C130.306 46.1253 114.602 26.197 91.5919 19.1703C91.1791 15.7385 91.6927 13.0603 90.5023 9.7005C86.5426 -1.46837 71.174 -3.47944 64.2816 6.22073C61.3538 10.3389 61.6562 14.361 61.3922 19.1703C38.3777 26.1778 22.6731 46.1733 21.2764 70.2486C20.6621 80.8127 22.2172 92.5239 21.3148 102.925C20.0189 117.847 5.57186 115.078 1.27134 125.119C-2.34762 133.561 2.04409 142.978 10.8371 145.527L52.4264 145.93Z"
                      fill="white"
                    />
                    <path
                      d="M52.4264 145.93L10.8371 145.527C2.04409 142.978 -2.34762 133.561 1.27134 125.119C5.57186 115.078 20.0189 117.847 21.3148 102.925C22.2172 92.5239 20.6621 80.8127 21.2764 70.2486C22.6779 46.1733 38.3825 26.1778 61.3922 19.1703C61.6562 14.361 61.3538 10.3389 64.2816 6.22073C71.174 -3.47944 86.5378 -1.46837 90.5023 9.7005C91.6927 13.0603 91.1791 15.7385 91.5919 19.1703C114.602 26.1922 130.306 46.1253 131.708 70.2486C132.284 80.1743 129.965 97.4772 132.308 106.126C135.293 117.146 145.123 115.466 150.134 122.378C156.445 131.085 151.79 143.319 141.413 145.748L100.462 146.074C99.9049 150.25 99.1418 153.394 97.0395 157.051C87.253 174.09 62.0162 172.352 54.4855 154.195C53.3048 151.344 53.0888 148.863 52.4264 145.93ZM74.4378 8.2222C70.7132 8.99495 68.683 13.8042 69.5133 17.2552L83.2212 17.5096C84.6899 11.7692 80.6246 6.94068 74.4378 8.227V8.2222ZM74.9514 25.0499C52.3832 25.7843 31.519 44.1143 29.5175 66.9656C27.996 84.3405 35.2099 110.518 18.5742 121.778C16.0208 123.506 11.2499 124.807 9.5652 126.688C5.39907 131.353 9.21482 138.313 15.2816 138.198H137.232C142.843 138.351 146.841 133.484 144.36 128.152C142.843 124.888 139.834 124.931 137.122 123.391C113.867 110.177 128.449 79.0128 121.268 57.1694C114.894 37.7835 95.3596 24.3875 74.9562 25.0499H74.9514ZM92.331 145.863H60.6531C62.2658 165.81 90.6895 165.858 92.331 145.863Z"
                      fill="black"
                    />
                    <path
                      d="M74.9514 25.0499C95.3549 24.3875 114.894 37.7787 121.264 57.1694C128.444 79.0128 113.858 110.177 137.117 123.391C139.824 124.931 142.833 124.888 144.355 128.152C146.836 133.484 142.838 138.351 137.227 138.203H15.2769C9.21486 138.313 5.39431 131.353 9.56044 126.688C11.2403 124.807 16.016 123.506 18.5695 121.778C35.2052 110.523 27.9912 84.3452 29.5127 66.9656C31.5142 44.1143 52.3833 25.7842 74.9466 25.0499H74.9514Z"
                      fill="white"
                    />
                    <path
                      d="M92.3309 145.862C90.6894 165.858 62.2656 165.81 60.653 145.862H92.3309Z"
                      fill="white"
                    />
                    <path
                      d="M74.4377 8.22186C80.6245 6.94034 84.6898 11.764 83.2211 17.5045L69.5132 17.2501C68.6829 13.7991 70.7132 8.98981 74.4377 8.21706V8.22186Z"
                      fill="white"
                    />
                  </svg>

                  <span className="notif-bubble">Du nouveau</span>

                  {notifications.some((n) => !n.read) && (
                    <div className="notif-count">
                      {notifications.filter((n) => !n.read).length}
                    </div>
                  )}
                </div>
              </div>

              {loading && notifications.length === 0 && (
                <div className="notif-inline-loader">
                  <div className="spinner"></div>
                  <p>Chargement des notifications...</p>
                </div>
              )}
            </div>

            {/* === Liste === */}
            <div className="notif-list">
              {notifications.map((notif, index) => {
                const isLast = index === notifications.length - 1;
                const isOpen = openNotifId === notif.id;

                return (
                  <div
                    id={`notif-${notif.id}`}
                    key={notif.id}
                    ref={isLast ? lastNotifRef : null}
                    className={`notif-item ${notif.read ? "read" : "unread"} ${isOpen ? "open" : ""}`}
                  >
                    <div
                      className="notif-header"
                      onClick={() => handleClick(notif)}
                    >
                      <Avatar
                        avatar={notif.sender?.avatar ?? null}
                        type="user"
                        pseudo={notif.sender?.pseudo || ""}
                        className="notif-avatar"
                      />

                      <div className="notif-info">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">
                          {formatDistanceToNowStrict(
                            new Date(notif.createdAt),
                            {
                              locale: fr,
                            },
                          )}{" "}
                          ago
                        </span>
                      </div>

                      {!notif.read && (
                        <span className="notif-badge">Nouveau</span>
                      )}

                      <div
                        className="notif-menu-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === notif.id ? null : notif.id,
                          );
                        }}
                      >
                        ⋮
                        {menuOpenId === notif.id && (
                          <div ref={menuRef} className="notif-menu">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notif.id);
                                setMenuOpenId(null);
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`notif-card-wrapper ${isOpen ? "expanded" : "collapsed"}`}
                    >
                      <NotificationCardRenderer
                        notif={notif}
                        isOpen={isOpen}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {!loading && notifications.length === 0 && (
              <p className="no-notif">Aucune notification.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default NotificationsPage;
