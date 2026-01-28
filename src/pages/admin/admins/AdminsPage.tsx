import { useEffect, useState } from "react";
import AdminsTable from "./AdminsTable";
import {
  createAdmin,
  deleteUser,
  getAdmins,
  updateAdminRole,
} from "@src/services/adminService";
import CreateAdminForm from "./CreateAdminForm";
import "./AdminsPage.scss";
import Toast from "@src/components/ommons/Toast";

export interface AdminUser {
  id: string;
  pseudo: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: string;
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      await deleteUser(adminToDelete.id);
      setAdminToDelete(null);
      await fetchAdmins();

      setToast({
        message: "Administrateur supprimé avec succès",
        type: "success",
      });
    } catch {
      setAdminToDelete(null);
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleCreateAdmin = async (payload: any) => {
    try {
      await createAdmin(payload);
      await fetchAdmins();

      setToast({
        message: "Administrateur créé avec succès",
        type: "success",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Erreur lors de la création de l’administrateur";

      setToast({
        message,
        type: "error",
      });
    }
  };

  const handleRoleChange = async (userId: string, role: "user" | "admin") => {
    try {
      await updateAdminRole(userId, role);
      await fetchAdmins();

      setToast({
        message: "Rôle mis à jour avec succès",
        type: "success",
      });
    } catch (err: any) {
      setToast({
        message:
          err?.response?.data?.message ||
          "Erreur lors de la modification du rôle",
        type: "error",
      });
    }
  };

  return (
    <div className="admins-page">
      <h1>Administrateurs</h1>

      <CreateAdminForm onSubmit={handleCreateAdmin} />

      <AdminsTable
        admins={admins}
        loading={loading}
        onRoleChange={handleRoleChange}
        onRequestDelete={setAdminToDelete}
      />

      {adminToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Supprimer l’administrateur</h3>
            <p>
              Voulez-vous vraiment supprimer{" "}
              <strong>{adminToDelete.pseudo}</strong> ?
              <br />
              Cette action est irréversible.
            </p>

            <div className="modal-actions">
              <button onClick={() => setAdminToDelete(null)}>Annuler</button>
              <button className="danger" onClick={handleConfirmDelete}>
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

export default AdminsPage;
