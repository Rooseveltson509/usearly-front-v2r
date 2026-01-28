import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@src/components/shared/Avatar";
import {
  deleteUser,
  getAdminUserDetail,
  toggleUserSuspension,
  updateAdminRole,
} from "@src/services/adminService";
import "./AdminUserDetail.scss";
import { useAuth } from "@src/services/AuthContext";
import Toast from "@src/components/ommons/Toast";

const AdminUserDetail = () => {
  const { userProfile } = useAuth();
  const isSuperAdmin = userProfile?.role === "super_admin";
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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
    try {
      await toggleUserSuspension(user.id);
      await fetchUser();

      setToast({
        message: user.expiredAt
          ? "Utilisateur réactivé"
          : "Utilisateur suspendu",
        type: "info",
      });
    } catch {
      setToast({
        message: "Erreur lors de la modification du statut",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      setToast({
        message: "Utilisateur supprimé avec succès",
        type: "success",
      });
      navigate("/admin/users");
    } catch (err: any) {
      setToast({
        message:
          err?.response?.data?.message ||
          "Erreur lors de la suppression de l’utilisateur",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
    }
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

        {isSuperAdmin && (
          <div className="admin-role-section">
            <label>Rôle</label>
            <select
              value={user.role}
              onChange={async (e) => {
                try {
                  await updateAdminRole(
                    user.id,
                    e.target.value as "user" | "admin",
                  );
                  await fetchUser();

                  setToast({
                    message: "Rôle mis à jour avec succès",
                    type: "success",
                  });
                } catch {
                  setToast({
                    message: "Erreur lors du changement de rôle",
                    type: "error",
                  });
                }
              }}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        )}
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
      {isSuperAdmin && (
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
            onClick={() => setShowDeleteModal(true)}
          >
            Supprimer l’utilisateur
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Supprimer l’utilisateur</h3>
            <p>
              Voulez-vous vraiment supprimer <strong>{user.pseudo}</strong> ?
              <br />
              Cette action est irréversible.
            </p>

            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="danger" onClick={handleDeleteUser}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminUserDetail;
