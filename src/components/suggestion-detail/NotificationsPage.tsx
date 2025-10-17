/* import { useEffect, useState } from "react";
import {
  getAllNotifications,
  markNotificationAsRead,
} from "@src/services/notificationService";
import { useNavigate } from "react-router-dom";
import "./NotificationsPage.scss";

interface Notification {
  id: string;
  message: string;
  type: string;
  suggestionId?: string;
  read: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllNotifications(page, 10); // 10 notifs par page
      setNotifications(data.notifications);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("❌ Erreur fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleClick = async (notif: Notification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
    }
    if (notif.suggestionId) {
      navigate(`/suggestions/${notif.suggestionId}`);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="notifications-page">
      <h2>Mes notifications</h2>

      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-card ${n.read ? "read" : "unread"}`}
              onClick={() => handleClick(n)}
            >
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
 */
