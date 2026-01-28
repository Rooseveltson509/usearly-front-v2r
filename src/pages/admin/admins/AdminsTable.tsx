import AdminRoleBadge from "./AdminRoleBadge";
import AdminActions from "./AdminActions";
import type { AdminUser } from "./AdminsPage";

interface Props {
  admins: AdminUser[];
  loading: boolean;
  onRoleChange: (id: string, role: "user" | "admin") => void;
  onRequestDelete: (admin: AdminUser) => void;
}

const AdminsTable = ({
  admins,
  loading,
  onRoleChange,
  onRequestDelete,
}: Props) => {
  if (loading) return <p>Chargement…</p>;
  if (admins.length === 0) return <p>Aucun administrateur.</p>;

  return (
    <table className="admins-table">
      <thead>
        <tr>
          <th>Pseudo</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td>{admin.pseudo}</td>
            <td>{admin.email}</td>
            <td>
              <AdminRoleBadge role={admin.role} />
            </td>
            <td>
              <AdminActions
                admin={admin}
                onRoleChange={onRoleChange}
                onRequestDelete={onRequestDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminsTable;
