import DashboardUserHeader from "@src/pages/admin/dashboardUser/components/header/DashboardUserHeader";
import DashboardFilter from "@src/pages/admin/dashboardUser/components/filters/DashboardFilter";
import Feed from "@src/pages/admin/dashboardUser/components/feed/Feed";
import { useMemo, useEffect, useState } from "react";
import { getAdminUsers } from "@src/services/adminService";
import { mapContributor, mapStatut } from "@src/utils/mapStats";
import "./DashboardUser.scss";
import {
  DASHBOARD_USER_FILTER_DEFAULTS,
  type DashboardUserFiltersState,
  type UserRow,
} from "@src/types/Filters";
import { filterUsers } from "@src/pages/admin/dashboardUser/utils/userFilters";
import useDashboardFilters from "@src/components/dashboard/hooks/useDashboardFilters";
import usePagination from "@src/components/dashboard/hooks/usePagination";
import DashboardPagination from "@src/components/dashboard/components/DashboardPagination";
import useDashboardData from "@src/components/dashboard/hooks/useDashboardData";

const PAGE_SIZE = 6;

const DashboardUser = () => {
  const [query, setQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const { filters, setFilter } = useDashboardFilters<DashboardUserFiltersState>(
    DASHBOARD_USER_FILTER_DEFAULTS,
  );

  const { page, totalPages, goPrev, goNext } = usePagination({
    totalItems,
    pageSize: PAGE_SIZE,
    resetDeps: [query],
    overflowStrategy: "none",
  });

  const { data: users, meta } = useDashboardData<
    UserRow[],
    { totalItems: number }
  >({
    initialData: [],
    fetcher: async () => {
      const res = await getAdminUsers(page, PAGE_SIZE, query, filters.statut);

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

      return {
        data: normalized,
        meta: { totalItems: res.pagination.totalItems },
      };
    },
    deps: [page, query, filters.statut],
  });

  useEffect(() => {
    if (typeof meta?.totalItems === "number") {
      setTotalItems(meta.totalItems);
    }
  }, [meta]);

  const filteredUsers = useMemo(
    () => filterUsers(users, query, filters),
    [users, query, filters],
  );

  return (
    <div className="dashboard-user-page">
      <DashboardUserHeader />
      <DashboardFilter
        value={query}
        filters={filters}
        onSearchChange={setQuery}
        onFilterChange={setFilter}
      />
      <Feed users={filteredUsers} />

      <DashboardPagination
        page={page}
        totalPages={totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
};

export default DashboardUser;
