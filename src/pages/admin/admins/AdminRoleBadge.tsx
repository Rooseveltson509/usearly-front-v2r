interface Props {
  role: "admin" | "super_admin";
}

const AdminRoleBadge = ({ role }: Props) => {
  const label = role === "super_admin" ? "Super admin" : "Admin";

  return <span className={`role-badge role-${role}`}>{label}</span>;
};

export default AdminRoleBadge;
