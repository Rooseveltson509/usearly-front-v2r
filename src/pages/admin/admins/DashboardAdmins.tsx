import { useEffect, useState } from "react";
import { getAdmins } from "@src/services/adminService";
import AdminsTable from "../admins/AdminsTable";
import "./DashboardAdmins.scss";
import DashboardUserHeader from "../dashboardUser/components/header/DashboardUserHeader";

export type AdminRow = {
  id: string;
  pseudo: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: string;
};

const PAGE_SIZE = 6;

const DashboardAdmins = () => {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadAdmins = async () => {
      const data = await getAdmins();
      setAdmins(data);
    };
    loadAdmins();
  }, []);

  const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));

  const paginatedAdmins = admins.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="dashboard-admins-page">
      {/* ✅ même header */}
      <DashboardUserHeader />

      {/* ✅ titre clair */}
      <div className="dashboard-admins-header">
        <h2>Administrateurs</h2>
        <p>Gestion des comptes administrateurs</p>
      </div>

      {/* ✅ table dédiée admins */}
      <AdminsTable
        admins={paginatedAdmins}
        loading={false}
        onRoleChange={() => {}}
        onRequestDelete={() => {}}
      />

      {/* ✅ pagination simple */}
      <div className="feed-table-body-page">
        <div
          className="feed-table-body-page-button"
          onClick={() => page > 1 && setPage((p) => p - 1)}
        >
          <h3>Page précédente</h3>
        </div>

        <div className="feed-table-body-page-location">
          Page {page}/{totalPages}
        </div>

        <div
          className="feed-table-body-page-button"
          onClick={() => page < totalPages && setPage((p) => p + 1)}
        >
          <h3>Page suivante</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmins;
