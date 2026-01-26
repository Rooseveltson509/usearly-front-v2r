import DashboardUserHeader from "@src/pages/admin/dashboardUser/components/header/DashboardUserHeader";
import DashboardFilter from "@src/pages/admin/dashboardUser/components/filters/DashboardFilter";
import Feed from "@src/pages/admin/dashboardUser/components/feed/Feed";
import { useState, useMemo, useEffect } from "react";
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

const UP_RANGE_BOUNDARIES: Record<
  Exclude<UpRange, "">,
  { min?: number; max?: number }
> = {
  "inf-10": { max: 10 },
  "10-30": { min: 10, max: 30 },
  "30-50": { min: 30, max: 50 },
  "sup-50": { min: 50 },
};

const isInUpRange = (value: number, range: UpRange) => {
  if (!range) {
    return true;
  }
  const bounds = UP_RANGE_BOUNDARIES[range];
  if (!bounds) {
    return true;
  }
  if (bounds.min !== undefined && value < bounds.min) {
    return false;
  }
  if (bounds.max !== undefined && value > bounds.max) {
    return false;
  }
  return true;
};

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

  const normalize = (string: string) =>
    string
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredUsers = useMemo(() => {
    const querys = normalize(query.trim());
    return users.filter((user) => {
      const queryUser =
        normalize(user.pseudo).includes(querys) ||
        normalize(user.email).includes(querys);
      const statutUser =
        selectedStatut.length === 0 || selectedStatut.includes(user.statut);
      const contributorUser =
        selectedContributorTypes.length === 0 ||
        selectedContributorTypes.includes(user.contributeur);
      const upRangeUser = isInUpRange(user.up, selectedUpRange);
      return queryUser && statutUser && contributorUser && upRangeUser;
    });
  }, [users, query, selectedStatut, selectedContributorTypes, selectedUpRange]);

  useEffect(() => {
    setPage(1);
  }, [query]);

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
      <Feed users={filteredUsers} />

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
