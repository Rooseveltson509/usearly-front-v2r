import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@src/components/shared/Avatar";
import {
  deleteUser,
  getAdminUserDetail,
  toggleUserSuspension,
} from "@src/services/adminService";
import "./AdminUserDetail.scss";

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getAdminUserDetail(userId);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <p>Chargement…</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  const handleToggleSuspension = async () => {
    await toggleUserSuspension(user.id);
    await fetchUser(); // recharge les infos
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?",
    );
    if (!confirmed) return;

    await deleteUser(user.id);
    navigate("/admin/users");
  };

  return (
    <div className="admin-user-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="user-header">
        <Avatar avatar={user.avatar} pseudo={user.pseudo} sizeHW={70} />
        <div className="user-meta">
          <h2>{user.pseudo}</h2>
          <p>{user.email}</p>
          <span className="statut">
            <span className="statut">
              {user.expiredAt ? "🟡 Suspendu" : "🟢 Actif"}
            </span>
          </span>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <strong>{user.totalFeedbacks}</strong>
          <span>Feedbacks</span>
        </div>
        <div className="stat-card">
          <strong>{user.brandsCount}</strong>
          <span>Marques</span>
        </div>
      </div>

      <div className="admin-user-actions">
        <button
          type="button"
          className={`admin-btn ${
            user.expiredAt ? "admin-btn-success" : "admin-btn-warning"
          }`}
          onClick={handleToggleSuspension}
        >
          {user.expiredAt
            ? "Réactiver l’utilisateur"
            : "Suspendre l’utilisateur"}
        </button>

        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={handleDeleteUser}
        >
          Supprimer l’utilisateur
        </button>
      </div>
    </div>
  );
};

export default AdminUserDetail;
