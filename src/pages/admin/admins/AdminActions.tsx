import { useAuth } from "@src/services/AuthContext";
import type { AdminUser } from "./AdminsPage";

interface Props {
  admin: AdminUser;
  onRoleChange: (id: string, role: "user" | "admin") => void;
  onRequestDelete: (admin: AdminUser) => void;
}

const AdminActions = ({ admin, onRoleChange, onRequestDelete }: Props) => {
  const { userProfile } = useAuth();

  const canDelete =
    userProfile?.role === "super_admin" &&
    admin.role !== "super_admin" &&
    admin.id !== userProfile.id;

  // ⚠️ Le backend interdit toute action sur super_admin
  if (admin.role === "super_admin") {
    return (
      <span
        className="admin-actions-disabled"
        title="Actions désactivées pour le super admin"
      >
        —
      </span>
    );
  }

  return (
    <div className="admin-actions">
      <select
        value={admin.role}
        onChange={(e) =>
          onRoleChange(admin.id, e.target.value as "user" | "admin")
        }
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      {canDelete && (
        <button
          className="admin-delete-btn"
          onClick={() => onRequestDelete(admin)}
        >
          Supprimer
        </button>
      )}
    </div>
  );
};

export default AdminActions;
