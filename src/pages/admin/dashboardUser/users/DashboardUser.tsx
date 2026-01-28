import DashboardUserHeader from "@src/pages/admin/dashboardUser/components/header/DashboardUserHeader";
import DashboardFilter from "@src/pages/admin/dashboardUser/components/filters/DashboardFilter";
import Feed from "@src/pages/admin/dashboardUser/components/feed/Feed";
import { useState, useEffect } from "react";
import { getAdminUsers } from "@src/services/adminService";
import {
  mapContributor,
  mapStatut,
  type ContributorLabel,
  type StatutLabel,
} from "../helpers/mapStats";
import "./DashboardUser.scss";

type UserRow = {
  id: string;
  avatar: string | null;
  statut: StatutLabel;
  pseudo: string;
  gender: string;
  birthdateISO: string; // "YYYY-MM-DD"
  email: string;
  feedbacks: number;
  marques: number;
  up: number;
  contributeur: ContributorLabel;
};

type UpRange = "inf-10" | "10-30" | "30-50" | "sup-50" | "";

const DashboardUser = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<StatutLabel[]>([]);
  const [selectedContributorTypes, setSelectedContributorTypes] = useState<
    ContributorLabel[]
  >([]);
  const [selectedUpRange, setSelectedUpRange] = useState<UpRange>("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getAdminUsers(
        page,
        PAGE_SIZE,
        query,
        selectedStatut, // 👈 ICI
      );

      const normalized: UserRow[] = res.users.map((u: any) => ({
        id: u.id,
        avatar: u.avatar,
        statut: mapStatut(u),
        pseudo: u.pseudo,
        gender: u.gender,
        birthdateISO: u.born,
        email: u.email,
        feedbacks: u.totalFeedbacks,
        marques: u.brandsCount,
        up: u.totalFeedbacks,
        contributeur: mapContributor(u.totalFeedbacks),
      }));

      setUsers(normalized);
      setTotalItems(res.pagination.totalItems);
    };

    loadUsers();
  }, [page, query, selectedStatut]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatut, query]);

  const PAGE_SIZE = 6;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return (
    <div className="dashboard-user-page">
      <DashboardUserHeader />
      <DashboardFilter
        value={query}
        selectedStatuts={selectedStatut}
        selectedContributors={selectedContributorTypes}
        selectedUpRange={selectedUpRange}
        onChange={setQuery}
        onStatutChange={setSelectedStatut}
        onContributorChange={setSelectedContributorTypes}
        onUpRangeChange={setSelectedUpRange}
      />
      <Feed users={users} />

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

export default DashboardUser;
